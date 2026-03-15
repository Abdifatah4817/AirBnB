import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { listings } from "@/data/listings";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, User, LogOut, Star } from "lucide-react";
import { motion } from "framer-motion";
import ListingCard from "@/components/ListingCard";

type Tab = "bookings" | "wishlist" | "profile";

// Mock past bookings for demo
const MOCK_BOOKINGS = [
  { id: "NSB-ABC123", propertyId: "westlands-modern-apartment", checkIn: "Mar 10, 2025", checkOut: "Mar 13, 2025", nights: 3, total: 8400, status: "completed" },
  { id: "NSB-DEF456", propertyId: "kilimani-cozy-studio", checkIn: "Apr 5, 2025", checkOut: "Apr 7, 2025", nights: 2, total: 3360, status: "confirmed" },
];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [tab, setTab] = useState<Tab>("bookings");

  if (!user) return <Navigate to="/" replace />;

  const wishlisted = listings.filter((l) => wishlist.includes(l.id));

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "bookings", label: "My Bookings", icon: <Calendar className="w-4 h-4" /> },
    { key: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
    { key: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl font-display">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Welcome, {user.name.split(" ")[0]}</h1>
              <p className="text-sm text-muted-foreground capitalize">{user.role} account</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2 text-muted-foreground">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8 gap-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {/* Bookings Tab */}
          {tab === "bookings" && (
            <div className="space-y-4">
              {MOCK_BOOKINGS.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No bookings yet.</p>
                  <Button asChild><Link to="/explore">Explore stays</Link></Button>
                </div>
              ) : (
                MOCK_BOOKINGS.map((b) => {
                  const property = listings.find((l) => l.id === b.propertyId);
                  return (
                    <div key={b.id} className="border border-border rounded-lg p-5 flex flex-col sm:flex-row gap-4">
                      {property && (
                        <img src={property.images[0]} alt={property.title}
                          className="w-full sm:w-32 h-24 object-cover rounded-md shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-display font-semibold text-foreground text-sm truncate">
                            {property?.title || b.propertyId}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 capitalize ${STATUS_STYLES[b.status]}`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{b.checkIn} – {b.checkOut} · {b.nights} nights</p>
                        <p className="text-sm font-semibold text-foreground">KSh {b.total.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Booking ID: {b.id}</p>
                        {b.status === "completed" && (
                          <button className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline">
                            <Star className="w-3 h-3" /> Leave a review
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {tab === "wishlist" && (
            <div>
              {wishlisted.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No saved properties yet.</p>
                  <Button asChild><Link to="/explore">Explore stays</Link></Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlisted.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="max-w-md space-y-5">
              {[
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Role", value: user.role, capitalize: true },
                { label: "Phone", value: user.phone || "Not set" },
                { label: "Member since", value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
              ].map((f) => (
                <div key={f.label} className="border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
                  <p className={`text-sm font-medium text-foreground ${f.capitalize ? "capitalize" : ""}`}>{f.value}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
