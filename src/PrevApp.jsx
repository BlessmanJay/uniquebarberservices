import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import { NavContextProvider } from "./contexts/NavContext";

import Nav from "./components/Nav";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Haircuts from "./pages/Haircuts";
import Tints from "./pages/Tints";
import Shaves from "./pages/Shaves";
import Treatments from "./pages/Treatments";
import Packages from "./pages/Packages";
import Reviews from "./pages/About";
import Contact from "./pages/Contact";
import BookVisit from "./pages/BookingForm";

import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { supabase } from "./services/supabase";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdminSession() {
      try {
        // Step 1: Check for an existing Supabase session.
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        const user = data.session?.user;

        if (!user) {
          if (active) setIsAdmin(false);
          return;
        }

        // Step 2: Verify that this user is an authorized admin.
        const { data: admin, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (adminError) throw adminError;

        if (active) {
          setIsAdmin(Boolean(admin));
        }

        // Sign out authenticated users who aren't admins.
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

    // Keep the UI in sync when the session is signed out.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && active) {
        setIsAdmin(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checkingSession) {
    return <p className="p-6 text-center">Checking your session...</p>;
  }

  return (
    <BrowserRouter>
      <NavContextProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* <Route path="/admin" element={<AdminLogin />} /> */}
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="/services" element={<Services />}>
            <Route path="haircuts" element={<Haircuts />} />
            <Route path="tints" element={<Tints />} />
            <Route path="shaves" element={<Shaves />} />
            <Route path="treatments" element={<Treatments />} />
            <Route path="packages" element={<Packages />} />
          </Route>

          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-visit" element={<BookVisit />} />

          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboard onLogout={() => setIsAdmin(false)} />
              ) : (
                <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />
              )
            }
          />
        </Routes>
      </NavContextProvider>
    </BrowserRouter>
  );
}

export default App;

{
  /* Uni1que9Bless9man_$# */
}
