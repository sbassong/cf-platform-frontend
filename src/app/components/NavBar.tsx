"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  // { href: "/feed", label: "Feed" },
  // { href: "/groups", label: "Groups" },
  // { href: "/events", label: "Events" },
  // { href: "/messages", label: "Messages" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();

  console.log({ user });

  // helper to get initials from the display name for the avatar fallback
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-background border-b">
      <Link href="/" className="flex items-center justify-center">
        <span className="sr-only">Child-Free Platform</span>
        {/* You can place a Logo component or SVG here */}
        <h1 className="text-lg font-bold">CFP</h1>
      </Link>

      <nav className="hidden md:flex flex-grow items-center justify-center">
        {user && (
          <div className="flex items-center space-x-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80 text-foreground/60",
                    isActive && "text-primary font-semibold"
                  )}
                  data-cy={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <div className="flex items-center gap-4 ml-auto">
        {isLoading ? (
          <div className="w-24 h-8 bg-gray-200 rounded-md animate-pulse"></div>
        ) : user ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild data-cy="user-avatar-button">
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.profile?.avatarUrl || ""}
                    alt={user?.profile?.displayName || "User"}
                  />
                  <AvatarFallback>
                    {getInitials(user.profile?.displayName || "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p
                    className="text-sm font-medium leading-none"
                    data-cy="user-display-name"
                  >
                    {user.profile?.displayName}
                  </p>
                  <p
                    className="text-xs leading-none text-muted-foreground"
                    data-cy="user-email"
                  >
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  href={`/profiles/${user.profile.username}`}
                  data-cy="profile-link"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" data-cy="settings-link">
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={signOut}
                data-cy="signout-button"
                className="text-red-500 focus:bg-red-500/10 focus:text-red-500"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/signin">
              <Button variant="ghost" data-cy="signin-link">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button data-cy="signup-link">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
