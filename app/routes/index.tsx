import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { ThreeSteps } from "@/components/ThreeSteps";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ThreeSteps />
      <Features />
      <Testimonials />
      <Pricing />
    </main>
  );
}
