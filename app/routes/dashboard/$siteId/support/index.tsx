import { useCurrentUser } from "@/hooks/useCurrentUser";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { MessageSquare, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { LoaderButton } from "@/components/ui/loader-button";
import { useState } from "react";

const supportSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters")
    .trim(),
});

type SupportFormData = z.infer<typeof supportSchema>;

export const Route = createFileRoute("/dashboard/$siteId/support/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const { data: user } = useCurrentUser();
  const createSupportMessage = useMutation(api.support.createSupportMessage);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: SupportFormData) => {
    if (!user || !siteId) return;

    await createSupportMessage({
      userId: user._id,
      siteId,
      message: data.message,
    });

    reset();
    setIsSubmitted(true);
  };

  return (
    <DashboardCard className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Support</h1>
      </div>

      {isSubmitted ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <div className="max-w-md">
            <h2 className="text-xl font-semibold">
              Thank you for reaching out!
            </h2>
            <p className="mt-2 text-gray-600">
              We've received your message and will get back to you as soon as
              possible to help resolve your issue.
            </p>
            <Button
              className="mt-6"
              onClick={() => setIsSubmitted(false)}
              variant="outline"
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">How can we help you?</span>
              <textarea
                {...register("message")}
                className="min-h-[150px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your issue or question..."
              />
              {errors.message && (
                <span className="text-sm text-red-500">
                  {errors.message.message}
                </span>
              )}
            </label>

            <LoaderButton
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              loadingText="Submitting..."
            >
              Submit
            </LoaderButton>
          </div>
        </form>
      )}
    </DashboardCard>
  );
}
