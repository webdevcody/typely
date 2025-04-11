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
import { DashboardHeader } from "@/components/ui/dashboard-header";

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
    <div className="p-8 space-y-6 bg-[#0D0F12] min-h-full">
      <DashboardHeader title="Dashboard/Settings" />

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
      </DashboardCard>

      {/* Delete Site Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#1C1F26] border-[#262932] text-white">
          <DialogHeader>
            <DialogTitle>Delete Site</DialogTitle>
            <DialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your
              site and remove all associated data.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <div>
              <form.Field
                name="confirmSiteName"
                validators={{
                  onChange: ({ value }) =>
                    value !== siteId
                      ? "Please type the site ID to confirm"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Please type{" "}
                      <span className="font-mono text-white">{siteId}</span> to
                      confirm
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={cn(
                        "flex h-10 w-full rounded-xl border bg-[#141518] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#262932] disabled:cursor-not-allowed disabled:opacity-50",
                        field.state.meta.errors.length > 0
                          ? "border-red-500/50"
                          : "border-[#262932]"
                      )}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-[#262932] text-gray-300 hover:bg-[#262932] hover:text-white"
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={!canSubmit || isSubmitting}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  >
                    {isSubmitting ? "Deleting..." : "Delete Site"}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
