"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";
import {
  signInWithEmail,
  signInWithGoogle,
} from "@/src/lib/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Authenticate with Firebase Auth first
      await signInWithEmail(email, password);
      router.push("/advertising");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/invalid-credential"
      ) {
        // User not found in Firebase Auth — redirect to sign-up
        router.push("/signup");
      } else {
        setError("Incorrect email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      router.push("/advertising");
    } catch (err) {
      setError("Unable to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral text-primary">
      <Container className="flex min-h-screen items-center justify-center py-16">
        <Card className="w-full max-w-md border-secondary/20">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <p className="text-sm text-secondary">
              Sign in with your email or continue with Google.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@agroconsult.africa"
                  className="h-11 w-full rounded-xl border border-secondary/20 bg-white px-3 text-sm text-primary outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-xl border border-secondary/20 bg-white px-3 text-sm text-primary outline-none focus:border-primary"
                  required
                />
              </div>
              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </p>
              ) : null}
              <Button
                type="submit"
                className="w-full bg-accent text-primary hover:bg-tertiary"
                disabled={isLoading}
              >
                Sign in with email
              </Button>
            </form>
            <div className="flex items-center gap-3 text-xs text-secondary">
              <span className="h-px flex-1 bg-secondary/20" />
              or
              <span className="h-px flex-1 bg-secondary/20" />
            </div>
            <Button
              type="button"
              className="w-full border border-secondary/20 bg-white text-primary hover:bg-neutral"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 48 48"
                  className="h-5 w-5"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.5 0 6.4 1.2 8.8 3.5l6.4-6.4C35.2 2.6 30 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.6 5.9C12 13.3 17.5 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24.5c0-1.6-.1-2.8-.4-4.2H24v8h12.8c-.5 2.8-2 5.1-4.2 6.7l6.5 5.1c3.8-3.5 6.4-8.7 6.4-15.6z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.1 28.1c-.6-1.6-.9-3.4-.9-5.1s.3-3.5.9-5.1l-7.6-5.9C.9 15.1 0 19 0 23s.9 7.9 2.5 11.1l7.6-6z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 46.5c6 0 11.2-2 14.9-5.4l-6.5-5.1c-1.8 1.2-4.1 1.9-8.4 1.9-6.5 0-12-3.8-13.9-9.4l-7.6 6C6.5 42.6 14.6 46.5 24 46.5z"
                  />
                </svg>
                <p className="text-black-900">Continue with Google</p>
              </span>
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 text-xs text-secondary">
            <p>
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-accent hover:text-tertiary">
                Sign up
              </a>
            </p>
            <p>By signing in you agree to our terms and privacy policy.</p>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
}
