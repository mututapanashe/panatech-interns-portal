import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowTrendingUpIcon,
  BookmarkIcon,
  BoltIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
  CheckBadgeIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  EyeIcon,
  HomeIcon,
  MapPinIcon,
  SparklesIcon,
  TrashIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import AdminTable from "../components/dashboard/AdminTable";
import DashboardCard from "../components/dashboard/DashboardCard";
import DocumentPreviewModal from "../components/dashboard/DocumentPreviewModal";
import MobileBottomNav from "../components/dashboard/MobileBottomNav";
import Sidebar from "../components/dashboard/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import FilterPanel from "../components/student/FilterPanel";
import SearchBar from "../components/student/SearchBar";
import VacancyCard from "../components/student/VacancyCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import FormField from "../components/ui/FormField";
import StatusBadge from "../components/ui/StatusBadge";
import TextField from "../components/ui/TextField";
import { ELIGIBLE_ATTACHMENT_LEVELS } from "../constants/academicLevels";
import { useAuth } from "../contexts/AuthContext";
import {
  generateStudentAiInsight,
  rewriteStudentCvSection,
} from "../services/aiInsights";
import {
  createApplicationFromVacancy,
  getStudentCvViewUrl,
  removeStudentCv,
  subscribeToStudentApplications,
  subscribeToVacancies,
  uploadStudentCv,
} from "../services/platformData";
import {
  buildCvRewriteFallback,
  buildStudentFallbackInsight,
} from "../utils/aiFallbacks";
import {
  getVacancyApplicationMeta,
  joinTextList,
  normalizeTextList,
} from "../utils/platformModels";
import { calculateProfileCompletion, rankVacanciesForStudent } from "../utils/vacancyMatching";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: HomeIcon },
  { id: "apply", label: "Find Attachment Opportunities", icon: BriefcaseIcon },
  { id: "saved", label: "Saved Opportunities", icon: BookmarkIcon },
  { id: "applications", label: "My Applications", icon: ClipboardDocumentListIcon },
  { id: "upload", label: "CV Workspace", icon: DocumentTextIcon },
  { id: "analysis", label: "AI CV Analysis", icon: SparklesIcon },
  { id: "status", label: "Application Status", icon: ChartBarIcon },
  { id: "profile", label: "Profile", icon: UserCircleIcon },
  { id: "logout", label: "Logout", icon: ArrowLeftStartOnRectangleIcon },
];

const mobileBottomNavItems = [
  { id: "dashboard", label: "Home", icon: HomeIcon },
  { id: "apply", label: "Search", icon: BriefcaseIcon },
  { id: "upload", label: "CV", icon: DocumentTextIcon },
  { id: "applications", label: "Applications", icon: ClipboardDocumentListIcon },
];

const fallbackVacancies = [
  {
    id: "op-1",
    companyName: "Harare Tech Solutions",
    vacancyTitle: "Business Systems Attachment",
    category: "Business Management Systems Design and Applications",
    requiredSkills: ["Systems Analysis", "Excel", "Documentation"],
    tags: ["analysis", "reporting", "operations"],
    location: "Harare",
    vacancyType: "On-site",
    status: "Open",
    deadline: "2026-04-05",
    description: "Support systems design, process mapping, and student-facing reporting workflows.",
    applicationMethod: "portal",
    applicationInstructions: "Apply directly through the platform with your CV ready.",
    requiredDocuments: ["CV", "Attachment letter"],
  },
  {
    id: "op-2",
    companyName: "Mutare Digital Hub",
    vacancyTitle: "ICT Support Attachment",
    category: "Computer Science",
    requiredSkills: ["Networking", "IT Support", "Documentation"],
    tags: ["support", "helpdesk", "hardware"],
    location: "Mutare",
    vacancyType: "Hybrid",
    status: "Open",
    deadline: "2026-04-12",
    description: "Assist with service desk operations, hardware support, and documentation.",
    applicationMethod: "email",
    applicationEmail: "careers@mutaredigitalhub.co.zw",
    applicationInstructions:
      "Send your CV, attachment letter, and a short motivation email to the recruitment desk.",
    requiredDocuments: ["CV", "Attachment letter", "Academic transcript"],
  },
  {
    id: "op-3",
    companyName: "Bulawayo Enterprise Group",
    vacancyTitle: "Operations and Data Assistant",
    category: "Information Systems",
    requiredSkills: ["Excel", "Data Entry", "Reporting"],
    tags: ["operations", "data", "admin"],
    location: "Bulawayo",
    vacancyType: "On-site",
    status: "Open",
    deadline: "2026-04-18",
    description: "Help with operational reporting, data cleanup, and internal office support.",
    applicationMethod: "external",
    applicationLink: "https://careers.example.com/bulawayo-enterprise-group/operations-data-assistant",
    applicationInstructions:
      "Complete the company application form and upload the requested supporting documents.",
    requiredDocuments: ["CV", "Cover letter"],
  },
];

const fallbackApplications = [
  {
    id: "sample-1",
    vacancyId: "op-1",
    company: "PanAfrica Systems",
    position: "Business Systems Attachment",
    applicationMethod: "portal",
    status: "Under Review",
    dateApplied: "2026-03-18T08:00:00.000Z",
  },
  {
    id: "sample-2",
    vacancyId: "op-2",
    company: "TechBridge Zimbabwe",
    position: "ICT Support Attachment",
    applicationMethod: "email",
    status: "Accepted",
    dateApplied: "2026-03-12T08:00:00.000Z",
  },
];

function sortApplications(items) {
  return [...items].sort((left, right) =>
    String(right.dateApplied || "").localeCompare(String(left.dateApplied || "")),
  );
}

