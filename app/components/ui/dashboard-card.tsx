import { cn } from "@/lib/utils";
import React from "react";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DashboardCard({
  children,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-color-card-border bg-dashboard-card-background p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
