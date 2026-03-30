import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { Flame, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Live Matches", to: "/videos" },
    { label: "Schedule", to: "/videos" },
    { label: "Videos", to: "/videos" },
    { label: "Download", to: "/subscribe" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navbar border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/cricket-zone-logo-transparent.dim_120x120.png"
              alt="Cricket Zone"
              className="h-9 w-9 object-contain"
            />
            <span className="font-bold text-xl tracking-tight text-foreground">
              Cricket<span className="text-primary">Zone</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
                activeProps={{
                  className:
                    "px-3 py-2 text-sm text-primary border-b-2 border-primary rounded-none",
                }}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2 text-sm text-gold hover:text-foreground transition-colors"
                data-ocid="nav.link"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right utilities */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              data-ocid="nav.search_input"
            >
              <Search className="h-5 w-5" />
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to="/subscribe">
                  <Button
                    size="sm"
                    className="hidden sm:flex"
                    data-ocid="nav.primary_button"
                  >
                    Subscribe
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => clear()}
                  className="hidden sm:flex border-border text-muted-foreground hover:text-foreground"
                  data-ocid="nav.secondary_button"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAuthOpen(true)}
                  className="hidden sm:flex border-border text-muted-foreground hover:text-foreground"
                  data-ocid="nav.secondary_button"
                >
                  Login
                </Button>
                <Link to="/subscribe">
                  <Button
                    size="sm"
                    className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90"
                    data-ocid="nav.primary_button"
                  >
                    Subscribe
                  </Button>
                </Link>
              </div>
            )}

            <button
              type="button"
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
              data-ocid="nav.toggle"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <Input
              placeholder="Search matches, teams, players..."
              className="bg-secondary border-border"
              autoFocus
              data-ocid="nav.search_input"
            />
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-3 border-t border-border pt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2 text-sm text-gold"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.link"
              >
                Admin
              </Link>
            )}
            <div className="flex gap-2 px-3 pt-2">
              {isLoggedIn ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    clear();
                    setMenuOpen(false);
                  }}
                  className="border-border"
                  data-ocid="nav.secondary_button"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAuthOpen(true);
                    setMenuOpen(false);
                  }}
                  className="border-border"
                  data-ocid="nav.secondary_button"
                >
                  Login
                </Button>
              )}
              <Link to="/subscribe" onClick={() => setMenuOpen(false)}>
                <Button
                  size="sm"
                  className="bg-primary"
                  data-ocid="nav.primary_button"
                >
                  Subscribe ₹20/mo
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>

      {/* Auth Modal */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent
          className="bg-card border-border"
          data-ocid="auth.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              Sign in to Cricket Zone
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Sign in with Internet Identity to access live IPL streams,
              download videos, and manage your subscription.
            </p>
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => {
                login();
                setAuthOpen(false);
              }}
              disabled={isLoggingIn}
              data-ocid="auth.primary_button"
            >
              {isLoggingIn ? "Connecting..." : "Sign in with Internet Identity"}
            </Button>
            <Button
              variant="outline"
              className="w-full border-border"
              onClick={() => setAuthOpen(false)}
              data-ocid="auth.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
