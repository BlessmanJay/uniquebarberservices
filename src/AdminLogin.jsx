import { useState } from "react";
import { supabase } from "./services/supabase";
import ActionButton from "./components/ActionButton";
import GenericButton from "./components/GenericButton";

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  async function handleLogin(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Step 1: Sign in with Supabase Auth.
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({
          type: "error",
          text: "Invalid email or password.",
        });
        return;
      }

      // Step 2: Check whether this user is an admin.
      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();

        setMessage({
          type: "error",
          text: "You are not authorized to access the admin area.",
        });
        return;
      }

      // Step 3: The user is an authorized admin.
      setMessage({
        type: "success",
        text: "Admin login successful!",
      });
      onLoginSuccess();
    } catch (error) {
      console.error("Login error:", error);

      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto mt-16 w-full max-w-md rounded-xl border border-slate-200 p-6 shadow-lg">
      <h1 className="mb-2 text-2xl font-bold">Admin Login</h1>

      <p className="mb-6 text-sm text-slate-500">
        Sign in to manage appointments.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="mb-1 block font-medium">
            Email address
          </label>

          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 p-3"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="mb-1 block font-medium">
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 p-3"
            placeholder="Enter your password"
          />
        </div>

        {message.text && (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </p>
        )}

        <GenericButton
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-violet-700 p-3 font-semibold text-white hover:bg-violet-800 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </GenericButton>
      </form>
      <ActionButton />
    </main>
  );
}

export default AdminLogin;
