import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ComponentProps } from "react";

interface LoaderButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
}

export function LoaderButton({
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: LoaderButtonProps) {
  return (
    <Button {...props} disabled={loading || disabled}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText || "Loading..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
