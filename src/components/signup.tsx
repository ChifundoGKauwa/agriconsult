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
import { signUpWithEmail } from "@/src/lib/auth";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      await signUpWithEmail(email, password);
      router.push("/advertising");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };

      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else if (
        error.message?.includes("Failed to save user data") ||
        error.message?.includes("permission-denied") ||
        error.message?.includes("Missing or insufficient")
      ) {
        setError(
          "Account created but failed to save to database. Update your Firestore security rules."
        );
      } else {
        setError("Unable to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral text-primary">
      <Container className="flex min-h-screen items-center justify-center py-16">
        <Card className="w-full max-w-md border-secondary/20">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <p className="text-sm text-secondary">
              Sign up with your email to start advertising.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSignUp}>
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
                  placeholder="At least 6 characters"
                  className="h-11 w-full rounded-xl border border-secondary/20 bg-white px-3 text-sm text-primary outline-none focus:border-primary"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
                  className="h-11 w-full rounded-xl border border-secondary/20 bg-white px-3 text-sm text-primary outline-none focus:border-primary"
                  required
                  minLength={6}
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
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="text-center text-xs text-secondary">
              Already have an account?{" "}
              <a href="/login" className="text-accent hover:text-tertiary">
                Sign in
              </a>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-secondary">
            By signing up you agree to our terms and privacy policy.
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
}
