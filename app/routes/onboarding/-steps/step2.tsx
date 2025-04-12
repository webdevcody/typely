import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/ui/dashboard-header";
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

const formSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  url: z
    .string()
    .min(1, "Sitemap URL is required")
    .url("Please enter a valid URL")
    .regex(/sitemap\.xml$/, "URL must end with sitemap.xml"),
});

type FormData = z.infer<typeof formSchema>;

export function Step2() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createSite = useMutation(api.sites.createSite);
  const reindexSite = useMutation(api.sites.reindexSite);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const siteId = await createSite(data);
      localStorage.setItem("siteId", siteId);
      await reindexSite({ siteId });
      navigate({ to: "/onboarding/$step", params: { step: "3" } });
    } catch (error) {
      toast.error("There was an error creating your site. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6 min-h-screen">
      <div className="max-w-2xl mx-auto rounded-2xl bg-dashboard-panel-background border border-[#262932]/50 shadow-sm">
        <div className="border-b-2 border-[#262932]">
          <div className="p-8">
            <DashboardHeader title="Adding Your First Site (Step 2 of 3)" />
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="w-full max-w-xl mx-auto px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-white bg-clip-text text-transparent">
                Enter Your Website Details
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 text-left"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">
                          Site Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="My Awesome Website"
                            className="bg-dashboard-card-background border-[#262932] focus-visible:ring-1 focus-visible:ring-cyan-500/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">
                          Website Sitemap URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com/sitemap.xml"
                            className="bg-dashboard-card-background border-[#262932] focus-visible:ring-1 focus-visible:ring-cyan-500/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-gray-400">
                          Enter the full URL of your sitemap.xml file.
                        </p>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        navigate({
                          to: "/onboarding/$step",
                          params: { step: "1" },
                        })
                      }
                      className="border-[#262932] hover:bg-dashboard-card-background"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-cyan-500/80 to-cyan-500 hover:from-cyan-500 hover:to-cyan-500/90 text-white shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Crawling Site...
                        </>
                      ) : (
                        "Start Crawling Site"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
