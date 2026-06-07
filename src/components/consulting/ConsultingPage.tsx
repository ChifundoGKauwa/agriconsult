"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";
import { auth, db } from "@/src/lib/firebase";

const MESSAGES_COLLECTION = "messages";

type Reply = {
  userID: string;
  displayName: string;
  message: string;
  createdAt: string;
};

type Message = {
  id: string;
  userID: string;
  displayName: string;
  message: string;
  createdAt?: Timestamp;
  replies: Reply[];
};

const experts = [
  {
    name: "Gabriel Jonathan",
    role: "Agronomist & Crop Scientist",
  },
];

const faqs = [
  {
    title: "How fast will I get a response?",
    body: "Most questions receive a response within 30 minutes from an available expert.",
  },
  {
    title: "Can I follow up after the first answer?",
    body: "Yes. Your session includes follow-up questions until your issue is resolved.",
  },
  {
    title: "Are experts verified?",
    body: "All experts are vetted and verified by our advisory team before joining.",
  },
];

export default function ConsultingPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : null);
    });
    return unsubscribe;
  }, []);

  // Real-time listener for messages
  useEffect(() => {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Message, "id">),
          }))
        );
      },
      (error) => {
        console.error("Could not load messages:", error.message);
      }
    );

    return unsubscribe;
  }, []);

  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;

    if (!user && !guestName.trim()) {
      alert("Please enter your name or sign in to post.");
      return;
    }

    setIsPosting(true);

    try {
      await addDoc(collection(db, MESSAGES_COLLECTION), {
        userID: user?.uid ?? `guest-${Date.now()}`,
        displayName: user?.email?.split("@")[0] ?? guestName.trim(),
        message: newMessage.trim(),
        createdAt: serverTimestamp(),
        replies: [],
      });

      setNewMessage("");
      setGuestName("");
    } catch (error) {
      console.error("Error posting message:", error);
      alert("Failed to post message. Check Firestore security rules.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleReply = async (messageId: string) => {
    const replyText = replyInputs[messageId]?.trim();
    if (!replyText) return;

    try {
      const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
      await updateDoc(messageRef, {
        replies: arrayUnion({
          userID: user?.uid ?? `guest-${Date.now()}`,
          displayName: user?.email?.split("@")[0] ?? "Consultant",
          message: replyText,
          createdAt: new Date().toISOString(),
        }),
      });

      setReplyInputs((prev) => ({ ...prev, [messageId]: "" }));
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Failed to post reply. Check Firestore security rules.");
    }
  };

  return (
    <div className="flex flex-col bg-neutral text-primary">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge>Consultation Hub</Badge>
            <h1 className="text-4xl font-semibold leading-tight">
              Ask a question. Get expert answers in minutes.
            </h1>
            <p className="max-w-xl text-sm text-secondary">
              Connect with agronomists, market strategists, and logistics advisors
              for real-time guidance tailored to your farm or agri-business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary text-white hover:bg-secondary">
                Ask an Expert Now
              </Button>
              <Button variant="outline" size="lg">
                Browse Expert Profiles
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Verified agri experts",
                "Secure, private Q&A",
                "Follow-up included",
              ].map((item) => (
                <Card key={item} className="border-secondary/20">
                  <CardContent className="text-xs text-secondary">{item}</CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Post a Question Card */}
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle>Ask a public question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-secondary">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  {user ? `Signed in as ${user.email?.split("@")[0]}` : "Your name"}
                </label>
                {!user && (
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name (public)"
                    className="h-11 w-full rounded-xl border border-secondary/20 bg-white px-3 text-sm text-primary outline-none focus:border-primary"
                  />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Your Question
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your farming question here..."
                  rows={3}
                  className="w-full rounded-xl border border-secondary/20 bg-white px-3 py-2.5 text-sm text-primary outline-none focus:border-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                size="lg"
                className="w-full bg-accent text-primary hover:bg-tertiary"
                onClick={handlePostMessage}
                disabled={isPosting}
              >
                {isPosting ? "Posting..." : "Post Question"}
              </Button>
              {!user && (
                <p className="text-xs text-secondary">
                  Posting as guest.{" "}
                  <a href="/login" className="text-accent hover:text-tertiary">
                    Sign in
                  </a>{" "}
                  for a personalized experience.
                </p>
              )}
            </CardFooter>
          </Card>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <Container className="grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "1. Ask your question",
              body: "Share the details, images, and context our experts need.",
            },
            {
              title: "2. Match with an expert",
              body: "We route your question to a vetted specialist in minutes.",
            },
            {
              title: "3. Get actionable guidance",
              body: "Receive step-by-step advice and follow-up support.",
            },
          ].map((step) => (
            <Card key={step.title} className="border-secondary/20">
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-secondary">
                {step.body}
              </CardContent>
            </Card>
          ))}
        </Container>
      </section>

      {/* Expert Profiles */}
      <section className="bg-white py-16">
        <Container className="space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-3">
              <Badge>Available Experts</Badge>
              <h2 className="text-3xl font-semibold">Talk to the right advisor.</h2>
            </div>
            <Button variant="outline">View all experts</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {experts.map((expert) => (
              <Card key={expert.name} className="border-secondary/20">
                <CardHeader>
                  <CardTitle className="text-base">{expert.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-secondary">
                  <p>{expert.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Q&A Feed — Dynamic Messages */}
      <section id="qa" className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <Badge>Recent Questions</Badge>
            <h2 className="text-3xl font-semibold">
              Browse community questions and answers.
            </h2>

            {messages.length === 0 ? (
              <p className="text-sm text-secondary">
                No questions yet. Be the first to ask!
              </p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <Card key={msg.id} className="border-secondary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{msg.message}</CardTitle>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-secondary">
                            {msg.displayName}
                          </span>
                          {msg.createdAt && (
                            <span className="text-xs text-secondary/60">
                              {new Date(
                                (msg.createdAt as Timestamp).toDate?.() ?? msg.createdAt
                              ).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Replies */}
                      {msg.replies && msg.replies.length > 0 && (
                        <div className="ml-4 space-y-3 border-l-2 border-secondary/20 pl-4">
                          {msg.replies.map((reply, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-accent">
                                  {reply.displayName}
                                </span>
                                <span className="text-xs text-secondary/60">
                                  {new Date(reply.createdAt).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="mt-1 text-secondary">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyInputs[msg.id] ?? ""}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({
                              ...prev,
                              [msg.id]: e.target.value,
                            }))
                          }
                          placeholder="Write a reply..."
                          className="h-9 flex-1 rounded-xl border border-secondary/20 bg-white px-3 text-xs text-primary outline-none focus:border-primary"
                        />
                        <Button
                          size="sm"
                          className="bg-accent text-primary hover:bg-tertiary"
                          onClick={() => handleReply(msg.id)}
                        >
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — Live Expert Card + FAQ */}
          <div className="space-y-6">
            <Card className="border-secondary/20 bg-primary text-white">
              <CardHeader>
                <CardTitle>Live Expert Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-neutral/80">
                <p>
                  &ldquo;The transition from conventional to precision nutrient delivery
                  needs baseline soil analysis. Start with segmented field mapping
                  and focus on high-variance zones first.&rdquo;
                </p>
                <p className="text-xs text-neutral/70">Dr. Elias Vance · 2 min ago</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="bg-accent text-primary hover:bg-tertiary">
                  Ask a follow-up
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-4">
              <Badge>FAQ</Badge>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <Card key={faq.title} className="border-secondary/20">
                    <CardHeader>
                      <CardTitle className="text-sm">{faq.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-secondary">
                      {faq.body}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
