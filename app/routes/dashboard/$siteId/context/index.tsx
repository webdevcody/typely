import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileText, MessageSquare, Upload, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

const contextTypes = [
  {
    id: "text",
    title: "Manual Text",
    description: "Manually enter text content to train your AI",
    icon: FileText,
    href: "add?type=text",
  },
  {
    id: "file-upload",
    title: "File Upload",
    description: "Upload documents, PDFs, or text files to train your AI",
    icon: Upload,
    href: "add?type=file-upload",
  },
  {
    id: "faq",
    title: "FAQ Builder",
    description:
      "Create a structured FAQ to train your AI with common questions and answers",
    icon: MessageSquare,
    href: "add?type=faq",
  },
];

export const Route = createFileRoute("/dashboard/$siteId/context/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const [activeTab, setActiveTab] = useState(() => {
    // Try to get the saved tab from localStorage, default to "text"
    return localStorage.getItem("contextActiveTab") || "text";
  });

  useEffect(() => {
    // Save the active tab to localStorage whenever it changes
    localStorage.setItem("contextActiveTab", activeTab);
  }, [activeTab]);

  const { data: textContexts } = useQuery(
    convexQuery(api.context.getContextsBySiteIdAndType, {
      siteId: siteId as Id<"sites">,
      type: "text",
    })
  );

  const { data: fileContexts } = useQuery(
    convexQuery(api.context.getContextsBySiteIdAndType, {
      siteId: siteId as Id<"sites">,
      type: "file-upload",
    })
  );

  const { data: faqContexts } = useQuery(
    convexQuery(api.context.getContextsBySiteIdAndType, {
      siteId: siteId as Id<"sites">,
      type: "faq",
    })
  );

  function formatFAQContent(content: string) {
    return content
      .split(/\n\n/)
      .map((pair) => {
        const lines = pair.split("\n");
        if (lines.length >= 2) {
          return `${lines[0]}\n${lines[1]}`;
        }
        return pair;
      })
      .join("\n\n");
  }

  const deleteContext = useMutation(api.context.deleteContext);
  const [contextToDelete, setContextToDelete] = useState<string | null>(null);

  const renderContextList = (contexts: any[] | undefined) => {
    if (!contexts || contexts.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No contexts found
        </div>
      );
    }

    return contexts.map((context) => (
      <Card key={context._id} className="relative">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{context.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Link
                to={
                  context.type === "faq"
                    ? "/dashboard/$siteId/context/edit-faq"
                    : "/dashboard/$siteId/context/edit"
                }
                params={{ siteId }}
                search={{ contextId: context._id }}
              >
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Dialog
                open={contextToDelete === context._id}
                onOpenChange={(open) => !open && setContextToDelete(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setContextToDelete(context._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Context</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this context? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setContextToDelete(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        await deleteContext({ contextId: context._id });
                        setContextToDelete(null);
                      }}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <CardDescription className="mt-2 whitespace-pre-wrap">
            {context.type === "faq"
              ? formatFAQContent(context.content)
              : context.content}
          </CardDescription>
        </CardHeader>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add Context</h2>
        <p className="text-muted-foreground">
          Add additional context to help your agents understand your business.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 [&>*]:transition-transform [&>*]:duration-200 [&>*:hover]:scale-[1.02]">
        {contextTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Link
              key={type.id}
              to="/dashboard/$siteId/context/add"
              params={{ siteId }}
              search={{ type: type.id }}
              className="cursor-pointer h-full"
            >
              <Card className="hover:bg-muted/50 transition-colors h-full flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{type.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    {type.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Your Contexts
        </h2>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="file-upload">Files</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="space-y-4">
            {renderContextList(textContexts)}
          </TabsContent>
          <TabsContent value="file-upload" className="space-y-4">
            {renderContextList(fileContexts)}
          </TabsContent>
          <TabsContent value="faq" className="space-y-4">
            {renderContextList(faqContexts)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
