import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function RouteLoadingCard({ title, eyebrow, description }) {
  return (
    <section className="relative flex min-h-[55vh] items-center justify-center px-4 py-16 sm:px-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-7rem] top-10 h-56 w-56 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-16 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <div className="w-full max-w-lg rounded-[34px] border border-slate-200 bg-white/92 p-8 text-center shadow-[0_26px_70px_-34px_rgba(15,23,42,0.24)] backdrop-blur">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-4xl leading-tight text-slate-950">{title}</h2>
        <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>
      </div>
    </section>
  );
}

function ProtectedRoute({ children, requireAdmin = false, requireStudent = false }) {
  const { isAdmin, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <RouteLoadingCard
        description="We're confirming your sign-in details and loading your workspace."
        eyebrow="Checking session"
        title="Preparing your dashboard"
      />
    );
  }

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate replace to="/dashboard" />;
  }

  if (requireStudent && isAdmin) {
    return <Navigate replace to="/admin-dashboard" />;
  }

  return children;
}

export default ProtectedRoute;
