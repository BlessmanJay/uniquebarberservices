import { NavLink } from "react-router";

function RatingsButton({ children }) {
  return (
    <NavLink to="/reviews">
      <button className="w-full md:w-38 h-12 bg-gray-800 font-body text-white text-lg text-center mb-6 md:mb-6 pt-2 pb-2 px-4 font-bold rounded-lg">
        {children}
      </button>
    </NavLink>
  );
}

export default RatingsButton;
