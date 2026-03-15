import { useState, useRef, useEffect } from "react";
import { MapPin, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NEIGHBORHOODS = ["Westlands", "Karen", "Kilimani", "Lavington", "Nairobi CBD", "Gigiri", "Runda", "Muthaiga", "Parklands", "Upperhill"];

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function LocationSearch({ value, onChange, className }: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [recents, setRecents] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("nairobistay_recents") || "[]"); }
    catch { return []; }
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const suggestions = query.length > 0
    ? NEIGHBORHOODS.filter((n) => n.toLowerCase().includes(query.toLowerCase()))
    : [];

  const select = (val: string) => {
    setQuery(val);
    onChange(val);
    setOpen(false);
    const updated = [val, ...recents.filter((r) => r !== val)].slice(0, 3);
    setRecents(updated);
    localStorage.setItem("nairobistay_recents", JSON.stringify(updated));
  };

  const clear = () => { setQuery(""); onChange(""); inputRef.current?.focus(); };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors cursor-text"
        onClick={() => { setOpen(true); inputRef.current?.focus(); }}>
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground">Location</p>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search destinations"
            className="text-sm font-medium text-foreground bg-transparent outline-none w-full placeholder:text-muted-foreground"
          />
        </div>
        {query && (
          <button onClick={(e) => { e.stopPropagation(); clear(); }} className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            {suggestions.length > 0 ? (
              <div>
                <p className="text-xs font-semibold text-muted-foreground px-3 pt-3 pb-1">Suggestions</p>
                {suggestions.map((s) => (
                  <button key={s} onClick={() => select(s)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors text-left">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{s}</span>
                  </button>
                ))}
              </div>
            ) : recents.length > 0 ? (
              <div>
                <p className="text-xs font-semibold text-muted-foreground px-3 pt-3 pb-1">Recent searches</p>
                {recents.map((r) => (
                  <button key={r} onClick={() => select(r)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors text-left">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{r}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-muted-foreground px-3 pt-3 pb-1">Popular areas</p>
                {NEIGHBORHOODS.slice(0, 5).map((n) => (
                  <button key={n} onClick={() => select(n)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors text-left">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{n}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
