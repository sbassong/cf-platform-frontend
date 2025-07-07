"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Button
      onClick={signOut}
      variant="destructive"
      size="default"
      data-cy="signout-button"
    >
      Sign Out
    </Button>
  );
}
