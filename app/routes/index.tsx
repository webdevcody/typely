import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@/components/signin";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { DemoCTA } from "@/components/DemoCTA";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <DemoCTA />
    </main>
  );
}
