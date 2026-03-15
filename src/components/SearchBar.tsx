import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();

  return (
    <div className="bg-background rounded-lg shadow-elevated p-2 flex flex-col md:flex-row items-stretch gap-2 max-w-3xl w-full">
      <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">Location</p>
          <p className="text-sm font-medium text-foreground">Nairobi, Kenya</p>
        </div>
      </div>
      <div className="hidden md:block w-px bg-border" />
      <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
        <Calendar className="w-4 h-4 text-primary shrink-0" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">Check in — Check out</p>
          <p className="text-sm font-medium text-foreground">Add dates</p>
        </div>
      </div>
      <div className="hidden md:block w-px bg-border" />
      <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
        <Users className="w-4 h-4 text-primary shrink-0" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">Guests</p>
          <p className="text-sm font-medium text-foreground">Add guests</p>
        </div>
      </div>
      <Button
        size="lg"
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6"
        onClick={() => navigate("/explore")}
      >
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
