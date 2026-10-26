import { Link } from "react-router";
const haircuts = [
  {
    image: "/clean-low-cut.png",
    alt: "Clean Low Cut & Sharp Edge-up",
    title: "Clean Low Cut & Sharp Edge-up",
    description:
      "Step up your look with a perfectly blended low cut, a crisp, well-defined edge-up, and a clean, consistent hair finish. Every detail is carefully crafted to give you a fresh, confident, and polished appearance.",
  },
  {
    image: "/mid-skin-fade.png",
    alt: "Professional taper fade haircut",
    title: "Mid Skin Fade",
    description:
      "Level up your style with our signature 360 Waves, featuring a smooth mid skin fade and a razor-sharp line-up. The natural wave pattern adds texture, while the seamless fade and crisp edges deliver a clean, premium finish. Perfect for the modern gentleman who values a sharp, confident, and effortlessly stylish look.",
  },
  {
    image: "/haircut-taper-fade.jpeg",
    alt: "Professional taper fade haircut",
    title: "Taper Fade",
    description:
      "A clean, professional taper fade featuring a gradual transition from shorter hair around the sides and back to more length on top. A versatile, polished style that keeps you looking sharp for any occasion.",
  },
  {
    image: "/high-top-fade.PNG",
    alt: "Professional high top fade",
    title: "High Top Fade",
    description:
      "A bold high top fade with a neatly shaped top and closely faded sides. This statement style adds height and definition while maintaining a clean, sharp finish.",
  },
  {
    image: "/tapered-sides.PNG",
    alt: "Professional tapered sides haircut",
    title: "Tapered Sides",
    description:
      "A stylish haircut with gradually shortened sides that blend naturally into the hair above. The tapered finish creates a neat, balanced appearance without taking away from your chosen top style.",
  },

  {
    image: "/textured-afro-with-mid-fade.png",
    alt: "Textured Afro with Mid Fade and Curved Hair Design",
    title: "Textured Afro Mid Fade and a C-Cut",
    description:
      "Keep it fresh with this stylish textured afro, a clean mid fade, and a sharp curved design for a distinctive finish. Perfect for anyone who wants a neat, modern look with a touch of creativity.",
  },
  {
    image: "/blonde-textured-top.png",
    alt: "Blonde Textured Top with Artistic Design Fade",
    title: "Blonde Textured Top with Artistic Design Fade",
    description:
      "Stand out with this bold, blonde-textured top paired with a clean low fade and sharp, flowing hair designs. A perfect blend of creativity, precision, and style for anyone who wants to turn heads.",
  },
];

function Haircuts() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      {/* Page heading */}
      <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
        <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 sm:text-sm">
          Find Your Style
        </p>

        <h1 className="mb-4 font-heading text-3xl font-bold leading-tight text-gray-800 sm:text-4xl lg:text-5xl">
          Professional Haircuts
        </h1>

        <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
          From classic cuts to modern fades, discover a style that suits your
          personality. Every cut is finished with precision, care, and attention
          to detail.
        </p>
      </header>

      {/* Haircut collection */}
      <section
        aria-label="Our haircut styles"
        className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 xl:grid-cols-3"
      >
        {haircuts.map((haircut) => (
          <article
            key={haircut.title}
            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 sm:aspect-[5/4] lg:aspect-[4/5]">
              <img
                src={haircut.image}
                alt={haircut.alt}
                className="h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h2 className="mb-3 font-heading text-2xl font-bold leading-snug text-gray-800">
                {haircut.title}
              </h2>

              <p className="mb-6 flex-1 text-sm leading-7 text-gray-600 sm:text-base">
                {haircut.description}
              </p>

              <Link
                to="/book-visit"
                className="mt-auto inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-amber-700 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 sm:text-base"
              >
                Book This Haircut
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Closing message */}
      <section className="mx-auto mt-16 max-w-3xl border-t border-gray-200 px-2 pt-10 text-center sm:mt-20 sm:pt-14">
        <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 sm:text-sm">
          The Unique Barbershop Experience
        </p>

        <h2 className="mb-4 font-heading text-2xl font-bold leading-tight text-gray-800 sm:text-3xl lg:text-4xl">
          A Fresh Cut, A Confident You
        </h2>

        <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
          Your style deserves the right attention. Whether you choose a timeless
          taper or a bold high top fade, we focus on clean lines, balanced
          proportions, and a finish that brings out your best look.
        </p>

        <Link
          to="/book-visit"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-amber-700 px-7 py-3 font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
        >
          Book Your Visit
        </Link>
      </section>
    </main>
  );
}

export default Haircuts;

/*import { useEffect } from "react";
import { supabase } from "../services/supabase";
import { Link } from "react-router";

function Haircuts() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_date, appointment_time, status")
        .limit(5);

      if (error) {
        console.error("Supabase error:", error.message);
        return;
      }

      console.log("Supabase connected successfully!", data);
    }

    testConnection();
  }, []);

  return (
    <main className="mx-4 my-10 sm:mx-6 md:mx-10">
      <header className="mb-10 text-center">
        <p className="mb-2 font-body text-sm font-semibold uppercase tracking-widest text-amber-600">
          Find Your Style
        </p>

        <h1 className="mb-4 font-heading text-3xl font-bold text-gray-800 sm:text-4xl">
          Professional Haircuts
        </h1>

        <p className="mx-auto max-w-2xl leading-7 text-gray-500">
          From classic cuts to modern fades, discover a style that suits your
          personality and keeps you looking sharp.
        </p>
      </header>

      <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <img
          src="/haircut-taper-fade.jpeg"
          alt="Professional taper fade haircut"
          className="max-h-112.5 w-full object-cover"
          loading="lazy"
        />
      </article>

      <div className="mt-8 text-center">
        <Link
          to="/book-visit"
          className="inline-block rounded-lg bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
        >
          Book a Haircut
        </Link>
      </div>

      <section className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gray-800 sm:text-3xl">
          A Fresh Cut, A Confident You
        </h2>

        <p className="leading-7 text-gray-500">
          Whether you prefer a clean taper fade or a timeless classic cut, we
          focus on precision, attention to detail, and a finish that complements
          your style.
        </p>
      </section>

      <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <img
          src="/high-top-fade.PNG"
          alt="Professional high top fade"
          className="max-h-112.5 w-full object-cover"
          loading="lazy"
        />
      </article>

      <div className="mt-8 text-center">
        <Link
          to="/book-visit"
          className="inline-block rounded-lg bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
        >
          Book a Haircut
        </Link>
      </div>

      <section className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gray-800 sm:text-3xl">
          A Fresh Cut, A Confident You
        </h2>

        <p className="leading-7 text-gray-500">
          Whether you prefer a clean taper fade or a timeless classic cut, we
          focus on precision, attention to detail, and a finish that complements
          your style.
        </p>
      </section>

      <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <img
          src="/tapered-sides.PNG"
          alt="Professional tapered sides haircut"
          className="max-h-112.5 w-full object-cover"
          loading="lazy"
        />
      </article>

      <div className="mt-8 text-center">
        <Link
          to="/book-visit"
          className="inline-block rounded-lg bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
        >
          Book a Haircut
        </Link>
      </div>
      <section className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="mb-4 font-heading text-2xl font-bold text-gray-800 sm:text-3xl">
          A Fresh Cut, A Confident You
        </h2>

        <p className="leading-7 text-gray-500">
          Whether you prefer a clean taper fade or a timeless classic cut, we
          focus on precision, attention to detail, and a finish that complements
          your style.
        </p>
      </section>
    </main>
  );
}

export default Haircuts;
*/
