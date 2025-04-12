import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  Upload,
  Pencil,
  Trash2,
  FileX,
  Plus,
  Bot,
  Trash,
} from "lucide-react";
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
import { DashboardCard } from "@/components/ui/dashboard-card";
import { toast } from "sonner";
import { InnerCard, innerCardStyles } from "@/components/InnerCard";
import { cn } from "@/lib/utils";

const contextTypes = [
  {
    id: "text",
    title: "Text",
    description: "Add text-based context for your AI to reference.",
    icon: FileText,
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
    title: "FAQ",
    description: "Add frequently asked questions and answers.",
    icon: MessageSquare,
  },
  {
    id: "agent",
    title: "Agent",
    description: "Create a custom AI agent with specific behaviors.",
    icon: Bot,
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
      type: "file",
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

  const handleDeleteContext = async () => {
    if (!contextToDelete) return;

    try {
      await deleteContext({
        contextId: contextToDelete as Id<"contexts">,
      });
      toast.success("Context deleted successfully");
      setContextToDelete(null);
    } catch (error) {
      toast.error("Failed to delete context");
    }
  };

  const renderContextList = (contexts: any[] | undefined) => {
    if (!contexts || contexts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="relative mb-8">
            <div className="h-24 w-24 text-gray-500/20 animate-pulse">
              <FileX className="h-full w-full" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <Plus className="h-5 w-5" />
            </div>
          </div>

          <h3 className="font-semibold text-2xl mb-3 text-center text-white">
            Your Knowledge Base Awaits
          </h3>

          <div className="space-y-4 text-center max-w-md mb-8">
            <p className="text-gray-400">
              Train your AI assistant by adding contexts - documents, FAQs, or
              any important information you want your AI to learn from.
            </p>
            <p className="text-sm text-gray-500">
              Your AI becomes smarter with each context you add, providing more
              accurate and relevant responses.
            </p>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="h-5 w-5" />
            Add Your First Context
          </button>
        </div>
      );
    }

    return contexts.map((context) => (
      <InnerCard key={context._id}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">{context.title}</CardTitle>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-[#262932]"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-[#262932]"
                onClick={() => setContextToDelete(context._id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription className="mt-2 whitespace-pre-wrap text-gray-400">
            {context.type === "faq"
              ? formatFAQContent(context.content)
              : context.content}
          </CardDescription>
        </CardHeader>
      </InnerCard>
    ));
  };

  return (
    <div className="space-y-8">
      <DashboardCard>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Add Context
            </h2>
            <p className="text-gray-400">
              Add additional context to help your agents understand your
              business.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contextTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link
                  key={type.id}
                  to="/dashboard/$siteId/context/add"
                  params={{ siteId }}
                  search={{ type: type.id }}
                  className={cn(innerCardStyles, "cursor-pointer h-full")}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-white group-hover:text-white">
                      {type.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    {type.description}
                  </CardDescription>
                </Link>
              );
            })}
          </div>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Your Context
            </h2>
            <p className="text-gray-400">
              View and manage your existing context.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-[#1C1F26] border-[#262932] mb-2">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="file">Files</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="agent">Agent</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-4">
              {renderContextList(textContexts)}
            </TabsContent>
            <TabsContent value="file" className="space-y-4">
              {renderContextList(fileContexts)}
            </TabsContent>
            <TabsContent value="faq" className="space-y-4">
              {renderContextList(faqContexts)}
            </TabsContent>
            <TabsContent value="agent" className="space-y-4">
              {renderContextList(fileContexts)}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardCard>

      {/* Delete Context Dialog */}
      <Dialog
        open={!!contextToDelete}
        onOpenChange={() => setContextToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Context</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this context? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setContextToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContext}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
