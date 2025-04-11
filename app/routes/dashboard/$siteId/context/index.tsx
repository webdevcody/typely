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
import { DashboardHeader } from "@/components/ui/dashboard-header";

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
      <DashboardCard key={context._id} variant="inner" className="relative">
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
              <Dialog
                open={contextToDelete === context._id}
                onOpenChange={(open) => !open && setContextToDelete(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-[#262932]"
                    onClick={() => setContextToDelete(context._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1C1F26] border-[#262932] text-white">
                  <DialogHeader>
                    <DialogTitle>Delete Context</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Are you sure you want to delete this context? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setContextToDelete(null)}
                      className="border-[#262932] text-gray-300 hover:bg-[#262932] hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        await deleteContext({ contextId: context._id });
                        setContextToDelete(null);
                      }}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <CardDescription className="mt-2 whitespace-pre-wrap text-gray-400">
            {context.type === "faq"
              ? formatFAQContent(context.content)
              : context.content}
          </CardDescription>
        </CardHeader>
      </DashboardCard>
    ));
  };

  return (
    <div className="p-8 space-y-6 bg-[#0D0F12] min-h-full">
      <DashboardHeader title="Dashboard/Context" />

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
                  className="cursor-pointer h-full"
                >
                  <DashboardCard
                    variant="inner"
                    className="hover:bg-[#262932] transition-colors h-full flex flex-col group"
                  >
                    <CardHeader className="flex-1">
                      <div className="flex items-center gap-2">
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
                    </CardHeader>
                  </DashboardCard>
                </Link>
              );
            })}
          </div>

          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="bg-[#1C1F26] border border-[#262932]">
              <TabsTrigger
                value="text"
                className="data-[state=active]:bg-[#262932] data-[state=active]:text-white text-gray-400"
              >
                Text
              </TabsTrigger>
              <TabsTrigger
                value="file"
                className="data-[state=active]:bg-[#262932] data-[state=active]:text-white text-gray-400"
              >
                Files
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="data-[state=active]:bg-[#262932] data-[state=active]:text-white text-gray-400"
              >
                FAQs
              </TabsTrigger>
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
          </Tabs>
        </div>
      </DashboardCard>
    </div>
  );
}
