const authErrorMap = {
  "auth/invalid-credential": "Invalid email or password.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Invalid email or password.",
  "auth/email-already-in-use": "This email is already registered.",
  "auth/email-not-verified": "Verify your email first using the link sent to your inbox.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-disabled": "This account has been disabled. Contact the administrator.",
  "auth/operation-not-allowed":
    "Email and password sign-in is not enabled in Firebase Authentication.",
  "auth/verification-email-send-failed":
    "Your account was created, but the verification email could not be sent. Use the resend option on login.",
  "auth/popup-closed-by-user": "Sign-in popup was closed before completing login.",
  "auth/cancelled-popup-request": "Another sign-in popup is already open.",
  "auth/network-request-failed": "Network error. Check your internet connection and try again.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "permission-denied":
    "Database rules are blocking this action. Publish your Firestore rules, then try again.",
};

export const formatAuthError = (error) => {
  if (!error) return "Something went wrong. Please try again.";

  const normalized = String(error.code || "");
  if (authErrorMap[normalized]) {
    return authErrorMap[normalized];
  }

  if (String(error.message || "").includes("Authentication service is not configured")) {
    return "Authentication service is not configured. Add your Firebase keys to .env.";
  }

  if (String(error.message || "").includes("Missing or insufficient permissions")) {
    return "Database rules are blocking this action. Publish your Firestore rules, then try again.";
  }

  return String(error.message || "Something went wrong. Please try again.");
};
