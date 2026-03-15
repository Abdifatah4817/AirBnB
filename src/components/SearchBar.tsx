import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LocationSearch from "./LocationSearch";
import DatePicker from "./DatePicker";
import GuestSelector from "./GuestSelector";

export default function SearchBar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0 });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("neighborhood", location);
    if (checkIn) params.set("checkIn", checkIn.toISOString());
    if (checkOut) params.set("checkOut", checkOut.toISOString());
    params.set("guests", String(guests.adults + guests.children));
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="bg-background rounded-lg shadow-elevated p-2 flex flex-col md:flex-row items-stretch gap-2 max-w-3xl w-full">
      <div className="flex-1">
        <LocationSearch value={location} onChange={setLocation} />
      </div>
      <div className="hidden md:block w-px bg-border self-stretch my-1" />
      <div className="flex-1">
        <DatePicker checkIn={checkIn} checkOut={checkOut} onChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }} />
      </div>
      <div className="hidden md:block w-px bg-border self-stretch my-1" />
      <div className="flex-1">
        <GuestSelector guests={guests} onChange={setGuests} />
      </div>
      <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6" onClick={handleSearch}>
        <Search className="w-4 h-4 mr-2" /> Search
      </Button>
    </div>
  );
}
