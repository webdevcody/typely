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
} from "@/components/ui/form";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a title for this content"
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
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your content here..."
                  className="min-h-[200px]"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Content"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
