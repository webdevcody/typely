import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, LogOut, Menu, NotepadText } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ModeToggle } from "./mode-toggle";
import { SiteSelector } from "./site-selector";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const { signIn, signOut } = useAuthActions();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const currentUser = useCurrentUser();
  const { isLoading } = useConvexAuth();
  const routerState = useRouterState();

  const handleSignOut = () => {
    signOut();
    setIsSheetOpen(false);
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <nav className="mx-auto flex items-center justify-between p-4 lg:px-8">
        {/* Logo and Site Selector */}
        <div className="flex gap-8 items-center justify-center flex-1 basis-0">
          <Link
            to="/"
            className="font-bold text-xl flex items-center gap-2 text-foreground"
          >
            <NotepadText className="size-5" />
            Typely
          </Link>

          {routerState.location.pathname.startsWith("/dashboard") && (
            <Authenticated>
              <SiteSelector />
            </Authenticated>
          )}
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex lg:gap-x-12 flex-1 justify-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-semibold leading-6 text-foreground hover:text-foreground/80"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex items-center gap-x-4 flex-1 basis-0 justify-end">
          <ModeToggle />
          {isLoading && (
            <div className="flex items-center justify-center h-8 w-8 bg-muted animate-pulse rounded-full">
              <Loader2 className="animate-spin size-4" />
            </div>
          )}
          <Authenticated>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-accent hover:border hover:border-accent cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    {currentUser.isLoading ? (
                      <div className="h-full w-full bg-muted animate-pulse rounded-full" />
                    ) : (
                      <>
                        <AvatarImage src={currentUser?.data?.image} />
                        <AvatarFallback>
                          {currentUser?.data?.name?.charAt(0)?.toUpperCase() ??
                            "U"}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Authenticated>
          <Unauthenticated>
            <Button onClick={() => signIn("google")}>Sign in</Button>
          </Unauthenticated>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] p-0 overflow-y-auto flex flex-col max-h-screen"
            >
              <SheetHeader className="border-b p-6">
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col px-6">
                <Authenticated>
                  <div className="py-6">
                    <SiteSelector />
                  </div>
                </Authenticated>
                <div className="space-y-4 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsSheetOpen(false)}
                      className="block text-base font-semibold text-foreground hover:text-foreground/80"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="border-t py-6">
                  <div className="flex items-center justify-between mb-4">
                    <ModeToggle />
                  </div>
                  <Authenticated>
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-2">
                        <Avatar className="size-10">
                          <AvatarImage src={currentUser?.data?.image} />
                          <AvatarFallback>
                            {currentUser?.data?.name
                              ?.charAt(0)
                              ?.toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {currentUser.isLoading ? (
                              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                            ) : (
                              currentUser?.data?.name
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Signed in with Google
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleSignOut}
                        >
                          Sign out
                        </Button>
                      </div>
                    </div>
                  </Authenticated>
                  <Unauthenticated>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Sign in to access all features
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => {
                          signIn("google");
                          setIsSheetOpen(false);
                        }}
                      >
                        Sign in with Google
                      </Button>
                    </div>
                  </Unauthenticated>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
