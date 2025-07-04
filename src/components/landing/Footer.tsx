import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
      <p className="text-xs text-muted-foreground">
        &copy; 2025 Child-Free Platform. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="/terms" className="text-xs hover:underline underline-offset-4">
          Terms of Service
        </Link>
        <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
          Privacy Policy
        </Link>
      </nav>
    </footer>
  );
}