"use client";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-neutral text-primary">
      {/* Hero */}
      <section className="bg-white py-16">
        <Container className="mx-auto max-w-3xl space-y-6 text-center">
          <Badge>About AgriConsult</Badge>
          <h1 className="text-4xl font-semibold">Empowering African Agriculture</h1>
          <p className="text-secondary leading-relaxed">
            AgriConsult bridges the gap between traditional farming wisdom and
            modern agricultural science. We provide a marketplace for verified
            agricultural products, expert consulting services, and a community
            Q&A platform where farmers and agronomists connect.
          </p>
        </Container>
      </section>

      {/* Features */}
      <section className="py-16">
        <Container className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Marketplace",
              body: "Buy and sell verified agricultural products. Upload your produce, set prices, and reach buyers across the continent.",
            },
            {
              title: "Expert Consulting",
              body: "Connect with certified agronomists and crop scientists. Get real-time advice on soil health, crop cycles, and market strategy.",
            },
            {
              title: "Community Q&A",
              body: "Ask questions and get answers from experts and fellow farmers. Browse frequently asked questions or start a new discussion.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-secondary/20">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-secondary">{item.body}</CardContent>
            </Card>
          ))}
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <Container className="mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-2xl font-semibold">Ready to get started?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/advertising">
              <Button size="lg" className="bg-accent text-primary hover:bg-tertiary">Explore Marketplace</Button>
            </Link>
            <Link href="/consulting">
              <Button variant="outline" size="lg">Talk to an Expert</Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
