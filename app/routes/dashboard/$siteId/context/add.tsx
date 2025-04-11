import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploadForm } from "@/components/context/FileUploadForm";
import { TextInputForm } from "@/components/context/TextInputForm";
import { FAQBuilderForm } from "@/components/context/FAQBuilderForm";

export const Route = createFileRoute("/dashboard/$siteId/context/add")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: search.type as string,
    };
  },
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const { type } = Route.useSearch();

  const getFormComponent = () => {
    switch (type) {
      case "file-upload":
        return <FileUploadForm />;
      case "text":
        return <TextInputForm />;
      case "faq":
        return <FAQBuilderForm />;
      default:
        return (
          <div className="text-center">
            <p className="text-muted-foreground">
              Invalid context type selected.
            </p>
            <Link
              to="/dashboard/$siteId/context"
              params={{ siteId }}
              className="text-primary hover:underline"
            >
              Go back to context selection
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/$siteId/context" params={{ siteId }}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add Context</h2>
          <p className="text-muted-foreground">
            {type === "file-upload" && "Upload files to train your AI"}
            {type === "text" && "Manually enter text to train your AI"}
            {type === "faq" && "Create a FAQ to train your AI"}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">{getFormComponent()}</div>
    </div>
  );
}
