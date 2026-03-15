import { createContext, useContext, useState, type ReactNode } from "react";

export interface BookingState {
  propertyId: string;
  propertyTitle: string;
  pricePerNight: number;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: { adults: number; children: number };
  guestDetails: { name: string; email: string; phone: string; specialRequests: string };
}

interface BookingContextType {
  booking: BookingState | null;
  setBooking: (b: BookingState) => void;
  clearBooking: () => void;
  nights: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBookingState] = useState<BookingState | null>(null);

  const nights =
    booking?.checkIn && booking?.checkOut
      ? Math.max(1, Math.round((booking.checkOut.getTime() - booking.checkIn.getTime()) / 86400000))
      : 0;

  const subtotal = (booking?.pricePerNight ?? 0) * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  return (
    <BookingContext.Provider value={{
      booking,
      setBooking: setBookingState,
      clearBooking: () => setBookingState(null),
      nights,
      subtotal,
      serviceFee,
      total,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
