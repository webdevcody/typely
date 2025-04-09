import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$siteId/chats")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Chats</h1>
      <p>View chat history for any users talking with Sensei</p>
    </div>
  );
}