function formatDate(value) {
  if (!value) {
    return "Today";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Today";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function firstNameFrom(fullName) {
  const trimmedName = String(fullName || "").trim();
  return trimmedName ? trimmedName.split(/\s+/)[0] : "Student";
}

function buildRecommendedSubjectLine(vacancy, studentName) {
  const role = vacancy?.vacancyTitle || vacancy?.position || "Attachment Application";
  return `Application for ${role} - ${studentName}`;
}

function getRequiredDocuments(vacancy) {
  const documents = normalizeTextList(vacancy?.requiredDocuments);
  return documents.length ? documents : ["CV"];
}

function createEmptyProfile() {
  return {
    name: "",
    email: "",
    university: "",
    program: "",
    level: "",
    preferredLocation: "",
    skills: [],
    interests: [],
    loginCount: 0,
    createdAt: "",
    cvURL: null,
    cvFileName: null,
    cvStoragePath: null,
    cvUploadedAt: null,
    cvVersions: [],
  };
}

function buildEditForm(profile = {}) {
  return {
    ...createEmptyProfile(),
    ...profile,
    skillsText: joinTextList(profile.skills),
    interestsText: joinTextList(profile.interests),
  };
}

function buildCvVersionRecord(payload = {}, options = {}) {
  return {
    id: payload.cvStoragePath || `${payload.cvFileName || "cv"}-${payload.cvUploadedAt || Date.now()}`,
    fileName: payload.cvFileName || "Student CV",
    uploadedAt: payload.cvUploadedAt || new Date().toISOString(),
    url: payload.cvURL || "",
    storagePath: payload.cvStoragePath || "",
    isCurrent: Boolean(options.isCurrent),
  };
}

const applicationColumns = [
  { key: "company", label: "Company Name" },
  { key: "position", label: "Position Applied" },
  {
    key: "applicationMethod",
    label: "Apply Method",
    render: (value, row) => {
      const applicationMeta = getVacancyApplicationMeta(value || row);
      return <StatusBadge tone={applicationMeta.badgeLabel}>{applicationMeta.badgeLabel}</StatusBadge>;
    },
  },
  {
    key: "status",
    label: "Status",
    render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
  },
  {
    key: "dateApplied",
    label: "Date Applied",
    render: (value) => formatDate(value),
  },
];

function StudentDashboard() {
  const { user, userProfile, logout, saveStudentProfile, isFirebaseAvailable } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const sectionScrollPositionsRef = useRef({ dashboard: 0 });
  const visitedSectionsRef = useRef(new Set(["dashboard"]));
  const previousSectionRef = useRef("dashboard");

  const storageScope = user?.uid || user?.email || "student-preview";
  const profileStorageKey = `panatech-${storageScope}-profile`;
  const applicationsStorageKey = `panatech-${storageScope}-applications`;
  const cvStorageKey = `panatech-${storageScope}-cv`;
  const savedStorageKey = `panatech-${storageScope}-saved-opportunities`;

  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    category: "",
    location: "",
    skill: "",
    type: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [profileState, setProfileState] = useState(createEmptyProfile());
  const [editForm, setEditForm] = useState(buildEditForm());
  const [applications, setApplications] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [activeApplicationId, setActiveApplicationId] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiInsight, setAiInsight] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [cvRewriteInput, setCvRewriteInput] = useState("");
  const [cvRewriteFocus, setCvRewriteFocus] = useState("");
  const [cvRewriteResult, setCvRewriteResult] = useState(null);
  const [isRewritingCv, setIsRewritingCv] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [cvPreview, setCvPreview] = useState({
    isOpen: false,
    url: "",
    fileName: "",
    generatedUrl: false,
  });

  useEffect(() => {
    const previousSection = previousSectionRef.current;

    if (previousSection !== activeSection) {
      sectionScrollPositionsRef.current[previousSection] = window.scrollY;
    }

    const targetScroll = visitedSectionsRef.current.has(activeSection)
      ? sectionScrollPositionsRef.current[activeSection] ?? 0
      : 0;

    visitedSectionsRef.current.add(activeSection);
    previousSectionRef.current = activeSection;

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: targetScroll, behavior: "auto" });
    });
  }, [activeSection]);

  useEffect(() => {
    if (user && isFirebaseAvailable) {
      const nextProfile = {
        ...createEmptyProfile(),
        name: userProfile?.name || user?.displayName || "",
        email: userProfile?.email || user?.email || "",
        university: userProfile?.university || "",
        program: userProfile?.program || "",
        level: userProfile?.level || "",
        preferredLocation: userProfile?.preferredLocation || "",
        skills: Array.isArray(userProfile?.skills) ? userProfile.skills : [],
        interests: Array.isArray(userProfile?.interests) ? userProfile.interests : [],
        loginCount: Number(userProfile?.loginCount || 0),
        createdAt: userProfile?.createdAt || new Date().toISOString(),
        cvURL: userProfile?.cvURL || null,
        cvFileName: userProfile?.cvFileName || null,
        cvStoragePath: userProfile?.cvStoragePath || null,
        cvUploadedAt: userProfile?.cvUploadedAt || null,
        cvVersions: Array.isArray(userProfile?.cvVersions) ? userProfile.cvVersions : [],
      };

      setProfileState(nextProfile);
      setEditForm(buildEditForm(nextProfile));
      return;
    }

    const storedProfile = window.localStorage.getItem(profileStorageKey);
    if (storedProfile) {
      const nextProfile = { ...createEmptyProfile(), ...JSON.parse(storedProfile) };
      setProfileState(nextProfile);
      setEditForm(buildEditForm(nextProfile));
    }
  }, [isFirebaseAvailable, profileStorageKey, user, userProfile]);

  useEffect(() => {
    if (user && isFirebaseAvailable) {
      const unsubscribeApplications = subscribeToStudentApplications(
        user.uid,
        setApplications,
        (error) => {
          console.error("Unable to read student applications:", error);
          setApplications([]);
        },
      );
      const unsubscribeVacancies = subscribeToVacancies((items) => {
        setVacancies(items.filter((item) => item.status !== "Closed"));
      }, (error) => {
        console.error("Unable to read vacancies:", error);
        setVacancies([]);
      });

      return () => {
        unsubscribeApplications();
        unsubscribeVacancies();
      };
    }

    const storedApplications = window.localStorage.getItem(applicationsStorageKey);
    const storedCvRecord = window.localStorage.getItem(cvStorageKey);

    setApplications(storedApplications ? JSON.parse(storedApplications) : fallbackApplications);
    setVacancies(fallbackVacancies);

    if (storedCvRecord) {
      const cvRecord = JSON.parse(storedCvRecord);
      setProfileState((current) => ({
        ...current,
        cvURL: cvRecord.url || current.cvURL || null,
        cvFileName: cvRecord.fileName,
        cvUploadedAt: cvRecord.uploadedAt,
      }));
    }

    return undefined;
  }, [applicationsStorageKey, cvStorageKey, isFirebaseAvailable, user]);

  useEffect(() => {
    const storedSavedOpportunities = window.localStorage.getItem(savedStorageKey);
    setSavedOpportunities(
      storedSavedOpportunities ? JSON.parse(storedSavedOpportunities) : [],
    );
  }, [savedStorageKey]);

  const studentName =
    profileState?.name?.trim() ||
    userProfile?.name?.trim() ||
    user?.displayName?.trim() ||
    user?.email?.trim() ||
    "Student";
  const studentFirstName = firstNameFrom(studentName);
  const studentEmail = profileState?.email || user?.email || "Not available";
  const hasLoggedInBefore = Number(profileState?.loginCount || userProfile?.loginCount || 0) > 1;
  const welcomeTitle = hasLoggedInBefore
    ? `Welcome back, ${studentFirstName}`
    : `Welcome, ${studentFirstName}`;
  const cvRecord = useMemo(
    () =>
      profileState?.cvFileName
        ? {
            fileName: profileState.cvFileName,
            uploadedAt: profileState.cvUploadedAt,
            url: profileState.cvURL,
            storagePath: profileState.cvStoragePath,
          }
        : null,
    [
      profileState?.cvFileName,
      profileState?.cvStoragePath,
      profileState?.cvUploadedAt,
      profileState?.cvURL,
    ],
  );

  const profileCompletion = useMemo(
    () => calculateProfileCompletion(profileState, Boolean(cvRecord?.url)),
    [cvRecord?.url, profileState],
  );

  const rankedVacancies = useMemo(
    () => rankVacanciesForStudent(profileState, vacancies),
    [profileState, vacancies],
  );

  const recommendedVacancies = useMemo(
    () => rankedVacancies.filter((item) => item.match.recommended).slice(0, 6),
    [rankedVacancies],
  );

  const searchOptions = useMemo(
    () => ({
      categories: [...new Set(rankedVacancies.map((item) => item.category).filter(Boolean))].sort(),
      locations: [...new Set(rankedVacancies.map((item) => item.location).filter(Boolean))].sort(),
      skills: [
        ...new Set(
          rankedVacancies.flatMap((item) => [
            ...normalizeTextList(item.requiredSkills),
            ...normalizeTextList(item.tags),
          ]),
        ),
      ].sort(),
      types: [...new Set(rankedVacancies.map((item) => item.vacancyType || "On-site"))].sort(),
    }),
    [rankedVacancies],
  );

  const filteredVacancies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rankedVacancies.filter((vacancy) => {
      const searchableText = [
        vacancy.companyName,
        vacancy.vacancyTitle,
        vacancy.description,
        vacancy.category,
        joinTextList(vacancy.requiredSkills),
        joinTextList(vacancy.tags),
      ]
        .join(" ")
        .toLowerCase();

      if (query && !searchableText.includes(query)) {
        return false;
      }

      if (searchFilters.category && vacancy.category !== searchFilters.category) {
        return false;
      }

      if (searchFilters.location && vacancy.location !== searchFilters.location) {
        return false;
      }

      if (
        searchFilters.skill &&
        ![...normalizeTextList(vacancy.requiredSkills), ...normalizeTextList(vacancy.tags)].some(
          (item) => item.toLowerCase() === searchFilters.skill.toLowerCase(),
        )
      ) {
        return false;
      }

      if (searchFilters.type && (vacancy.vacancyType || "On-site") !== searchFilters.type) {
        return false;
      }

      return true;
    });
  }, [rankedVacancies, searchFilters, searchQuery]);

  const filteredRecommendedVacancies = useMemo(
    () => filteredVacancies.filter((item) => item.match.recommended).slice(0, 6),
    [filteredVacancies],
  );

  const cvAnalysis = useMemo(() => {
    const checks = [
      {
        label: "CV uploaded as PDF",
        complete: Boolean(cvRecord?.url),
      },
      {
        label: "Full profile name added",
        complete: Boolean(profileState?.name),
      },
      {
        label: "Program added",
        complete: Boolean(profileState?.program),
      },
      {
        label: "Eligible level selected",
        complete: ELIGIBLE_ATTACHMENT_LEVELS.includes(profileState?.level || ""),
      },
      {
        label: "Preferred location added",
        complete: Boolean(profileState?.preferredLocation),
      },
      {
        label: "Skills added",
        complete: normalizeTextList(profileState?.skills).length > 0,
      },
      {
        label: "University added",
        complete: Boolean(profileState?.university),
      },
      {
        label: "Target opportunities shortlisted",
        complete: savedOpportunities.length > 0 || applications.length > 0,
      },
    ];

    const completedChecks = checks.filter((item) => item.complete).length;
    const score = Math.round((completedChecks / checks.length) * 100);
    const readinessLabel =
      score >= 85 ? "Ready" : score >= 65 ? "On track" : score >= 45 ? "Building" : "Getting started";

    const recommendations = [];

    if (!cvRecord?.url) {
      recommendations.push("Upload your CV as a PDF so employers can review it easily.");
    }

    if (!profileState?.university) {
      recommendations.push("Add your university so your profile feels complete to reviewers.");
    }

    if (!profileState?.preferredLocation) {
      recommendations.push("Set your preferred location so more relevant city-based opportunities appear first.");
    }

    if (normalizeTextList(profileState?.skills).length === 0) {
      recommendations.push("Add your key skills so the right opportunities are easier to discover.");
    }

    if (!savedOpportunities.length && !applications.length) {
      recommendations.push("Save a few opportunities first, then apply to the best matches.");
    }

    if (applications.some((item) => item.status === "Rejected")) {
      recommendations.push("Review rejected applications and tailor your next CV/application set.");
    }

    if (!recommendations.length) {
      recommendations.push("Your profile looks ready. Keep applying to relevant opportunities.");
    }

    return {
      checks,
      recommendations,
      readinessLabel,
      score,
    };
  }, [applications, cvRecord, profileState, savedOpportunities]);

  const summary = useMemo(
    () => ({
      submitted: applications.length,
      review: applications.filter((item) => item.status === "Under Review").length,
      accepted: applications.filter((item) => item.status === "Accepted").length,
      rejected: applications.filter((item) => item.status === "Rejected").length,
    }),
    [applications],
  );

  const summaryCards = useMemo(
    () => [
      {
        label: "Applications Submitted",
        value: summary.submitted,
        note: "Vacancies you have already moved into your attachment pipeline.",
        accent: "orange",
        badge: "01",
      },
      {
        label: "Under Review",
        value: summary.review,
        note: "Applications waiting for a company decision.",
        accent: "blue",
        badge: "02",
      },
      {
        label: "Accepted",
        value: summary.accepted,
        note: "Successful applications already moving forward.",
        accent: "emerald",
        badge: "03",
      },
      {
        label: "Rejected",
        value: summary.rejected,
        note: "Applications that need a stronger next attempt.",
        accent: "slate",
        badge: "04",
      },
    ],
    [summary.accepted, summary.rejected, summary.review, summary.submitted],
  );

  const spotlightTiles = [
      {
        label: "Program",
        value: profileState?.program || "Add your program details",
        icon: AcademicCapIcon,
        tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "Current Level",
      value: profileState?.level || "Select your level",
      icon: ArrowTrendingUpIcon,
      tone: "bg-orange-50 text-orange-700",
    },
    {
      label: "Profile Updated",
      value: formatDate(profileState?.createdAt || new Date().toISOString()),
      icon: CalendarDaysIcon,
      tone: "bg-slate-100 text-slate-700",
    },
      {
        label: "CV Status",
        value: cvRecord ? "Portfolio ready" : "Upload your CV",
        icon: CheckBadgeIcon,
        tone: "bg-emerald-50 text-emerald-700",
      },
      {
        label: "Preferred Location",
        value: profileState?.preferredLocation || "Set your preferred city",
        icon: MapPinIcon,
        tone: "bg-violet-50 text-violet-700",
      },
    ];

  const roadmapSteps = [
    {
      title: cvRecord ? "CV uploaded" : "Upload your CV",
      copy: cvRecord
        ? "Your document is in place and ready for attachment applications."
        : "Upload a clean PDF CV so your applications are ready to send.",
      done: Boolean(cvRecord),
    },
    {
      title: savedOpportunities.length ? "Opportunities shortlisted" : "Save relevant opportunities",
      copy: savedOpportunities.length
        ? `${savedOpportunities.length} vacancies are already saved for later review.`
        : "Build a shortlist before you apply so your decisions stay focused.",
      done: Boolean(savedOpportunities.length),
    },
    {
      title: normalizeTextList(profileState?.skills).length ? "Skills profile completed" : "Add your skills",
      copy: normalizeTextList(profileState?.skills).length
        ? "Your skills are now helping the system prioritize stronger recommendations."
        : "Add core tools and competencies so your best-fit opportunities rise first.",
      done: normalizeTextList(profileState?.skills).length > 0,
    },
    {
      title: summary.submitted ? "Applications submitted" : "Submit your first application",
      copy: summary.submitted
        ? `${summary.submitted} applications already exist in your attachment pipeline.`
        : "Use the apply flow to move the right vacancy into your application pipeline.",
      done: Boolean(summary.submitted),
    },
  ];

  const quickActionCards = [
    {
      title: "CV Workspace",
      copy: "Keep your CV current and ready before the next shortlist window opens.",
      action: () => setActiveSection("upload"),
      label: "Open CV Workspace",
      icon: DocumentTextIcon,
      tone: "from-orange-50 to-white",
    },
    {
      title: "Best Matches",
      copy: "Review recommended placements first, then browse the full vacancy board.",
      action: () => setActiveSection("apply"),
      label: "Open Opportunities",
      icon: BriefcaseIcon,
      tone: "from-sky-50 to-white",
    },
    {
      title: "Refine With AI",
      copy: "Use AI review and CV rewriting before your next application.",
      action: () => setActiveSection("analysis"),
      label: "Open AI Studio",
      icon: SparklesIcon,
      tone: "from-slate-100 to-white",
    },
  ];

  const featuredVacancy = recommendedVacancies[0] || rankedVacancies[0] || null;

  const profileTiles = [
    {
      label: "University",
      value: profileState?.university || "Add your university",
    },
    {
      label: "Program",
      value: profileState?.program || "Add your program",
    },
    {
      label: "Level",
      value: profileState?.level || "Select level",
    },
    {
      label: "Skills",
      value: normalizeTextList(profileState?.skills).length
        ? `${normalizeTextList(profileState.skills).length} added`
        : "Add your skills",
    },
    {
      label: "Preferred Location",
      value: profileState?.preferredLocation || "Set your location preference",
    },
    {
      label: "CV Status",
      value: cvRecord ? "Ready to send" : "Not uploaded",
    },
    {
      label: "Saved Opportunities",
      value: savedOpportunities.length ? `${savedOpportunities.length} saved` : "Nothing saved yet",
    },
    {
      label: "Profile Completion",
      value: `${profileCompletion.percentage}% complete`,
    },
  ];

  const persistSavedOpportunities = (items) => {
    setSavedOpportunities(items);
    window.localStorage.setItem(savedStorageKey, JSON.stringify(items));
  };

  const closeCvPreview = () => {
    setCvPreview({
      isOpen: false,
      url: "",
      fileName: "",
      generatedUrl: false,
    });
  };

  const aiPayload = useMemo(
    () => ({
      studentName,
      firstName: studentFirstName,
      email: studentEmail,
      university: profileState?.university || "",
      program: profileState?.program || "",
      level: profileState?.level || "",
      preferredLocation: profileState?.preferredLocation || "",
      skills: normalizeTextList(profileState?.skills),
      interests: normalizeTextList(profileState?.interests),
      readinessScore: cvAnalysis.score,
      readinessLabel: cvAnalysis.readinessLabel,
      hasCv: Boolean(cvRecord?.url),
      cvFileName: cvRecord?.fileName || "",
      savedOpportunities: savedOpportunities.slice(0, 5).map((item) => ({
        companyName: item.companyName,
        vacancyTitle: item.vacancyTitle,
        location: item.location,
        deadline: item.deadline,
      })),
      recentApplications: applications.slice(0, 5).map((item) => ({
        company: item.company,
        position: item.position,
        status: item.status,
        dateApplied: item.dateApplied,
      })),
      statusSummary: summary,
      focusQuestion: aiQuestion,
    }),
    [
      aiQuestion,
      applications,
      cvAnalysis.readinessLabel,
      cvAnalysis.score,
      cvRecord?.fileName,
      cvRecord?.url,
      profileState?.interests,
      profileState?.level,
      profileState?.preferredLocation,
      profileState?.program,
      profileState?.skills,
      profileState?.university,
      savedOpportunities,
      studentEmail,
      studentFirstName,
      studentName,
      summary,
    ],
  );

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const downloadPreviewDocument = () => {
    if (!cvPreview.url) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = cvPreview.url;
    anchor.download = cvPreview.fileName || "student-cv.pdf";
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const selectSection = async (sectionId) => {
    setSidebarOpen(false);

    if (sectionId === "logout") {
      await handleLogout();
      return;
    }

    setActiveSection(sectionId);
  };

  const handleMobileNavSelect = (sectionId) => {
    setSidebarOpen(false);
    setShowFilters(false);

    if (sectionId === "dashboard") {
      sectionScrollPositionsRef.current.dashboard = 0;
    }

    if (activeSection === sectionId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setActiveSection(sectionId);
  };

  const handleSaveOpportunity = (vacancy) => {
    const alreadySaved = savedOpportunities.some((item) => item.id === vacancy.id);
    const nextSavedOpportunities = alreadySaved
      ? savedOpportunities.filter((item) => item.id !== vacancy.id)
      : [
          {
            id: vacancy.id,
            companyName: vacancy.companyName || vacancy.company,
            vacancyTitle: vacancy.vacancyTitle || vacancy.position,
            category: vacancy.category || "",
            location: vacancy.location || "Zimbabwe",
            status: vacancy.status || "Open",
            deadline: vacancy.deadline || "",
            description: vacancy.description || "",
            requiredSkills: vacancy.requiredSkills || [],
            requiredDocuments: vacancy.requiredDocuments || [],
            tags: vacancy.tags || [],
            applicationMethod: vacancy.applicationMethod || "portal",
            applicationEmail: vacancy.applicationEmail || "",
            applicationLink: vacancy.applicationLink || "",
            applicationInstructions: vacancy.applicationInstructions || "",
            match: vacancy.match || null,
          },
          ...savedOpportunities,
        ];

    persistSavedOpportunities(nextSavedOpportunities);
  };

  const hasAppliedToVacancy = (vacancyId) =>
    applications.some((item) => item.vacancyId === vacancyId || item.id === vacancyId);

  const opportunityPreviewColumns = [
    { key: "companyName", label: "Company" },
    { key: "vacancyTitle", label: "Opportunity" },
    { key: "category", label: "Category" },
    {
      key: "applicationMethod",
      label: "Apply Method",
      render: (value, vacancy) => {
        const applicationMeta = getVacancyApplicationMeta(vacancy || value);
        return <StatusBadge tone={applicationMeta.badgeLabel}>{applicationMeta.badgeLabel}</StatusBadge>;
      },
    },
    { key: "location", label: "Location" },
    {
      key: "deadline",
      label: "Deadline",
      render: (value) => formatDate(value),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value || "Open"}>{value || "Open"}</StatusBadge>,
    },
    {
      key: "match",
      label: "Match",
      render: (value) => {
        if (!value?.recommended) {
          return <span className="text-slate-500">Browse</span>;
        }

        return (
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="accepted">{`${value.score}% match`}</StatusBadge>
            {value.reasons?.slice(0, 1).map((item) => (
              <StatusBadge key={item} tone="submitted">
                {item}
              </StatusBadge>
            ))}
          </div>
        );
      },
    },
    {
      key: "id",
      label: "Action",
      render: (_, vacancy) => {
        const alreadyApplied = hasAppliedToVacancy(vacancy.id);
        const isSaved = savedOpportunities.some((item) => item.id === vacancy.id);
        const applicationMeta = getVacancyApplicationMeta(vacancy);

        return (
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={alreadyApplied}
              onClick={() => setSelectedVacancy(vacancy)}
              size="sm"
              variant={alreadyApplied ? "secondary" : "primary"}
            >
              {alreadyApplied ? "Applied" : applicationMeta.actionLabel}
            </Button>
            <Button
              onClick={() => handleSaveOpportunity(vacancy)}
              size="sm"
              variant={isSaved ? "dark" : "secondary"}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        );
      },
    },
  ];

  const persistApplicationRecord = async (vacancy, nextStatus, submittedExternally = false) => {
    setActiveApplicationId(vacancy.id);

    try {
      if (user && isFirebaseAvailable) {
        const createdApplication = await createApplicationFromVacancy({
          student: {
            uid: user.uid,
            name: profileState.name || studentName,
            email: studentEmail,
            program: profileState.program,
            skills: normalizeTextList(profileState.skills),
            level: profileState.level,
            preferredLocation: profileState.preferredLocation,
            university: profileState.university || "Zimbabwean University Student",
          },
          vacancy,
          status: nextStatus,
          submittedExternally,
        });
        setApplications((current) =>
          sortApplications([
            {
              id: createdApplication.id,
              vacancyId: createdApplication.vacancyId,
              company: createdApplication.companyApplied || createdApplication.company,
              position: createdApplication.position,
              status: createdApplication.status,
              applicationMethod: createdApplication.applicationMethod,
              dateApplied: createdApplication.dateApplied,
            },
            ...current.filter((item) => item.id !== createdApplication.id),
          ]),
        );
      } else {
        if (hasAppliedToVacancy(vacancy.id)) {
          throw new Error("You already applied for this attachment vacancy.");
        }

        const nextApplications = [
          {
            id: `local-${vacancy.id}`,
            vacancyId: vacancy.id,
            company: vacancy.companyName || vacancy.company,
            position: vacancy.vacancyTitle || vacancy.position,
            status: nextStatus,
            applicationMethod: vacancy.applicationMethod || "portal",
            dateApplied: new Date().toISOString(),
          },
          ...applications,
        ];

        const sortedLocalApplications = sortApplications(nextApplications);
        setApplications(sortedLocalApplications);
        window.localStorage.setItem(applicationsStorageKey, JSON.stringify(sortedLocalApplications));
      }

      persistSavedOpportunities(savedOpportunities.filter((item) => item.id !== vacancy.id));
      setSelectedVacancy(null);
      setActiveSection("applications");
    } catch (submitError) {
      toast.error(
        submitError?.message === "You already applied for this attachment vacancy."
          ? submitError.message
          : "We could not submit your application right now.",
      );
    } finally {
      setActiveApplicationId("");
    }
  };

  const handleApply = async (vacancy) => {
    await persistApplicationRecord(vacancy, "Submitted");
  };

  const handleMarkApplied = async (vacancy) => {
    await persistApplicationRecord(vacancy, "Applied - Awaiting Response", true);
  };

  const handleUploadCV = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingCv(true);

    try {
      const isPdfFile =
        file.type === "application/pdf" || String(file.name || "").toLowerCase().endsWith(".pdf");

      if (!isPdfFile) {
        throw new Error("Upload your CV as a PDF so it can be viewed directly in the dashboard.");
      }

      if (user && isFirebaseAvailable) {
        const cvPayload = await uploadStudentCv(user.uid, file, profileState.cvStoragePath || "");
        const nextCvVersions = [
          buildCvVersionRecord(cvPayload, { isCurrent: true }),
          ...((profileState.cvVersions || [])
            .filter(
              (item) => item.storagePath !== cvPayload.cvStoragePath && item.url !== cvPayload.cvURL,
            )
            .map((item) => ({ ...item, isCurrent: false }))),
        ].slice(0, 6);
        const nextProfile = await saveStudentProfile({
          ...profileState,
          ...cvPayload,
          cvVersions: nextCvVersions,
        });
        setProfileState(nextProfile);
        setEditForm(buildEditForm(nextProfile));
      } else {
        const fileReader = new FileReader();
        const cvURL = await new Promise((resolve, reject) => {
          fileReader.onload = () => resolve(String(fileReader.result || ""));
          fileReader.onerror = () => reject(new Error("Unable to read the selected CV file."));
          fileReader.readAsDataURL(file);
        });

        const nextCvRecord = {
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          url: cvURL,
        };

        const nextProfile = {
          ...profileState,
          cvURL: nextCvRecord.url,
          cvFileName: nextCvRecord.fileName,
          cvUploadedAt: nextCvRecord.uploadedAt,
          cvVersions: [
            buildCvVersionRecord(
              {
                cvURL: nextCvRecord.url,
                cvFileName: nextCvRecord.fileName,
                cvUploadedAt: nextCvRecord.uploadedAt,
              },
              { isCurrent: true },
            ),
            ...((profileState.cvVersions || [])
              .filter((item) => item.url !== nextCvRecord.url)
              .map((item) => ({ ...item, isCurrent: false }))),
          ].slice(0, 6),
        };

        setProfileState(nextProfile);
        setEditForm(buildEditForm(nextProfile));
        window.localStorage.setItem(profileStorageKey, JSON.stringify(nextProfile));
        window.localStorage.setItem(cvStorageKey, JSON.stringify(nextCvRecord));
      }

    } catch (uploadError) {
      toast.error(
        uploadError?.message ===
          "Upload your CV as a PDF so it can be viewed directly in the dashboard."
          ? uploadError.message
          : "We could not upload your CV right now.",
      );
    } finally {
      setIsUploadingCv(false);
      event.target.value = "";
    }
  };

  const handleRemoveCv = async () => {
    const previousProfile = profileState;
    const nextProfile = {
      ...profileState,
      cvURL: null,
      cvFileName: null,
      cvStoragePath: null,
      cvUploadedAt: null,
      cvVersions: (profileState.cvVersions || []).filter(
        (item) => item.storagePath !== profileState.cvStoragePath && item.url !== profileState.cvURL,
      ),
    };

    try {
      setProfileState(nextProfile);
      setEditForm(buildEditForm(nextProfile));
      closeCvPreview();
      window.localStorage.removeItem(cvStorageKey);

      if (user && isFirebaseAvailable) {
        try {
          await removeStudentCv(profileState.cvStoragePath);
        } catch (removeError) {
          if (removeError?.code !== "storage/object-not-found") {
            throw removeError;
          }
        }
        const savedProfile = await saveStudentProfile(nextProfile);
        setProfileState(savedProfile);
        setEditForm(buildEditForm(savedProfile));
      } else {
        setProfileState(nextProfile);
        setEditForm(buildEditForm(nextProfile));
        window.localStorage.setItem(profileStorageKey, JSON.stringify(nextProfile));
      }

    } catch {
      setProfileState(previousProfile);
      setEditForm(buildEditForm(previousProfile));
      window.localStorage.setItem(profileStorageKey, JSON.stringify(previousProfile));
      toast.error("We could not remove your CV right now.");
    }
  };

  const handleViewCv = async () => {
    if (!cvRecord) {
      return;
    }

    try {
      const viewUrl =
        user && isFirebaseAvailable
          ? await getStudentCvViewUrl(profileState.cvStoragePath, profileState.cvURL)
          : cvRecord.url;

      if (!viewUrl) {
        throw new Error("No CV is currently available.");
      }

      setCvPreview({
        isOpen: true,
        url: viewUrl,
        fileName: cvRecord.fileName,
        generatedUrl: false,
      });
    } catch (error) {
      if (error?.code === "storage/object-not-found") {
        const clearedProfile = {
          ...profileState,
          cvURL: null,
          cvFileName: null,
          cvStoragePath: null,
          cvUploadedAt: null,
          cvVersions: (profileState.cvVersions || []).filter(
            (item) => item.storagePath !== profileState.cvStoragePath && item.url !== profileState.cvURL,
          ),
        };

        setProfileState(clearedProfile);
        setEditForm(buildEditForm(clearedProfile));
        window.localStorage.removeItem(cvStorageKey);

        if (user && isFirebaseAvailable) {
          try {
            await saveStudentProfile(clearedProfile);
          } catch (saveError) {
            console.error("Unable to clear missing CV state:", saveError);
          }
        }

        toast.error("This CV is no longer available. Upload it again.");
        return;
      }

      toast.error("We could not open your CV right now.");
    }
  };

  const handleCopyValue = async (value) => {
    if (!value) {
      return;
    }

    try {
      await window.navigator.clipboard.writeText(value);
    } catch {
      toast.error("We could not copy that right now.");
    }
  };

  const handleOpenEmailApp = (vacancy) => {
    const destinationEmail = selectedVacancy?.applicationEmail || vacancy?.applicationEmail;

    if (!destinationEmail) {
      toast.error("This vacancy does not have an application email yet.");
      return;
    }

    const subject = buildRecommendedSubjectLine(vacancy || selectedVacancy, studentName);
    window.location.href = `mailto:${destinationEmail}?subject=${encodeURIComponent(subject)}`;
  };

  const handleOpenExternalLink = (vacancy) => {
    const nextLink = selectedVacancy?.applicationLink || vacancy?.applicationLink;

    if (!nextLink) {
      toast.error("This vacancy does not have an application link yet.");
      return;
    }

    window.open(nextLink, "_blank", "noopener,noreferrer");
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setIsSavingProfile(true);

    const nextProfile = {
      ...profileState,
      name: String(editForm.name ?? "").trim(),
      email: studentEmail,
      university: String(editForm.university ?? "").trim(),
      program: String(editForm.program ?? "").trim(),
      level: String(editForm.level ?? "").trim(),
      preferredLocation: String(editForm.preferredLocation ?? "").trim(),
      skills: normalizeTextList(editForm.skillsText),
      interests: normalizeTextList(editForm.interestsText),
    };

    if (!nextProfile.name || !nextProfile.program || !nextProfile.level) {
      toast.error("Complete your name, program, and level before saving.");
      setIsSavingProfile(false);
      return;
    }

    if (!ELIGIBLE_ATTACHMENT_LEVELS.includes(nextProfile.level)) {
      toast.error("Select a valid attachment level before saving.");
      setIsSavingProfile(false);
      return;
    }

    try {
      if (user && isFirebaseAvailable) {
        const savedProfile = await saveStudentProfile(nextProfile);
        setProfileState(savedProfile);
        setEditForm(buildEditForm(savedProfile));
      } else {
        setProfileState(nextProfile);
        setEditForm(buildEditForm(nextProfile));
        window.localStorage.setItem(profileStorageKey, JSON.stringify(nextProfile));
      }

      setActiveSection("dashboard");
    } catch (saveError) {
      toast.error(saveError.message || "Unable to update your profile right now.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleGenerateAiInsight = async () => {
    if (!user || !isFirebaseAvailable) {
      const fallbackInsight = buildStudentFallbackInsight({
        applications,
        cvAnalysis,
        profileState,
        question: aiQuestion,
        savedOpportunities,
        studentFirstName,
      });
      setAiInsight(fallbackInsight);
      return;
    }

    setIsGeneratingAi(true);

    try {
      const result = await generateStudentAiInsight(aiPayload);
      setAiInsight(result);
    } catch (error) {
      console.error("Unable to generate student AI insight:", error);
      const fallbackInsight = buildStudentFallbackInsight({
        applications,
        cvAnalysis,
        profileState,
        question: aiQuestion,
        savedOpportunities,
        studentFirstName,
      });
      setAiInsight(fallbackInsight);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleRewriteCvSection = async () => {
    setIsRewritingCv(true);

    try {
      if (!cvRewriteInput.trim()) {
        throw new Error("Paste a CV point or summary first.");
      }

      if (!user || !isFirebaseAvailable) {
        const fallbackRewrite = buildCvRewriteFallback(cvRewriteInput, cvRewriteFocus);
        setCvRewriteResult(fallbackRewrite);
        return;
      }

      const result = await rewriteStudentCvSection({
        currentText: cvRewriteInput,
        focus: cvRewriteFocus,
        studentName,
        program: profileState?.program || "",
        level: profileState?.level || "",
      });
      setCvRewriteResult(result);
    } catch (error) {
      if (error?.message === "Paste a CV point or summary first.") {
        toast.error(error.message);
      } else {
        console.error("Unable to rewrite CV section:", error);
        const fallbackRewrite = buildCvRewriteFallback(cvRewriteInput, cvRewriteFocus);
        setCvRewriteResult(fallbackRewrite);
      }
    } finally {
      setIsRewritingCv(false);
    }
  };

  const renderApplicationsBlock = (items, emptyTitle, emptyDescription) => {
    if (items.length === 0) {
      return (
        <EmptyState
          actionLabel="Browse Vacancies"
          description={emptyDescription}
          onAction={() => setActiveSection("apply")}
          title={emptyTitle}
        />
      );
    }

    const statusBreakdown = [
      {
        label: "Submitted",
        value: items.filter((item) => item.status === "Submitted").length,
        tone: "submitted",
      },
      {
        label: "Under Review",
        value: items.filter((item) => item.status === "Under Review").length,
        tone: "under review",
      },
      {
        label: "Accepted",
        value: items.filter((item) => item.status === "Accepted").length,
        tone: "accepted",
      },
      {
        label: "Rejected",
        value: items.filter((item) => item.status === "Rejected").length,
        tone: "rejected",
      },
    ];

    return (
      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_22px_60px_-36px_rgba(15,23,42,0.18)]">
        <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_45%,#eff6ff_100%)] px-5 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Application Records
              </p>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                Track submitted roles, decisions, and the latest movement in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge>{`${items.length} total`}</StatusBadge>
              <StatusBadge tone="submitted">
                {`${items.filter((item) => item.status === "Under Review").length} under review`}
              </StatusBadge>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statusBreakdown.map((item) => (
              <article
                className="rounded-[20px] border border-white/80 bg-white/85 px-4 py-3 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.18)]"
                key={item.label}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl text-slate-950">{item.value}</p>
                  </div>
                  <StatusBadge tone={item.tone}>{item.label}</StatusBadge>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/45 p-2">
            <AdminTable columns={applicationColumns} rows={items} />
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendationRail = (items, emptyTitle, emptyDescription) => {
    if (!items.length) {
      return (
        <EmptyState
          actionLabel="Open Profile"
          description={emptyDescription}
          onAction={() => setActiveSection("profile")}
          title={emptyTitle}
        />
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map((vacancy) => {
            const alreadyApplied = hasAppliedToVacancy(vacancy.id);
            const isSaved = savedOpportunities.some((item) => item.id === vacancy.id);

            return (
              <article
                className="min-w-[290px] max-w-[290px] flex-shrink-0 overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(145deg,#ffffff_0%,#fff7ed_42%,#eff6ff_100%)] p-5 shadow-[0_26px_70px_-44px_rgba(15,23,42,0.22)]"
                key={vacancy.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge tone="accepted">Recommended</StatusBadge>
                    <StatusBadge tone="submitted">{vacancy.category || "Attachment role"}</StatusBadge>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
                    <SparklesIcon className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-lg leading-snug text-slate-950">
                    {vacancy.vacancyTitle || vacancy.position}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {vacancy.companyName || vacancy.company}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge>{vacancy.category || "General placement"}</StatusBadge>
                  <StatusBadge>{vacancy.location || "Zimbabwe"}</StatusBadge>
                </div>

                <div className="mt-4 grid gap-2">
                  {vacancy.match.reasons?.map((reason) => (
                    <div
                      className="rounded-[18px] border border-white/80 bg-white/86 px-4 py-2 text-sm text-slate-700"
                      key={reason}
                    >
                      {reason}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    disabled={alreadyApplied || activeApplicationId === vacancy.id}
                    onClick={() => setSelectedVacancy(vacancy)}
                    size="sm"
                    variant={alreadyApplied ? "secondary" : "primary"}
                  >
                    {alreadyApplied ? "Applied" : "Review Match"}
                  </Button>
                  <Button
                    onClick={() => handleSaveOpportunity(vacancy)}
                    size="sm"
                    variant={isSaved ? "dark" : "secondary"}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <DashboardCard
        className="bg-[radial-gradient(circle_at_top_left,rgba(255,237,213,0.95),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(219,234,254,0.9),transparent_38%),linear-gradient(135deg,#ffffff_0%,#f8fafc_42%,#fff7ed_100%)]"
        description="Look for attachment opportunities, manage applications, and track your progress from one place."
        eyebrow="Student Workspace"
        title={welcomeTitle}
      >
        <div className="grid gap-6 xl:grid-cols-[1.22fr_0.78fr]">
          <div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {spotlightTiles.map((tile) => {
                const Icon = tile.icon;

                return (
                  <article
                    className="rounded-[26px] border border-white/80 bg-white/84 p-4 shadow-[0_22px_55px_-34px_rgba(15,23,42,0.22)] backdrop-blur-sm"
                    key={tile.label}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-[1.25rem] ${tile.tone}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {tile.label}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-900">{tile.value}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {profileTiles.map((tile) => (
                <article
                  className="rounded-[22px] border border-slate-200/80 bg-white/80 px-4 py-3"
                  key={tile.label}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {tile.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-900">{tile.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <article className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_30px_80px_-42px_rgba(15,23,42,0.55)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
                    Profile Completion
                  </p>
                  <p className="mt-3 text-5xl leading-none">{profileCompletion.percentage}%</p>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-white/10">
                  <BoltIcon className="h-5 w-5 text-orange-200" />
                </span>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#f97316_0%,#facc15_45%,#60a5fa_100%)]"
                  style={{ width: `${Math.max(profileCompletion.percentage, 10)}%` }}
                />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <StatusBadge className="border-white/10 bg-white/10 text-white" tone="default">
                  {cvAnalysis.readinessLabel}
                </StatusBadge>
                <StatusBadge className="border-white/10 bg-white/10 text-white" tone="default">
                  {cvRecord ? "CV ready" : "CV missing"}
                </StatusBadge>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-200">
                {cvAnalysis.recommendations[0]}
              </p>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Completion Checklist
              </p>
              <div className="mt-4 grid gap-3">
                {profileCompletion.checks.slice(0, 4).map((item) => (
                  <div className="flex items-center justify-between gap-3" key={item.label}>
                    <p className="text-sm leading-7 text-slate-700">{item.label}</p>
                    <StatusBadge tone={item.complete ? "accepted" : "submitted"}>
                      {item.complete ? "Done" : "Pending"}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </article>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Button onClick={() => setActiveSection("apply")}>Find Opportunities</Button>
              <Button onClick={() => setActiveSection("upload")} variant="secondary">
                Open CV Workspace
              </Button>
              <Button onClick={() => setActiveSection("saved")} variant="secondary">
                Saved Opportunities
              </Button>
              <Button onClick={() => setActiveSection("analysis")} variant="ghost">
                AI CV Analysis
              </Button>
            </div>
          </div>
        </div>
      </DashboardCard>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <StatsCard
            accent={card.accent}
            badge={card.badge}
            key={card.label}
            label={card.label}
            note={card.note}
            value={card.value}
          />
        ))}
      </section>

      <DashboardCard
        className="bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_42%,#eff6ff_100%)]"
        description="A curated stream of opportunities that feel most relevant to your current student profile."
        eyebrow="Best Matches For You"
        title={`Top picks for ${studentFirstName}`}
      >
        {renderRecommendationRail(
          recommendedVacancies,
          "Curated opportunities coming soon",
          "Curated opportunities will appear here as more suitable placements become available.",
        )}
      </DashboardCard>

      <section className="grid gap-6 xl:grid-cols-[1.28fr_0.72fr]">
        <DashboardCard
          description="Your latest activity across submitted attachment applications."
          eyebrow="Recent Applications"
          title="Latest activity"
        >
          {renderApplicationsBlock(
            applications.slice(0, 5),
            "No applications yet",
            "Start by browsing live attachment vacancies and your applications will appear here automatically.",
          )}
        </DashboardCard>

        <DashboardCard
          className="bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_42%,#eff6ff_100%)]"
          description="A premium, step-by-step view of what should happen next in your attachment journey."
          eyebrow="Attachment Roadmap"
          title="Build momentum"
        >
          <div className="grid gap-4">
            {roadmapSteps.map((step, index) => (
              <article
                className={`rounded-[24px] border p-5 shadow-[0_22px_55px_-38px_rgba(15,23,42,0.2)] ${
                  step.done ? "border-emerald-100 bg-white/92" : "border-slate-200 bg-white/88"
                }`}
                key={step.title}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full ${
                      step.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {step.done ? (
                      <CheckBadgeIcon className="h-5 w-5" />
                    ) : (
                      <ClockIcon className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-lg text-slate-950">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{step.copy}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <DashboardCard
          description="Browse all open vacancies with recommendations surfaced first, while still keeping the full list available."
          eyebrow="Vacancy Board"
          title="Browse all opportunities"
        >
          {rankedVacancies.length === 0 ? (
            <EmptyState
              actionLabel="Refresh Later"
              description="As soon as live vacancies are posted, they will appear here in a structured board."
              onAction={() => setActiveSection("apply")}
              title="No live opportunities yet"
            />
          ) : (
            <div className="space-y-5">
              {featuredVacancy && (
                <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_40%,#eff6ff_100%)] p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge tone="submitted">{featuredVacancy.location || "Zimbabwe"}</StatusBadge>
                        <StatusBadge status={featuredVacancy.status || "Open"}>
                          {featuredVacancy.status || "Open"}
                        </StatusBadge>
                        {featuredVacancy.match?.recommended && (
                          <StatusBadge tone="accepted">{`${featuredVacancy.match.score}% match`}</StatusBadge>
                        )}
                      </div>
                      <h3 className="mt-4 text-2xl leading-snug text-slate-950">
                        {featuredVacancy.vacancyTitle || featuredVacancy.position}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {featuredVacancy.companyName || featuredVacancy.company}
                      </p>
                      {featuredVacancy.description && (
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {featuredVacancy.description}
                        </p>
                      )}
                      {!!featuredVacancy.match?.reasons?.length && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {featuredVacancy.match.reasons.map((item) => (
                            <StatusBadge key={item} tone="submitted">
                              {item}
                            </StatusBadge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                      <div className="rounded-[22px] border border-white/80 bg-white/85 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Deadline
                        </p>
                        <p className="mt-2 text-sm text-slate-900">
                          {formatDate(featuredVacancy.deadline)}
                        </p>
                      </div>
                      <Button onClick={() => setSelectedVacancy(featuredVacancy)}>
                        Review & Apply
                      </Button>
                    </div>
                  </div>
                </article>
              )}

              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_22px_60px_-36px_rgba(15,23,42,0.18)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Vacancy Preview
                    </p>
                    <p className="mt-1 text-sm leading-7 text-slate-600">
                      Review all openings, match quality, deadlines, and quick actions without leaving the dashboard.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge>{`${rankedVacancies.length} open roles`}</StatusBadge>
                    <StatusBadge tone="submitted">{`${savedOpportunities.length} saved`}</StatusBadge>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <AdminTable columns={opportunityPreviewColumns} rows={rankedVacancies.slice(0, 6)} />
                </div>
              </div>
            </div>
          )}
        </DashboardCard>

        <div className="space-y-6">
          <DashboardCard
            className="bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_35%,#fff7ed_100%)]"
            description="Fast access to the actions students usually need most."
            eyebrow="Command Deck"
            title="Work faster"
          >
            <div className="grid gap-4">
              {quickActionCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    className={`rounded-[26px] border border-white/80 bg-gradient-to-br ${card.tone} p-5 shadow-[0_20px_55px_-38px_rgba(15,23,42,0.2)]`}
                    key={card.title}
                  >
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-slate-950 text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-lg text-slate-950">{card.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{card.copy}</p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <Button onClick={card.action} variant="secondary">
                        {card.label}
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </DashboardCard>

          <DashboardCard
            description="A quick workspace view of your current document, versioning path, and AI support."
            eyebrow="CV Workspace"
            title="CV readiness"
          >
            <div className="grid gap-4">
              <article className="rounded-[24px] border border-slate-200 bg-slate-50/75 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Current CV
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-900">
                      {cvRecord?.fileName || "No CV uploaded yet"}
                    </p>
                  </div>
                  <StatusBadge tone={cvRecord ? "accepted" : "submitted"}>
                    {cvRecord ? "Ready" : "Missing"}
                  </StatusBadge>
                </div>
              </article>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button onClick={() => setActiveSection("upload")}>Open CV Workspace</Button>
                <Button onClick={() => setActiveSection("analysis")} variant="secondary">
                  Open AI Assistant
                </Button>
              </div>
            </div>
          </DashboardCard>
        </div>
      </section>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case "apply":
        return (
          <div className="space-y-6">
            <DashboardCard
              className="bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_45%,#eff6ff_100%)]"
              description="Explore attachment opportunities through a cleaner, more focused discovery workspace."
              eyebrow="Attachment Discovery"
              title="Find your next placement"
            >
              <div className="space-y-6">
                <SearchBar
                  onChange={setSearchQuery}
                  onClear={() => setSearchQuery("")}
                  resultCount={filteredVacancies.length}
                  value={searchQuery}
                />

                <FilterPanel
                  filters={searchFilters}
                  isOpen={showFilters}
                  onChange={(key, value) =>
                    setSearchFilters((current) => ({
                      ...current,
                      [key]: value,
                    }))
                  }
                  onReset={() =>
                    setSearchFilters({
                      category: "",
                      location: "",
                      skill: "",
                      type: "",
                    })
                  }
                  onToggle={() => setShowFilters((current) => !current)}
                  options={searchOptions}
                />

                <div className="space-y-5">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Top Picks
                        </p>
                        <h3 className="mt-2 text-2xl text-slate-950">
                          Top picks for {studentFirstName}
                        </h3>
                      </div>
                      <StatusBadge tone="accepted">
                        {filteredRecommendedVacancies.length
                          ? `${filteredRecommendedVacancies.length} curated`
                          : "Fresh picks loading"}
                      </StatusBadge>
                    </div>

                    <div className="mt-5">
                      {filteredRecommendedVacancies.length ? (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {filteredRecommendedVacancies.map((vacancy) => (
                            <VacancyCard
                              alreadyApplied={hasAppliedToVacancy(vacancy.id)}
                              isFeatured
                              isSaved={savedOpportunities.some((item) => item.id === vacancy.id)}
                              key={vacancy.id}
                              onApply={() => setSelectedVacancy(vacancy)}
                              onSave={() => handleSaveOpportunity(vacancy)}
                              onViewDetails={() => setSelectedVacancy(vacancy)}
                              vacancy={{
                                ...vacancy,
                                formattedDeadline: formatDate(vacancy.deadline),
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-[26px] border border-dashed border-slate-300 bg-white/80 p-6">
                          <p className="text-base text-slate-900">Curated opportunities will appear here as the live vacancy board grows.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_22px_60px_-36px_rgba(15,23,42,0.18)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          All Opportunities
                        </p>
                        <p className="mt-1 text-sm leading-7 text-slate-600">
                          Browse open attachment opportunities, save the ones you want, and review full details before applying.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge>{`${filteredVacancies.length} shown`}</StatusBadge>
                        <StatusBadge tone="submitted">{`${savedOpportunities.length} saved`}</StatusBadge>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      {filteredVacancies.length === 0 ? (
                        <EmptyState
                          description="No opportunities found. Try adjusting your filters."
                          title="No opportunities found"
                        />
                      ) : (
                        <div className="grid gap-4 xl:grid-cols-2">
                          {filteredVacancies.map((vacancy) => (
                            <VacancyCard
                              alreadyApplied={hasAppliedToVacancy(vacancy.id)}
                              isSaved={savedOpportunities.some((item) => item.id === vacancy.id)}
                              key={vacancy.id}
                              onApply={() => setSelectedVacancy(vacancy)}
                              onSave={() => handleSaveOpportunity(vacancy)}
                              onViewDetails={() => setSelectedVacancy(vacancy)}
                              vacancy={{
                                ...vacancy,
                                formattedDeadline: formatDate(vacancy.deadline),
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        );
      case "saved":
        return (
          <DashboardCard
            description="Keep promising vacancies here and apply when you are ready."
            eyebrow="Saved Opportunities"
            title="Apply later shortlist"
          >
            {savedOpportunities.length === 0 ? (
              <EmptyState
                actionLabel="Browse Vacancies"
                description="Save relevant opportunities first so you can return and apply at the right time."
                onAction={() => setActiveSection("apply")}
                title="No saved opportunities yet"
              />
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {savedOpportunities.map((vacancy) => {
                  const alreadyApplied = hasAppliedToVacancy(vacancy.id);

                  return (
                    <article
                      className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_45%,#eff6ff_100%)] p-5 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.18)]"
                      key={vacancy.id}
                    >
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge tone="submitted">{vacancy.location || "Zimbabwe"}</StatusBadge>
                          <StatusBadge status={vacancy.status || "Open"}>
                            {vacancy.status || "Open"}
                          </StatusBadge>
                        </div>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white">
                          <BookmarkIcon className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="mt-4 text-2xl leading-snug text-slate-950">
                            {vacancy.vacancyTitle}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{vacancy.companyName}</p>
                          {vacancy.description && (
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                              {vacancy.description}
                            </p>
                          )}
                          {vacancy.deadline && (
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.2)]">
                              <ClockIcon className="h-4 w-4" />
                              Deadline: {formatDate(vacancy.deadline)}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 sm:items-end">
                          <Button
                            disabled={alreadyApplied || activeApplicationId === vacancy.id}
                            onClick={() => setSelectedVacancy(vacancy)}
                            variant={alreadyApplied ? "secondary" : "primary"}
                          >
                            {alreadyApplied
                              ? "Applied"
                              : activeApplicationId === vacancy.id
                                ? "Submitting..."
                                : "Apply Now"}
                          </Button>
                          <Button
                            onClick={() => handleSaveOpportunity(vacancy)}
                            variant="secondary"
                          >
                            Remove Saved
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </DashboardCard>
        );
      case "applications":
        return (
          <DashboardCard
            description="Everything you have submitted, with live status updates."
            eyebrow="My Applications"
            title="All submitted applications"
          >
            {renderApplicationsBlock(
              applications,
              "No submitted applications",
              "Your submitted attachment applications will appear here once you start applying.",
            )}
          </DashboardCard>
        );
      case "upload":
        return (
          <div className="space-y-6">
            <DashboardCard
              description="Upload, view, replace, and organize your current CV while keeping a clear path for future versions."
              eyebrow="CV Workspace"
              title="Manage your CV"
            >
              {cvRecord ? (
                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                  <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_40%,#eff6ff_100%)] p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                          Current Document
                        </p>
                        <h3 className="mt-3 text-2xl leading-snug text-slate-950">
                          {cvRecord.fileName}
                        </h3>
                      </div>
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-slate-950 text-white">
                        <DocumentTextIcon className="h-5 w-5" />
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[22px] border border-white/80 bg-white/88 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Last updated
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-900">
                          {formatDate(cvRecord.uploadedAt)}
                        </p>
                      </div>
                      <div className="rounded-[22px] border border-white/80 bg-white/88 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Readiness
                        </p>
                        <div className="mt-3">
                          <StatusBadge tone="accepted">Ready to send</StatusBadge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button disabled={isUploadingCv} onClick={() => fileInputRef.current?.click()}>
                        {isUploadingCv ? "Uploading..." : "Replace CV"}
                      </Button>
                      <Button onClick={handleViewCv} type="button" variant="secondary">
                        <EyeIcon className="h-4 w-4" />
                        View CV
                      </Button>
                      <Button onClick={handleRemoveCv} variant="ghost">
                        <TrashIcon className="h-4 w-4" />
                        Remove CV
                      </Button>
                    </div>
                  </article>

                  <div className="grid gap-6">
                    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.16)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Version Structure
                      </p>
                      <div className="mt-5 grid gap-3">
                        {(profileState.cvVersions || []).length ? (
                          profileState.cvVersions.slice(0, 4).map((version, index) => (
                            <div
                              className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
                              key={version.id || `${version.fileName}-${index}`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-slate-900">
                                    {version.fileName}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {formatDate(version.uploadedAt)}
                                  </p>
                                </div>
                                <StatusBadge tone={version.isCurrent ? "accepted" : "submitted"}>
                                  {version.isCurrent ? "Current" : "Archive-ready"}
                                </StatusBadge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm leading-7 text-slate-600">
                            Version history will start building as soon as you replace your CV.
                          </p>
                        )}
                      </div>
                    </article>

                    <article className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_45%,#fff7ed_100%)] p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.16)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        AI CV Assistant
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Use AI to rewrite weak CV bullets, sharpen your summary, and prepare a stronger version before you apply.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Button onClick={() => setActiveSection("analysis")}>
                          Open AI CV Assistant
                        </Button>
                        <Button onClick={() => setActiveSection("apply")} variant="secondary">
                          Find Opportunities
                        </Button>
                      </div>
                    </article>
                  </div>
                </div>
              ) : (
                <EmptyState
                  actionLabel={isUploadingCv ? "Uploading..." : "Upload CV"}
                  description="Add your current CV so you are ready the moment the right vacancy appears."
                  onAction={() => !isUploadingCv && fileInputRef.current?.click()}
                  title="No CV in your workspace yet"
                />
              )}
            </DashboardCard>
          </div>
        );
      case "analysis":
        return (
          <div className="space-y-6">
            <DashboardCard
              description="Ask the AI assistant to review your profile, vacancy readiness, and current application momentum."
              eyebrow="AI Attachment Assistant"
              title="Generate a real AI review"
            >
              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_46px_-34px_rgba(15,23,42,0.18)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    What the AI uses
                  </p>
                  <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
                    <p>Your profile details and eligible level</p>
                    <p>Your saved and submitted attachment activity</p>
                    <p>Your current readiness score and CV status</p>
                  </div>
                  <div className="mt-6">
                    <FormField htmlFor="student-ai-question" label="Focus question">
                      <TextField
                        as="textarea"
                        className="min-h-32"
                        id="student-ai-question"
                        onChange={(event) => setAiQuestion(event.target.value)}
                        placeholder="Example: How can I improve my chances for ICT support attachment roles in Harare?"
                        value={aiQuestion}
                      />
                    </FormField>
                  </div>
                  <div className="mt-5">
                    <Button
                      disabled={isGeneratingAi}
                      onClick={handleGenerateAiInsight}
                      type="button"
                    >
                      {isGeneratingAi ? "Analyzing..." : "Generate AI Review"}
                    </Button>
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_56%,#fff7ed_100%)] p-5 shadow-[0_18px_46px_-34px_rgba(15,23,42,0.16)]">
                  {aiInsight ? (
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                          AI Headline
                        </p>
                        <h3 className="mt-3 text-2xl leading-snug text-slate-950">
                          {aiInsight.headline}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{aiInsight.answer}</p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[22px] border border-white/70 bg-white/88 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                            AI Score
                          </p>
                          <p className="mt-3 text-4xl text-slate-950">{aiInsight.score}%</p>
                        </div>
                        <div className="rounded-[22px] border border-white/70 bg-white/88 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Search Focus
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {aiInsight.suggestedSearches?.map((item) => (
                              <span
                                className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800"
                                key={item}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full min-h-64 items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white/75 p-6 text-center">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          AI Result
                        </p>
                        <p className="mt-3 text-base leading-7 text-slate-600">
                          Generate a review to get real AI feedback on your attachment readiness and next steps.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              description="Paste one CV bullet, profile summary, or experience line and let the AI tighten the wording for attachment applications."
              eyebrow="AI CV Rewrite"
              title="Rewrite CV content"
            >
              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_46px_-34px_rgba(15,23,42,0.18)]">
                  <FormField htmlFor="cv-rewrite-input" label="Current CV text">
                    <TextField
                      as="textarea"
                      className="min-h-32"
                      id="cv-rewrite-input"
                      onChange={(event) => setCvRewriteInput(event.target.value)}
                      placeholder="Example: I was helping with IT support and doing reports for users."
                      value={cvRewriteInput}
                    />
                  </FormField>

                  <div className="mt-5">
                    <FormField htmlFor="cv-rewrite-focus" label="Target focus">
                      <TextField
                        id="cv-rewrite-focus"
                        onChange={(event) => setCvRewriteFocus(event.target.value)}
                        placeholder="Example: Make it stronger for systems support attachment roles"
                        type="text"
                        value={cvRewriteFocus}
                      />
                    </FormField>
                  </div>

                  <div className="mt-5">
                    <Button
                      disabled={isRewritingCv}
                      onClick={handleRewriteCvSection}
                      type="button"
                    >
                      {isRewritingCv ? "Rewriting..." : "Rewrite CV Text"}
                    </Button>
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_52%,#fff7ed_100%)] p-5 shadow-[0_18px_46px_-34px_rgba(15,23,42,0.16)]">
                  {cvRewriteResult ? (
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                          Rewrite Result
                        </p>
                        <h3 className="mt-3 text-2xl leading-snug text-slate-950">
                          {cvRewriteResult.headline}
                        </h3>
                      </div>

                      <article className="rounded-[24px] border border-white/80 bg-white/88 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Rewritten text
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-700">
                          {cvRewriteResult.rewrittenText}
                        </p>
                      </article>

                      <div className="grid gap-3">
                        {cvRewriteResult.improvements?.map((item) => (
                          <article
                            className="rounded-[20px] border border-slate-200 bg-white/88 p-4"
                            key={item}
                          >
                            <p className="text-sm leading-7 text-slate-700">{item}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full min-h-64 items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white/75 p-6 text-center">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          CV Rewrite
                        </p>
                        <p className="mt-3 text-base leading-7 text-slate-600">
                          Paste a CV line and generate a sharper, more professional rewrite for your next application.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              description="Smart readiness feedback based on your current profile, uploaded CV, and activity."
              eyebrow="AI CV Analysis"
              title="CV readiness overview"
            >
              <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
                <div className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Readiness Score
                  </p>
                  <p className="mt-4 text-5xl text-slate-950">{cvAnalysis.score}%</p>
                  <div className="mt-4">
                    <StatusBadge tone={cvAnalysis.score >= 65 ? "accepted" : "submitted"}>
                      {cvAnalysis.readinessLabel}
                    </StatusBadge>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    This score reflects how ready your profile currently looks for attachment applications.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {cvAnalysis.checks.map((check) => (
                    <div
                      className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.2)]"
                      key={check.label}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Check
                      </p>
                      <p className="mt-2 text-base text-slate-950">{check.label}</p>
                      <div className="mt-4">
                        <StatusBadge tone={check.complete ? "accepted" : "submitted"}>
                          {check.complete ? "Complete" : "Needs attention"}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              description="Practical next steps to strengthen your attachment readiness."
              eyebrow="Recommendations"
              title="What to improve next"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {(aiInsight?.nextSteps?.length ? aiInsight.nextSteps : cvAnalysis.recommendations).map((item) => (
                  <article
                    className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5"
                    key={item}
                  >
                    <p className="text-sm leading-7 text-slate-700">{item}</p>
                  </article>
                ))}
              </div>
            </DashboardCard>

            {aiInsight && (
              <DashboardCard
                description="A deeper AI breakdown of your strongest areas and what needs attention next."
                eyebrow="AI Breakdown"
                title="Strengths and risks"
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  <article className="rounded-[24px] border border-emerald-200 bg-emerald-50/80 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                      Strengths
                    </p>
                    <div className="mt-4 grid gap-3">
                      {aiInsight.strengths?.map((item) => (
                        <p className="text-sm leading-7 text-emerald-950" key={item}>
                          {item}
                        </p>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-[24px] border border-amber-200 bg-amber-50/80 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                      Risks
                    </p>
                    <div className="mt-4 grid gap-3">
                      {aiInsight.risks?.map((item) => (
                        <p className="text-sm leading-7 text-amber-950" key={item}>
                          {item}
                        </p>
                      ))}
                    </div>
                  </article>
                </div>
              </DashboardCard>
            )}
          </div>
        );
      case "status":
        return (
          <div className="space-y-6">
            <DashboardCard
              description="A quick status view of where every application currently stands."
              eyebrow="Application Status"
              title="Current progress"
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                  <StatsCard
                    accent={card.accent}
                    badge={card.badge}
                    key={card.label}
                    label={card.label}
                    value={card.value}
                  />
                ))}
              </div>
            </DashboardCard>

            <DashboardCard
              description="This list updates automatically whenever your application progress changes."
              eyebrow="Status Breakdown"
              title="Application timeline"
            >
              {renderApplicationsBlock(
                applications,
                "No application activity yet",
                "Once you submit applications, their review progress will appear here automatically.",
              )}
            </DashboardCard>
          </div>
        );
      case "profile":
        return (
          <DashboardCard
            description="Keep your academic profile accurate so the matching engine and employers see the right information."
            eyebrow="Profile"
            title="Update your details"
          >
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_42%,#eff6ff_100%)] p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                  Profile Snapshot
                </p>
                <div className="mt-5 grid gap-4">
                  {[
                    {
                      label: "Student name",
                      value: editForm.name || "Add your full name",
                      icon: UserCircleIcon,
                    },
                    {
                      label: "University",
                      value: editForm.university || "Add your university",
                      icon: MapPinIcon,
                    },
                    {
                      label: "Program",
                      value: editForm.program || "Add your program",
                      icon: AcademicCapIcon,
                    },
                    {
                      label: "Preferred location",
                      value: editForm.preferredLocation || "Add your preferred location",
                      icon: MapPinIcon,
                    },
                    {
                      label: "Email",
                      value: studentEmail,
                      icon: DocumentTextIcon,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        className="flex items-start gap-4 rounded-[22px] border border-white/80 bg-white/88 p-4"
                        key={item.label}
                      >
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] bg-slate-950 text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            {item.label}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-slate-900">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[24px] border border-white/80 bg-white/88 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Completion Score
                      </p>
                      <p className="mt-2 text-3xl text-slate-950">{profileCompletion.percentage}%</p>
                    </div>
                    <StatusBadge tone={profileCompletion.percentage >= 75 ? "accepted" : "submitted"}>
                      {profileCompletion.percentage >= 75 ? "Strong" : "Improve"}
                    </StatusBadge>
                  </div>
                </div>
              </article>

              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSaveProfile}>
                <FormField htmlFor="student-name" label="Full name">
                  <TextField
                    id="student-name"
                    name="name"
                    onChange={handleProfileChange}
                    type="text"
                    value={editForm.name || ""}
                  />
                </FormField>

                <FormField htmlFor="student-university" label="University">
                  <TextField
                    id="student-university"
                    name="university"
                    onChange={handleProfileChange}
                    placeholder="e.g. Midlands State University"
                    type="text"
                    value={editForm.university || ""}
                  />
                </FormField>

                <FormField htmlFor="student-program" label="Program">
                  <TextField
                    id="student-program"
                    name="program"
                    onChange={handleProfileChange}
                    type="text"
                    value={editForm.program || ""}
                  />
                </FormField>

                <FormField htmlFor="student-location" label="Preferred location">
                  <TextField
                    id="student-location"
                    name="preferredLocation"
                    onChange={handleProfileChange}
                    placeholder="e.g. Harare"
                    type="text"
                    value={editForm.preferredLocation || ""}
                  />
                </FormField>

                <FormField htmlFor="student-level" label="Level">
                  <TextField
                    as="select"
                    id="student-level"
                    name="level"
                    onChange={handleProfileChange}
                    value={editForm.level || ""}
                  >
                    <option value="">Select level</option>
                    {ELIGIBLE_ATTACHMENT_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </TextField>
                </FormField>

                <FormField htmlFor="student-email" label="Email">
                  <TextField disabled id="student-email" type="email" value={studentEmail} />
                </FormField>

                <FormField className="md:col-span-2" htmlFor="student-skills" label="Skills">
                  <TextField
                    as="textarea"
                    className="min-h-28"
                    id="student-skills"
                    name="skillsText"
                    onChange={handleProfileChange}
                    placeholder="e.g. Excel, React, Networking, Systems Analysis"
                    value={editForm.skillsText || ""}
                  />
                </FormField>

                <FormField className="md:col-span-2" htmlFor="student-interests" label="Interests (optional)">
                  <TextField
                    as="textarea"
                    className="min-h-24"
                    id="student-interests"
                    name="interestsText"
                    onChange={handleProfileChange}
                    placeholder="e.g. UX design, support services, business analysis"
                    value={editForm.interestsText || ""}
                  />
                </FormField>

                <div className="md:col-span-2">
                  <Button disabled={isSavingProfile} type="submit">
                    {isSavingProfile ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </div>
          </DashboardCard>
        );
      default:
        return renderDashboard();
    }
  };

  const mobileActiveNav = ["saved", "status"].includes(activeSection)
    ? "applications"
    : activeSection === "analysis"
      ? "upload"
      : activeSection === "profile"
        ? ""
        : activeSection;
  const selectedVacancyAlreadyApplied = selectedVacancy ? hasAppliedToVacancy(selectedVacancy.id) : false;
  const selectedVacancyMeta = selectedVacancy ? getVacancyApplicationMeta(selectedVacancy) : null;
  const selectedVacancySubject = selectedVacancy
    ? buildRecommendedSubjectLine(selectedVacancy, studentName)
    : "";
  const selectedVacancyRequiredDocuments = selectedVacancy ? getRequiredDocuments(selectedVacancy) : [];

  return (
    <section className="dashboard-shell relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] p-3 pb-28 sm:p-6 sm:pb-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-7rem] top-6 h-64 w-64 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-12 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <input
        accept=".pdf"
        className="hidden"
        onChange={handleUploadCV}
        ref={fileInputRef}
        type="file"
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:gap-6">
        <Sidebar
          activeItem={activeSection}
          isOpen={sidebarOpen}
          items={sidebarItems}
          mobileSubtitle={studentName}
          mobileTitle="Student Dashboard"
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
          onSelect={selectSection}
          subtitle={studentName}
          title="Student Panel"
        />

        <div className="w-full flex-1 space-y-4 sm:space-y-5">
          {renderMainContent()}
        </div>
      </div>

      <MobileBottomNav
        activeItem={mobileActiveNav}
        items={mobileBottomNavItems}
        onSelect={handleMobileNavSelect}
      />

      {selectedVacancy && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/55 backdrop-blur-sm"
          onClick={() => setSelectedVacancy(null)}
        >
          <div className="flex min-h-full items-start justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:p-4">
            <div
              className="flex w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_32px_90px_-42px_rgba(15,23,42,0.38)] sm:rounded-[32px]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                    {selectedVacancyMeta?.eyebrow || "Vacancy Details"}
                  </p>
                  <h2 className="mt-3 text-xl leading-snug text-slate-950 sm:text-2xl">
                    {selectedVacancy.vacancyTitle || selectedVacancy.position}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {selectedVacancy.companyName || selectedVacancy.company}
                  </p>
                  {selectedVacancyMeta && (
                    <div className="mt-3">
                      <StatusBadge tone={selectedVacancyMeta.badgeLabel}>
                        {selectedVacancyMeta.badgeLabel}
                      </StatusBadge>
                    </div>
                  )}
                </div>
                <button
                  className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
                  onClick={() => setSelectedVacancy(null)}
                  type="button"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[calc(100dvh-11rem)] overflow-y-auto px-4 py-4 sm:max-h-[calc(100dvh-13rem)] sm:px-6 sm:py-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Vacancy Details
                    </p>
                    <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
                      <p>
                        <span className="font-semibold text-slate-900">Location:</span>{" "}
                        {selectedVacancy.location || "Zimbabwe"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Deadline:</span>{" "}
                        {formatDate(selectedVacancy.deadline)}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Status:</span>{" "}
                        {selectedVacancy.status || "Open"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Type:</span>{" "}
                        {selectedVacancy.vacancyType || "On-site"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Category:</span>{" "}
                        {selectedVacancy.category || "General placement"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Application method:</span>{" "}
                        {selectedVacancyMeta?.badgeLabel || "Portal Apply"}
                      </p>
                    </div>
                    {selectedVacancy.description && (
                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {selectedVacancy.description}
                      </p>
                    )}
                    {!!selectedVacancy.requiredSkills?.length && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Requirements
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedVacancy.requiredSkills.map((skill) => (
                            <StatusBadge key={skill}>{skill}</StatusBadge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Required Documents
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedVacancyRequiredDocuments.map((document) => (
                          <StatusBadge key={document} tone="submitted">
                            {document}
                          </StatusBadge>
                        ))}
                      </div>
                    </div>
                  </article>

                  {selectedVacancyMeta?.method === "portal" ? (
                    <article className="rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_46%,#eff6ff_100%)] p-4 sm:p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Student Profile Check
                      </p>
                      <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-900">Name:</span> {studentName}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">Program:</span>{" "}
                          {profileState.program || "Add your program"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">Level:</span>{" "}
                          {profileState.level || "Select your level"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">CV:</span>{" "}
                          {cvRecord ? "Uploaded" : "Not uploaded yet"}
                        </p>
                      </div>
                      {!!selectedVacancy.match?.reasons?.length && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {selectedVacancy.match.reasons.map((item) => (
                            <StatusBadge key={item} tone="submitted">
                              {item}
                            </StatusBadge>
                          ))}
                        </div>
                      )}
                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        Submit this application directly inside the platform and keep tracking the result from your dashboard.
                      </p>
                      {!cvRecord && (
                        <p className="mt-4 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900">
                          Upload your CV first so your application is ready for review.
                        </p>
                      )}
                    </article>
                  ) : selectedVacancyMeta?.method === "email" ? (
                    <article className="rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_46%,#eff6ff_100%)] p-4 sm:p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Email Application Guide
                      </p>
                      <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-900">Destination email:</span>{" "}
                          {selectedVacancy.applicationEmail || "Not provided"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">Recommended subject:</span>{" "}
                          {selectedVacancySubject}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">CV:</span>{" "}
                          {cvRecord ? "Ready to attach" : "Upload your CV first"}
                        </p>
                      </div>
                      {!!selectedVacancy.applicationInstructions && (
                        <div className="mt-4 rounded-[20px] border border-white/80 bg-white/90 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Instructions
                          </p>
                          <p className="mt-2 text-sm leading-7 text-slate-700">
                            {selectedVacancy.applicationInstructions}
                          </p>
                        </div>
                      )}
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <Button
                          fullWidth
                          onClick={() => handleCopyValue(selectedVacancy.applicationEmail)}
                          type="button"
                          variant="secondary"
                        >
                          <ClipboardDocumentIcon className="h-4 w-4" />
                          Copy Email
                        </Button>
                        <Button
                          fullWidth
                          onClick={() => handleCopyValue(selectedVacancySubject)}
                          type="button"
                          variant="secondary"
                        >
                          <ClipboardDocumentIcon className="h-4 w-4" />
                          Copy Subject
                        </Button>
                        <Button fullWidth disabled={!cvRecord} onClick={handleViewCv} type="button" variant="secondary">
                          <EyeIcon className="h-4 w-4" />
                          View CV
                        </Button>
                        <Button
                          fullWidth
                          disabled={!cvRecord || !selectedVacancy.applicationEmail}
                          onClick={() => handleOpenEmailApp(selectedVacancy)}
                          type="button"
                        >
                          <EnvelopeIcon className="h-4 w-4" />
                          Open Email App
                        </Button>
                      </div>
                      {!cvRecord && (
                        <p className="mt-4 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900">
                          Upload your CV first, then send your email application and mark it as applied here.
                        </p>
                      )}
                    </article>
                  ) : (
                    <article className="rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_46%,#eff6ff_100%)] p-4 sm:p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        External Application Guide
                      </p>
                      <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-900">Application link:</span>{" "}
                          {selectedVacancy.applicationLink || "Not provided"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">CV:</span>{" "}
                          {cvRecord ? "Ready to upload" : "Upload your CV first"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">Follow-up:</span> Mark the vacancy as applied here after completing the company website form.
                        </p>
                      </div>
                      {!!selectedVacancy.applicationInstructions && (
                        <div className="mt-4 rounded-[20px] border border-white/80 bg-white/90 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Instructions
                          </p>
                          <p className="mt-2 text-sm leading-7 text-slate-700">
                            {selectedVacancy.applicationInstructions}
                          </p>
                        </div>
                      )}
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <Button
                          fullWidth
                          disabled={!selectedVacancy.applicationLink || !cvRecord}
                          onClick={() => handleOpenExternalLink(selectedVacancy)}
                          type="button"
                        >
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                          Go to Application Link
                        </Button>
                        <Button fullWidth disabled={!cvRecord} onClick={handleViewCv} type="button" variant="secondary">
                          <EyeIcon className="h-4 w-4" />
                          View CV
                        </Button>
                      </div>
                      {!cvRecord && (
                        <p className="mt-4 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900">
                          Upload your CV first, then complete the external application and mark it as applied here.
                        </p>
                      )}
                    </article>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 sm:py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button fullWidth onClick={() => setSelectedVacancy(null)} variant="secondary">
                    Cancel
                  </Button>
                  {!cvRecord ? (
                    <Button
                      fullWidth
                      onClick={() => {
                        setSelectedVacancy(null);
                        setActiveSection("upload");
                      }}
                    >
                      Open CV Workspace
                    </Button>
                  ) : selectedVacancyMeta?.method === "portal" ? (
                    <Button
                      fullWidth
                      disabled={selectedVacancyAlreadyApplied || activeApplicationId === selectedVacancy.id}
                      onClick={() => handleApply(selectedVacancy)}
                    >
                      {selectedVacancyAlreadyApplied
                        ? "Already Applied"
                        : activeApplicationId === selectedVacancy.id
                          ? "Submitting..."
                          : "Apply Now"}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      disabled={selectedVacancyAlreadyApplied || activeApplicationId === selectedVacancy.id}
                      onClick={() => handleMarkApplied(selectedVacancy)}
                    >
                      {selectedVacancyAlreadyApplied
                        ? "Already Applied"
                        : activeApplicationId === selectedVacancy.id
                          ? "Saving..."
                          : "Mark as Applied"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DocumentPreviewModal
        eyebrow="CV Preview"
        fileName={cvPreview.fileName}
        isOpen={cvPreview.isOpen}
        onClose={closeCvPreview}
        onDownload={downloadPreviewDocument}
        title="Student CV Preview"
        url={cvPreview.url}
      />
    </section>
  );
}

export default StudentDashboard;

