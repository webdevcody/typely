import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@/components/signin";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <SignIn />
    </div>
  );
}
