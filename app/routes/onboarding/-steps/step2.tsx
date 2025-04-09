import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export function Step2() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
  });
  const createSite = useMutation(api.sites.createSite);
  const indexSite = useAction(api.sites.indexSite);

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

      await indexSite({ siteId });

      navigate({ to: "/onboarding/$step", params: { step: "3" } });
    } catch (error) {
      toast.error("There was an error creating your site. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Enter Your Website Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Site Name</Label>
          <Input
            id="name"
            placeholder="My Awesome Website"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">Website Sitemap URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/sitemap.xml"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            required
          />
          <p className="text-sm text-gray-500">
            Enter the full URL of your sitemap.xml file.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate({ to: "/onboarding/$step", params: { step: "1" } })
            }
            className="cursor-pointer flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="cursor-pointer flex-1 bg-indigo-600 hover:bg-indigo-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Crawling Site...
              </>
            ) : (
              "Start Crawling Site"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
