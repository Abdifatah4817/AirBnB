import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import type { Listing } from "@/data/listings";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/listing/${listing.id}`} className="group block">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
          {listing.host.superhost && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-background rounded-full shadow-card">
              Superhost
            </span>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-foreground truncate pr-2">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span className="text-sm font-medium">{listing.rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{listing.neighborhood}</p>
          <p className="text-sm text-muted-foreground">
            {listing.guests} guests · {listing.bedrooms} bed · {listing.bathrooms} bath
          </p>
          <p className="text-sm font-semibold text-foreground">
            KSh {listing.price.toLocaleString()}{" "}
            <span className="font-normal text-muted-foreground">/ night</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
