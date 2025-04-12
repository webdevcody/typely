import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow, formatDistance } from "date-fns";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useState } from "react";
import { convexQuery } from "@convex-dev/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, FileText, MessageSquare, Bot } from "lucide-react";
import { InnerCard } from "@/components/InnerCard";
import { WidgetInstallation } from "@/components/WidgetInstallation";

const AI_AVATAR_URL =
  "https://api.dicebear.com/7.x/bottts/svg?seed=site-sensei&backgroundColor=633CFF";
const USER_AVATAR_URL =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=qwesdfx&backgroundColor=FFA500";

export const Route = createFileRoute("/dashboard/$siteId/chats/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const [selectedSessionId, setSelectedSessionId] =
    useState<Id<"chatSessions"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: chatSessions } = useQuery(
    convexQuery(api.chatMessages.listSessions, {
      siteId: params.siteId as Id<"sites">,
    })
  );

  const { data: messages } = useQuery(
    convexQuery(api.chatMessages.getMessages, {
      chatSessionId: selectedSessionId as Id<"chatSessions">,
    })
  );

  return (
    <DashboardCard>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Recent Chats</h1>
          <p className="text-gray-400">
            View chat history for any users talking with Sensei
          </p>
        </div>
      </div>

      {!chatSessions || chatSessions.length === 0 ? (
        <WidgetInstallation siteId={params.siteId} className="mt-8" />
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Chat Sessions List */}
          <div className="col-span-1 space-y-4">
            {chatSessions?.map((session) => (
              <InnerCard
                key={session._id}
                className={`p-4 rounded-xl cursor-pointer transition-colors ${
                  selectedSessionId === session._id &&
                  "bg-gradient-to-r from-primary-blue/40 via-[#1d2329] via-50%"
                }`}
                onClick={() => setSelectedSessionId(session._id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">
                    {session.firstMessage?.content ? "User" : "Anonymous User"}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {new Date(session._creationTime).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {session.firstMessage?.content || "No messages"}
                </p>
              </InnerCard>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="col-span-2">
            {selectedSessionId ? (
              <div className="space-y-4">
                <ScrollArea className="h-[600px] pr-4">
                  {messages?.map((message) => (
                    <InnerCard
                      key={message._id}
                      className={`p-4 rounded-xl mb-4 ${
                        message.role === "assistant"
                          ? "bg-[#1C1F26]"
                          : "bg-[#262932]"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === "assistant"
                              ? "bg-primary-blue/20"
                              : "bg-gray-600/20"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary-blue"
                            >
                              <circle cx="12" cy="12" r="3" />
                              <path d="M12 3v1.5M12 19.5V21M18.364 5.636l-1.06 1.06M6.696 17.304l-1.06 1.06M21 12h-1.5M4.5 12H3M18.364 18.364l-1.06-1.06M6.696 6.696l-1.06-1.06" />
                            </svg>
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-400"
                            >
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {message.role === "assistant" ? "Sensei" : "User"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(
                              message._creationTime
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap pl-11">
                        {message.content}
                      </p>
                    </InnerCard>
                  ))}
                </ScrollArea>

                {(!messages || messages.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    No messages in this chat session
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="rounded-full bg-[#1C1F26] p-4 mb-4">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <p className="text-lg font-medium">No chat selected</p>
                <p className="text-sm mt-1">
                  Select a chat session from the left to view the conversation
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
