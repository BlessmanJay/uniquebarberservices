import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router";

import { NavContextProvider } from "./contexts/NavContext";
import { supabase } from "./services/supabase";

import Nav from "./components/Nav";

import BookingForm from "./pages/BookingForm";
import Contact from "./pages/Contact";
import Haircuts from "./pages/Haircuts";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import About from "./pages/About";
import Services from "./pages/Services";
import Shaves from "./pages/Shaves";
import Tints from "./pages/Tints";
import Treatments from "./pages/Treatments";

import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import BeardCare from "./pages/BeardCare";

function AppLayout({ isAdmin, checkingSession, setIsAdmin }) {
  const location = useLocation();

  const isAdminPage =
    location.pathname === "/admin" || location.pathname === "/dashboard";

  return (
    <NavContextProvider>
      <div className="flex min-h-screen flex-col">
        {!isAdminPage && <Nav />}

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/services" element={<Services />}>
            <Route path="haircuts" element={<Haircuts />} />
            <Route path="tints" element={<Tints />} />
            <Route path="shaves" element={<Shaves />} />
            <Route path="treatments" element={<Treatments />} />
            <Route path="beard-care" element={<BeardCare />} />
            <Route path="packages" element={<Packages />} />
          </Route>

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-visit" element={<BookingForm />} />

          {/* Admin login and dashboard */}
          <Route
            path="/admin"
            element={
              checkingSession ? (
                <p className="p-6 text-center">Checking admin session...</p>
              ) : isAdmin ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              checkingSession ? (
                <p className="p-6 text-center">Checking admin session...</p>
              ) : isAdmin ? (
                <AdminDashboard onLogout={() => setIsAdmin(false)} />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          {/* Unknown URLs return to the homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </NavContextProvider>
  );
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdminSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        const user = data.session?.user;

        if (!user) {
          if (active) setIsAdmin(false);
          return;
        }

        const { data: admin, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (adminError) throw adminError;

        if (active) setIsAdmin(Boolean(admin));

        if (!admin) {
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error("Session verification failed:", error);

        if (active) setIsAdmin(false);
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    checkAdminSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!active) return;

      if (event === "SIGNED_OUT") {
        setIsAdmin(false);
        setCheckingSession(false);
        return;
      }

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        setCheckingSession(true);

        // Run the verification after the auth callback finishes.
        setTimeout(() => {
          if (active) {
            checkAdminSession();
          }
        }, 0);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <AppLayout
        isAdmin={isAdmin}
        checkingSession={checkingSession}
        setIsAdmin={setIsAdmin}
      />
    </BrowserRouter>
  );
}

export default App;
