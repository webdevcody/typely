import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { InnerCard } from "@/components/InnerCard";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

export const Route = createFileRoute("/dashboard/$siteId/settings")({
  component: RouteComponent,
});

type DeleteFormValues = {
  confirmSiteName: string;
};

function RouteComponent() {
  const { siteId } = useParams({ from: "/dashboard/$siteId/settings" });
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const deleteSite = useMutation(api.sites.deleteSite);
  const { data: site } = useQuery(
    convexQuery(api.sites.getSite, {
      siteId: siteId as Id<"sites">,
    })
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DeleteFormValues>({
    defaultValues: {
      confirmSiteName: "",
    },
  });

  const confirmSiteName = watch("confirmSiteName");

  const onSubmit = async (data: DeleteFormValues) => {
    if (!site) return;

    if (data.confirmSiteName !== site.name) {
      toast.error("Site name does not match");
      return;
    }

    try {
      await deleteSite({ siteId: siteId as Id<"sites"> });
      setIsDeleteDialogOpen(false);
      toast.success("Site deleted successfully");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error("Failed to delete site");
      console.error("Error deleting site:", error);
    }
  };

  return (
    <DashboardCard>
      <h1 className="text-2xl font-bold text-white mb-8">Site Settings</h1>

      <div className="space-y-8">
        {/* Danger Zone */}
        <InnerCard className="border-destructive/50">
          <h2 className="text-lg font-semibold text-destructive mb-4">
            Danger Zone
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Delete this site</h3>
              <p className="text-sm text-gray-400">
                Once you delete a site, there is no going back. Please be
                certain.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete site
            </Button>
          </div>
        </InnerCard>
      </div>

      {/* Delete Site Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Site</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              site and remove all data from our servers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-4">
              <div className="text-sm text-gray-300">
                Please type{" "}
                <span className="font-semibold text-white">{site?.name}</span>{" "}
                to confirm.
              </div>
              <input
                {...register("confirmSiteName")}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                )}
                placeholder="Type site name to proceed"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!site || confirmSiteName !== site.name}
              >
                Delete Site
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
}
