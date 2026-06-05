"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit, type Timestamp } from "firebase/firestore";
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
import { db } from "@/src/lib/firebase";

const IMAGES_COLLECTION = "images";
const MESSAGES_COLLECTION = "messages";

type Advertisement = {
  id: string;
  imageurl: string;
  title: string;
  description: string;
  price: string;
  createdAt?: Timestamp;
};

type Message = {
  id: string;
  message: string;
  displayName: string;
  createdAt?: Timestamp;
  replies?: { message: string; displayName: string }[];
};

const insights = [
  {
    title: "Soil & Yield Diagnostics",
    description:
      "Lab-backed analytics with actionable nitrogen and moisture recommendations.",
  },
  {
    title: "Brand & Media Strategy",
    description:
      "Launch plans for agri-products, co-ops, and exporter networks.",
  },
  {
    title: "Growth Coaching",
    description:
      "Milestone planning for farms scaling from local distribution to export.",
  },
];

const testimonials = [
  {
    name: "Chikondi M.",
    role: "Tea Cooperative Lead",
    quote:
      "Our revenue projections are finally aligned with real data and disciplined marketing.",
  },
  {
    name: "Tonderai K.",
    role: "Irrigation SME",
    quote:
      "The consulting roadmap helped us secure partners and sell out two product batches.",
  },
  {
    name: "Lilian A.",
    role: "Agri-Exporter",
    quote:
      "AgroConsult gave us pricing clarity and market entry options within weeks.",
  },
];

