import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import AuthShell from "../components/auth/AuthShell";
import AlertBanner from "../components/ui/AlertBanner";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import SectionHeading from "../components/ui/SectionHeading";
import TextField from "../components/ui/TextField";
import { ELIGIBLE_ATTACHMENT_LEVELS } from "../constants/academicLevels";
import { useAuth } from "../contexts/AuthContext";
import heroImage from "../assets/hero.png";
import { formatAuthError } from "../utils/authErrors";

const spotlightPoints = [
  "Register with your real academic details once, then manage everything from one dashboard.",
  "Keep your program, level, and profile details ready before applying for attachment.",
  "Use any valid email address that you can access reliably.",
];

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    program: "",
    level: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const validateForm = () => {
    if (!String(formData.name || "").trim()) {
      return "Full name is required.";
    }

    if (!String(formData.program || "").trim()) {
      return "Program is required.";
    }

    if (!ELIGIBLE_ATTACHMENT_LEVELS.includes(formData.level)) {
      return "Select a valid level before creating your account.";
    }

    if (String(formData.password || "").length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.program,
        formData.level,
      );

      toast.success(
        `Verification email sent to ${formData.email}. Verify your email before logging in.`,
      );
      navigate("/login", {
        replace: true,
        state: {
          verificationEmail: formData.email,
        },
      });
    } catch (registerError) {
      setError(formatAuthError(registerError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      PointIcon={CheckBadgeIcon}
      brandEyebrow="Student Registration"
      brandTitle="panaTECH Interns System"
      contentWidthClassName="max-w-2xl"
      description="Create your student account with the details that matter for industrial attachment tracking."
      headline="Create a student account and get ready to manage your attachment journey."
      imageAlt="University students preparing for attachment applications"
      imageSrc={heroImage}
      points={spotlightPoints}
      tone="light"
    >
      <SectionHeading
        description="Set up your student profile so you can discover attachment opportunities, manage applications, and stay ready from one workspace."
        eyebrow="Create your student account"
        title="Set up your profile"
        titleClassName="text-4xl sm:text-5xl"
      />

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <FormField htmlFor="register-name" label="Full Name">
            <TextField
              autoComplete="name"
              autoFocus
              id="register-name"
              name="name"
              onChange={handleChange}
              placeholder="e.g. Tariro Muchengeti"
              required
              type="text"
              value={formData.name}
            />
          </FormField>

          <FormField htmlFor="register-email" label="Email">
            <TextField
              autoComplete="email"
              id="register-email"
              name="email"
              onChange={handleChange}
              placeholder="you@example.com"
              required
              type="email"
              value={formData.email}
            />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-[1.25fr_0.75fr]">
          <FormField htmlFor="register-program" label="Program">
            <TextField
              id="register-program"
              name="program"
              onChange={handleChange}
              placeholder="BSc Honours in Business Management Systems Design and Applications"
              required
              type="text"
              value={formData.program}
            />
          </FormField>

          <FormField htmlFor="register-level" label="Level">
            <TextField
              as="select"
              id="register-level"
              name="level"
              onChange={handleChange}
              required
              value={formData.level}
            >
              <option value="">Select level</option>
              {ELIGIBLE_ATTACHMENT_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </TextField>
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField htmlFor="register-password" label="Password">
            <div className="relative">
              <TextField
                autoComplete="new-password"
                className="pr-12"
                id="register-password"
                minLength={6}
                name="password"
                onChange={handleChange}
                placeholder="Create a secure password"
                required
                type={showPassword ? "text" : "password"}
                value={formData.password}
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

          <FormField htmlFor="register-confirm-password" label="Confirm Password">
            <div className="relative">
              <TextField
                autoComplete="new-password"
                className="pr-12"
                id="register-confirm-password"
                minLength={6}
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
              />
              <button
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-3 my-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setShowConfirmPassword((current) => !current)}
                type="button"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </FormField>
        </div>

        {error && <AlertBanner tone="error">{error}</AlertBanner>}

        <Button disabled={isSubmitting} fullWidth size="lg" type="submit">
          {isSubmitting ? "Creating account..." : "Create Account"}
          {!isSubmitting && <ArrowRightIcon className="h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-semibold text-sky-700 transition hover:text-sky-800" to="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}

export default Register;
