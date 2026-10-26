import { Link } from "react-router";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

function Contact() {
  return (
    <main className="text-gray-800">
      {/* Hero Section */}
      <section className="bg-gray-900 px-6 py-16 text-center text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Get in Touch
          </p>

          <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Let's Talk Grooming.
          </h1>

          <p className="mx-auto max-w-2xl leading-7 text-gray-300 sm:text-lg">
            Have a question about our services or need help planning your next
            visit? We'd love to hear from you.
          </p>

          <Link
            to="/book-visit"
            className="mt-8 inline-block rounded-lg bg-amber-600 px-8 py-3 font-bold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            Book an Appointment
          </Link>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-600">
              We're Here to Help
            </p>

            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Contact Unique Barbershop
            </h2>

            <p className="mx-auto max-w-2xl leading-7 text-gray-600">
              Choose your preferred way to get in touch. For appointments, you
              can also use our online booking form.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* WhatsApp */}
            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <FaWhatsapp
                className="mb-4 text-3xl text-green-600"
                aria-hidden="true"
              />

              <h3 className="mb-3 text-xl font-bold">WhatsApp</h3>

              <p className="mb-5 leading-7 text-gray-600">
                Message us with your questions or appointment enquiries.
              </p>

              <a
                href="https://wa.me/9057908212"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-amber-700 hover:text-amber-900 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Chat with us →
              </a>
            </article>

            {/* Instagram */}
            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <FaInstagram
                className="mb-4 text-3xl text-pink-600"
                aria-hidden="true"
              />

              <h3 className="mb-3 text-xl font-bold">Instagram</h3>

              <p className="mb-5 leading-7 text-gray-600">
                Discover grooming inspiration and explore our latest styles.
              </p>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-amber-700 hover:text-amber-900 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Follow us →
              </a>
            </article>

            {/* Facebook */}
            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <FaFacebook
                className="mb-4 text-3xl text-blue-600"
                aria-hidden="true"
              />

              <h3 className="mb-3 text-xl font-bold">Facebook</h3>

              <p className="mb-5 leading-7 text-gray-600">
                Stay connected with our barbershop and updates.
              </p>

              <a
                href="https://www.facebook.com/UniqueBarbershopAKS"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-amber-700 hover:text-amber-900 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Visit our page →
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-600">
              Plan Your Visit
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">Opening Hours</h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-5 text-center leading-7 text-gray-600">
              We look forward to welcoming you. Please confirm our current
              opening hours before visiting.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                <span className="font-semibold">Mondays – Saturdays</span>
                <span className="text-right text-gray-600">
                  8:00AM - 9:00PM
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold">Sundays</span>
                <span className="text-right text-gray-600">
                  2:00PM - 9:00PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-gray-900 px-6 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-5 text-3xl font-bold sm:text-4xl">
            Ready for a Fresh Look?
          </h2>

          <p className="mb-8 leading-7 text-gray-300">
            Choose your service and book your next visit with Unique Barbershop.
          </p>

          <Link
            to="/book-visit"
            className="inline-block rounded-lg bg-amber-600 px-8 py-3 font-bold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Contact;
