import { Link } from "react-router";

function ServiceQuickLinks() {
  return (
    <div className="mb-6">
      <p className="font-body font-light text-lg text-slate-400 mb-4 uppercase">
        our services
      </p>
      <div className="flex flex-col space-y-4 text-white">
        <Link to="/services/haircuts" className="w-fit">
          Haircuts
        </Link>
        <Link to="/services/tints" className="w-fit">
          Tints / Hair Colouring
        </Link>
        <Link to="/services/shaves" className="w-fit">
          Shaves
        </Link>
        <Link to="/services/treatments" className="w-fit">
          Treatments
        </Link>
        <Link to="" className="w-fit">
          Packages
        </Link>
      </div>
    </div>
  );
}

export default ServiceQuickLinks;
