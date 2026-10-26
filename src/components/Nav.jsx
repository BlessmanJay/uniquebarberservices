import { NavLink } from "react-router";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import BookingButton from "./BookingButton";
import { useNavContext } from "../contexts/NavContext";

const navLinkClass = ({ isActive }) =>
  isActive
    ? "bg-gray-400 pr-3 pt-1 rounded-lg text-white"
    : "bg-white text-gray-600";
const linkClass =
  "text-xl font-bold font-body text-gray-500 hover:bg-gray-400 pl-5 pr-5 pt-1 hover:rounded-lg";

function Nav() {
  const { isOpen, setIsOpen } = useNavContext();

  return (
    <nav className="mx-4 mt-4 flex flex-col md:mx-6 md:mt-6 md:grid md:grid-cols-[9fr_repeat(4,1fr)] md:items-center md:gap-4">
      {/* Header and Hamburger menu */}
      <div className="relative mb-8">
        <NavLink
          to="/"
          className={`w-fit sm:text-2xl md:text-3xl lg:text-4xl xl:5xl text-gray-600 font-extrabold font-heading ${navLinkClass}`}
        >
          <strong>UNIQUE BARBERSHOP</strong>
        </NavLink>

        <>
          {!isOpen ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden absolute right-5"
            >
              <Bars3Icon className="w-8 h-8 text-gray-600 cursor-pointer" />
            </button>
          ) : (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden absolute right-5"
            >
              <XMarkIcon className="w-8 h-8 text-gray-600 cursor-pointer" />
            </button>
          )}
        </>
      </div>

      <div
        className={`${isOpen ? "flex" : "hidden"} flex-col gap-6 md:flex md:flex-row`}
      >
        <NavLink
          to="/about"
          className={(props) =>
            `w-fit h-fit pb-2 ${linkClass} ${navLinkClass(props)}`
          }
        >
          About
        </NavLink>

        <NavLink
          to="/services"
          className={(props) =>
            `w-fit h-fit pb-2 ${linkClass}  ${navLinkClass(props)}`
          }
        >
          Services
        </NavLink>

        <NavLink
          to="/contact"
          className={(props) =>
            `w-fit h-fit pb-2 ${linkClass} ${navLinkClass(props)}`
          }
        >
          Contact
        </NavLink>

        <BookingButton className="mx-auto px-24 ml-5 mr-5 md:w-38 md:px-8 md:text-nowrap md:text-left">
          Book Time
        </BookingButton>
      </div>
    </nav>
  );
}

export default Nav;
