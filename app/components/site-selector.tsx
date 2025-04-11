import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

export function SiteSelector() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: sites } = useQuery(convexQuery(api.sites.getUserSites, {}));
  const currentUrl = window.location.pathname;
  const currentSiteId = currentUrl.split("/")[2]; // Extracts siteId from URL if present

  if (!sites) return null;

  const currentSite = sites.find((site) => site._id === currentSiteId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-foreground"
        >
          {currentSite?.name ?? "Select a site"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search sites..." />
          <CommandList>
            <CommandEmpty>No sites found.</CommandEmpty>
            <CommandGroup heading="Your Sites">
              {sites.map((site) => (
                <CommandItem
                  key={site._id}
                  onSelect={() => {
                    navigate({
                      to: "/dashboard/$siteId",
                      params: { siteId: site._id as Id<"sites"> },
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentSiteId === site._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {site.name}asdfasdf
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  navigate({ to: "/onboarding" });
                  setOpen(false);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a new site
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
