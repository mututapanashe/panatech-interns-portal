/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ELIGIBLE_ATTACHMENT_LEVELS } from "../constants/academicLevels";
import { auth, db, isFirebaseConfigured } from "../firebase/config";
import { normalizeStudentProfileFields } from "../utils/platformModels";

const AuthContext = createContext();
const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);
const allowDevAdminEmailFallback = import.meta.env.DEV && adminEmails.length > 0;
const APP_STORAGE_PREFIX = "panatech-";
const AUTH_STORAGE_PREFIXES = ["firebase:", APP_STORAGE_PREFIX];

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isConfiguredAdminEmail(email) {
  return allowDevAdminEmailFallback && adminEmails.includes(normalizeEmail(email));
}

function createAuthFlowError(message, code, extra = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, extra);
  return error;
}

function clearStoredSessionData() {
  [window.localStorage, window.sessionStorage].forEach((storage) => {
    const keysToRemove = [];

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key) {
        continue;
      }

      if (AUTH_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => storage.removeItem(key));
  });
}

function normalizeProfileShape(uid, email, source = {}, role = "student", emailVerified = false) {
  return {
    uid,
    name: String(source.name || "").trim(),
    email: normalizeEmail(source.email || email || ""),
    university: String(source.university || "").trim(),
    program: String(source.program || "").trim(),
    level: String(source.level || "").trim(),
    preferredLocation: String(source.preferredLocation || "").trim(),
    skills: Array.isArray(source.skills) ? source.skills.filter(Boolean) : [],
    interests: Array.isArray(source.interests) ? source.interests.filter(Boolean) : [],
    role,
    loginCount: Number(source.loginCount || 0),
    createdAt: source.createdAt || "",
    updatedAt: source.updatedAt || "",
    cvURL: source.cvURL || null,
    cvFileName: source.cvFileName || null,
    cvStoragePath: source.cvStoragePath || null,
    cvUploadedAt: source.cvUploadedAt || null,
    cvVersions: Array.isArray(source.cvVersions) ? source.cvVersions : [],
    emailVerified,
  };
}

function publicUserShape(firebaseUser, profile) {
  return {
    uid: firebaseUser.uid,
    email: profile.email || firebaseUser.email || "",
    displayName: profile.name || firebaseUser.displayName || "",
    name: profile.name || firebaseUser.displayName || "",
    role: profile.role || "student",
    loginCount: Number(profile.loginCount || 0),
    emailVerified: Boolean(firebaseUser.emailVerified),
  };
}

async function readAdminProfile(uid, email, emailVerified, displayName = "") {
  const adminSnapshot = await getDoc(doc(db, "admins", uid));

  if (adminSnapshot.exists()) {
    return normalizeProfileShape(uid, email, adminSnapshot.data(), "admin", emailVerified);
  }

  if (!isConfiguredAdminEmail(email)) {
    return null;
  }

  const studentSnapshot = await getDoc(doc(db, "students", uid));
  const fallbackSource = studentSnapshot.exists()
    ? studentSnapshot.data()
    : {
        name: displayName || "",
        email,
        university: "",
        program: "",
        level: "",
        loginCount: 0,
      };

  return normalizeProfileShape(uid, email, fallbackSource, "admin", emailVerified);
}

