import { Link } from "react-router";

function About() {
  return (
    <main className="text-gray-800">
      {/* Hero Section */}
      <section className="bg-gray-900 px-6 py-20 text-center text-white sm:py-24 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Welcome to Unique Barbershop
          </p>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            More Than a Haircut.
            <span className="block text-amber-400">It's Your Identity.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            We believe that great grooming is about more than appearance. It's
            about confidence, personal style, and feeling your best every time
            you walk out the door.
          </p>

          <Link
            to="/services"
            className="mt-8 inline-block rounded-lg bg-amber-600 px-8 py-3 font-bold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            Explore Our Services
          </Link>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 py-16 sm:py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-600">
              Who We Are
            </p>

            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Our Story</h2>

            <p className="mb-5 leading-7 text-gray-600">
              Unique Barbershop is dedicated to helping people look sharp, feel
              confident, and express their individuality through professional
              grooming.
            </p>

            <p className="mb-5 leading-7 text-gray-600">
              From clean, precise haircuts to beard grooming, hair colouring,
              and treatments, we offer services designed to suit different
              styles and grooming needs.
            </p>

            <p className="leading-7 text-gray-600">
              Our goal is to make every visit an opportunity to refresh your
              look and leave feeling ready to take on the day.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/brand-logo.jpg"
              alt="Professional haircut at Unique Barbershop"
              className="h-72 w-full object-cover sm:h-96"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-600">
              What Matters to Us
            </p>

            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              The Values Behind Our Craft
            </h2>

            <p className="mx-auto max-w-2xl leading-7 text-gray-600">
              We believe every grooming experience should reflect care,
              attention, and respect for your personal style.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 text-3xl" aria-hidden="true">
                ✂️
              </div>

              <h3 className="mb-3 text-xl font-bold">Quality Craftsmanship</h3>

              <p className="leading-7 text-gray-600">
                We value precision, careful attention to detail, and styles that
                help you look your best.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 text-3xl" aria-hidden="true">
                👌
              </div>

              <h3 className="mb-3 text-xl font-bold">Personal Style</h3>

              <p className="leading-7 text-gray-600">
                Your style is your own. We offer grooming options that help you
                express your personality and preferences.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 text-3xl" aria-hidden="true">
                🤝
              </div>

              <h3 className="mb-3 text-xl font-bold">Customer Care</h3>

              <p className="leading-7 text-gray-600">
                We want you to feel welcome, comfortable, and confident
                throughout your grooming experience.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-600">
            Grooming for Your Style
          </p>

          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            Your Look, Your Choice
          </h2>

          <p className="mb-8 leading-7 text-gray-600">
            Whether you're looking for a fresh haircut, a clean shave, a new
            hair colour, or a nourishing treatment, explore our services to find
            the right option for you.
          </p>

          <Link
            to="/services"
            className="inline-block rounded-lg border-2 border-gray-900 px-8 py-3 font-bold text-gray-900 transition hover:bg-gray-900 hover:text-white"
          >
            Discover Our Services
          </Link>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-gray-900 px-6 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-5 text-3xl font-bold sm:text-4xl">
            Your Next Great Look Starts Here
          </h2>

          <p className="mb-8 leading-7 text-gray-300">
            Ready to refresh your style? Explore our services and book your next
            appointment with Unique Barbershop.
          </p>

          <Link
            to="/book-visit"
            className="inline-block rounded-lg bg-amber-600 px-8 py-3 font-bold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;
