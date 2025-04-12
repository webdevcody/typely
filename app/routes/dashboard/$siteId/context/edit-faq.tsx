import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQBuilderForm } from "@/components/context/FAQBuilderForm";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard/$siteId/context/edit-faq")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      contextId: search.contextId as string,
    };
  },
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const { contextId } = Route.useSearch();

  const { data: context } = useQuery(
    convexQuery(api.context.getContextById, {
      contextId: contextId as Id<"contexts">,
    })
  );

  if (!context) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/$siteId/context" params={{ siteId }}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit FAQ</h2>
          <p className="text-muted-foreground">Update your FAQ collection</p>
        </div>
      </div>

      <div className="rounded-lg p-6">
        <FAQBuilderForm
          siteId={siteId as Id<"sites">}
          initialTitle={context.title}
          initialContent={context.content}
          contextId={contextId as Id<"contexts">}
        />
      </div>
    </div>
  );
}