async function readStudentProfile(uid, email, displayName, emailVerified) {
  const studentRef = doc(db, "students", uid);
  const studentSnapshot = await getDoc(studentRef);

  if (!studentSnapshot.exists()) {
    const fallbackProfile = normalizeProfileShape(
      uid,
      email,
      {
        name: displayName || "",
        email,
        university: "",
        program: "",
        level: "",
        loginCount: 0,
      },
      "student",
      emailVerified,
    );

    return fallbackProfile;
  }

  return normalizeProfileShape(uid, email, studentSnapshot.data(), "student", emailVerified);
}

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const isFirebaseAvailable = Boolean(isFirebaseConfigured && auth && db);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(isFirebaseAvailable);
  const isAdmin = userRole === "admin";

  useEffect(() => {
    if (!isFirebaseAvailable) {
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      void (async () => {
        try {
          if (!currentUser) {
            setUser(null);
            setUserProfile(null);
            setUserRole(null);
            setLoading(false);
            return;
          }

          const adminProfile = await readAdminProfile(
            currentUser.uid,
            currentUser.email,
            currentUser.emailVerified,
            currentUser.displayName,
          );

          if (adminProfile) {
            setUser(publicUserShape(currentUser, adminProfile));
            setUserProfile(adminProfile);
            setUserRole("admin");
            setLoading(false);
            return;
          }

          if (!currentUser.emailVerified) {
            setUser(null);
            setUserProfile(null);
            setUserRole(null);
            setLoading(false);
            return;
          }

          const studentProfile = await readStudentProfile(
            currentUser.uid,
            currentUser.email,
            currentUser.displayName,
            currentUser.emailVerified,
          );

          setUser(publicUserShape(currentUser, studentProfile));
          setUserProfile(studentProfile);
          setUserRole("student");
          setLoading(false);
        } catch {
          setUser(null);
          setUserProfile(null);
          setUserRole(null);
          setLoading(false);
        }
      })();
    });

    return () => unsubscribe();
  }, [isFirebaseAvailable]);

  const assertEligibleLevel = (level) => {
    const normalizedLevel = String(level ?? "").trim();
    if (!ELIGIBLE_ATTACHMENT_LEVELS.includes(normalizedLevel)) {
      throw new Error(
        `Only students in levels ${ELIGIBLE_ATTACHMENT_LEVELS.join(", ")} can register.`,
      );
    }
    return normalizedLevel;
  };

  const getDashboardPath = (account = userProfile) => {
    if (!account) {
      return "/dashboard";
    }

    return account.role === "admin" ? "/admin-dashboard" : "/dashboard";
  };

  const register = async (email, password, name, program, level) => {
    if (!isFirebaseAvailable) {
      throw new Error("Firebase authentication is not configured yet.");
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedName = String(name || "").trim();
    const normalizedProgram = String(program || "").trim();
    const normalizedLevel = assertEligibleLevel(level);

    if (!normalizedName) {
      throw new Error("Full name is required.");
    }

    if (!normalizedProgram) {
      throw new Error("Program is required.");
    }

    let createdUser = null;
    let profileSaved = false;

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        String(password),
      );
      createdUser = credential.user;

      await updateProfile(createdUser, { displayName: normalizedName });

      const studentProfile = {
        name: normalizedName,
        email: normalizedEmail,
        university: "",
        program: normalizedProgram,
        level: normalizedLevel,
        preferredLocation: "",
        skills: [],
        interests: [],
        role: "student",
        loginCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cvURL: null,
        cvFileName: null,
        cvStoragePath: null,
        cvUploadedAt: null,
        cvVersions: [],
      };

      await setDoc(doc(db, "students", createdUser.uid), studentProfile);
      profileSaved = true;

      await sendEmailVerification(createdUser);
      await signOut(auth);

      return {
        user: {
          uid: createdUser.uid,
          email: normalizedEmail,
          name: normalizedName,
          requiresEmailVerification: true,
        },
      };
    } catch (error) {
      if (createdUser && !profileSaved) {
        try {
          await deleteUser(createdUser);
        } catch {
          // Ignore cleanup failures and surface the original error.
        }
      }

      if (createdUser && auth.currentUser?.uid === createdUser.uid) {
        try {
          await signOut(auth);
        } catch {
          // Ignore sign-out cleanup failures and surface the original error.
        }
      }

      if (createdUser && profileSaved) {
        throw createAuthFlowError(
          "Your account was created, but we could not send the verification email. Use the resend option on login.",
          "auth/verification-email-send-failed",
        );
      }

      throw error;
    }
  };

  const login = async (email, password, rememberSession = true) => {
    if (!isFirebaseAvailable) {
      throw new Error("Firebase authentication is not configured yet.");
    }

    await setPersistence(
      auth,
      rememberSession ? browserLocalPersistence : browserSessionPersistence,
    );

    const normalizedEmail = normalizeEmail(email);
    const credential = await signInWithEmailAndPassword(auth, normalizedEmail, String(password));
    await credential.user.reload();

    const activeUser = auth.currentUser || credential.user;
    const adminProfile = await readAdminProfile(
      activeUser.uid,
      activeUser.email,
      activeUser.emailVerified,
      activeUser.displayName,
    );

    if (adminProfile) {
      setUser(publicUserShape(activeUser, adminProfile));
      setUserProfile(adminProfile);
      setUserRole("admin");
      return { user: publicUserShape(activeUser, adminProfile) };
    }

    if (!activeUser.emailVerified) {
      await signOut(auth);
      throw createAuthFlowError(
        "Verify your email first using the link sent to your inbox.",
        "auth/email-not-verified",
        {
          email: normalizedEmail,
        },
      );
    }

    const studentProfile = await readStudentProfile(
      activeUser.uid,
      activeUser.email,
      activeUser.displayName,
      activeUser.emailVerified,
    );

    const nextProfile = {
      ...studentProfile,
      loginCount: Number(studentProfile.loginCount || 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "students", activeUser.uid), nextProfile, { merge: true });

    setUser(publicUserShape(activeUser, nextProfile));
    setUserProfile(nextProfile);
    setUserRole("student");
    return { user: publicUserShape(activeUser, nextProfile) };
  };

  const resendVerificationEmail = async (email, password) => {
    if (!isFirebaseAvailable) {
      throw new Error("Firebase authentication is not configured yet.");
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPassword = String(password || "");

    if (!normalizedEmail) {
      throw new Error("Enter your email first.");
    }

    if (!normalizedPassword) {
      throw new Error("Enter your password first so we can resend the verification email.");
    }

    let verificationUser = null;

    try {
      await setPersistence(auth, browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, normalizedPassword);
      verificationUser = credential.user;
      await verificationUser.reload();

      if (verificationUser.emailVerified) {
        return {
          alreadyVerified: true,
          email: normalizedEmail,
        };
      }

      await sendEmailVerification(verificationUser);

      return {
        alreadyVerified: false,
        email: normalizedEmail,
      };
    } finally {
      if (verificationUser && auth.currentUser?.uid === verificationUser.uid) {
        try {
          await signOut(auth);
        } catch {
          // Ignore cleanup failures after verification resend.
        }
      }
    }
  };

  const saveStudentProfile = async (profileInput = {}) => {
    if (!isFirebaseAvailable || !auth.currentUser) {
      throw new Error("You must be signed in to update your profile.");
    }

    const currentUser = auth.currentUser;
    const currentProfile = await readStudentProfile(
      currentUser.uid,
      currentUser.email,
      currentUser.displayName,
      currentUser.emailVerified,
    );

    const nextProfile = {
      ...normalizeStudentProfileFields(profileInput, currentProfile),
      level: profileInput.level
        ? assertEligibleLevel(profileInput.level)
        : String(currentProfile.level ?? "").trim(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "students", currentUser.uid), nextProfile, { merge: true });

    if (nextProfile.name && currentUser.displayName !== nextProfile.name) {
      await updateProfile(currentUser, { displayName: nextProfile.name });
    }

    setUser(publicUserShape(currentUser, nextProfile));
    setUserProfile(nextProfile);
    setUserRole("student");
    return nextProfile;
  };

  const logout = async () => {
    try {
      if (isFirebaseAvailable) {
        await signOut(auth);
      }
    } finally {
      clearStoredSessionData();
      setUser(null);
      setUserProfile(null);
      setUserRole(null);
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    if (!isFirebaseAvailable) {
      throw new Error("Firebase authentication is not configured yet.");
    }

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      throw new Error("Enter your email first.");
    }

    await sendPasswordResetEmail(auth, normalizedEmail);
  };

  const value = {
    user,
    userProfile,
    userRole,
    isAdmin,
    isAuthenticated: Boolean(user),
    loading,
    isFirebaseAvailable,
    register,
    login,
    resendVerificationEmail,
    logout,
    resetPassword,
    saveStudentProfile,
    getDashboardPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
