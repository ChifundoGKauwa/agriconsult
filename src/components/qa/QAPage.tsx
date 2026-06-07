"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit, type Timestamp } from "firebase/firestore";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";
import { db } from "@/src/lib/firebase";
import Link from "next/link";

const MESSAGES_COLLECTION = "messages";

type Message = {
  id: string;
  message: string;
  displayName: string;
  createdAt?: Timestamp;
  replies?: { message: string; displayName: string; createdAt: string }[];
};

export default function QAPage() {
  const [frequentQuestions, setFrequentQuestions] = useState<Message[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));

      const counts: Record<string, { count: number; msg: Message }> = {};
      msgs.forEach((msg) => {
        const key = msg.message.toLowerCase().trim();
        if (!counts[key]) counts[key] = { count: 0, msg };
        counts[key].count++;
      });

      const frequent = Object.values(counts)
        .filter((item) => item.count > 1)
        .sort((a, b) => b.count - a.count)
        .map((item) => item.msg);

      setFrequentQuestions(frequent);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="flex flex-col bg-neutral text-primary">
      <section className="bg-white py-10">
        <Container className="mx-auto max-w-3xl space-y-4 text-center">
          <Badge>Frequently Asked Questions</Badge>
          <h1 className="text-3xl font-semibold">Community Knowledge Base</h1>
          <p className="text-sm text-secondary">
            Questions asked by farmers and answered by experts. If the same question is asked multiple times, it appears here.
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container className="mx-auto max-w-3xl space-y-4">
          {frequentQuestions.length === 0 ? (
            <p className="text-center text-sm text-secondary">
              No frequently asked questions yet.{" "}
              <Link href="/consulting" className="text-accent hover:text-tertiary">Ask the first question</Link>.
            </p>
          ) : (
            frequentQuestions.map((q) => (
              <Card key={q.id} className="border-secondary/20">
                <CardHeader>
                  <CardTitle className="text-base">{q.message}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {q.replies && q.replies.length > 0 && (
                    <div className="ml-4 space-y-3 border-l-2 border-secondary/20 pl-4">
                      {q.replies.map((reply, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-accent">
                              {reply.displayName}
                            </span>
                            <span className="text-xs text-secondary/60">
                              {new Date(reply.createdAt).toLocaleString("en-US", {
                                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-secondary">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-right">
                    <Link href="/consulting">
                      <Button variant="ghost" className="px-0 text-xs">Ask a follow-up</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </Container>
      </section>
    </div>
  );
}
