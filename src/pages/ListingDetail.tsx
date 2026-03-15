import { useParams, Link, useNavigate } from "react-router-dom";
import { listings } from "@/data/listings";
import { Star, Shield, MapPin, Users, Bed, Bath, Wifi, Car, Dumbbell, TreePine,
  ChevronLeft, Heart, Share2, Phone, ChevronLeft as Prev, ChevronRight as Next } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import DatePicker from "@/components/DatePicker";
import GuestSelector from "@/components/GuestSelector";
import { useWishlist } from "@/hooks/useWishlist";
import { useBooking } from "@/hooks/useBooking";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-5 h-5" />,
  Parking: <Car className="w-5 h-5" />,
  Gym: <Dumbbell className="w-5 h-5" />,
  Garden: <TreePine className="w-5 h-5" />,
};

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = listings.find((l) => l.id === id);
  const { toggle, isWishlisted } = useWishlist();
  const { setBooking } = useBooking();
  const { user } = useAuth();

  const [imgIndex, setImgIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [authOpen, setAuthOpen] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Listing not found</h1>
          <Link to="/explore" className="text-primary hover:underline text-sm">Browse all listings</Link>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000))
    : 0;
  const subtotal = listing.price * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  const handleReserve = () => {
    if (!user) { setAuthOpen(true); return; }
    if (!checkIn || !checkOut) return;
    setBooking({
      propertyId: listing.id,
      propertyTitle: listing.title,
      pricePerNight: listing.price,
      checkIn, checkOut, guests,
      guestDetails: { name: user.name, email: user.email, phone: "", specialRequests: "" },
    });
    navigate("/booking");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/explore" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to listings
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => toggle(listing.id)}>
              <Heart className={`w-4 h-4 mr-1 ${isWishlisted(listing.id) ? "fill-primary text-primary" : ""}`} /> Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" /> Share
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-lg overflow-hidden aspect-[16/9] md:aspect-[2/1] mb-8">
          <img src={listing.images[imgIndex]} alt={listing.title} className="w-full h-full object-cover" />
          {listing.images.length > 1 && (
            <>
              <button onClick={() => setImgIndex((i) => (i - 1 + listing.images.length) % listing.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/90 flex items-center justify-center shadow hover:bg-background transition-colors">
                <Prev className="w-4 h-4" />
              </button>
              <button onClick={() => setImgIndex((i) => (i + 1) % listing.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/90 flex items-center justify-center shadow hover:bg-background transition-colors">
                <Next className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {listing.images.map((_, i) => (
                  <button key={i} onClick={() => setImgIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? "bg-background" : "bg-background/50"}`} />
                ))}
              </div>
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{listing.title}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {listing.neighborhood}</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-foreground text-foreground" /> {listing.rating} ({listing.reviews} reviews)</span>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="flex items-center gap-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-foreground"><Users className="w-4 h-4 text-muted-foreground" /> {listing.guests} guests</div>
              <div className="flex items-center gap-2 text-sm text-foreground"><Bed className="w-4 h-4 text-muted-foreground" /> {listing.bedrooms} bedrooms</div>
              <div className="flex items-center gap-2 text-sm text-foreground"><Bath className="w-4 h-4 text-muted-foreground" /> {listing.bathrooms} bathrooms</div>
            </div>

            {/* Host */}
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-lg">
                {listing.host.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-foreground">Hosted by {listing.host.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {listing.host.superhost && <span className="text-primary font-medium">Superhost</span>}
                  {listing.host.verified && <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Verified</span>}
                  <span>Joined {listing.host.joined}</span>
                </div>
              </div>
              <a href="tel:+254740531856">
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="w-4 h-4" /> Call Abdifatah
                </Button>
              </a>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">About this place</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {listing.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 p-3 rounded-md border border-border text-sm text-foreground">
                    {amenityIcons[a] || <div className="w-5 h-5 rounded-full bg-muted" />} {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-1">Reviews</h2>
              <div className="flex items-center gap-2 mb-5">
                <Star className="w-4 h-4 fill-foreground text-foreground" />
                <span className="font-semibold text-foreground">{listing.rating}</span>
                <span className="text-muted-foreground text-sm">· {listing.reviews} reviews</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {listing.reviewsList.map((r) => (
                  <div key={r.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground">
                        {r.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{r.author}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-background rounded-lg border border-border p-6 shadow-elevated">
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-display text-2xl font-bold text-foreground">KSh {listing.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>

              <div className="border border-border rounded-lg overflow-hidden mb-4">
                <DatePicker checkIn={checkIn} checkOut={checkOut}
                  onChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }} />
                <div className="border-t border-border">
                  <GuestSelector guests={guests} onChange={setGuests} maxGuests={listing.guests} />
                </div>
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
                onClick={handleReserve} disabled={!checkIn || !checkOut}>
                {!checkIn || !checkOut ? "Select dates to reserve" : "Reserve"}
              </Button>

              <a href="tel:+254740531856" className="block mt-3">
                <Button variant="outline" className="w-full h-11 text-sm font-medium gap-2">
                  <Phone className="w-4 h-4" /> Call Abdifatah
                </Button>
              </a>

              <p className="text-center text-xs text-muted-foreground mt-3">You won't be charged yet</p>

              {nights > 0 && (
                <div className="border-t border-border mt-5 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">KSh {listing.price.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""}</span>
                    <span className="text-foreground">KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee (12%)</span>
                    <span className="text-foreground">KSh {serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">KSh {total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="login" />
    </div>
  );
}
