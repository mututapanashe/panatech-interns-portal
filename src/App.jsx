import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";

function ScrollManager() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      window.setTimeout(() => {
        const section = document.querySelector(hash);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}

function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";
  const isWorkspaceRoute =
    location.pathname === "/student-dashboard" || location.pathname === "/admin-dashboard";

  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      <ScrollManager />
      {isAuthRoute && (
        <div className="px-4 pb-1 pt-5 sm:px-6 sm:pt-6">
          <div className="mx-auto flex w-full max-w-7xl">
            <Link
              aria-label="Back to landing page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:text-orange-600"
              to="/"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
      {!isWorkspaceRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute requireAdmin>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      {!isWorkspaceRoute && <Footer />}
    </div>
  );
}

export default App;
