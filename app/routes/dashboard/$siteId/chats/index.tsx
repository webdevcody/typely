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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Chats</h1>
          <p className="text-muted-foreground">
            View chat history for any users talking with Sensei
          </p>
        </div>

        <div className="flex gap-4">
          <input
            type="search"
            placeholder="Search chats..."
            className="px-3 py-2 border rounded-md"
          />
          <select className="px-3 py-2 border rounded-md">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>All time</option>
          </select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">First Message</TableHead>
              <TableHead className="w-48">Last Message</TableHead>
              <TableHead className="w-48">Duration</TableHead>
              <TableHead>First Message</TableHead>
              <TableHead className="w-24 text-center">Messages</TableHead>
              <TableHead className="w-24">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!chatSessions ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <span className="loading loading-spinner" /> Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : chatSessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
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
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedSessionId(chat._id)}
                >
                  <TableCell>
                    {formatDistanceToNow(
                      new Date(chat.firstMessage?.createdAt || 0),
                      {
                        addSuffix: true,
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(
                      new Date(chat.lastMessage?.createdAt || 0),
                      {
                        addSuffix: true,
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistance(
                      new Date(chat.firstMessage?.createdAt || 0),
                      new Date(chat.lastMessage?.createdAt || 0),
                      { includeSeconds: true }
                    )}
                  </TableCell>
                  <TableCell className="truncate max-w-md">
                    {chat.firstMessage?.content}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {messages?.length || 0}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${
                        Date.now() -
                          new Date(chat.lastMessage?.createdAt || 0).getTime() <
                        5 * 60 * 1000
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
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

      <Sheet
        open={!!selectedSessionId}
        onOpenChange={() => setSelectedSessionId(null)}
      >
        <SheetContent className="w-[480px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex justify-between items-center">
              <span>Chat Session</span>
              <span className="text-sm font-normal text-muted-foreground">
                {messages?.length || 0} messages
              </span>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-8rem)] mt-6 px-8">
            {!messages ? (
              <div className="flex items-center justify-center h-32">
                <span className="loading loading-spinner" /> Loading...
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
                      className={`flex-1 rounded-lg p-3 text-sm ${
                        message.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-900"
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
