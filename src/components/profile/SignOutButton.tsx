"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Button
      onClick={signOut}
      variant="destructive"
      size="default"
      data-cy="signout-button"
    >
      <LogOut/>
      Sign Out
    </Button>
  );
}
