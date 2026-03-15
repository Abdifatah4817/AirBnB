import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBooking } from "@/hooks/useBooking";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Shield, Phone } from "lucide-react";
import { motion } from "framer-motion";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function BookingPage() {
  const { booking, nights, subtotal, serviceFee, total, setBooking } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!booking || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No booking in progress.</p>
          <Link to="/explore" className="text-primary hover:underline text-sm">Browse listings</Link>
        </div>
      </div>
    );
  }

  const updateDetails = (field: string, value: string) =>
    setBooking({ ...booking, guestDetails: { ...booking.guestDetails, [field]: value } });

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const bookingId = `NSB-${Date.now().toString(36).toUpperCase()}`;
    navigate(`/booking/confirmation?id=${bookingId}`);
  };

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-5xl">
        <Link to={`/listing/${booking.propertyId}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to listing
        </Link>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">Confirm your booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleConfirm} className="lg:col-span-3 space-y-8">
            {/* Trip Details */}
            <div className="border border-border rounded-lg p-5">
              <h2 className="font-display font-semibold text-foreground mb-4">Your trip</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Check-in</p>
                  <p className="font-medium text-foreground">{formatDate(booking.checkIn!)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Check-out</p>
                  <p className="font-medium text-foreground">{formatDate(booking.checkOut!)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Duration</p>
                  <p className="font-medium text-foreground">{nights} night{nights !== 1 ? "s" : ""}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Guests</p>
                  <p className="font-medium text-foreground">
                    {booking.guests.adults} adult{booking.guests.adults !== 1 ? "s" : ""}
                    {booking.guests.children > 0 && `, ${booking.guests.children} child${booking.guests.children !== 1 ? "ren" : ""}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="border border-border rounded-lg p-5 space-y-4">
              <h2 className="font-display font-semibold text-foreground">Guest details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required value={booking.guestDetails.name}
                    onChange={(e) => updateDetails("name", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={booking.guestDetails.email}
                    onChange={(e) => updateDetails("email", e.target.value)} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" placeholder="+254..." required value={booking.guestDetails.phone}
                    onChange={(e) => updateDetails("phone", e.target.value)} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="requests">Special requests (optional)</Label>
                  <Textarea id="requests" placeholder="Any special requests for the host..." rows={3}
                    value={booking.guestDetails.specialRequests}
                    onChange={(e) => updateDetails("specialRequests", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Payment Placeholder */}
            <div className="border border-border rounded-lg p-5">
              <h2 className="font-display font-semibold text-foreground mb-4">Payment</h2>
              <div className="bg-muted rounded-md p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">M-Pesa / Card payment</p>
                <p>Payment processing will be available soon. For now, contact the host directly to arrange payment.</p>
                <a href="tel:+254740531856" className="flex items-center gap-2 text-primary mt-3 font-medium hover:underline">
                  <Phone className="w-4 h-4" /> Call Abdifatah: +254 740 531 856
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
              {loading ? "Confirming..." : `Confirm booking · KSh ${total.toLocaleString()}`}
            </Button>
          </form>

          {/* Summary Card */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="sticky top-24 border border-border rounded-lg p-5 space-y-4">
              <h2 className="font-display font-semibold text-foreground">Price summary</h2>
              <p className="text-sm font-medium text-foreground">{booking.propertyTitle}</p>
              <div className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">KSh {booking.pricePerNight.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""}</span>
                  <span className="text-foreground">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee (12%)</span>
                  <span className="text-foreground">KSh {serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold pt-3 border-t border-border text-base">
                  <span>Total (KSh)</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted rounded-md p-3">
                <Shield className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <p>Your booking is protected. You won't be charged until the host confirms.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
