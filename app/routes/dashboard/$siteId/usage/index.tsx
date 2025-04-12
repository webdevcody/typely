import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Id } from "convex/_generated/dataModel";

export const Route = createFileRoute("/dashboard/$siteId/usage/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const { data: usageData } = useQuery(
    convexQuery(api.usage.getSiteUsage, { siteId: siteId as Id<"sites"> })
  );

  if (!usageData) {
    return <div>Loading...</div>;
  }

  const totalTokens = usageData.reduce((acc, day) => acc + day.tokens, 0);
  const totalCost = usageData.reduce((acc, day) => acc + day.cost, 0);
  const dailyAverage =
    usageData.length > 0 ? Math.round(totalTokens / usageData.length) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Tokens Used</CardTitle>
            <CardDescription>Lifetime token usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTokens.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Cost</CardTitle>
            <CardDescription>Based on OpenAI's pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Average</CardTitle>
            <CardDescription>Average tokens per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyAverage.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Over Time</CardTitle>
          <CardDescription>Token usage trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tokens"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
