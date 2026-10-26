import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

function BookingProvider({ children }) {
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  return (
    <BookingContext.Provider
      value={{
        bookingConfirmation,
        setBookingConfirmation,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

function useBooking() {
  const context = useContext(BookingContext);

  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }

  return context;
}

export { BookingProvider, useBooking };
