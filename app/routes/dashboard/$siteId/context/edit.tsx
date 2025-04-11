import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { LoaderButton } from "@/components/ui/loader-button";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export const Route = createFileRoute("/dashboard/$siteId/context/edit")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      contextId: search.contextId as string,
    };
  },
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const { contextId } = Route.useSearch();
  const navigate = useNavigate();

  const { data: context } = useQuery(
    convexQuery(api.context.getContextById, {
      contextId: contextId as Id<"contexts">,
    })
  );

  const updateContext = useMutation(api.context.updateTextContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: context?.title ?? "",
      content: context?.content ?? "",
    },
    values: {
      title: context?.title ?? "",
      content: context?.content ?? "",
    },
  });

  if (!context) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateContext({
        contextId: contextId as Id<"contexts">,
        title: values.title,
        content: values.content,
      });

      toast.success("Context updated", {
        description: "Your context has been updated successfully.",
      });

      navigate({
        to: "/dashboard/$siteId/context",
        params: { siteId },
      });
    } catch (error) {
      toast.error("Failed to update context. Please try again.", {
        description: "Failed to update context. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/$siteId/context" params={{ siteId }}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Context</h2>
          <p className="text-muted-foreground">
            Update your AI training context
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title" {...field} />
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
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your content"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <LoaderButton
                type="submit"
                loading={form.formState.isSubmitting}
                loadingText="Updating..."
              >
                Update Context
              </LoaderButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
