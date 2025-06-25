"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import SignOutButton from "./SignOutButton";

// Helper components for mobile menu icons
// function MenuIcon(props: React.ComponentProps<"svg">) {
//   return (
//     <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
//     </svg>
//   );
// }

// function CloseIcon(props: React.ComponentProps<"svg">) {
//   return (
//     <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
//     </svg>
//   );
// }

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth(); // Get user state and loading status
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ];

  const handleMobileSignOut = async () => {
    await signOut();
    closeMobileMenu();
  };

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              CF APP
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive
                    ? "text-white bg-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth links for Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-24 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            ) : user ? (
              <>
                <Link
                  href={`/users/${user.name}`}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                  data-cy="profile-link"
                >
                  My Profile
                </Link>
                <SignOutButton />
              </>
            ) : (
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-gray-100 focus:outline-none"
              aria-label="Main menu"
            >
              {/* {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />} */}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isLoading ? (
                <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
              ) : user ? (
                <div className="px-2 space-y-1">
                  <Link
                    href={`/users/${user.name}`}
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  {/* can't use the button component directly as it doesn't close the menu, so we replicate its logic */}
                  <button
                    onClick={handleMobileSignOut}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  onClick={closeMobileMenu}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}