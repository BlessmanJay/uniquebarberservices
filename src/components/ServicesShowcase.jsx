import { Link } from "react-router";

const services = [
  {
    title: "Haircuts",
    description:
      "Discover fresh styles, precision cuts, and modern fades tailored to you.",
    image: "/mid-skin-fade.png",
    to: "/services/haircuts",
    price: "₦3,000",
  },
  {
    title: "Beard Care",
    description:
      "Keep your beard looking sharp with professional grooming and care.",
    image: "/haircut-beard.jpeg",
    to: "/services/shaves",
    price: "₦2,500",
  },
  {
    title: "Tints",
    description:
      "Explore beautiful hair colours to refresh your look and express your style.",
    image: "/tint-burgundy.jpg",
    to: "/services/tints",
    price: "₦5,000",
  },

  {
    title: "Treatments",
    description:
      "Nourish your hair and scalp with treatments designed to refresh and restore.",
    image: "/treatment-img1.jpg",
    to: "/services/treatments",
    price: "₦7,000",
  },
];

function ServicesShowcase() {
  return (
    <>
      <section className="bg-gray-900 px-6 py-16 text-center text-white sm:py-20 md:py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
          Unique Barbershop
        </p>

        <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
          Your Style. Your Confidence. Our Craft.
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
          Discover professional haircuts, beard grooming, hair colouring, and
          treatments designed to help you look and feel your best.
        </p>

        <Link
          to="/book-visit"
          className="mt-8 inline-block rounded-lg bg-amber-600 px-8 py-3 font-bold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
        >
          Book an Appointment
        </Link>
      </section>
      <section className="mx-4 my-16 sm:mx-6 md:mx-10">
        <div className="mb-8 text-center">
          <p className="mb-2 font-body text-sm font-semibold uppercase tracking-widest text-amber-600">
            Discover Our Services
          </p>

          <h2 className="mb-4 font-heading text-3xl font-bold text-gray-800 sm:text-4xl">
            Exceptional Grooming, Every Time
          </h2>

          <p className="mx-auto max-w-2xl text-gray-500">
            From precision haircuts to professional grooming treatments, find
            the service that suits your style.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
            >
              <Link
                to={service.to}
                aria-label={`Explore ${service.title}`}
                className="block overflow-hidden"
              >
                <img
                  src={service.image}
                  alt=""
                  className="h-56 w-full object-cover transition duration-300 hover:scale-105 sm:h-64"
                  loading="lazy"
                />
              </Link>

              <div className="p-5">
                <h3 className="mb-2 font-heading text-2xl font-bold text-gray-800">
                  {service.title}
                </h3>

                {service.price !== null && (
                  <p className="mb-3 font-semibold text-amber-700">
                    Starting at {service.price}
                  </p>
                )}

                <p className="mb-5 text-sm leading-6 text-gray-500">
                  {service.description}
                </p>

                <Link
                  to={service.to}
                  className="inline-flex items-center gap-2 font-semibold text-amber-700 transition hover:text-amber-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
                >
                  Explore Service
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-600">
              The Unique Experience
            </p>

            <h2 className="mb-4 text-3xl font-bold text-gray-800 sm:text-4xl">
              Why Choose Unique Barbershop?
            </h2>

            <p className="mx-auto max-w-2xl leading-relaxed text-gray-500">
              Great grooming is about more than appearance. It's about
              confidence, attention to detail, and finding a style that feels
              right for you.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-gray-800">
                Attention to Detail
              </h3>
              <p className="leading-relaxed text-gray-600">
                Every service is an opportunity to help you achieve a clean,
                polished look that suits your personal style.
              </p>
            </article>

            <article className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-gray-800">
                Your Style Matters
              </h3>
              <p className="leading-relaxed text-gray-600">
                Explore grooming options and choose a look that reflects your
                personality and preferences.
              </p>
            </article>

            <article className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-gray-800">
                Care You Can Appreciate
              </h3>
              <p className="leading-relaxed text-gray-600">
                From haircuts to treatments, discover services designed to
                support your grooming routine.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 px-6 py-16 text-center text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-5 text-3xl font-bold sm:text-4xl">
            Ready for Your Next Look?
          </h2>

          <p className="mb-8 leading-relaxed text-gray-300 sm:text-lg">
            Your next great look starts here. Explore our grooming services and
            book your appointment with Unique Barbershop today.
          </p>

          <Link
            to="/book-visit"
            className="inline-block rounded-lg bg-amber-600 px-8 py-3 font-bold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}

export default ServicesShowcase;
