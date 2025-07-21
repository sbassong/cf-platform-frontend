"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import useSWR from 'swr';
import { Conversation } from '@/types';
import { fetcher } from '@/lib/api';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { Edit, LogOut, Settings, MessageCircle } from "lucide-react";
import SearchBar from "../search/SearchBar";

// const navLinks = [
//   { href: "/", label: "Home" },
//   // { href: "/feed", label: "Feed" },
//   // { href: "/groups", label: "Groups" },
//   // { href: "/events", label: "Events" },
//   // { href: "/messages", label: "Messages" },
//   { href: "/about", label: "About" },
// ];

// This is a helper component for styling dropdown items, based on shadcn docs
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const { data: conversations } = useSWR<Conversation[]>(
    user ? '/messaging/conversations' : null,
    fetcher
  );

  const unreadCount = conversations?.filter(convo =>
    convo.lastMessage &&
    convo.lastMessage.sender._id !== user?.profile._id &&
    user?.profile._id &&
    !convo.lastMessage.readBy.includes(user.profile._id)
  ).length || 0;


  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-center bg-background/95 backdrop-blur-sm border-b">
      <div className=" flex items-center. justify-between w-full mx-4 ">
        <Link href="/" className="flex items-center justify-center mr-6">
          <span className="sr-only">Child-Free Platform</span>
          <h1 className="text-lg font-bold">CFP</h1>
        </Link>

        {user ? (
          // LOGGED-IN STATE (Main App Nav)
          <div className="flex flex-grow justify-between">
            <SearchBar /> 

            <NavigationMenu>
              <NavigationMenuList>
                {/* Feed Link */}
                <NavigationMenuItem>
                  <Link href="/" passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent text-foreground/60 hover:text-foreground/80",
                        pathname === "/" && "text-foreground font-semibold"
                      )}
                    >
                      Feed
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* Community Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "bg-transparent text-foreground/60 hover:text-foreground/80",
                      pathname.startsWith("/groups") ||
                        pathname.startsWith("/events") ||
                        (pathname.startsWith("/messages") &&
                          "text-foreground font-semibold")
                    )}
                  >
                    Community
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      <ListItem href="/groups" title="Groups">
                        Find and join communities based on your interests.
                      </ListItem>
                      <ListItem href="/events" title="Events">
                        Discover virtual or local meetups and activities.
                      </ListItem>
                      <ListItem href="/messages" title="Messages">
                        Make connections and catch up with your friends.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-4">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profile?.avatarUrl || ""} alt={user.profile?.displayName || "User"} />
                      <AvatarFallback>{getInitials(user.profile?.displayName || "")}</AvatarFallback>
                    </Avatar>
                    {unreadCount > 0 && (
                      <span className="absolute bottom-6 left-6 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 py-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-md font-semibold leading-none">{user.profile?.displayName}</p>
                      <p className="text-sm leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="py-2 text-md">
                    <Link href={`/profiles/${user.profile.username}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2 text-md">
                    <Link href="/messages">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                      {unreadCount > 0 && (
                        <span className=" flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2 text-md">
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-md text-red-500 focus:text-red-500 hover:bg-red-500/10 py-2 ">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          // LOGGED-OUT STATE (Landing Page Nav)
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/#features">
              <Button variant="ghost">Features</Button>
            </Link>
            <Link href="/#testimonials">
              <Button variant="ghost">Testimonials</Button>
            </Link>
            <Link href="/signin">
              <Button variant="ghost" data-cy="signin-link">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button data-cy="signup-link">Sign Up</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
