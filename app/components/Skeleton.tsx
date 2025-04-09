import { cn } from "@/lib/utils";

export const Skeleton = ({
  rows = 1,
  type = "default",
}: {
  rows?: number;
  type?: "default" | "title" | "description" | "badge";
}) => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-8 w-24 bg-gray-300 animate-pulse rounded-sm",
            type === "title" && "h-8 w-64",
            type === "description" && "h-6 w-48",
            type === "badge" && "h-6 w-24"
          )}
        ></div>
      ))}
    </div>
  );
};
