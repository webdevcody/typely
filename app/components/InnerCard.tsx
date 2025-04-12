import { cn } from "@/lib/utils";

export const innerCardStyles =
  "rounded-xl bg-gradient-to-br from-dashboard-panel-background to-[#1a1e22] border p-6";

export function InnerCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className={cn(innerCardStyles, className)}>
      {children}
    </div>
  );
}