export default function LandingPage() {
  const [marketAds, setMarketAds] = useState<Advertisement[]>([]);
  const [frequentQuestions, setFrequentQuestions] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch first 4 ads from Firestore
  useEffect(() => {
    const q = query(
      collection(db, IMAGES_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(4)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMarketAds(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Advertisement, "id">),
        }))
      );
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch messages to find frequently asked questions
  useEffect(() => {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));

      // Find duplicates by checking which messages appear more than once
      const messageCounts: Record<string, { count: number; msg: Message }> = {};
      msgs.forEach((msg) => {
        const key = msg.message.toLowerCase().trim();
        if (!messageCounts[key]) {
          messageCounts[key] = { count: 0, msg };
        }
        messageCounts[key].count++;
      });

      // Show messages asked more than once, sorted by frequency
      const frequent = Object.values(messageCounts)
        .filter((item) => item.count > 1)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((item) => item.msg);

      setFrequentQuestions(frequent);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="flex flex-col bg-neutral text-primary">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0">
          <Image
            src="/landing.png"
            alt="Aerial view of farmland"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/20" />
        </div>
        <Container className="relative py-16 lg:py-24">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-accent text-primary border-accent/60">
              Global Leadership
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Precision Insights for the Modern Farm.
            </h1>
            <p className="max-w-xl text-base text-neutral/85">
              Bridging traditional agricultural wisdom with data-driven strategic
              consulting to maximize your yield and operational efficiency.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-accent text-primary hover:bg-tertiary">
                <Link href="/consulting">Start Your Consultation</Link>
              </Button>
              <Button size="lg" className="bg-secondary text-white hover:bg-primary">
                <Link href="/#services">View Case Studies</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section id="services" className="bg-white py-16">
        <Container className="space-y-12">
          <div className="flex flex-wrap items-center justify-between gap-6 text-[11px] uppercase tracking-[0.28em] text-secondary">
            <span>Certified Agri-Tech Partner</span>
            <span>Global Seed Alliance</span>
            <span>Sustainable Soil Council</span>
            <span>Precision Precision Group</span>
            <span>Bio-Dynamic Certified</span>
          </div>
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold">Our Core Specializations</h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-tertiary" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle>Expert Consultation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-secondary">
                <p>
                  Get direct access to veteran agronomists and market analysts.
                  We provide soil health diagnostics, crop cycle planning, and
                  financial risk assessments tailored to your local geography.
                </p>
                <Link href="/consulting">
                  <Button variant="ghost" className="px-0 text-primary">
                    Explore Services
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-secondary/30 bg-primary text-white">
              <CardHeader>
                <CardTitle>Strategic Advertising</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm text-neutral/85">
                <p>
                  Position your agricultural products where it matters most.
                  Our network reaches high-intent buyers, commercial farms, and
                  regional distributors across the continent.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-t border-white/20 pt-4">
                    <span className="text-xs uppercase tracking-[0.3em] text-neutral/70">
                      Annual Reach
                    </span>
                    <span className="text-lg font-semibold text-accent">15M+</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/20 pt-4">
                    <span className="text-xs uppercase tracking-[0.3em] text-neutral/70">
                      Retained Clients
                    </span>
                    <span className="text-lg font-semibold text-accent">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-secondary/20 bg-neutral">
              <CardHeader>
                <CardTitle>Interactive Q&amp;A</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-secondary">
                <p>
                  The industry&apos;s most robust knowledge base. Ask questions,
                  get answers from certified experts, and join a community of
                  professional growers.
                </p>
              </CardContent>
            </Card>
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle>Professional Network</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-secondary">
                <p>
                  Connect with agronomists, irrigation specialists, logistics
                  partners, and export-ready advisors through our vetted
                  network.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Consulting */}
      <section id="consulting" className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge>Consultation Hub</Badge>
            <h2 className="text-3xl font-semibold">
              Optimizing soil health, nitrogen, and sustainable high-yield harvests.
            </h2>
            <p className="text-secondary">
              We blend field diagnostics, financial modeling, and marketing
              strategy to ensure your operations are profitable and resilient.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/consulting">
                <Button variant="solid" className="bg-primary text-white hover:bg-secondary">
                  Schedule Strategy Call
                </Button>
              </Link>
              <Link href="/consulting">
                <Button variant="ghost">Download Service Deck</Button>
              </Link>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-secondary/20 bg-white p-6 shadow-sm">
            {[
              "Initial diagnostics and onboarding",
              "On-farm analytics and benchmarking",
              "Campaign and sales enablement",
              "Continuous performance reviews",
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm text-secondary">{step}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Marketplace – Live from Firestore */}
      <section id="advertising" className="bg-white py-16">
        <Container className="space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-4">
              <Badge>Featured Marketplace</Badge>
              <h2 className="text-3xl font-semibold">
                Inputs, tools, and advisory kits curated for performance.
              </h2>
            </div>
            <Link href="/advertising">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <p className="col-span-full text-sm text-secondary">Loading marketplace...</p>
            ) : marketAds.length > 0 ? (
              marketAds.map((ad) => (
                <Card key={ad.id} className="border-secondary/20">
                  {ad.imageurl && (
                    <div className="relative h-36 overflow-hidden rounded-t-2xl">
                      <Image
                        src={ad.imageurl}
                        alt={ad.title || "Marketplace item"}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-base">{ad.title || "Untitled"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-secondary">
                    <p>{ad.description || "No description"}</p>
                    <p className="text-lg font-semibold text-primary">
                      {ad.price || "Contact seller"}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/advertising">
                      <Button variant="ghost" className="px-0">
                        View details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <>
                {[
                  { title: "Hybrid Maize Seed", detail: "High-yield, drought-tolerant", price: "MWK 48,000" },
                  { title: "Organic Fertilizer Blend", detail: "Slow release, soil-safe", price: "MWK 26,500" },
                  { title: "Drip Irrigation Kit", detail: "5-acre starter system", price: "MWK 210,000" },
                  { title: "Harvest Logistics Plan", detail: "Cold chain advisory", price: "MWK 75,000" },
                ].map((item) => (
                  <Card key={item.title} className="border-secondary/20">
                    <CardHeader>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-secondary">
                      <p>{item.detail}</p>
                      <p className="text-lg font-semibold text-primary">{item.price}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/advertising">
                        <Button variant="ghost" className="px-0">
                          View details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </>
            )}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container className="grid gap-10 rounded-3xl border border-secondary/30 bg-neutral p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <Badge>Ready to Scale</Badge>
            <h2 className="text-3xl font-semibold">
              Build a resilient agriculture business with expert partners.
            </h2>
            <p className="text-secondary">
              We blend agronomy and advertising to help you win new buyers and
              maximize harvest profitability.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/consulting">
              <Button size="lg">Start a Project</Button>
            </Link>
            <Link href="/consulting">
              <Button variant="outline" size="lg">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Q&A – Frequently Asked Questions from Firestore */}
      <section id="qa" className="bg-white py-16">
        <Container className="space-y-10">
          <div className="space-y-4">
            <Badge>Frequently Asked Questions</Badge>
            <h2 className="text-3xl font-semibold">
              Trusted by producers, exporters, and agri-innovators.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {frequentQuestions.length > 0 ? (
              frequentQuestions.map((q) => (
                <Card key={q.id} className="border-secondary/20">
                  <CardContent className="space-y-4">
                    <p className="text-sm text-secondary">&ldquo;{q.message}&rdquo;</p>
                    <div>
                      <p className="text-xs text-secondary/80">
                        Asked by {q.displayName}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="border-secondary/20">
                  <CardContent className="space-y-4">
                    <p className="text-sm text-secondary">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-secondary/80">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
