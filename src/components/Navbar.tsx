import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Phone, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "About Nairobi", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, logout } = useAuth();

  const openAuth = (tab: "login" | "signup") => { setAuthTab(tab); setAuthOpen(true); };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isHome ? "bg-background/80 backdrop-blur-xl" : "bg-background shadow-card"
      }`}>
        <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          <Link to="/" className="font-display text-xl font-bold text-foreground tracking-tight">
            Nairobi<span className="text-primary">Stay</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+254740531856"
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <Phone className="w-4 h-4" /> +254 740 531 856
            </a>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    {user.name.split(" ")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => openAuth("login")}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => openAuth("signup")}>
                  <User className="w-4 h-4 mr-2" /> Sign Up
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} className="md:hidden bg-background border-t border-border">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {navLinks.map((l) => (
                  <Link key={l.href} to={l.href} className="text-sm font-medium text-muted-foreground py-2"
                    onClick={() => setMobileOpen(false)}>{l.label}</Link>
                ))}
                <a href="tel:+254740531856" className="flex items-center gap-2 text-sm font-medium text-primary py-2">
                  <Phone className="w-4 h-4" /> +254 740 531 856
                </a>
                {user ? (
                  <>
                    <Link to="/dashboard" className="text-sm font-medium text-foreground py-2" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => { logout(); setMobileOpen(false); }}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { openAuth("login"); setMobileOpen(false); }}>Sign In</Button>
                    <Button size="sm" className="flex-1" onClick={() => { openAuth("signup"); setMobileOpen(false); }}>Sign Up</Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </>
  );
}
