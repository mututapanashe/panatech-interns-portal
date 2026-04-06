import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import AuthShell from "../components/auth/AuthShell";
import AlertBanner from "../components/ui/AlertBanner";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import SectionHeading from "../components/ui/SectionHeading";
import TextField from "../components/ui/TextField";
import { useAuth } from "../contexts/AuthContext";
import heroImage from "../assets/hero.png";
import { formatAuthError } from "../utils/authErrors";

const benefits = [
  "Find industrial attachment opportunities faster.",
  "Track your applications in one workspace.",
  "Stay ready with a clean student profile and CV.",
];

function Login() {
  const { getDashboardPath, login, resendVerificationEmail, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  useEffect(() => {
    if (!location.state?.verificationEmail) {
      return;
    }

    setEmail(location.state.verificationEmail);
    setMessage(
      `We sent an account verification email to ${location.state.verificationEmail}.`,
    );
    setShowResendVerification(true);
  }, [location.state]);

  useEffect(() => {
    if (!location.state?.loggedOut) {
      return;
    }

    setMessage("You've been logged out.");
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setShowResendVerification(false);
    setIsSubmitting(true);

    try {
      const credential = await login(email, password, rememberMe);
      navigate(getDashboardPath(credential.user), { replace: true });
    } catch (loginError) {
      setError(formatAuthError(loginError));
      setShowResendVerification(loginError?.code === "auth/email-not-verified");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");
    setShowResendVerification(false);

    if (!email) {
      setError("Enter your email first so we know where to send the reset link.");
      return;
    }

    try {
      await resetPassword(email);
      toast.success("Password reset email sent.");
      setMessage("Check your inbox for the password reset link.");
    } catch (resetError) {
      setError(formatAuthError(resetError));
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setMessage("");
    setIsResendingVerification(true);

    try {
      const result = await resendVerificationEmail(email, password);

      if (result.alreadyVerified) {
        toast.success("Your email is already verified. You can log in now.");
        setMessage("Your email is already verified. Continue with login.");
        setShowResendVerification(false);
        return;
      }

      toast.success("Verification email sent.");
      setMessage(`A new verification email was sent to ${result.email}.`);
      setShowResendVerification(true);
    } catch (verificationError) {
      setError(formatAuthError(verificationError));
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <AuthShell
      PointIcon={CheckCircleIcon}
      brandEyebrow="Student Attachment Platform"
      brandTitle="panaTECH Interns System"
      description="Find your industrial attachment faster and track applications in one place."
      headline="Log in and continue your attachment journey."
      imageAlt="Students preparing documents for industrial attachment"
      imageSrc={heroImage}
      points={benefits}
      showDesktopShowcase={false}
      tone="dark"
    >
      <SectionHeading
        description="Access your attachment dashboard, manage applications, and stay ready for the next opportunity."
        eyebrow="Student login"
        title="Login to continue"
        titleClassName="text-4xl sm:text-5xl"
      />

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <FormField htmlFor="login-email" label="Email">
          <TextField
            autoComplete="email"
            autoFocus
            id="login-email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </FormField>

        <FormField htmlFor="login-password" label="Password">
          <div className="relative">
            <TextField
              autoComplete="current-password"
              className="pr-12"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 my-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </FormField>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3 text-sm text-slate-600">
            <input
              checked={rememberMe}
              className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              onChange={(event) => setRememberMe(event.target.checked)}
              type="checkbox"
            />
            Remember me
          </label>

          <button
            className="text-left text-sm font-semibold text-sky-700 transition hover:text-sky-800"
            onClick={handleForgotPassword}
            type="button"
          >
            Forgot password?
          </button>
        </div>

        {message && <AlertBanner tone="success">{message}</AlertBanner>}
        {error && <AlertBanner tone="error">{error}</AlertBanner>}
        {showResendVerification && (
          <div className="rounded-[24px] border border-sky-200 bg-sky-50/80 p-4">
            <p className="text-sm font-semibold text-sky-900">Need another verification email?</p>
            <p className="mt-2 text-sm leading-7 text-sky-800">
              Enter the same email and password you used to create the account, then resend the
              verification link.
            </p>
            <div className="mt-4">
              <Button
                disabled={isResendingVerification}
                onClick={handleResendVerification}
                size="sm"
                variant="secondary"
              >
                {isResendingVerification ? "Sending..." : "Resend Verification Email"}
              </Button>
            </div>
          </div>
        )}

        <Button disabled={isSubmitting} fullWidth size="lg" type="submit">
          <UserCircleIcon className="h-4.5 w-4.5" />
          {isSubmitting ? "Logging in..." : "Login"}
          {!isSubmitting && <ArrowRightIcon className="h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link className="font-semibold text-sky-700 transition hover:text-sky-800" to="/register">
          Create Account
        </Link>
      </p>
    </AuthShell>
  );
}

export default Login;
