import { cn } from "@/lib/utils";
import React from "react";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "inner";
}

export function DashboardCard({
  children,
  className,
  variant = "default",
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        variant === "default" && "bg-[#141518] p-8",
        variant === "inner" && "bg-[#1C1F26] p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

// export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
//   const parts = title.split("/");

//   return (
//     <div className="flex items-center gap-2 text-gray-400 mb-6">
//       {parts.map((part, index) => (
//         <React.Fragment key={index}>
//           {index > 0 && <span>/</span>}
//           <span className={index === parts.length - 1 ? "text-white" : ""}>
//             {part}
//           </span>
//         </React.Fragment>
//       ))}
//       {subtitle && (
//         <>
//           <span>/</span>
//           <span className="text-white">{subtitle}</span>
//         </>
//       )}
//     </div>
//   );
// }
