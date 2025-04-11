import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  className?: string;
}

export function DashboardHeader({ title, className }: DashboardHeaderProps) {
  const parts = title.split("/");

  return (
    <div className={cn("flex items-center gap-2 text-gray-400", className)}>
      {parts.map((part, index) => (
        <>
          {index > 0 && <span>/</span>}
          <span
            key={index}
            className={index === parts.length - 1 ? "text-white" : undefined}
          >
            {part}
          </span>
        </>
      ))}
    </div>
  );
}
