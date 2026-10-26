import { NavLink } from "react-router";

function BookingButton({ children, className }) {
  return (
    <NavLink to="/book-visit">
      <button
        className={`h-12 bg-gray-800 font-body text-white text-lg text-center mb-6 md:mb-6 pt-2 pb-2 hover:bg-gray-600 font-bold hover:rounded-lg rounded-lg cursor-pointer ${className}`}
      >
        {children}
      </button>
    </NavLink>
  );
}

export default BookingButton;
