import { cn } from "@/lib/utils";
import React from "react";

export function Panel({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-dashboard-panel-background border border-[#262932]/50 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
