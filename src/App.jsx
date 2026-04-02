import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthGuard from "./components/AuthGuard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";

const workspaceRoutes = new Set([
  "/dashboard",
  "/search",
  "/cv",
  "/applications",
  "/student-dashboard",
  "/admin-dashboard",
]);

function ScrollManager() {
  const { hash, pathname } = useLocation();
  const isWorkspaceRoute = workspaceRoutes.has(pathname);

  useEffect(() => {
    if (isWorkspaceRoute) {
      return;
    }

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
  }, [hash, isWorkspaceRoute, pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";
  const isWorkspaceRoute = workspaceRoutes.has(location.pathname);

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
          <Route
            path="/login"
            element={
              <AuthGuard>
                <Login />
              </AuthGuard>
            }
          />
          <Route
            path="/register"
            element={
              <AuthGuard>
                <Register />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireStudent>
                <StudentDashboard initialSection="dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute requireStudent>
                <StudentDashboard initialSection="apply" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cv"
            element={
              <ProtectedRoute requireStudent>
                <StudentDashboard initialSection="upload" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute requireStudent>
                <StudentDashboard initialSection="applications" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={<Navigate replace to="/dashboard" />}
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
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
