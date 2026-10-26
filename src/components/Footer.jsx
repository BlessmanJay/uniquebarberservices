import { Link } from "react-router";
import ContactsQuickLinks from "./ContactsQuickLinks";
import HeroHeading from "./HeroHeading";
import QuickLinks from "./QuickLinks";
import SeparatorLine from "./SeparatorLine";
import ServiceQuickLinks from "./ServicesQuickLinks";
import SiteParagraphs from "./SiteParagraphs";
import SocialsLinks from "./SocialsLinks";

function Footer() {
  return (
    <footer className="w-full min-w-0 overflow-x-clip bg-gray-800 px-4 py-10 text-white sm:px-6 md:px-8">
      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-[1.5fr_repeat(3,1fr)] md:gap-x-10">
        <div>
          <HeroHeading className="text-3xl text-white pb-5">
            Unique Barbershop
          </HeroHeading>

          <SiteParagraphs className="max-w-sm text-gray-300">
            More than just a haircut. It's a lifestyle. Unique Barbershop
            delivers premium grooming services designed to keep you looking
            sharp, feeling confident, and ready for what's next.
          </SiteParagraphs>

          <SocialsLinks />
        </div>

        <SeparatorLine className="max-w-2xl md:hidden" />
        <QuickLinks />

        <SeparatorLine className="max-w-2xl md:hidden" />
        <ServiceQuickLinks />

        <SeparatorLine className="max-w-2xl md:hidden" />
        <ContactsQuickLinks />
      </div>

      <SeparatorLine className="md:w-full" />

      <div className="mx-auto mt-5 flex max-w-5xl flex-col items-center gap-3 text-center md:flex-row-reverse md:justify-between md:gap-6">
        <p className="uppercase text-slate-400 mb-5">
          look good / feel good / be you
        </p>
        <p className="text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Unique Barbershop. All rights
          reserved
        </p>

        <Link
          to="/admin"
          className="text-xs text-slate-400 transition-colors hover:text-white"
        >
          Admin Login
        </Link>
        <div className="text-center w-32 h-1.5 bg-white rounded-lg mx-auto md:hidden"></div>
      </div>
    </footer>
  );
}

export default Footer;
