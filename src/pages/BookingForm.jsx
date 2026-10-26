import { useEffect, useRef, useState } from "react";
import ActionButton from "../components/ActionButton";
import { supabase } from "../services/supabase";
import { createPaymentAccessToken } from "../helpers/paymentAccessToken";
import GenericButton from "../components/GenericButton";

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
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [availabilityError, setAvailabilityError] = useState(false);
  const [availabilityRetry, setAvailabilityRetry] = useState(0);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [isSubmittingReference, setIsSubmittingReference] = useState(false);
  const [referenceMessage, setReferenceMessage] = useState(null);

  const submissionLock = useRef(false);

  async function handlePaymentReferenceSubmit(e) {
    e.preventDefault();

    if (
      !bookingConfirmation?.id ||
      !bookingConfirmation?.paymentAccessToken ||
      !paymentReference.trim()
    ) {
      setReferenceMessage({
        type: "error",
        text: "Please enter your transfer reference.",
      });
      return;
    }

    setIsSubmittingReference(true);
    setReferenceMessage(null);

    try {
      const { error } = await supabase.rpc("submit_payment_reference", {
        p_appointment_id: bookingConfirmation.id,
        p_access_token: bookingConfirmation.paymentAccessToken,
        p_payment_reference: paymentReference.trim(),
      });

      if (error) {
        console.error("Payment reference submission failed:", error);

        setReferenceMessage({
          type: "error",
          text: "We couldn't submit your reference. Please try again.",
        });
        return;
      }

      setBookingConfirmation((prev) => ({
        ...prev,
        paymentStatus: "pending_verification",
      }));

      setPaymentReference("");

      setReferenceMessage({
        type: "success",
        text: "Transfer reference submitted! Your payment is awaiting verification.",
      });
    } catch (error) {
      console.error("Payment reference submission failed:", error);

      setReferenceMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmittingReference(false);
    }
  }

  // Services retrieved from Supabase
  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      setLoadingServices(true);
      setServicesError(false);

      const { data, error } = await supabase
        .from("services")
        .select("id, name, price")
        .eq("is_active", true)
        .order("name");

      if (cancelled) return;

      if (error) {
        console.error("Could not fetch services:", error.message);
        setServicesError(true);
        setServices([]);
      } else {
        setServices(data);
        setServicesError(false);
      }

      setLoadingServices(false);
    }

    fetchServices();

    return () => {
      cancelled = true;
    };
  }, []);

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

  // Booking submission handler
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

      const { token, tokenHash } = await createPaymentAccessToken();

      // Submit appointment to Supabase.
      const { data: appointment, error: insertError } = await supabase
        .from("appointments")
        .insert({
          customer_name: formData.name.trim(),
          service: formData.service,
          appointment_date: formData.date,
          appointment_time: formData.time,
          phone: normalizedPhone,
          payment_access_token_hash: tokenHash,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Supabase appointment insert failed:", {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
        });

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

      // Booking confirmation object
      setBookingConfirmation({
        id: appointment.id,
        paymentAccessToken: token,
        paymentStatus: "not_started",
        name: formData.name.trim(),
        service: formData.service,
        date: formData.date,
        time: formData.time,
        phone: normalizedPhone,
        status: "pending",
        totalPrice,
        depositAmount,
        balanceAmount,
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
      console.error("Booking submission failed:", error);

      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Error details:", JSON.stringify(error));
      }

      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      submissionLock.current = false;
    }
  }
  // End of handleSubmit

  const lastCompleteIndex = fields.findIndex((field) => !validFields[field]);

  const visibleCount =
    lastCompleteIndex === -1 ? fields.length : lastCompleteIndex + 1;

  const allComplete = fields.every((field) => validFields[field]);

  // payment calculations
  const selectedService = services.find(
    (service) => service.name === formData.service,
  );

  const totalPrice = selectedService ? Number(selectedService.price) : 0;

  const depositAmount = Math.round(totalPrice * 0.7);
  const balanceAmount = totalPrice - depositAmount;

  const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

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
            Thank you, <strong> {bookingConfirmation.name}</strong>! Your
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
          <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-5">
            <h3 className="text-xl font-bold text-violet-900">
              Pay Your 70% Deposit
            </h3>

            <p className="mt-2 text-sm text-slate-700">
              Transfer your deposit using the bank details below. Your
              appointment remains pending until the barbershop confirms your
              booking and verifies your payment.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-slate-500">Bank</p>
                <p className="font-semibold">PalmPay</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Account name</p>
                <p className="font-semibold">Blessed Jonah John</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Account number</p>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-lg font-bold">9057908212</p>

                  <GenericButton
                    type="button"
                    onClick={async () => {
                      setCopyMessage(null);

                      try {
                        await navigator.clipboard.writeText("9057908212");

                        setCopyMessage({
                          type: "success",
                          text: "Account number copied successfully!",
                        });
                      } catch (error) {
                        console.error("Could not copy account number:", error);

                        setCopyMessage({
                          type: "error",
                          text: "Could not copy automatically. Please copy the account number manually.",
                        });
                      }
                    }}
                    className="rounded-lg border border-violet-300 px-3 py-1 text-sm font-semibold text-violet-900 hover:bg-violet-100"
                  >
                    Copy account number
                  </GenericButton>

                  {copyMessage && (
                    <p
                      role="status"
                      aria-live="polite"
                      className={`mt-2 text-sm font-medium ${
                        copyMessage.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {copyMessage.text}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-violet-200 pt-4">
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Total price</span>
                <span className="font-semibold">
                  {formatNaira(bookingConfirmation.totalPrice)}
                </span>
              </div>

              <div className="mt-2 flex justify-between gap-4">
                <span className="font-semibold text-violet-900">
                  Deposit to transfer (70%)
                </span>
                <span className="font-bold text-violet-900">
                  {formatNaira(bookingConfirmation.depositAmount)}
                </span>
              </div>

              <div className="mt-2 flex justify-between gap-4">
                <span className="text-slate-600">Remaining balance</span>
                <span className="font-semibold">
                  {formatNaira(bookingConfirmation.balanceAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment reference from */}
          {bookingConfirmation.paymentStatus !== "pending_verification" &&
            bookingConfirmation.paymentStatus !== "paid" && (
              <form
                onSubmit={handlePaymentReferenceSubmit}
                className="mt-6 space-y-4 rounded-lg border border-gray-300 p-4"
              >
                <h3 className="text-lg font-bold">
                  Submit Your Transfer Reference
                </h3>

                <p className="text-sm text-gray-600">
                  After transferring your deposit, enter the payment reference
                  provided by your bank. Your payment will remain unverified
                  until we confirm receipt.
                </p>

                <label
                  htmlFor="payment-reference"
                  className="block font-medium"
                >
                  Bank Transfer Reference (Optional)
                </label>

                <input
                  id="payment-reference"
                  type="text"
                  value={paymentReference}
                  onChange={(e) => {
                    setPaymentReference(e.target.value);
                    setReferenceMessage(null);
                  }}
                  maxLength={20}
                  minLength={15}
                  autoComplete="off"
                  // required
                  placeholder="Enter your transfer reference. Note that, this is optional."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />

                <GenericButton
                  type="submit"
                  disabled={isSubmittingReference || !paymentReference.trim()}
                  className="w-full rounded-lg bg-blue-800 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmittingReference
                    ? "Submitting..."
                    : "Submit Payment Reference"}
                </GenericButton>
              </form>
            )}

          {referenceMessage && (
            <p
              role="status"
              aria-live="polite"
              className={`text-sm font-medium ${
                referenceMessage.type === "success"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {referenceMessage.text}
            </p>
          )}

          {/* Pending admin approval */}
          <p className="mt-4 text-sm text-slate-600">
            Your appointment is pending confirmation by the barbershop
            management.
          </p>
          <div className="flex items-center justify-between">
            <ActionButton to="/services">Back to Services</ActionButton>

            <GenericButton
              type="button"
              onClick={() => {
                setBookingConfirmation(null);
                setMessage({ type: "", text: "" });
                setCopyMessage(null);

                setFormData({
                  name: "",
                  service: "",
                  date: "",
                  time: "",
                  phone: "",
                });
              }}
              className="w-24 sm:w-40 relative z-50 mt-6 cursor-pointer rounded-lg bg-green-900 text-sm sm:text-base px-2 py-3 sm:px-6 sm:py-3 font-semibold text-white hover:bg-violet-800"
            >
              Book Again
            </GenericButton>
          </div>
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
                disabled={
                  loadingServices || servicesError || services.length === 0
                }
                className="w-full rounded-[7px] border border-[#ccc] bg-white p-3 text-base focus:border-violet-500 focus:outline-2 focus:outline-violet-400 disabled:cursor-wait disabled:opacity-60"
              >
                <option value="">
                  {loadingServices
                    ? "Loading services..."
                    : servicesError
                      ? "Unable to load services"
                      : services.length === 0
                        ? "No services currently available"
                        : "Select a service"}
                </option>

                {services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>

              {servicesError && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  Could not load services. Please refresh the page and try
                  again.
                </p>
              )}

              {formData.service &&
                (() => {
                  const selectedService = services.find(
                    (service) => service.name === formData.service,
                  );

                  if (!selectedService) return null;

                  return (
                    <div className="mt-3 rounded-lg bg-violet-50 p-4">
                      <p className="text-sm text-slate-600">Service price</p>

                      {selectedService && (
                        <div className="mt-3 rounded-lg bg-violet-50 p-4">
                          <p className="text-md text-slate-600 font-bold">
                            Payment breakdown
                          </p>

                          <div className="mt-2 flex items-center justify-between gap-4">
                            <span className="text-slate-600">Total price</span>
                            <span className="font-bold">
                              {formatNaira(totalPrice)}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-4">
                            <span className="text-slate-600">70% deposit</span>
                            <span className="font-bold text-violet-800">
                              {formatNaira(depositAmount)}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-4">
                            <span className="text-slate-600">
                              Remaining 30% balance
                            </span>
                            <span className="font-bold">
                              {formatNaira(balanceAmount)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    // Price display ends here
                  );
                })()}
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
            <div className="mb-5.5 animate-[reveal_0.3s_ease]">
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
                <GenericButton
                  type="button"
                  onClick={() => setAvailabilityRetry((prev) => prev + 1)}
                  className="mt-2 text-sm font-semibold cursor-pointer text-violet-700 underline"
                >
                  Try again
                </GenericButton>
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
            <GenericButton
              id="submitBtn"
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-[7px] bg-violet-600 p-3.25 text-base text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Book Appointment"}
            </GenericButton>
          )}
        </form>
      )}
    </div>
  );
}

export default BookingForm;
