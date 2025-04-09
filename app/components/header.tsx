import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
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

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "About", href: "/about" },
];

export function Header() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const currentUser = useCurrentUser();

  const handleSignOut = () => {
    signOut();
    setIsSheetOpen(false);
  };

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="font-bold text-xl">
            Site Sensei
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Authenticated>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.data?.image} />
                    <AvatarFallback>
                      {currentUser?.data?.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left"
                  >
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
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetHeader className="border-b p-6">
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col px-6">
                <div className="space-y-4 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsSheetOpen(false)}
                      className="block text-base font-semibold text-gray-900 hover:text-gray-600"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="border-t py-6">
                  <Authenticated>
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={currentUser?.data?.image} />
                          <AvatarFallback>
                            {currentUser?.data?.name
                              ?.charAt(0)
                              ?.toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {currentUser?.data?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Signed in with Google
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={handleSignOut}
                      >
                        Sign out
                      </Button>
                    </div>
                  </Authenticated>
                  <Unauthenticated>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">
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
