import { useCallback, useEffect, useState } from "react";
import ActionButton from "./components/ActionButton";
import { supabase } from "./services/supabase";
import GenericButton from "./components/GenericButton";

function AdminDashboard({ onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  // Services and their prices
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicePrices, setServicePrices] = useState({});
  const [savingService, setSavingService] = useState(null);
  const [servicesMessage, setServicesMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const appointmentsPerPage = 10;

  const fetchAppointments = useCallback(async () => {
    setIsRefreshing(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          "id, customer_name, service, appointment_date, appointment_time, phone, status, created_at, total_price, deposit_amount, balance_amount, payment_status, payment_reference",
        )
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (error) throw error;

      setAppointments(data ?? []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setMessage("Unable to load appointments. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch services from Supabase
  const fetchServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesMessage("");

    try {
      const { data, error } = await supabase
        .from("services")
        .select("name, price, is_active")
        .order("name", { ascending: true });

      if (error) throw error;

      setServices(data ?? []);

      // Initialize the editable price fields
      setServicePrices(
        Object.fromEntries(
          (data ?? []).map((service) => [
            service.name,
            String(service.price ?? ""),
          ]),
        ),
      );
    } catch (error) {
      console.error("Error fetching services:", error);
      setServicesMessage("Unable to load services. Please try again.");
    } finally {
      setServicesLoading(false);
    }
  }, []);

  // Save an updated service price
  async function saveServicePrice(service) {
    const enteredPrice = servicePrices[service.name];

    if (
      enteredPrice === undefined ||
      enteredPrice.trim() === "" ||
      !Number.isFinite(Number(enteredPrice)) ||
      Number(enteredPrice) < 0
    ) {
      setServicesMessage("Please enter a valid price of ₦0 or more.");
      return;
    }

    const newPrice = Number(enteredPrice);

    setSavingService(service.name);
    setServicesMessage("");

    try {
      const { error } = await supabase
        .from("services")
        .update({ price: newPrice })
        .eq("name", service.name);

      if (error) throw error;

      setServices((previousServices) =>
        previousServices.map((item) =>
          item.name === service.name ? { ...item, price: newPrice } : item,
        ),
      );

      setServicesMessage(`${service.name} price updated successfully.`);
    } catch (error) {
      console.error("Error updating service price:", error);
      setServicesMessage(
        "Unable to save this price. Check your permissions and try again.",
      );
    } finally {
      setSavingService(null);
    }
  }

  // To avoid cascading renders(from riggering synchronous state updates directly from an effect), we'll use setTimeout to schedule the initial fetch after the effect runs.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAppointments();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchAppointments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Filter Appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      appointment.customer_name.toLowerCase().includes(search) ||
      appointment.phone.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage,
  );

  const startIndex = (currentPage - 1) * appointmentsPerPage;

  const currentAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + appointmentsPerPage,
  );

  // Update Status
  async function updateStatus(id, newStatus) {
    setUpdatingId(id);
    setMessage("");

    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
      setMessage("Could not update appointment status.");
    } else {
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: newStatus }
            : appointment,
        ),
      );

      setMessage(`Appointment ${newStatus} successfully.`);
    }

    setUpdatingId(null);
  }

  // Delete Appointment
  async function deleteAppointment(appointment) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the appointment for ${appointment.customer_name} on ${appointment.appointment_date} at ${appointment.appointment_time.slice(0, 5)}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setUpdatingId(appointment.id);
    setMessage("");

    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointment.id);

      if (error) throw error;

      setAppointments((previousAppointments) =>
        previousAppointments.filter((item) => item.id !== appointment.id),
      );

      setMessage("Appointment deleted successfully.");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setMessage(
        "Unable to delete this appointment. Check your permissions and try again.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // Verify Payment
  async function verifyPayment(appointmentId, newPaymentStatus) {
    const action =
      newPaymentStatus === "paid"
        ? "verify this payment"
        : "reject this payment";

    const confirmed = window.confirm(`Are you sure you want to ${action}?`);

    if (!confirmed) return;

    setUpdatingId(appointmentId);
    setMessage("");

    try {
      const { error } = await supabase.rpc("verify_appointment_payment", {
        p_appointment_id: appointmentId,
        p_new_payment_status: newPaymentStatus,
      });

      if (error) throw error;

      setMessage(
        newPaymentStatus === "paid"
          ? "Payment verified successfully."
          : "Payment rejected. The customer can submit a corrected reference.",
      );

      await fetchAppointments();
    } catch (error) {
      console.error("Payment verification failed:", error);
      setMessage("Unable to update payment status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      setMessage("Unable to sign out. Please try again.");
      return;
    }

    onLogout();
  }

  if (loading) {
    return <p className="p-6">Loading appointments...</p>;
  }

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>

          {lastUpdated && (
            <p className="mt-2 text-sm text-slate-500">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}

          <GenericButton
            type="button"
            onClick={fetchAppointments}
            disabled={isRefreshing}
            className="rounded-lg bg-violet-700 px-4 py-2
    font-semibold text-white hover:bg-violet-800
    disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing..." : "Refresh Appointments"}
          </GenericButton>

          <p className="mt-2 text-slate-500">
            Manage your customer appointments.
          </p>
        </div>

        <GenericButton
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-100"
        >
          Sign Out
        </GenericButton>
      </header>

      {/* Manage Services */}
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Manage Services
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View and update your service prices.
            </p>
          </div>

          <GenericButton
            type="button"
            onClick={fetchServices}
            disabled={servicesLoading}
            className="rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-100 disabled:opacity-50"
          >
            {servicesLoading ? "Loading..." : "Refresh Services"}
          </GenericButton>
        </div>

        {servicesMessage && (
          <p
            role="status"
            aria-live="polite"
            className="mb-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-700"
          >
            {servicesMessage}
          </p>
        )}

        {servicesLoading ? (
          <p className="py-4 text-slate-500">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="py-4 text-slate-500">No services found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-3">Service</th>
                  <th className="p-3">Price (₦)</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => (
                  <tr key={service.name} className="border-t border-slate-200">
                    <td className="p-3 font-medium">{service.name}</td>

                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={servicePrices[service.name] ?? ""}
                        onChange={(event) =>
                          setServicePrices((previous) => ({
                            ...previous,
                            [service.name]: event.target.value,
                          }))
                        }
                        aria-label={`Price for ${service.name}`}
                        className="w-32 rounded-lg border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none"
                      />
                    </td>

                    <td className="p-3">
                      {service.is_active ? "Active" : "Inactive"}
                    </td>

                    <td className="p-3">
                      <GenericButton
                        type="button"
                        onClick={() => saveServicePrice(service)}
                        disabled={savingService !== null}
                        className="rounded-lg bg-violet-700 px-3 py-2 font-semibold text-white hover:bg-violet-900 transition duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingService === service.name ? "Saving..." : "Save"}
                      </GenericButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total appointments</p>
          <p className="mt-2 text-3xl font-bold">{appointments.length}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {appointments.filter((appt) => appt.status === "pending").length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Confirmed</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {appointments.filter((appt) => appt.status === "confirmed").length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Cancelled Appointments
          </p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {
              appointments.filter(
                (appointment) => appointment.status === "cancelled",
              ).length
            }
          </p>
        </div>
      </section>

      {/* Filter section */}

      <div className="mb-4">
        <label
          htmlFor="appointment-search"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Search appointments
        </label>

        <input
          id="appointment-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by customer name or phone number..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 sm:max-w-md"
        />
        {searchTerm && (
          <GenericButton
            type="button"
            onClick={() => setSearchTerm("")}
            className="mt-2 pl-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
          >
            Clear Search
          </GenericButton>
        )}
      </div>

      <section
        aria-label="Filter appointments by status"
        className="mb-6 flex flex-wrap gap-3"
      >
        {[
          { label: "All", value: "all" },
          { label: "Pending", value: "pending" },
          { label: "Confirmed", value: "confirmed" },
          { label: "Cancelled", value: "cancelled" },
        ].map((filter) => (
          <GenericButton
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            aria-pressed={statusFilter === filter.value}
            className={`rounded-full border px-5 py-2 font-semibold transition-colors ${
              statusFilter === filter.value
                ? "border-violet-700 bg-violet-700 text-white"
                : "border-slate-300 bg-white text-slate-600 hover:bg-violet-50"
            }`}
          >
            {filter.label}
          </GenericButton>
        ))}
      </section>
      <GenericButton
        type="button"
        onClick={() => {
          setSearchTerm("");
          setStatusFilter("all");
          setCurrentPage(1);
        }}
        className="mb-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Clear Filters
      </GenericButton>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mb-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-700"
        >
          {message}
        </p>
      )}

      <section className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-225 text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Service</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment Details</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentAppointments.map((appointment) => (
              <tr key={appointment.id} className="border-t border-slate-200">
                <td className="p-4 font-medium">{appointment.customer_name}</td>

                <td className="p-4">
                  <a
                    href={`tel:${appointment.phone}`}
                    className="text-violet-700 underline"
                  >
                    {appointment.phone}
                  </a>
                </td>

                <td className="p-4">{appointment.service}</td>

                <td className="p-4">{appointment.appointment_date}</td>

                <td className="p-4">
                  {appointment.appointment_time.slice(0, 5)}
                </td>

                <td className="p-4 capitalize">{appointment.status}</td>

                <td className="p-4">
                  <div className="min-w-48 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Total:</span> ₦
                      {Number(appointment.total_price ?? 0).toLocaleString()}
                    </p>

                    <p>
                      <span className="font-semibold">Deposit (70%):</span> ₦
                      {Number(appointment.deposit_amount ?? 0).toLocaleString()}
                    </p>

                    <p>
                      <span className="font-semibold">Balance (30%):</span> ₦
                      {Number(appointment.balance_amount ?? 0).toLocaleString()}
                    </p>

                    <p>
                      <span className="font-semibold">Payment:</span>{" "}
                      <span className="capitalize">
                        {(
                          appointment.payment_status ?? "not_started"
                        ).replaceAll("_", " ")}
                      </span>
                    </p>

                    <p className="wrap-break-word">
                      <span className="font-semibold">Transfer reference:</span>{" "}
                      {appointment.payment_reference || "Not submitted"}
                    </p>

                    {appointment.payment_status === "pending_verification" && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        <GenericButton
                          type="button"
                          disabled={updatingId === appointment.id}
                          onClick={() => verifyPayment(appointment.id, "paid")}
                          className="rounded-md bg-green-700 px-3 py-2 text-white disabled:opacity-50"
                        >
                          {updatingId === appointment.id
                            ? "Processing..."
                            : "Verify Payment"}
                        </GenericButton>

                        <GenericButton
                          type="button"
                          disabled={updatingId === appointment.id}
                          onClick={() =>
                            verifyPayment(appointment.id, "rejected")
                          }
                          className="rounded-md bg-red-600 px-3 py-2 text-white disabled:opacity-50"
                        >
                          Reject Payment
                        </GenericButton>
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    {appointment.status === "pending" && (
                      // Confirm appointment
                      <GenericButton
                        type="button"
                        disabled={updatingId === appointment.id}
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Are you sure you want to confirm this appointment?",
                          );

                          if (confirmed) {
                            updateStatus(appointment.id, "confirmed");
                          }
                        }}
                        className="rounded-md bg-green-700 px-3 py-2 text-white disabled:opacity-50"
                      >
                        Confirm
                      </GenericButton>
                    )}
                    {/* Cancel appointment */}
                    {appointment.status !== "cancelled" && (
                      <GenericButton
                        type="button"
                        disabled={updatingId === appointment.id}
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Are you sure you want to cancel this appointment?",
                          );

                          if (confirmed) {
                            updateStatus(appointment.id, "cancelled");
                          }
                        }}
                        className="rounded-md bg-red-600 px-3 py-2 text-white disabled:opacity-50"
                      >
                        Cancel
                      </GenericButton>
                    )}
                    {/* Delete appointment */}
                    <GenericButton
                      type="button"
                      disabled={updatingId === appointment.id}
                      onClick={() => deleteAppointment(appointment)}
                      className="rounded-md bg-red-800 px-3 py-2 text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingId === appointment.id
                        ? "Processing..."
                        : "Delete"}
                    </GenericButton>
                  </div>
                </td>
              </tr>
            ))}

            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No {statusFilter === "all" ? "" : `${statusFilter} `}
                  appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Appointments counts displayed */}
        <p className="mt-4 pl-4 text-sm text-slate-500">
          Showing {filteredAppointments.length === 0 ? 0 : startIndex + 1}
          {"–"}
          {Math.min(
            startIndex + appointmentsPerPage,
            filteredAppointments.length,
          )}
          {" of "}
          {filteredAppointments.length} appointments
        </p>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <GenericButton
              type="button"
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </GenericButton>

            <p className="text-sm font-medium text-slate-600">
              Page {currentPage} of {totalPages}
            </p>

            <GenericButton
              type="button"
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </GenericButton>
          </div>
        )}
      </section>

      <ActionButton />
    </main>
  );
}

export default AdminDashboard;
