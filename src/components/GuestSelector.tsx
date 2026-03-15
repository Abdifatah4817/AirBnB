import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Guests { adults: number; children: number }

interface GuestSelectorProps {
  guests: Guests;
  onChange: (guests: Guests) => void;
  maxGuests?: number;
  className?: string;
}

export default function GuestSelector({ guests, onChange, maxGuests = 10, className }: GuestSelectorProps) {
  const total = guests.adults + guests.children;
  const label = total === 0 ? "Add guests" : `${total} guest${total !== 1 ? "s" : ""}`;

  const update = (key: keyof Guests, delta: number) => {
    const next = { ...guests, [key]: guests[key] + delta };
    if (next.adults < 1 || next.children < 0) return;
    if (next.adults + next.children > maxGuests) return;
    onChange(next);
  };

  const Counter = ({ label, sub, value, min, max }: { label: string; sub: string; value: number; min: number; max: number }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => update(label.toLowerCase() as keyof Guests, -1)} disabled={value <= min}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-4 text-center text-sm font-medium text-foreground">{value}</span>
        <button onClick={() => update(label.toLowerCase() as keyof Guests, 1)} disabled={value >= max || total >= maxGuests}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn("flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors w-full text-left", className)}>
          <Users className="w-4 h-4 text-primary shrink-0" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Guests</p>
            <p className={cn("text-sm font-medium", total > 0 ? "text-foreground" : "text-muted-foreground")}>{label}</p>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <Counter label="Adults" sub="Ages 13 or above" value={guests.adults} min={1} max={maxGuests} />
        <Counter label="Children" sub="Ages 2–12" value={guests.children} min={0} max={maxGuests - 1} />
        <p className="text-xs text-muted-foreground mt-3">Max {maxGuests} guests</p>
      </PopoverContent>
    </Popover>
  );
}
