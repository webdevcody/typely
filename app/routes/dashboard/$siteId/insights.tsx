import { createFileRoute, useParams } from "@tanstack/react-router";
import { api } from "../../../../convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { InnerCard } from "@/components/InnerCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format, subDays } from "date-fns";
import { Id } from "../../../../convex/_generated/dataModel";
import { MessageSquare, FileText, Globe, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/$siteId/insights")({
  component: RouteComponent,
});

// Placeholder data - replace with real data later
const generateDailyChatData = () => {
  const today = new Date();
  return Array.from({ length: 14 }).map((_, i) => {
    const date = subDays(today, 13 - i);
    return {
      date: format(date, "MMM dd"),
      chats: Math.floor(Math.random() * 20 + 10), // Random between 10-30
      uniqueUsers: Math.floor(Math.random() * 15 + 5), // Random between 5-20
    };
  });
};

const contentStats = {
  pages: 42,
  documents: 15,
  faqs: 23,
  customContexts: 8,
};

const chatMetrics = {
  totalChats: 347,
  avgResponseTime: "1.2s",
  satisfactionRate: "94%",
  uniqueUsers: 156,
};

function RouteComponent() {
  const { siteId } = useParams({ from: "/dashboard/$siteId/insights" });
  const dailyChatData = generateDailyChatData();

  const contentData = [
    { name: "Pages", value: contentStats.pages, color: "#3b82f6", icon: Globe },
    {
      name: "Documents",
      value: contentStats.documents,
      color: "#22c55e",
      icon: FileText,
    },
    {
      name: "FAQs",
      value: contentStats.faqs,
      color: "#eab308",
      icon: HelpCircle,
    },
    {
      name: "Custom Contexts",
      value: contentStats.customContexts,
      color: "#ef4444",
      icon: MessageSquare,
    },
  ];

  return (
    <DashboardCard>
      <h1 className="text-2xl font-bold mb-6">Site Insights</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <InnerCard>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Total Chats</span>
            <span className="text-2xl font-bold">{chatMetrics.totalChats}</span>
          </div>
        </InnerCard>
        <InnerCard>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Avg Response Time</span>
            <span className="text-2xl font-bold">
              {chatMetrics.avgResponseTime}
            </span>
          </div>
        </InnerCard>
        <InnerCard>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Satisfaction Rate</span>
            <span className="text-2xl font-bold">
              {chatMetrics.satisfactionRate}
            </span>
          </div>
        </InnerCard>
        <InnerCard>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Unique Users</span>
            <span className="text-2xl font-bold">
              {chatMetrics.uniqueUsers}
            </span>
          </div>
        </InnerCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Chat Activity */}
        <InnerCard className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Daily Chat Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyChatData}>
              <defs>
                <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="chats"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorChats)"
                name="Total Chats"
              />
              <Area
                type="monotone"
                dataKey="uniqueUsers"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Unique Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </InnerCard>

        {/* Content Distribution */}
        <InnerCard>
          <h2 className="text-lg font-semibold mb-4">Content Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {contentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </InnerCard>

        {/* Content Stats */}
        <InnerCard>
          <h2 className="text-lg font-semibold mb-4">Content Breakdown</h2>
          <div className="space-y-4">
            {contentData.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              );
            })}
          </div>
        </InnerCard>
      </div>
    </DashboardCard>
  );
}
