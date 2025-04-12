import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/ui/dashboard-header";

export function Step2() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
  });
  const createSite = useMutation(api.sites.createSite);
  const reindexSite = useMutation(api.sites.reindexSite);

  useEffect(() => {
    // Load from session storage if exists
    const savedData = localStorage.getItem("siteFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Save form data to session storage
      localStorage.setItem("siteFormData", JSON.stringify(formData));

      const siteId = await createSite(formData);
      // Save siteId to session storage for step3
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
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-200">
                    Site Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Website"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="bg-dashboard-card-background border-[#262932] focus-visible:ring-1 focus-visible:ring-cyan-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-gray-200">
                    Website Sitemap URL
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/sitemap.xml"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, url: e.target.value }))
                    }
                    required
                    className="bg-dashboard-card-background border-[#262932] focus-visible:ring-1 focus-visible:ring-cyan-500/50"
                  />
                  <p className="text-sm text-gray-400">
                    Enter the full URL of your sitemap.xml file.
                  </p>
                </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
