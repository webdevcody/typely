import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Settings,
  MessageSquare,
  Bot,
  Files,
} from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  className?: string;
}

const iconMap = {
  Overview: LayoutDashboard,
  Pages: Files,
  Documents: FileText,
  Context: FileText,
  Sessions: MessageSquare,
  Agents: Bot,
  Settings: Settings,
  Dashboard: LayoutDashboard,
};

export function DashboardHeader({ title, className }: DashboardHeaderProps) {
  const parts = title.split("/");

  return (
    <div className={cn("flex items-center gap-2 text-gray-400", className)}>
      {parts.map((part, index) => {
        const Icon = iconMap[part as keyof typeof iconMap];
        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}
            <div className="flex items-center gap-1">
              {index === 0 && Icon && <Icon className="h-4 w-4" />}
              <span
                className={
                  index === parts.length - 1 ? "text-white" : undefined
                }
              >
                {part}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
