import { Link } from "react-router";

function BeardCare() {
  return (
    <main className="mx-4 my-10 sm:mx-6 md:mx-10">
      <header className="mb-10 text-center">
        <p className="mb-2 font-body text-sm font-semibold uppercase tracking-widest text-amber-600">
          The Finishing Touch
        </p>

        <h1 className="mb-4 font-heading text-3xl font-bold text-gray-800 sm:text-4xl">
          Professional Shaves
        </h1>

        <p className="mx-auto max-w-2xl leading-7 text-gray-500">
          Enjoy a clean, polished look with grooming that helps you feel fresh,
          sharp, and confident.
        </p>
      </header>
      <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <img
          src="/haircut-beard.jpeg"
          alt="Professional beard grooming"
          className="max-h-112.5 w-full object-cover"
          loading="lazy"
        />
      </article>
      <div className="mt-8 text-center">
        <Link
          to="/book-visit"
          className="inline-block rounded-lg bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
        >
          Book a Session
        </Link>
      </div>

      <section className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gray-800 sm:text-3xl">
          Sharp Details, Fresh Confidence
        </h2>

        <p className="leading-7 text-gray-500">
          Keep your look clean and well-groomed with attention to detail that
          helps you feel confident and refreshed.
        </p>
      </section>
    </main>
  );
}

export default BeardCare;
