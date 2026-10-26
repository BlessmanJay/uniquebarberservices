import { Link } from "react-router";

const tintColours = [
  {
    name: "Burgundy",
    description: "A rich, bold shade with a deep red finish.",
    image: "/tint-burgundy.jpg",
  },
  {
    name: "Ginger Brown",
    description: "A warm blend of brown and copper tones.",
    image: "/tint-ginger-brown.jpeg",
  },
  {
    name: "Ginger",
    description: "A vibrant copper-inspired shade that stands out.",
    image: "/tint-ginger.jpg",
  },
  {
    name: "Honey Brown",
    description: "A warm brown shade with golden undertones.",
    image: "/tint-honey-brown.png",
  },
  {
    name: "Wine",
    description: "A deep red-purple shade for a distinctive look.",
    image: "/tint-wine.jpg",
  },
];

function Tints() {
  return (
    <main className="mx-4 my-10 sm:mx-6 md:mx-10">
      <header className="mb-10 text-center">
        <p className="mb-2 font-body text-sm font-semibold uppercase tracking-widest text-amber-600">
          Discover Your Colour
        </p>

        <h1 className="mb-4 font-heading text-3xl font-bold text-gray-800 sm:text-4xl">
          Hair Tints & Colours
        </h1>

        <p className="mx-auto max-w-2xl leading-7 text-gray-500">
          Explore our range of beautiful hair colours and find the shade that
          matches your style and personality.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tintColours.map((tint) => (
          <article
            key={tint.name}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={tint.image}
              alt={`${tint.name} hair tint`}
              className="h-64 w-full object-cover"
              loading="lazy"
            />

            <div className="p-5">
              <h2 className="mb-2 font-heading text-xl font-bold text-gray-800">
                {tint.name}
              </h2>

              <p className="text-sm leading-6 text-gray-500">
                {tint.description}
              </p>
              <Link
                to="/book-visit"
                className="mt-5 inline-block rounded-lg bg-amber-700 px-5 py-2.5 font-semibold text-white transition hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
              >
                Book an Appointment
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16 rounded-2xl bg-gray-800 px-6 py-10 text-center text-white sm:px-10">
        <h2 className="mb-4 font-heading text-2xl font-bold sm:text-3xl">
          Ready for a New Look?
        </h2>

        <p className="mx-auto mb-6 max-w-xl leading-7 text-gray-300">
          Let us help you find the perfect shade to complement your style. Book
          your appointment today.
        </p>

        <Link
          to="/book-visit"
          className="inline-block rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
        >
          Book Your Visit
        </Link>
      </section>
    </main>
  );
}

export default Tints;
