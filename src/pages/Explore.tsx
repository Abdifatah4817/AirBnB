import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { listings, neighborhoods } from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const amenityOptions = ["WiFi", "Pool", "Parking", "Security", "Gym", "Garden", "Balcony", "City View"];

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const initialNeighborhood = searchParams.get("neighborhood") || "";

  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialNeighborhood);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (selectedNeighborhood && l.neighborhood !== selectedNeighborhood) return false;
      if (l.price < priceRange[0] || l.price > priceRange[1]) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every((a) => l.amenities.includes(a))) return false;
      return true;
    });
  }, [selectedNeighborhood, priceRange, selectedAmenities]);

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const clearFilters = () => {
    setSelectedNeighborhood("");
    setPriceRange([0, 30000]);
    setSelectedAmenities([]);
  };

  const hasFilters = selectedNeighborhood || selectedAmenities.length > 0 || priceRange[0] > 0 || priceRange[1] < 30000;

  return (
    <div className="min-h-screen pt-16">
      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center gap-3 overflow-x-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "border-primary text-primary" : ""}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <div className="h-6 w-px bg-border" />
          {neighborhoods.map((n) => (
            <Button
              key={n.name}
              variant={selectedNeighborhood === n.name ? "default" : "outline"}
              size="sm"
              className={selectedNeighborhood === n.name ? "bg-secondary text-secondary-foreground" : ""}
              onClick={() => setSelectedNeighborhood(selectedNeighborhood === n.name ? "" : n.name)}
            >
              {n.name}
            </Button>
          ))}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary">
              <X className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-background border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 lg:px-8 py-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {amenityOptions.map((a) => (
                  <Button
                    key={a}
                    variant={selectedAmenities.includes(a) ? "default" : "outline"}
                    size="sm"
                    className={selectedAmenities.includes(a) ? "bg-secondary text-secondary-foreground" : ""}
                    onClick={() => toggleAmenity(a)}
                  >
                    {a}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">
            {selectedNeighborhood || "All"} stays
            <span className="text-muted-foreground font-normal text-base ml-2">
              {filtered.length} {filtered.length === 1 ? "property" : "properties"}
            </span>
          </h1>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No properties match your filters.</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
