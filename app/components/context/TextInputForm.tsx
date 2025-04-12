import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { InnerCard } from "../InnerCard";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type FormData = z.infer<typeof formSchema>;

export function TextInputForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createContext = useMutation(api.context.createTextContext);
  const { siteId } = useParams({ from: "/dashboard/$siteId/context/add" });
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      await createContext({
        siteId: siteId as Id<"sites">,
        title: data.title.trim(),
        content: data.content.trim(),
        type: "text",
      });
      toast.success("Context added successfully");
      navigate({ to: "/dashboard/$siteId/context", params: { siteId } });
    } catch (error) {
      toast.error("Failed to add context: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Title</FormLabel>
              <FormDescription>
                Give your content a clear, descriptive title for easy reference.
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="e.g., Company Overview, Product Features, FAQ"
                  className="max-w-xl"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Content</FormLabel>
              <FormDescription>
                Enter the main content that will be used to train your AI.
                Include all relevant details and context.
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Enter detailed information about your topic..."
                  className="min-h-[300px] resize-y "
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() =>
              navigate({
                to: "/dashboard/$siteId/context",
                params: { siteId },
              })
            }
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              "Save Content"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
