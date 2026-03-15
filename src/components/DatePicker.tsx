import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onChange: (checkIn: Date | null, checkOut: Date | null) => void;
  className?: string;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function DatePicker({ checkIn, checkOut, onChange, className }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<"in" | "out">("in");
  const [hovered, setHovered] = useState<Date | null>(null);

  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const label = checkIn && checkOut
    ? `${formatDate(checkIn)} – ${formatDate(checkOut)}`
    : checkIn ? `${formatDate(checkIn)} – Check out` : "Add dates";

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDayClick = (day: Date) => {
    if (selecting === "in" || (checkIn && day <= checkIn)) {
      onChange(day, null);
      setSelecting("out");
    } else {
      onChange(checkIn, day);
      setSelecting("in");
      setOpen(false);
    }
  };

  const isInRange = (day: Date) => {
    const end = selecting === "out" && hovered ? hovered : checkOut;
    if (!checkIn || !end) return false;
    return day > checkIn && day < end;
  };

  const renderMonth = (year: number, month: number) => {
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
      <div className="w-full">
        <p className="text-sm font-semibold text-foreground text-center mb-3">{monthName}</p>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
            <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const day = new Date(year, month, i + 1);
            const isPast = day < today;
            const isCheckIn = checkIn && isSameDay(day, checkIn);
            const isCheckOut = checkOut && isSameDay(day, checkOut);
            const inRange = isInRange(day);

            return (
              <button
                key={i}
                disabled={isPast}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => selecting === "out" && setHovered(day)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "h-9 w-full text-sm rounded-md transition-colors",
                  isPast && "text-muted-foreground/40 cursor-not-allowed",
                  !isPast && "hover:bg-primary/10 cursor-pointer",
                  (isCheckIn || isCheckOut) && "bg-primary text-primary-foreground hover:bg-primary font-semibold",
                  inRange && "bg-primary/10 rounded-none",
                  isCheckIn && checkOut && "rounded-r-none",
                  isCheckOut && "rounded-l-none",
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const nextMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn("flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors w-full text-left", className)}>
          <Calendar className="w-4 h-4 text-primary shrink-0" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Check in — Check out</p>
            <p className={cn("text-sm font-medium", checkIn ? "text-foreground" : "text-muted-foreground")}>{label}</p>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-lg leading-none">‹</button>
          <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-lg leading-none">›</button>
        </div>
        <div className="flex gap-8">
          {renderMonth(viewMonth.getFullYear(), viewMonth.getMonth())}
          <div className="hidden md:block">{renderMonth(nextMonth.getFullYear(), nextMonth.getMonth())}</div>
        </div>
        {(checkIn || checkOut) && (
          <button onClick={() => { onChange(null, null); setSelecting("in"); }}
            className="mt-3 text-xs text-primary hover:underline w-full text-center">
            Clear dates
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
