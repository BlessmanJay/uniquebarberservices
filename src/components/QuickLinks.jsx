import { Link } from "react-router";

function QuickLinks() {
  return (
    <div className="mb-6">
      <p className="font-body font-light text-lg text-slate-400 mb-4 uppercase">
        Quick Links
      </p>
      <div className="flex flex-col space-y-4 text-white">
        <Link to="/" className="w-fit">
          Home
        </Link>
        <Link to="/about" className="w-fit">
          About
        </Link>
        <Link to="/services" className="w-fit">
          Services
        </Link>
        <Link to="/contact" className="w-fit">
          Contact
        </Link>
        <Link to="/book-visit" className="w-fit">
          Book Visit
        </Link>
      </div>
    </div>
  );
}

export default QuickLinks;
