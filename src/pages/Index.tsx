import heroImage from "@/assets/hero-nairobi.jpg";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import { listings, neighborhoods } from "@/data/listings";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const testimonials = [
  { name: "Emma S.", from: "London, UK", text: "The apartment in Westlands was absolutely stunning. Better than any hotel I've stayed at in Nairobi!", rating: 5 },
  { name: "Michael R.", from: "New York, US", text: "Seamless booking experience and the Karen villa exceeded all expectations. Will definitely return.", rating: 5 },
  { name: "Fatima A.", from: "Dubai, UAE", text: "The host was incredibly welcoming. The Kilimani penthouse views are unforgettable.", rating: 5 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Nairobi skyline at golden hour" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/60" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-6xl font-bold text-background mb-4 leading-tight"
          >
            Find your perfect stay in Nairobi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-background/80 mb-8 max-w-2xl mx-auto"
          >
            Premium short-term rentals in Nairobi's finest neighborhoods
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <SearchBar />
          </motion.div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Explore Nairobi</h2>
              <p className="text-muted-foreground mt-1">Discover properties across the city's best neighborhoods</p>
            </div>
            <Link to="/explore" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {neighborhoods.map((n, i) => (
              <motion.div
                key={n.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/explore?neighborhood=${n.name}`}
                  className="block p-5 rounded-lg border border-border hover:shadow-elevated hover:border-primary/20 transition-all duration-200 group"
                >
                  <MapPin className="w-5 h-5 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-display font-semibold text-foreground">{n.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{n.count} properties</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 lg:py-24 bg-background-nested">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Featured Stays</h2>
              <p className="text-muted-foreground mt-1">Handpicked properties loved by travelers</p>
            </div>
            <Link to="/explore" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              See all listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.slice(0, 6).map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            What travelers say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-lg border border-border p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.from}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold text-secondary-foreground mb-3">
            List your property on NairobiStay
          </h2>
          <p className="text-secondary-foreground/70 max-w-xl mx-auto mb-6">
            Join hundreds of verified hosts earning from premium short-term rentals in Nairobi.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Become a Host
          </Button>
        </div>
      </section>
    </div>
  );
}
