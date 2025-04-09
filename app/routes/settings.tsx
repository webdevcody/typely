import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const currentUser = useCurrentUser();
  const userEmail = currentUser?.data?.email;

  const form = useForm({
    defaultValues: {
      confirmEmail: "",
    },
    onSubmit: async ({ value }) => {
      // TODO: Implement delete account mutation
      setIsDeleteDialogOpen(false);
      navigate({ to: "/" });
    },
  });

  return (
    <div className="container py-8 mx-auto">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

      <div className="space-y-8">
        {/* Danger Zone */}
        <div className="border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-4">
            Danger Zone
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delete your account</h3>
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all associated data.
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
                name="confirmEmail"
                validators={{
                  onChange: ({ value }) =>
                    value !== userEmail
                      ? "Please type your email to confirm"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Please type <span className="font-mono">{userEmail}</span>{" "}
                      to confirm
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        field.state.meta.errors.length > 0 &&
                          "border-destructive"
                      )}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
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
                  >
                    {isSubmitting ? "Deleting..." : "Delete Account"}
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
