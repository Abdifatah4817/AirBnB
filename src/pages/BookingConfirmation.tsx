import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Calendar, Phone, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { motion } from "framer-motion";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BookingConfirmation() {
  const [params] = useSearchParams();
  const bookingId = params.get("id") || "NSB-UNKNOWN";
  const { booking, nights, total } = useBooking();

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-background">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full mx-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground mb-6">
          Your stay has been requested. Abdifatah will confirm shortly.
        </p>

        <div className="bg-muted rounded-lg p-5 text-left space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Booking ID</span>
            <span className="font-mono font-semibold text-foreground">{bookingId}</span>
          </div>
          {booking && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Property</span>
                <span className="font-medium text-foreground text-right max-w-[60%]">{booking.propertyTitle}</span>
              </div>
              {booking.checkIn && booking.checkOut && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-medium text-foreground">
                    {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">{nights} night{nights !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold border-t border-border pt-3">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">KSh {total.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 text-sm text-left">
          <p className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Next steps
          </p>
          <ul className="space-y-1 text-muted-foreground text-xs">
            <li>• Abdifatah will confirm your booking within 24 hours</li>
            <li>• You'll receive check-in instructions via phone/email</li>
            <li>• Payment to be arranged directly with the host</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a href="tel:+254740531856" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Phone className="w-4 h-4" /> Call Abdifatah
            </Button>
          </a>
          <Button asChild className="flex-1 gap-2">
            <Link to="/explore"><Home className="w-4 h-4" /> Browse more stays</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
