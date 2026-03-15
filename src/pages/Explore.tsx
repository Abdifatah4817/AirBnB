import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { listings, neighborhoods } from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const amenityOptions = ["WiFi", "Pool", "Parking", "Security", "Gym", "Garden", "Balcony", "City View"];
const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const initialNeighborhood = searchParams.get("neighborhood") || "";
  const initialGuests = Number(searchParams.get("guests")) || 0;

  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialNeighborhood);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("recommended");

  const filtered = useMemo(() => {
    let result = listings.filter((l) => {
      if (selectedNeighborhood && l.neighborhood !== selectedNeighborhood) return false;
      if (l.price < priceRange[0] || l.price > priceRange[1]) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every((a) => l.amenities.includes(a))) return false;
      if (minBedrooms > 0 && l.bedrooms < minBedrooms) return false;
      if (initialGuests > 0 && l.guests < initialGuests) return false;
      return true;
    });

    if (sort === "price_asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    else if (sort === "reviews") result = [...result].sort((a, b) => b.reviews - a.reviews);

    return result;
  }, [selectedNeighborhood, priceRange, selectedAmenities, minBedrooms, sort, initialGuests]);

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const clearFilters = () => {
    setSelectedNeighborhood(""); setPriceRange([0, 5000]);
    setSelectedAmenities([]); setMinBedrooms(0);
  };

  const hasFilters = selectedNeighborhood || selectedAmenities.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000 || minBedrooms > 0;
  const currentSort = SORT_OPTIONS.find((s) => s.value === sort)?.label;

  return (
    <div className="min-h-screen pt-16">
      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center gap-3 overflow-x-auto">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "border-primary text-primary shrink-0" : "shrink-0"}>
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </Button>
          <div className="h-6 w-px bg-border shrink-0" />
          {neighborhoods.map((n) => (
            <Button key={n.name} variant={selectedNeighborhood === n.name ? "default" : "outline"} size="sm"
              className={`shrink-0 ${selectedNeighborhood === n.name ? "bg-secondary text-secondary-foreground" : ""}`}
              onClick={() => setSelectedNeighborhood(selectedNeighborhood === n.name ? "" : n.name)}>
              {n.name}
            </Button>
          ))}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary shrink-0">
              <X className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="bg-background border-b border-border overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Price per night (KSh)</h4>
                <div className="flex items-center gap-3">
                  <input type="number" min={0} max={priceRange[1]} value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full border border-border rounded-md px-3 py-1.5 text-sm text-foreground bg-background" placeholder="Min" />
                  <span className="text-muted-foreground text-sm">–</span>
                  <input type="number" min={priceRange[0]} value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full border border-border rounded-md px-3 py-1.5 text-sm text-foreground bg-background" placeholder="Max" />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Bedrooms</h4>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((n) => (
                    <button key={n} onClick={() => setMinBedrooms(n)}
                      className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                        minBedrooms === n ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-foreground"
                      }`}>
                      {n === 0 ? "Any" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map((a) => (
                    <button key={a} onClick={() => toggleAmenity(a)}
                      className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                        selectedAmenities.includes(a) ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-foreground"
                      }`}>
                      {a}
                    </button>
                  ))}
                </div>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="w-3.5 h-3.5" /> {currentSort}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((o) => (
                <DropdownMenuItem key={o.value} onClick={() => setSort(o.value)}
                  className={sort === o.value ? "text-primary font-medium" : ""}>
                  {o.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-2">No properties match your filters.</p>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your search criteria.</p>
            <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
