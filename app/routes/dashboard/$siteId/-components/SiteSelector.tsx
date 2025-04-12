import { useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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

interface SiteSelectorProps {
  siteId: string;
}

export function SiteSelector({ siteId }: SiteSelectorProps) {
  const router = useRouter();
  const { data: sites } = useQuery(convexQuery(api.sites.getUserSites, {}));

  if (!sites) return null;

  const currentSite = sites.find((site) => site._id === siteId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          className="w-full h-auto hover:bg-transparent border border-color-card-border bg-dashboard-card-background group"
        >
          <div className="flex items-center gap-3 w-full">
            <img src="/icon.png" alt="Logo" className="size-8" />
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-white">
                  {(currentSite?.name?.length ?? 0) > 10
                    ? currentSite?.name?.slice(0, 10) + "..."
                    : currentSite?.name || "Select a site"}
                </h2>
              </div>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-gray-300 transition-transform group-data-[state=open]:rotate-180" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0  border border-[#262932]/50 shadow-lg">
        <Command className="bg-dashboard-panel-background">
          <CommandList className="py-2">
            <CommandGroup heading="Your Sites" className="px-2">
              {sites.map((site) => (
                <CommandItem
                  key={site._id}
                  onSelect={() => {
                    router.navigate({
                      to: "/dashboard/$siteId",
                      params: { siteId: site._id },
                    });
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#262932]  hover:text-white rounded-lg mx-2"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        siteId === site._id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {site.name}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator className="bg-[#262932] my-2" />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  router.navigate({
                    to: "/onboarding/$step",
                    params: { step: "1" },
                  });
                }}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#262932] hover:text-white rounded-lg mx-2"
              >
                <PlusCircle className="h-4 w-4" />
                Create a new site
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
