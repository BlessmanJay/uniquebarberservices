import { Link } from "react-router";

const treatments = [
  {
    name: "Deep Conditioning",
    description:
      "Restore moisture, improve softness, and leave your hair looking healthier.",
    image: "/treatment-img1.jpg",
  },
  {
    name: "Scalp Treatment",
    description:
      "Give your scalp extra care with a treatment designed to refresh and nourish.",
    image: "/treatment-img2.jpg",
  },
  {
    name: "Hair Repair",
    description:
      "Help improve the feel and appearance of dry, damaged, or weakened hair.",
    image: "/treatment-img3.jpg",
  },
];

function Treatments() {
  return (
    <main className="w-full min-w-0 overflow-x-clip px-4 py-8 sm:px-6 md:px-8">
      <section className="mx-auto w-full max-w-6xl min-w-0">
        <div className="w-full min-w-0 max-w-2xl">
          <p className="mb-3 font-semibold uppercase tracking-widest text-amber-600">
            Care Beyond the Cut
          </p>

          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Hair &amp; Scalp Treatments
          </h1>

          <p className="text-lg leading-relaxed text-gray-600">
            Give your hair the care it deserves with professional treatments
            designed to nourish your scalp, strengthen your hair, and leave you
            looking and feeling your best.
          </p>

          <Link
            to="/book-visit"
            className="mt-8 inline-block rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white transition hover:bg-gray-700"
          >
            Book a Treatment
          </Link>
        </div>

        <section className="mt-12 sm:mt-16">
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {treatments.map((treatment) => (
              <article
                key={treatment.name}
                className="min-w-0 overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 sm:aspect-[4/3]">
                  <img
                    src={treatment.image}
                    alt={treatment.name}
                    loading="lazy"
                    className="block h-full w-full object-cover object-center"
                  />
                </div>

                <div className="p-5 sm:p-6">
                  <h2 className="mb-3 text-2xl font-bold">{treatment.name}</h2>

                  <p className="leading-relaxed text-gray-600">
                    {treatment.description}
                  </p>

                  <Link
                    to="/book-visit"
                    className="mt-5 inline-block font-semibold text-amber-600 transition hover:text-amber-700"
                  >
                    Book This Treatment →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl min-w-0 rounded-2xl bg-gray-900 px-5 py-10 text-center text-white sm:mt-20 sm:px-8 sm:py-12 md:px-12">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Give Your Hair the Care It Deserves
        </h2>

        <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-gray-300">
          Ready to refresh your hair and scalp? Book your treatment with Unique
          Barbershop and let us help you look and feel your best.
        </p>

        <Link
          to="/book-visit"
          className="inline-block rounded-lg bg-amber-600 px-8 py-3 font-semibold text-white transition hover:bg-amber-700"
        >
          Book Your Appointment
        </Link>
      </section>
    </main>
  );
}

export default Treatments;
