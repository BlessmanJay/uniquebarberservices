import { useEffect, useRef, useState } from "react";
import { supabase } from "../services/supabase";

function validateNigerianPhone(phone) {
  const normalized = phone.replace(/[\s()-]/g, "");

  const nigeriaPhoneRegex = /^(?:\+234|234|0)([789][01]\d{8})$/;

  const match = normalized.match(nigeriaPhoneRegex);

  if (!match) {
    return null;
  }

  return `+234${match[1]}`;
}

function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    date: "",
    time: "",
    phone: "",
  });

  const [validFields, setValidFields] = useState({
    name: false,
    service: false,
    date: false,
    time: false,
    phone: false,
  });

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const fields = ["name", "service", "date", "time", "phone"];

  const [bookedTimes, setBookedTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [availabilityError, setAvailabilityError] = useState(false);
  const [availabilityRetry, setAvailabilityRetry] = useState(0);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  const submissionLock = useRef(false);

  useEffect(() => {
    if (!formData.date) {
      setBookedTimes([]);
      setLoadingTimes(false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      time: "",
    }));

    setValidFields((prev) => ({
      ...prev,
      time: false,
    }));

    let cancelled = false;

    async function fetchBookedTimes() {
      setAvailabilityError(false);
      setLoadingTimes(true);

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", formData.date)
        .in("status", ["pending", "confirmed"]);

      if (cancelled) return;

      if (error) {
        console.error("Could not fetch booked times:", error.message);
        setBookedTimes([]);
        setAvailabilityError(true);
      } else {
        setBookedTimes(
          data.map((appointment) => appointment.appointment_time.slice(0, 5)),
        );

        setAvailabilityError(false);
      }

      setLoadingTimes(false);
    }

    fetchBookedTimes();

    return () => {
      cancelled = true;
    };
  }, [formData.date, availabilityRetry]);

  // =====================
  function handleChange(e) {
    const { name, value, validity } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidFields((prev) => ({
      ...prev,
      [name]: value.trim() !== "" && validity.valid,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;
    if (submissionLock.current) return;

    submissionLock.current = true;
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    setBookingConfirmation(null);

    try {
      // Checking to ensure that every field is valid.
      if (!fields.every((field) => validFields[field])) {
        setMessage({
          type: "error",
          text: "Please complete all fields correctly.",
        });
        return;
      }

      // Validating the phone number
      const normalizedPhone = validateNigerianPhone(formData.phone);

      if (!normalizedPhone) {
        setMessage({
          type: "error",
          text: "Please enter a valid Nigerian mobile number, e.g. 08012345678 or +2348012345678.",
        });

        return;
      }

      // Double-checking the appointment time.
      if (formData.time < "08:00" || formData.time > "20:00") {
        setMessage({
          type: "error",
          text: "Appointments are available only between 8 AM and 8 PM.",
        });
        return;
      }

      // Checking whether the selected slot is already booked.
      const { data: existing, error: checkError } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", formData.date)
        .eq("appointment_time", formData.time)
        .in("status", ["pending", "confirmed"]);

      if (checkError) {
        console.error(checkError);
        setMessage({
          type: "error",
          text: "Unable to check availability. Please try again",
        });
        return;
      }

      if (existing.length > 0) {
        setBookedTimes((prev) =>
          prev.includes(formData.time) ? prev : [...prev, formData.time],
        );

        setFormData((prev) => ({ ...prev, time: "" }));
        setValidFields((prev) => ({ ...prev, time: false }));

        setMessage({
          type: "error",
          text: "Sorry, that time is already booked. Please choose another",
        });
        return;
      }

      // Save the appointment to Supabase.
      const { error: insertError } = await supabase
        .from("appointments")
        .insert({
          customer_name: formData.name.trim(),
          service: formData.service,
          appointment_date: formData.date,
          appointment_time: formData.time,
          phone: normalizedPhone,
        });

      if (insertError) {
        console.error(insertError);

        if (insertError.code === "23505") {
          setMessage({
            type: "error",
            text: "Someone just booked that time. Please select another.",
          });
          setBookedTimes((prev) =>
            prev.includes(formData.time) ? prev : [...prev, formData.time],
          );
          setFormData((prev) => ({ ...prev, time: "" }));
          setValidFields((prev) => ({ ...prev, time: false }));
          return;
        }

        setMessage({
          type: "error",
          text: "Booking failed. Please try again.",
        });
        return;
      }

      setBookingConfirmation({
        name: formData.name.trim(),
        service: formData.service,
        date: formData.date,
        time: formData.time,
        phone: normalizedPhone,
        status: "pending",
      });

      setMessage({
        type: "success",
        text: "Your appointment request has been submitted successfully!",
      });

      // Refreshing the booked times.
      setBookedTimes((prev) =>
        prev.includes(formData.time) ? prev : [...prev, formData.time],
      );

      // Resetting the form.
      setFormData({
        name: "",
        service: "",
        date: "",
        time: "",
        phone: "",
      });

      setValidFields({
        name: false,
        service: false,
        date: false,
        time: false,
        phone: false,
      });
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      submissionLock.current = false;
    }
  }

  // End of handleSubmit ===========================

  const lastCompleteIndex = fields.findIndex((field) => !validFields[field]);

  const visibleCount =
    lastCompleteIndex === -1 ? fields.length : lastCompleteIndex + 1;

  const allComplete = fields.every((field) => validFields[field]);

  const inputStyle = "mb-[22px] animate-[reveal_0.3s_ease]";

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-7.5 font-sans">
      {/* Starts here! */}
      {bookingConfirmation && (
        <section
          aria-live="polite"
          className="mb-6 rounded-xl border border-green-200 bg-green-50 p-6"
        >
          <h2 className="text-2xl font-bold text-green-800">
            Booking Request Received!
          </h2>

          <p className="mt-2 text-green-700">
            Thank you, <strong> {bookingConfirmation.name} </strong>! Your
            appointment request was submitted successfully.
          </p>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-600">Service</dt>
              <dd>{bookingConfirmation.service}</dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-600">Date</dt>
              <dd>{bookingConfirmation.date}</dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-600">Time</dt>
              <dd>{bookingConfirmation.time}</dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-600">Phone</dt>
              <dd>{bookingConfirmation.phone}</dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-600">Status</dt>
              <dd className="font-semibold capitalize text-amber-700">
                {bookingConfirmation.status}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-slate-600">
            Your appointment is pending confirmation by the barbershop admin.
          </p>

          <button
            type="button"
            onClick={() => {
              setBookingConfirmation(null);
              setMessage({ type: "", text: "" });
              setFormData({
                name: "",
                service: "",
                date: "",
                time: "",
                phone: "",
              });
            }}
            className="relative z-50 mt-6 cursor-pointer rounded-lg bg-green-900 px-6 py-3 font-semibold text-white hover:bg-violet-800"
          >
            Book Another Appointment
          </button>

          {/* 
          <button
            type="button"
            onClick={() => {
              setBookingConfirmation(null);
              setMessage({ type: "", text: "" });
              setIsSubmitting(false);

              setFormData({
                name: "",
                service: "",
                date: "",
                time: "",
                phone: "",
              });

              setValidFields({});
            }}
            className="mt-6 cursor-pointer rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white hover:bg-violet-800"
          >
            Book Another Appointment
          </button> */}
        </section>
      )}
      {/* Ends here! */}

      {!bookingConfirmation && (
        <form
          id="bookingForm"
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-112.5 rounded-xl bg-white p-6 shadow-[0_4px_20px_#00000010]"
        >
          <h1 className="text-2xl font-bold">Book an Appointment</h1>

          <p className="mb-7 mt-2 text-[#666]">
            Tell us a little about yourself.
          </p>

          {/* Step 1: Name */}
          {visibleCount >= 1 && (
            <div className={inputStyle}>
              <label htmlFor="name" className="mb-2 block font-semibold">
                What's your name?
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-[7px] border border-[#ccc] p-3 text-base focus:border-violet-500 focus:outline-2 focus:outline-violet-400"
              />
            </div>
          )}

          {/* Step 2: Service */}
          {visibleCount >= 2 && (
            <div className={inputStyle}>
              <label htmlFor="service" className="mb-2 block font-semibold">
                Choose a service
              </label>

              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full rounded-[7px] border border-[#ccc] bg-white p-3 text-base focus:border-violet-500 focus:outline-2 focus:outline-violet-400"
              >
                <option value="">Select a service</option>
                <option value="haircut">Haircut only</option>
                <option value="haircut-n-dyeing">Haircut &amp; Dyeing</option>
                <option value="edge-up">Edge-up only</option>
                <option value="edge-up-n-dyeing">Edge-up &amp; Dyeing</option>
                <option value="edge-up-n-shaving">Edge-up &amp; Shaving</option>
                <option value="edge-up-shaving-n-dyeing">
                  Edge-up, Shaving &amp; Dyeing
                </option>
                <option value="shaving">Shaving only</option>
                <option value="beard">Beard grooming</option>
                <option value="both">Haircut and beard</option>
                <option value="dyeing">Dyeing only</option>
                <option value="tints-or-color-dyeing">Tinting or Dyeing</option>
              </select>
            </div>
          )}

          {/* Step 3: Date */}
          {visibleCount >= 3 && (
            <div className={inputStyle}>
              <label htmlFor="date" className="mb-2 block font-semibold">
                Choose your appointment date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                min={todayString}
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-[7px] border border-[#ccc] p-3 text-base focus:border-violet-500 focus:outline-2 focus:outline-violet-400"
              />
            </div>
          )}

          {/* Step 4: Time */}
          {visibleCount >= 4 && (
            <div className="mb-[22px] animate-[reveal_0.3s_ease]">
              <label htmlFor="time" className="mb-2 block font-semibold">
                Choose your appointment time
              </label>

              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                disabled={loadingTimes || availabilityError}
                className="w-full rounded-[7px] border border-[#ccc] bg-white p-3 text-base focus:border-violet-500 focus:outline-2 focus:outline-violet-400 disabled:cursor-wait disabled:opacity-60"
              >
                <option value="">
                  {loadingTimes
                    ? "Loading available times..."
                    : availabilityError
                      ? "Unable to load times. Please try again."
                      : "Select an available time"}
                </option>

                {Array.from({ length: 25 }, (_, i) => {
                  const totalMinutes = 8 * 60 + i * 30;
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;

                  const time =
                    `${String(hours).padStart(2, "0")}:` +
                    `${String(minutes).padStart(2, "0")}`;

                  if (bookedTimes.includes(time)) return null;

                  const label = new Date(
                    `2000-01-01T${time}:00`,
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <option key={time} value={time}>
                      {label}
                    </option>
                  );
                })}
              </select>

              {availabilityError && (
                <button
                  type="button"
                  onClick={() => setAvailabilityRetry((prev) => prev + 1)}
                  className="mt-2 text-sm font-semibold cursor-pointer text-violet-700 underline"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {/* Step 5: Phone */}
          {visibleCount >= 5 && (
            <div className="mb-5.5 animate-[reveal_0.3s_ease]">
              <label htmlFor="phone" className="mb-2 block font-semibold">
                What's your phone number?
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="08012345678 or +2348012345678"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-[7px] border border-[#ccc] p-3 text-base focus:border-violet-500 focus:outline-2 focus:outline-violet-400"
              />
            </div>
          )}

          {message.text && (
            <p
              role="status"
              aria-live="polite"
              className={`mb-4 rounded-lg p-3 text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </p>
          )}

          {allComplete && (
            <button
              id="submitBtn"
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-[7px] bg-violet-600 p-3.25 text-base text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Book Appointment"}
            </button>
          )}
        </form>
      )}
    </div>
  );
}

export default BookingForm;
