import { NavLink } from "react-router";

function FilterService({ children, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex h-9 w-fit shrink-0 items-center justify-center rounded-full border border-slate-300 px-6 text-sm whitespace-nowrap transition-colors ${
          isActive
            ? "bg-gray-900 text-white"
            : "bg-white font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default FilterService;
