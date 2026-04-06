import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthGuard from "./components/AuthGuard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

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

function RouteFallback() {
  return (
    <section className="relative flex min-h-[55vh] items-center justify-center px-4 py-16 sm:px-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-7rem] top-10 h-56 w-56 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-16 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <div className="w-full max-w-lg rounded-[34px] border border-slate-200 bg-white/92 p-8 text-center shadow-[0_26px_70px_-34px_rgba(15,23,42,0.24)] backdrop-blur">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
          Loading workspace
        </p>
        <h2 className="mt-3 text-4xl leading-tight text-slate-950">Preparing your page</h2>
        <p className="mt-4 text-base leading-8 text-slate-600">
          We&apos;re loading the next screen for you.
        </p>
      </div>
    </section>
  );
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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route
              path="/"
              element={
                <AuthGuard>
                  <Home />
                </AuthGuard>
              }
            />
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
        </Suspense>
      </main>
      {!isWorkspaceRoute && <Footer />}
    </div>
  );
}

export default App;
