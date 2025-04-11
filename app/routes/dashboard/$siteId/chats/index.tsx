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
    <div className="p-8 space-y-6 bg-[#0D0F12] min-h-full">
      <DashboardHeader title="Dashboard/Chats" />

      <DashboardCard>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Chats</h1>
            <p className="text-gray-400">
              View chat history for any users talking with Sensei
            </p>
          </div>

          <div className="flex gap-4">
            <Input
              type="search"
              placeholder="Search chats..."
              className="w-64 bg-[#1C1F26] border-[#262932] text-gray-300 placeholder:text-gray-500"
            />
            <Select defaultValue="24h">
              <SelectTrigger className="w-[180px] bg-[#1C1F26] border-[#262932] text-gray-300">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1F26] border-[#262932]">
                <SelectItem
                  value="24h"
                  className="text-gray-300 focus:bg-[#262932] focus:text-white"
                >
                  Last 24 hours
                </SelectItem>
                <SelectItem
                  value="7d"
                  className="text-gray-300 focus:bg-[#262932] focus:text-white"
                >
                  Last 7 days
                </SelectItem>
                <SelectItem
                  value="30d"
                  className="text-gray-300 focus:bg-[#262932] focus:text-white"
                >
                  Last 30 days
                </SelectItem>
                <SelectItem
                  value="all"
                  className="text-gray-300 focus:bg-[#262932] focus:text-white"
                >
                  All time
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl border border-[#262932] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#262932] hover:bg-transparent">
                <TableHead className="w-48 text-gray-400">
                  First Message
                </TableHead>
                <TableHead className="w-48 text-gray-400">
                  Last Message
                </TableHead>
                <TableHead className="w-48 text-gray-400">Duration</TableHead>
                <TableHead className="text-gray-400">First Message</TableHead>
                <TableHead className="w-24 text-center text-gray-400">
                  Messages
                </TableHead>
                <TableHead className="w-24 text-gray-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!chatSessions ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : chatSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <span className="text-lg">No chat sessions yet</span>
                      <span className="text-sm">
                        Chat sessions will appear here once users start
                        conversations
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                chatSessions.map((chat) => (
                  <TableRow
                    key={chat._id}
                    className="cursor-pointer border-b border-[#262932] hover:bg-[#1C1F26] transition-colors"
                    onClick={() => setSelectedSessionId(chat._id)}
                  >
                    <TableCell className="text-gray-300">
                      {formatDistanceToNow(
                        new Date(chat.firstMessage?.createdAt || 0),
                        {
                          addSuffix: true,
                        }
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDistanceToNow(
                        new Date(chat.lastMessage?.createdAt || 0),
                        {
                          addSuffix: true,
                        }
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDistance(
                        new Date(chat.firstMessage?.createdAt || 0),
                        new Date(chat.lastMessage?.createdAt || 0),
                        { includeSeconds: true }
                      )}
                    </TableCell>
                    <TableCell className="truncate max-w-md text-gray-300">
                      {chat.firstMessage?.content}
                    </TableCell>
                    <TableCell className="text-center font-medium text-gray-300">
                      {messages?.length || 0}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${
                          Date.now() -
                            new Date(
                              chat.lastMessage?.createdAt || 0
                            ).getTime() <
                          5 * 60 * 1000
                            ? "bg-green-500/10 text-green-500"
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {Date.now() -
                          new Date(chat.lastMessage?.createdAt || 0).getTime() <
                        5 * 60 * 1000
                          ? "Active"
                          : "Ended"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>

      <Sheet
        open={!!selectedSessionId}
        onOpenChange={() => setSelectedSessionId(null)}
      >
        <SheetContent className="w-[480px] sm:w-[540px] bg-[#1C1F26] border-l border-[#262932] p-0">
          <SheetHeader className="p-6 border-b border-[#262932]">
            <SheetTitle className="flex justify-between items-center text-white">
              <span>Chat Session</span>
              <span className="text-sm font-normal text-gray-400">
                {messages?.length || 0} messages
              </span>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-8rem)] px-6 py-4">
            {!messages ? (
              <div className="flex items-center justify-center h-32 text-gray-400 gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                Loading...
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex items-end gap-4 ${
                      message.role === "assistant" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex-1 rounded-xl p-3 text-sm ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-[#262932] text-gray-300"
                      }`}
                    >
                      {message.content}
                      <div className="text-xs opacity-70 mt-1">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={
                          message.role === "user"
                            ? USER_AVATAR_URL
                            : AI_AVATAR_URL
                        }
                        alt={`${message.role === "user" ? "User" : "AI"} Avatar`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
