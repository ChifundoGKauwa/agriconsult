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

const experts = [
  {
    name: "Dr. Elias Vance",
    role: "Senior Soil Pathologist",
    rating: "4.9",
    responses: "1,248 answers",
  },
  {
    name: "Amara Phiri",
    role: "Market Strategy Lead",
    rating: "4.8",
    responses: "980 answers",
  },
  {
    name: "Tendai Moyo",
    role: "Livestock Nutritionist",
    rating: "4.9",
    responses: "1,104 answers",
  },
];

const qaFeed = [
  {
    question: "How do I reduce nitrogen loss during rainy season?",
    answer:
      "Split applications and pair with stabilized nitrogen. We recommend soil testing before each top-dress to match uptake curves.",
    expert: "Dr. Elias Vance",
  },
  {
    question: "What pricing strategy works for maize export buyers?",
    answer:
      "Anchor your price to FOB benchmarks and include logistics tiers to protect margins. Provide a 90-day availability window.",
    expert: "Amara Phiri",
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
  return (
    <div className="flex flex-col bg-neutral text-primary">
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

          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle>Describe your question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-secondary">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Category
                </label>
                <div className="rounded-xl border border-secondary/20 px-3 py-2 text-xs text-secondary">
                  Select topic
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Your Question
                </label>
                <div className="min-h-[110px] rounded-xl border border-secondary/20 px-3 py-2 text-xs text-secondary">
                  Type your question here...
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Response Priority
                </label>
                <div className="flex flex-wrap gap-2">
                  {"Standard | Priority | Urgent".split(" | ").map((label) => (
                    <Button key={label} size="sm" variant="outline">
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full bg-accent text-primary hover:bg-tertiary">
                Start Secure Chat
              </Button>
            </CardFooter>
          </Card>
        </Container>
      </section>

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
                <CardContent className="space-y-2 text-sm text-secondary">
                  <p>{expert.role}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span>{expert.rating} rating</span>
                    <span>{expert.responses}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="px-0">
                    Chat with expert
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="qa" className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <Badge>Recent Answers</Badge>
            <h2 className="text-3xl font-semibold">
              See how experts solve real farming challenges.
            </h2>
            <div className="space-y-4">
              {qaFeed.map((item) => (
                <Card key={item.question} className="border-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-base">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-secondary">
                    <p>{item.answer}</p>
                    <p className="text-xs text-secondary/80">Answer by {item.expert}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Card className="border-secondary/20 bg-primary text-white">
            <CardHeader>
              <CardTitle>Live Expert Response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-neutral/80">
              <p>
                "The transition from conventional to precision nutrient delivery
                needs baseline soil analysis. Start with segmented field mapping
                and focus on high-variance zones first."
              </p>
              <p className="text-xs text-neutral/70">Dr. Elias Vance · 2 min ago</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="bg-accent text-primary hover:bg-tertiary">
                Ask a follow-up
              </Button>
            </CardFooter>
          </Card>
        </Container>
      </section>

      <section className="bg-white py-16">
        <Container className="space-y-8">
          <div className="space-y-3">
            <Badge>FAQ</Badge>
            <h2 className="text-3xl font-semibold">Frequently asked questions.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <Card key={faq.title} className="border-secondary/20">
                <CardHeader>
                  <CardTitle className="text-base">{faq.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-secondary">
                  {faq.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
