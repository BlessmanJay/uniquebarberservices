import AccentLine from "../components/AccentLine";
import AmberTexts from "../components/AmberTexts";
import BookingButton from "../components/BookingButton";
import FilterService from "../components/FilterService";
import Footer from "../components/Footer";
import HeroHeading from "../components/HeroHeading";
import Rating from "../components/Rating";
import RatingsButton from "../components/RatingsButton";
import SalonBgView from "../components/SalonBgView";
import ServicesShowcase from "../components/ServicesShowcase";
import SiteParagraphs from "../components/SiteParagraphs";
import { useNavContext } from "../contexts/NavContext";

function Home() {
  const { isOpen } = useNavContext();

  return (
    <>
      <main className="w-full min-w-0 flex-1">
        {/* Hero section */}
        <section className="mx-auto w-full max-w-7xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 md:px-10 md:pt-10 md:pb-14">
          <div className="grid min-w-0 grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-8 lg:gap-12">
            {/* Hero text */}
            <div className="min-w-0">
              <AccentLine />

              <AmberTexts className="text-3xl md:text-4xl">
                Welcome to <strong>Unique Barbershop</strong>
              </AmberTexts>

              <HeroHeading className="mt-3 text-3xl leading-tight text-gray-800 italic sm:text-4xl md:text-4xl lg:text-5xl">
                &apos;&apos;Where Every Detail is an Art Form&apos;&apos;
              </HeroHeading>

              <SiteParagraphs className="mt-4 max-w-lg text-gray-500">
                Step into a world of refined beauty. Our talented stylists
                transform your vision into reality with precision, passion, and
                an unwavering commitment to excellence in every detail.
              </SiteParagraphs>

              <div className="mt-6 flex flex-col items-start gap-4">
                {!isOpen ? (
                  <BookingButton className="w-full sm:w-auto sm:min-w-56 md:w-full md:max-w-sm px-4">
                    BOOK AN APPOINTMENT
                  </BookingButton>
                ) : (
                  <RatingsButton>RATINGS &amp; REVIEWS</RatingsButton>
                )}

                <Rating />
              </div>
            </div>

            {/* Hero image */}
            <div className="min-w-0 w-full">
              <SalonBgView />
            </div>
          </div>
        </section>

        {/* Services section */}
        <section className="mx-auto w-full max-w-7xl min-w-0 px-4 pt-2 pb-10 sm:px-6 sm:pt-4 md:px-10 md:pb-14">
          {/* Section heading and filters */}
          <div className="mb-6 sm:mb-8">
            <div className="flex min-w-0 items-center gap-3">
              <AccentLine />
              <AmberTexts className="text-lg md:text-xl">
                OUR SERVICES
              </AmberTexts>
            </div>

            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-end md:gap-8">
              <div className="min-w-0">
                <HeroHeading className="text-3xl font-bold leading-tight sm:text-4xl">
                  Filter by Service
                </HeroHeading>

                <SiteParagraphs className="mt-2 text-base text-slate-400">
                  Find the perfect service for your needs.
                </SiteParagraphs>
              </div>

              <nav
                aria-label="Filter services"
                className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3 md:justify-end"
              >
                <FilterService to="/">All</FilterService>
                <FilterService to="/services/haircuts">Haircuts</FilterService>
                <FilterService to="/services/beard-care">
                  Beard Care
                </FilterService>
                <FilterService to="/services/shaves">Shaves</FilterService>
                <FilterService to="/services/treatments">
                  Treatments
                </FilterService>
              </nav>
            </div>
          </div>

          {/* Showcase gets the full section width */}
          <div className="w-full min-w-0">
            <ServicesShowcase />
          </div>
        </section>
      </main>

      {/* Existing footer preserved */}
      <Footer />
    </>
  );
}

export default Home;
