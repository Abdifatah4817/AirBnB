import { useParams, Link } from "react-router-dom";
import { listings } from "@/data/listings";
import { Star, Shield, MapPin, Users, Bed, Bath, Wifi, Car, Dumbbell, TreePine, ChevronLeft, Heart, Share2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-5 h-5" />,
  Parking: <Car className="w-5 h-5" />,
  Gym: <Dumbbell className="w-5 h-5" />,
  Garden: <TreePine className="w-5 h-5" />,
};

export default function ListingDetail() {
  const { id } = useParams();
  const listing = listings.find((l) => l.id === id);
  const [liked, setLiked] = useState(false);

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

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/explore" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to listings
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLiked(!liked)}>
              <Heart className={`w-4 h-4 mr-1 ${liked ? "fill-primary text-primary" : ""}`} /> Save
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-1" /> Share
            </Button>
          </div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg overflow-hidden aspect-[16/9] md:aspect-[2/1] mb-8"
        >
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
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
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-display font-bold text-foreground">
                {listing.host.name.charAt(0)}
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">Hosted by {listing.host.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {listing.host.superhost && <span className="text-primary font-medium">Superhost</span>}
                  {listing.host.verified && (
                    <span className="flex items-center gap-1 text-accent"><Shield className="w-3.5 h-3.5" /> Verified</span>
                  )}
                </div>
              </div>
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
                    {amenityIcons[a] || <div className="w-5 h-5 rounded-full bg-muted" />}
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-background rounded-lg border border-border p-6 shadow-elevated">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-2xl font-bold text-foreground">KSh {listing.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>

              <div className="border border-border rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2 border-b border-border">
                  <div className="p-3 border-r border-border">
                    <p className="text-xs font-semibold text-foreground">CHECK-IN</p>
                    <p className="text-sm text-muted-foreground">Add date</p>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-foreground">CHECK-OUT</p>
                    <p className="text-sm text-muted-foreground">Add date</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-foreground">GUESTS</p>
                  <p className="text-sm text-muted-foreground">1 guest</p>
                </div>
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold">
                Reserve
              </Button>

              <a href="tel:+254712345678" className="block mt-3">
                <Button variant="outline" className="w-full h-11 text-sm font-medium gap-2">
                  <Phone className="w-4 h-4" /> Call Abdifatah
                </Button>
              </a>

              <p className="text-center text-xs text-muted-foreground mt-3">You won't be charged yet</p>

              <div className="border-t border-border mt-6 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">KSh {listing.price.toLocaleString()} × 5 nights</span>
                  <span className="text-foreground">KSh {(listing.price * 5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="text-foreground">KSh {Math.round(listing.price * 5 * 0.12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">KSh {Math.round(listing.price * 5 * 1.12).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
