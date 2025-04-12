import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "@tanstack/react-form";
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

export const Route = createFileRoute("/dashboard/$siteId/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = useParams({ from: "/dashboard/$siteId/settings" });
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const form = useForm({
    defaultValues: {
      confirmSiteName: "",
    },
    onSubmit: async ({ value }) => {
      // TODO: Implement delete site mutation
      setIsDeleteDialogOpen(false);
      navigate({ to: "/dashboard" });
    },
  });

  return (
    <DashboardCard>
      <h1 className="text-2xl font-bold text-white mb-8">Site Settings</h1>

      <div className="space-y-8">
        {/* Danger Zone */}
        <div className="border border-red-500/20 rounded-xl p-6 bg-[#1C1F26]">
          <h2 className="text-lg font-semibold text-red-500 mb-4">
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
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
            >
              Delete site
            </Button>
          </div>
        </div>
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="py-4">
              <div className="text-sm text-gray-500">
                Please type <span className="font-semibold">confirm</span> to
                confirm.
              </div>
              <form.Field
                name="confirmSiteName"
                children={(field) => (
                  <input
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    )}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Type confirm to proceed"
                  />
                )}
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
                disabled={form.state.values.confirmSiteName !== "confirm"}
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
