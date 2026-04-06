import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowUpTrayIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  EyeIcon,
  HomeIcon,
  MapPinIcon,
  PlusCircleIcon,
  SparklesIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import AdminTable from "../components/dashboard/AdminTable";
import DashboardCard from "../components/dashboard/DashboardCard";
import DocumentPreviewModal from "../components/dashboard/DocumentPreviewModal";
import MobileBottomNav from "../components/dashboard/MobileBottomNav";
import Sidebar from "../components/dashboard/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import FormField from "../components/ui/FormField";
import StatusBadge from "../components/ui/StatusBadge";
import TextField from "../components/ui/TextField";
import ConfirmModal from "../components/ui/ConfirmModal";
import { useAuth } from "../contexts/AuthContext";
import { generateAdminAiInsight } from "../services/aiInsights";
import {
  bulkCreateVacancies,
  createVacancy,
  getStudentCvViewUrl,
  subscribeToAllApplications,
  subscribeToStudents,
  subscribeToVacancies,
  updateApplicationStatus,
} from "../services/platformData";
import { buildAdminFallbackInsight } from "../utils/aiFallbacks";
import {
  getVacancyApplicationMeta,
  joinTextList,
  normalizeTextList,
} from "../utils/platformModels";
import { parseVacancyImportFile } from "../utils/vacancyImport";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: HomeIcon },
  { id: "post-vacancy", label: "Post New Vacancy", icon: PlusCircleIcon },
  { id: "manage-vacancies", label: "Manage Vacancies", icon: BriefcaseIcon },
  { id: "view-applications", label: "View Applications", icon: ClipboardDocumentListIcon },
  { id: "manage-students", label: "Manage Students", icon: UsersIcon },
  {
    id: "update-status",
    label: "Update Application Status",
    icon: AdjustmentsHorizontalIcon,
  },
  { id: "reports", label: "Reports / Statistics", icon: ChartBarIcon },
  { id: "logout", label: "Logout", icon: ArrowLeftStartOnRectangleIcon },
];

const mobileBottomNavItems = [
  { id: "dashboard", label: "Home", icon: HomeIcon },
  { id: "manage-vacancies", label: "Vacancies", icon: BriefcaseIcon },
  { id: "view-applications", label: "Applications", icon: ClipboardDocumentListIcon },
  { id: "manage-students", label: "Students", icon: UsersIcon },
];

const fallbackApplications = [
  {
    id: "app-1",
    studentId: "stu-1",
    studentName: "Tariro Muchengeti",
    studentProgram: "Business Management Systems Design and Applications",
    university: "Midlands State University",
    companyApplied: "Harare Tech Solutions",
    position: "Business Systems Attachment",
    applicationMethod: "portal",
    status: "Under Review",
    dateApplied: "2026-03-18T08:00:00.000Z",
  },
  {
    id: "app-2",
    studentId: "stu-2",
    studentName: "Simbarashe Ncube",
    studentProgram: "Computer Science",
    university: "National University of Science and Technology",
    companyApplied: "TechBridge Zimbabwe",
    position: "ICT Support Attachment",
    applicationMethod: "email",
    status: "Accepted",
    dateApplied: "2026-03-16T08:00:00.000Z",
  },
];

const fallbackVacancies = [
  {
    id: "vac-1",
    companyName: "Harare Tech Solutions",
    vacancyTitle: "Business Systems Attachment",
    category: "Business Management Systems Design and Applications",
    requiredSkills: ["Systems Analysis", "Excel", "Documentation"],
    tags: ["business analysis", "reporting", "operations"],
    location: "Harare",
    deadline: "2026-04-05",
    status: "Open",
    description: "Support systems design, process mapping, and student reporting workflows.",
    applicationMethod: "portal",
    applicationInstructions: "Students apply directly through the portal with a CV and attachment letter.",
    requiredDocuments: ["CV", "Attachment letter"],
  },
  {
    id: "vac-2",
    companyName: "Mutare Digital Hub",
    vacancyTitle: "ICT Support Attachment",
    category: "Computer Science",
    requiredSkills: ["IT Support", "Networking", "Documentation"],
    tags: ["support", "helpdesk", "hardware"],
    location: "Mutare",
    deadline: "2026-04-12",
    status: "Open",
    description: "Assist with service desk operations and documentation.",
    applicationMethod: "email",
    applicationEmail: "careers@mutaredigitalhub.co.zw",
    applicationInstructions:
      "Students must email their CV, attachment letter, and transcript to the recruitment desk.",
    requiredDocuments: ["CV", "Attachment letter", "Academic transcript"],
  },
];

const fallbackStudents = [
  {
    id: "stu-1",
    name: "Tariro Muchengeti",
    university: "Midlands State University",
    program: "Business Management Systems Design and Applications",
    level: "3.2",
    preferredLocation: "Harare",
    skills: ["Systems Analysis", "Excel", "Documentation"],
    cvFileName: "Tariro-Muchengeti-CV.pdf",
    cvURL: "",
    cvStoragePath: "",
  },
  {
    id: "stu-2",
    name: "Simbarashe Ncube",
    university: "NUST",
    program: "Computer Science",
    level: "4.2",
    preferredLocation: "Bulawayo",
    skills: ["IT Support", "Networking", "Python"],
    cvFileName: null,
    cvURL: "",
    cvStoragePath: "",
  },
];

const workflowStatuses = ["Submitted", "Under Review", "Accepted", "Rejected"];

function formatDate(value) {
  if (!value) {
    return "Pending";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function AdminDashboard() {
  const { user, logout, userProfile, isFirebaseAvailable } = useAuth();
  const navigate = useNavigate();
  const importInputRef = useRef(null);
  const sectionScrollPositionsRef = useRef({ dashboard: 0 });
  const visitedSectionsRef = useRef(new Set(["dashboard"]));
  const previousSectionRef = useRef("dashboard");

  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [applications, setApplications] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [students, setStudents] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isParsingImport, setIsParsingImport] = useState(false);
  const [isImportingVacancies, setIsImportingVacancies] = useState(false);
  const [activeStatusUpdate, setActiveStatusUpdate] = useState("");
  const [adminAiQuestion, setAdminAiQuestion] = useState("");
  const [adminAiInsight, setAdminAiInsight] = useState(null);
  const [isGeneratingAdminAi, setIsGeneratingAdminAi] = useState(false);
  const [importRows, setImportRows] = useState([]);
  const [cvPreview, setCvPreview] = useState({
    isOpen: false,
    studentId: "",
    url: "",
    fileName: "",
  });
  const [vacancyForm, setVacancyForm] = useState({
    companyName: "",
    vacancyTitle: "",
    category: "",
    requiredSkillsText: "",
    requiredDocumentsText: "",
    location: "",
    deadline: "",
    status: "Open",
    applicationMethod: "portal",
    applicationEmail: "",
    applicationLink: "",
    applicationInstructions: "",
    tagsText: "",
    description: "",
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
      const unsubscribeApplications = subscribeToAllApplications((items) => {
        setApplications(
          items.map((item) => ({
            ...item,
            companyApplied: item.companyApplied || item.company || "Not set",
            studentName: item.studentName || "Student",
            studentProgram: item.studentProgram || "Program not set",
            studentId: item.studentId || "",
            university: item.university || "Zimbabwean University Student",
            position: item.position || "Attachment Position",
          })),
        );
      }, (error) => {
        console.error("Unable to read admin applications:", error);
      });
      const unsubscribeVacancies = subscribeToVacancies(setVacancies, (error) => {
        console.error("Unable to read admin vacancies:", error);
      });
      const unsubscribeStudents = subscribeToStudents(setStudents, (error) => {
        console.error("Unable to read students:", error);
      });

      return () => {
        unsubscribeApplications();
        unsubscribeVacancies();
        unsubscribeStudents();
      };
    }

    setApplications(fallbackApplications);
    setVacancies(fallbackVacancies);
    setStudents(fallbackStudents);
    return undefined;
  }, [isFirebaseAvailable, user]);

  const adminName = userProfile?.name || user?.email || "Admin";
  const studentLookup = useMemo(
    () =>
      students.reduce((accumulator, item) => {
        accumulator[item.id] = item;
        return accumulator;
      }, {}),
    [students],
  );

  const reportSummary = useMemo(
    () => ({
      accepted: applications.filter((item) => item.status === "Accepted").length,
      rejected: applications.filter((item) => item.status === "Rejected").length,
      review: applications.filter((item) => item.status === "Under Review").length,
      openVacancies: vacancies.filter((item) => item.status === "Open").length,
    }),
    [applications, vacancies],
  );

  const summaryCards = useMemo(
    () => [
      {
        label: "Total Students Registered",
        value: students.length,
        note: "Students currently registered on the platform.",
        accent: "orange",
        badge: "01",
      },
      {
        label: "Total Applications Submitted",
        value: applications.length,
        note: "All application records currently captured.",
        accent: "blue",
        badge: "02",
      },
      {
        label: "Active Vacancies",
        value: reportSummary.openVacancies,
        note: "Vacancies students can currently apply for.",
        accent: "slate",
        badge: "03",
      },
      {
        label: "Applications Under Review",
        value: reportSummary.review,
        note: "Applications waiting for the next admin or employer action.",
        accent: "emerald",
        badge: "04",
      },
    ],
    [applications.length, reportSummary.openVacancies, reportSummary.review, students.length],
  );

  const dashboardNotifications = useMemo(() => {
    const items = [];

    if (reportSummary.review > 0) {
      items.push({
        id: "admin-review",
        title: "Applications need review",
        body: `${reportSummary.review} application${reportSummary.review === 1 ? "" : "s"} ${reportSummary.review === 1 ? "is" : "are"} waiting for action.`,
        sectionId: "view-applications",
        tone: "warning",
      });
    }

    if (reportSummary.openVacancies === 0) {
      items.push({
        id: "admin-vacancies",
        title: "No active vacancies",
        body: "Post or reopen vacancies so students can discover current opportunities.",
        sectionId: "post-vacancy",
        tone: "warning",
      });
    }

    if (students.length > 0) {
      items.push({
        id: "admin-students",
        title: "Student pipeline is active",
        body: `${students.length} student${students.length === 1 ? "" : "s"} ${students.length === 1 ? "is" : "are"} currently registered on the platform.`,
        sectionId: "manage-students",
        tone: "info",
      });
    }

    if (applications.length > 0) {
      items.push({
        id: "admin-activity",
        title: "Application activity live",
        body: `${applications.length} total application${applications.length === 1 ? "" : "s"} ${applications.length === 1 ? "is" : "are"} currently in the system.`,
        sectionId: "dashboard",
        tone: "positive",
      });
    }

    return items.slice(0, 5);
  }, [applications.length, reportSummary.openVacancies, reportSummary.review, students.length]);

  const actionTiles = [
    {
      label: "Open Vacancies",
      value: `${reportSummary.openVacancies} active`,
    },
    {
      label: "Review Queue",
      value: `${reportSummary.review} applications`,
    },
    {
      label: "Student Records",
      value: `${students.length} students`,
    },
    {
      label: "Import Queue",
      value: `${importRows.filter((item) => item.isValid).length} ready`,
    },
  ];

  const applicationColumns = [
    { key: "studentName", label: "Student Name" },
    { key: "studentProgram", label: "Program" },
    { key: "university", label: "University" },
    { key: "companyApplied", label: "Company" },
    { key: "position", label: "Vacancy" },
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
    {
      key: "studentId",
      label: "CV",
      render: (value, row) => {
        const student = studentLookup[value] || students.find((item) => item.id === value);
        const hasCv = Boolean(student?.cvStoragePath || student?.cvURL);

        if (!hasCv) {
          return <span className="text-slate-500">No CV</span>;
        }

        return (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handlePreviewStudentCv(row)} size="sm" variant="secondary">
              <EyeIcon className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={() => handleDownloadStudentCv(row)} size="sm" variant="ghost">
              Download
            </Button>
          </div>
        );
      },
    },
  ];

  const vacancyColumns = [
    { key: "companyName", label: "Company" },
    { key: "vacancyTitle", label: "Vacancy" },
    { key: "category", label: "Category" },
    {
      key: "applicationMethod",
      label: "Apply Method",
      render: (value, row) => {
        const applicationMeta = getVacancyApplicationMeta(row || value);
        return <StatusBadge tone={applicationMeta.badgeLabel}>{applicationMeta.badgeLabel}</StatusBadge>;
      },
    },
    {
      key: "requiredSkills",
      label: "Required Skills",
      render: (value) => (normalizeTextList(value).length ? joinTextList(value) : "Not specified"),
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
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
    },
  ];

  const importPreviewColumns = [
    { key: "rowNumber", label: "Row" },
    {
      key: "payload",
      label: "Company",
      render: (value) => value.companyName || "Missing",
    },
    {
      key: "vacancyTitle",
      label: "Vacancy",
      render: (_, row) => row.payload.vacancyTitle || "Missing",
    },
    {
      key: "category",
      label: "Category",
      render: (_, row) => row.payload.category || "Missing",
    },
    {
      key: "location",
      label: "Location",
      render: (_, row) => row.payload.location || "Missing",
    },
    {
      key: "validation",
      label: "Validation",
      render: (_, row) =>
        row.isValid ? (
          <StatusBadge tone="accepted">Ready</StatusBadge>
        ) : (
          <div className="space-y-1">
            {row.errors.map((item) => (
              <p className="text-xs text-red-600" key={item}>
                {item}
              </p>
            ))}
          </div>
        ),
    },
  ];

  const adminAiPayload = useMemo(
    () => ({
      adminName,
      totals: {
        students: students.length,
        applications: applications.length,
        vacancies: vacancies.length,
        openVacancies: reportSummary.openVacancies,
        underReview: reportSummary.review,
        accepted: reportSummary.accepted,
        rejected: reportSummary.rejected,
      },
      recentApplications: applications.slice(0, 6).map((item) => ({
        studentName: item.studentName,
        university: item.university,
        companyApplied: item.companyApplied,
        position: item.position,
        status: item.status,
      })),
      vacancyPreview: vacancies.slice(0, 6).map((item) => ({
        companyName: item.companyName,
        vacancyTitle: item.vacancyTitle,
        category: item.category,
        requiredSkills: item.requiredSkills,
        deadline: item.deadline,
        status: item.status,
        location: item.location,
      })),
      focusQuestion: adminAiQuestion,
    }),
    [adminAiQuestion, adminName, applications, reportSummary, students.length, vacancies],
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/login", {
        replace: true,
        state: { loggedOut: true },
      });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const selectSection = async (sectionId) => {
    setSidebarOpen(false);

    if (sectionId === "logout") {
      setShowLogoutConfirm(true);
      return;
    }

    setActiveSection(sectionId);
  };

  const handleMobileNavSelect = (sectionId) => {
    void selectSection(sectionId);
  };

  function closeCvPreview() {
    setCvPreview({
      isOpen: false,
      studentId: "",
      url: "",
      fileName: "",
    });
  }

  async function resolveStudentCv(applicationOrStudentId) {
    const studentId =
      typeof applicationOrStudentId === "string"
        ? applicationOrStudentId
        : applicationOrStudentId?.studentId;
    const student = studentLookup[studentId];

    if (!student || (!student.cvStoragePath && !student.cvURL)) {
      throw new Error("This student has not uploaded a CV yet.");
    }

    const url =
      user && isFirebaseAvailable
        ? await getStudentCvViewUrl(student.cvStoragePath, student.cvURL)
        : student.cvURL;

    return {
      studentId,
      url,
      fileName:
        student.cvFileName ||
        `${typeof applicationOrStudentId === "string" ? "Student" : applicationOrStudentId.studentName || "Student"}-CV.pdf`,
    };
  }

  async function handlePreviewStudentCv(application) {
    try {
      const document = await resolveStudentCv(application);
      setCvPreview({
        isOpen: true,
        studentId: document.studentId,
        url: document.url,
        fileName: document.fileName,
      });
    } catch {
      toast.error("We could not preview this CV right now.");
    }
  }

  async function handleDownloadStudentCv(application) {
    try {
      const document = await resolveStudentCv(application);
      const anchor = window.document.createElement("a");
      anchor.href = document.url;
      anchor.download = document.fileName;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      window.document.body.appendChild(anchor);
      anchor.click();
      window.document.body.removeChild(anchor);
    } catch {
      toast.error("We could not download this CV right now.");
    }
  }

  async function handleDownloadPreviewCv() {
    if (!cvPreview.studentId) {
      return;
    }

    await handleDownloadStudentCv(cvPreview.studentId);
  }

  const handleVacancyFormChange = (event) => {
    const { name, value } = event.target;
    setVacancyForm((current) => {
      if (name === "applicationMethod") {
        return {
          ...current,
          applicationMethod: value,
          applicationEmail: value === "email" ? current.applicationEmail : "",
          applicationLink: value === "external" ? current.applicationLink : "",
        };
      }

      return { ...current, [name]: value };
    });
  };

  const handleCreateVacancy = async (event) => {
    event.preventDefault();
    setIsPublishing(true);

    const nextVacancy = {
      companyName: String(vacancyForm.companyName || "").trim(),
      vacancyTitle: String(vacancyForm.vacancyTitle || "").trim(),
      category: String(vacancyForm.category || "").trim(),
      requiredSkills: normalizeTextList(vacancyForm.requiredSkillsText),
      requiredDocuments: normalizeTextList(vacancyForm.requiredDocumentsText),
      location: String(vacancyForm.location || "").trim(),
      deadline: String(vacancyForm.deadline || "").trim(),
      status: String(vacancyForm.status || "Open").trim(),
      applicationMethod: String(vacancyForm.applicationMethod || "portal").trim().toLowerCase(),
      applicationEmail: String(vacancyForm.applicationEmail || "").trim(),
      applicationLink: String(vacancyForm.applicationLink || "").trim(),
      applicationInstructions: String(vacancyForm.applicationInstructions || "").trim(),
      tags: normalizeTextList(vacancyForm.tagsText),
      description: String(vacancyForm.description || "").trim(),
      ownerRole: "admin",
    };

    if (
      !nextVacancy.companyName ||
      !nextVacancy.vacancyTitle ||
      !nextVacancy.category ||
      !nextVacancy.location ||
      !nextVacancy.deadline
    ) {
      toast.error("Company, vacancy, category, location, and deadline are required.");
      setIsPublishing(false);
      return;
    }

    if (nextVacancy.applicationMethod === "email" && !nextVacancy.applicationEmail) {
      toast.error("Add an application email for email-based vacancies.");
      setIsPublishing(false);
      return;
    }

    if (nextVacancy.applicationMethod === "external" && !nextVacancy.applicationLink) {
      toast.error("Add an external application link for external vacancies.");
      setIsPublishing(false);
      return;
    }

    try {
      if (user && isFirebaseAvailable) {
        await createVacancy(nextVacancy);
      } else {
        setVacancies((current) => [
          {
            id: `vac-${Date.now()}`,
            ...nextVacancy,
          },
          ...current,
        ]);
      }

      setVacancyForm({
        companyName: "",
        vacancyTitle: "",
        category: "",
        requiredSkillsText: "",
        requiredDocumentsText: "",
        location: "",
        deadline: "",
        status: "Open",
        applicationMethod: "portal",
        applicationEmail: "",
        applicationLink: "",
        applicationInstructions: "",
        tagsText: "",
        description: "",
      });
      setActiveSection("manage-vacancies");
    } catch {
      toast.error("We could not publish this vacancy right now.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsParsingImport(true);

    try {
      const parsedRows = await parseVacancyImportFile(file);
      setImportRows(parsedRows);
    } catch {
      toast.error("We could not read that spreadsheet right now.");
    } finally {
      setIsParsingImport(false);
      event.target.value = "";
    }
  };

  const handleConfirmImport = async () => {
    const validRows = importRows.filter((item) => item.isValid).map((item) => item.payload);

    if (!validRows.length) {
      toast.error("There are no valid vacancy rows ready for import.");
      return;
    }

    setIsImportingVacancies(true);

    try {
      if (user && isFirebaseAvailable) {
        await bulkCreateVacancies(validRows);
      } else {
        setVacancies((current) => [
          ...validRows.map((item, index) => ({
            id: `bulk-vac-${Date.now()}-${index}`,
            ...item,
          })),
          ...current,
        ]);
      }

      setImportRows([]);
      setActiveSection("manage-vacancies");
    } catch {
      toast.error("We could not import those vacancies right now.");
    } finally {
      setIsImportingVacancies(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    setActiveStatusUpdate(`${applicationId}:${status}`);

    try {
      if (user && isFirebaseAvailable) {
        await updateApplicationStatus(applicationId, status);
      } else {
        setApplications((current) =>
          current.map((item) => (item.id === applicationId ? { ...item, status } : item)),
        );
      }
    } catch {
      toast.error("We could not update this application right now.");
    } finally {
      setActiveStatusUpdate("");
    }
  };

  const handleGenerateAdminAiInsight = async () => {
    if (!user || !isFirebaseAvailable) {
      const fallbackInsight = buildAdminFallbackInsight({
        applications,
        question: adminAiQuestion,
        reportSummary,
        students,
        vacancies,
      });
      setAdminAiInsight(fallbackInsight);
      return;
    }

    setIsGeneratingAdminAi(true);

    try {
      const result = await generateAdminAiInsight(adminAiPayload);
      setAdminAiInsight(result);
    } catch (error) {
      console.error("Unable to generate admin AI insight:", error);
      const fallbackInsight = buildAdminFallbackInsight({
        applications,
        question: adminAiQuestion,
        reportSummary,
        students,
        vacancies,
      });
      setAdminAiInsight(fallbackInsight);
    } finally {
      setIsGeneratingAdminAi(false);
    }
  };

  const renderVacancyPreview = () => {
    if (vacancies.length === 0) {
      return (
        <EmptyState
          actionLabel="Post New Vacancy"
          description="Start posting opportunities so students can begin applying."
          onAction={() => setActiveSection("post-vacancy")}
          title="No vacancies posted yet"
        />
      );
    }

    return (
      <div className="grid gap-4">
        {vacancies.map((vacancy) => {
          const applicationMeta = getVacancyApplicationMeta(vacancy);

          return (
          <article
            className="overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_48%,#fff7ed_100%)] p-5 shadow-[0_18px_46px_-36px_rgba(15,23,42,0.18)]"
            key={vacancy.id}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={vacancy.status}>{vacancy.status}</StatusBadge>
                <StatusBadge tone={applicationMeta.badgeLabel}>{applicationMeta.badgeLabel}</StatusBadge>
                {vacancy.location && <StatusBadge>{vacancy.location}</StatusBadge>}
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] bg-slate-950 text-white">
                <BuildingOffice2Icon className="h-5 w-5" />
              </span>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg text-slate-950">{vacancy.companyName}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{vacancy.vacancyTitle}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge>{vacancy.category || "General placement"}</StatusBadge>
                  {normalizeTextList(vacancy.requiredSkills)
                    .slice(0, 2)
                    .map((skill) => (
                      <StatusBadge key={skill} tone="submitted">
                        {skill}
                      </StatusBadge>
                    ))}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-white/80 bg-white/85 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Deadline
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-900">
                      <CalendarDaysIcon className="h-4 w-4 text-slate-400" />
                      {formatDate(vacancy.deadline)}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-white/80 bg-white/85 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Location
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-900">
                      <MapPinIcon className="h-4 w-4 text-slate-400" />
                      {vacancy.location || "Zimbabwe"}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-white/80 bg-white/85 px-4 py-3 sm:col-span-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Application Route
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-900">
                      {applicationMeta.helperLabel}
                    </p>
                    {vacancy.applicationEmail && (
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        Email: {vacancy.applicationEmail}
                      </p>
                    )}
                    {vacancy.applicationLink && (
                      <p className="mt-1 break-all text-sm leading-7 text-slate-600">
                        Link: {vacancy.applicationLink}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <p className="text-sm leading-7 text-slate-600">
                  Keep this vacancy current so students see the right status and deadline.
                </p>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-7">
      <DashboardCard
        className="bg-[linear-gradient(135deg,#ffffff_0%,#eef3f9_48%,#e4ebf4_100%)]"
        description="Manage the student pipeline, company-facing vacancy supply, and application flow from one workspace."
        eyebrow="Admin Workspace"
        title="Welcome Admin"
      >
        <div className="grid gap-5 xl:grid-cols-[1.45fr_0.55fr]">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {actionTiles.map((tile) => (
              <div
                className="rounded-[24px] border border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(242,246,251,0.96)_100%)] p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.22)]"
                key={tile.label}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {tile.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-900">{tile.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-slate-900/85 bg-[linear-gradient(180deg,#020617_0%,#111827_52%,#1e293b_100%)] p-4 shadow-[0_34px_86px_-44px_rgba(15,23,42,0.62)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-300">
              Quick Actions
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Button onClick={() => setActiveSection("post-vacancy")}>Post New Vacancy</Button>
            <Button onClick={() => setActiveSection("view-applications")} variant="secondary">
              Review Applications
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

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <DashboardCard
          description="A quick view of the most recent student activity on the platform."
          eyebrow="Recent Applications"
          title="Latest application activity"
        >
          {applications.length === 0 ? (
            <EmptyState
              description="Applications will appear here once students begin applying for posted vacancies."
              title="No applications yet"
            />
          ) : (
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_22px_60px_-36px_rgba(15,23,42,0.18)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300/80 bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f9_100%)] px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Application Records
                  </p>
                  <p className="mt-1 text-sm leading-7 text-slate-600">
                    Review the latest submissions and keep status updates moving.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge>{`${applications.length} total`}</StatusBadge>
                  <StatusBadge tone="submitted">
                    {`${reportSummary.review} under review`}
                  </StatusBadge>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <AdminTable columns={applicationColumns} rows={applications.slice(0, 8)} />
              </div>
            </div>
          )}
        </DashboardCard>

        <DashboardCard
          description="Monitor current vacancies, deadlines, and listing status."
          eyebrow="Vacancy Management Preview"
          title="Current vacancy pipeline"
        >
          {renderVacancyPreview()}
        </DashboardCard>
      </section>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case "post-vacancy":
        return (
          <div className="space-y-6">
            <DashboardCard
              description="Create a richer vacancy record that can scale later to company-owned listings, not just admin-posted records."
              eyebrow="Post New Vacancy"
              title="Create vacancy"
            >
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreateVacancy}>
                <FormField htmlFor="company-name" label="Company Name">
                  <TextField
                    id="company-name"
                    name="companyName"
                    onChange={handleVacancyFormChange}
                    type="text"
                    value={vacancyForm.companyName}
                  />
                </FormField>

                <FormField htmlFor="vacancy-title" label="Vacancy Title">
                  <TextField
                    id="vacancy-title"
                    name="vacancyTitle"
                    onChange={handleVacancyFormChange}
                    type="text"
                    value={vacancyForm.vacancyTitle}
                  />
                </FormField>

                <FormField htmlFor="category" label="Category / Program">
                  <TextField
                    id="category"
                    name="category"
                    onChange={handleVacancyFormChange}
                    placeholder="e.g. Computer Science"
                    type="text"
                    value={vacancyForm.category}
                  />
                </FormField>

                <FormField htmlFor="location" label="Location">
                  <TextField
                    id="location"
                    name="location"
                    onChange={handleVacancyFormChange}
                    placeholder="e.g. Harare"
                    type="text"
                    value={vacancyForm.location}
                  />
                </FormField>

                <FormField htmlFor="required-skills" label="Required Skills">
                  <TextField
                    id="required-skills"
                    name="requiredSkillsText"
                    onChange={handleVacancyFormChange}
                    placeholder="e.g. Excel, Networking, Documentation"
                    type="text"
                    value={vacancyForm.requiredSkillsText}
                  />
                </FormField>

                <FormField htmlFor="required-documents" label="Required Documents">
                  <TextField
                    id="required-documents"
                    name="requiredDocumentsText"
                    onChange={handleVacancyFormChange}
                    placeholder="e.g. CV, Attachment letter, Academic transcript"
                    type="text"
                    value={vacancyForm.requiredDocumentsText}
                  />
                </FormField>

                <FormField htmlFor="deadline" label="Deadline">
                  <TextField
                    id="deadline"
                    name="deadline"
                    onChange={handleVacancyFormChange}
                    type="date"
                    value={vacancyForm.deadline}
                  />
                </FormField>

                <FormField htmlFor="tags" label="Tags">
                  <TextField
                    id="tags"
                    name="tagsText"
                    onChange={handleVacancyFormChange}
                    placeholder="e.g. support, data, systems"
                    type="text"
                    value={vacancyForm.tagsText}
                  />
                </FormField>

                <FormField htmlFor="application-method" label="Application Method">
                  <TextField
                    as="select"
                    id="application-method"
                    name="applicationMethod"
                    onChange={handleVacancyFormChange}
                    value={vacancyForm.applicationMethod}
                  >
                    <option value="portal">Portal</option>
                    <option value="email">Email</option>
                    <option value="external">External Link</option>
                  </TextField>
                </FormField>

                <FormField htmlFor="status" label="Status">
                  <TextField
                    as="select"
                    id="status"
                    name="status"
                    onChange={handleVacancyFormChange}
                    value={vacancyForm.status}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </TextField>
                </FormField>

                {vacancyForm.applicationMethod === "email" && (
                  <FormField className="md:col-span-2" htmlFor="application-email" label="Application Email">
                    <TextField
                      id="application-email"
                      name="applicationEmail"
                      onChange={handleVacancyFormChange}
                      placeholder="e.g. careers@company.co.zw"
                      type="email"
                      value={vacancyForm.applicationEmail}
                    />
                  </FormField>
                )}

                {vacancyForm.applicationMethod === "external" && (
                  <FormField className="md:col-span-2" htmlFor="application-link" label="Application Link">
                    <TextField
                      id="application-link"
                      name="applicationLink"
                      onChange={handleVacancyFormChange}
                      placeholder="https://company-careers-site.com/apply"
                      type="url"
                      value={vacancyForm.applicationLink}
                    />
                  </FormField>
                )}

                <FormField
                  className="md:col-span-2"
                  htmlFor="application-instructions"
                  label="Application Instructions"
                >
                  <TextField
                    as="textarea"
                    className="min-h-24"
                    id="application-instructions"
                    name="applicationInstructions"
                    onChange={handleVacancyFormChange}
                    placeholder="Add any steps students should follow before applying."
                    value={vacancyForm.applicationInstructions}
                  />
                </FormField>

                <FormField className="md:col-span-2" htmlFor="description" label="Description">
                  <TextField
                    as="textarea"
                    className="min-h-32"
                    id="description"
                    name="description"
                    onChange={handleVacancyFormChange}
                    placeholder="Describe the work students will do in this attachment role."
                    value={vacancyForm.description}
                  />
                </FormField>

                <div className="md:col-span-2">
                  <Button disabled={isPublishing} type="submit">
                    {isPublishing ? "Publishing..." : "Publish Vacancy"}
                  </Button>
                </div>
              </form>
            </DashboardCard>

            <DashboardCard
              description="Upload a CSV or Excel sheet, preview the mapped vacancy rows, validate fields, then confirm import."
              eyebrow="Bulk Vacancy Upload"
              title="Import from spreadsheet"
            >
              <input
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleImportFile}
                ref={importInputRef}
                type="file"
              />
              <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
                <article className="rounded-[26px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_50%,#fff7ed_100%)] p-5 shadow-[0_18px_46px_-34px_rgba(15,23,42,0.16)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <ArrowUpTrayIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Supported files
                      </p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        CSV, XLSX, and XLS vacancy sheets.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3">
                    <Button
                      disabled={isParsingImport}
                      onClick={() => importInputRef.current?.click()}
                      type="button"
                    >
                      {isParsingImport ? "Reading file..." : "Choose spreadsheet"}
                    </Button>
                    <Button
                      disabled={isImportingVacancies || importRows.filter((item) => item.isValid).length === 0}
                      onClick={handleConfirmImport}
                      type="button"
                      variant="secondary"
                    >
                      {isImportingVacancies ? "Importing..." : "Confirm Import"}
                    </Button>
                  </div>
                </article>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge>{`${importRows.length} rows parsed`}</StatusBadge>
                    <StatusBadge tone="accepted">
                      {`${importRows.filter((item) => item.isValid).length} valid`}
                    </StatusBadge>
                    <StatusBadge tone="rejected">
                      {`${importRows.filter((item) => !item.isValid).length} issues`}
                    </StatusBadge>
                  </div>

                  {importRows.length === 0 ? (
                    <EmptyState
                      description="Once you upload a spreadsheet, the preview and field validation will appear here."
                      title="No import preview yet"
                    />
                  ) : (
                    <AdminTable columns={importPreviewColumns} rows={importRows} />
                  )}
                </div>
              </div>
            </DashboardCard>
          </div>
        );
      case "manage-vacancies":
        return (
          <DashboardCard
            description="Review vacancy records and keep the active listings current."
            eyebrow="Manage Vacancies"
            title="Vacancy records"
          >
            {vacancies.length === 0 ? (
              <EmptyState
                actionLabel="Post Vacancy"
                description="Vacancy records will appear here after you publish or import them."
                onAction={() => setActiveSection("post-vacancy")}
                title="No vacancy records yet"
              />
            ) : (
              <div className="space-y-6">
                <AdminTable columns={vacancyColumns} rows={vacancies} />
                {renderVacancyPreview()}
              </div>
            )}
          </DashboardCard>
        );
      case "view-applications":
        return (
          <DashboardCard
            description="All student applications currently captured in the system."
            eyebrow="View Applications"
            title="Application records"
          >
            {applications.length === 0 ? (
              <EmptyState
                description="Applications will appear here as soon as students start responding to posted vacancies."
                title="No application records yet"
              />
            ) : (
              <AdminTable columns={applicationColumns} rows={applications} />
            )}
          </DashboardCard>
        );
      case "manage-students":
        return (
          <DashboardCard
            description="Review students preparing for industrial attachment."
            eyebrow="Manage Students"
            title="Registered students"
          >
            {students.length === 0 ? (
              <EmptyState
                description="Student records will appear here after users complete registration."
                title="No registered students yet"
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {students.map((student) => (
                  <article
                    className="overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_46%,#eff6ff_100%)] p-5 shadow-[0_18px_46px_-36px_rgba(15,23,42,0.18)]"
                    key={student.id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg text-slate-950">{student.name || "Student"}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {student.university || "Zimbabwean University Student"}
                        </p>
                      </div>
                      <StatusBadge>{`Level ${student.level || "Not set"}`}</StatusBadge>
                    </div>
                    <div className="mt-5 grid gap-3">
                      <div className="rounded-[18px] border border-white/80 bg-white/88 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Program
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm leading-7 text-slate-700">
                          <AcademicCapIcon className="h-4 w-4 text-slate-400" />
                          {student.program || "Program not yet added"}
                        </p>
                      </div>
                      <div className="rounded-[18px] border border-white/80 bg-white/88 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Skills
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">
                          {normalizeTextList(student.skills).length
                            ? joinTextList(student.skills)
                            : "Skills not yet added"}
                        </p>
                      </div>
                      <div className="rounded-[18px] border border-white/80 bg-white/88 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Preferred location
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm leading-7 text-slate-700">
                          <MapPinIcon className="h-4 w-4 text-slate-400" />
                          {student.preferredLocation || "Not set"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </DashboardCard>
        );
      case "update-status":
        return (
          <DashboardCard
            description="Review active applications and update their progress."
            eyebrow="Update Application Status"
            title="Application workflow"
          >
            {applications.length === 0 ? (
              <EmptyState
                description="As soon as students submit applications, you can review and update them from here."
                title="No applications to update"
              />
            ) : (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <article
                    className="overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_48%,#fff7ed_100%)] p-5 shadow-[0_18px_46px_-36px_rgba(15,23,42,0.18)]"
                    key={application.id}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={application.status}>{application.status}</StatusBadge>
                        <StatusBadge>{application.university}</StatusBadge>
                      </div>
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] bg-slate-950 text-white">
                        <BriefcaseIcon className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-lg text-slate-950">{application.studentName}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {application.companyApplied} - {application.position}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {workflowStatuses.map((status) => (
                          <Button
                            className="px-4 py-2 text-xs"
                            disabled={activeStatusUpdate === `${application.id}:${status}`}
                            key={status}
                            onClick={() => handleStatusUpdate(application.id, status)}
                            type="button"
                            variant={application.status === status ? "dark" : "secondary"}
                          >
                            {activeStatusUpdate === `${application.id}:${status}`
                              ? "Updating..."
                              : status}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </DashboardCard>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <DashboardCard
              description="Use AI to review vacancy pressure, application flow, and the next operational actions the admin team should take."
              eyebrow="AI Operations Assistant"
              title="Generate admin AI insights"
            >
              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_46px_-34px_rgba(15,23,42,0.18)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <SparklesIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        AI focus
                      </p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        Summaries, bottlenecks, and action priorities for the platform.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <FormField htmlFor="admin-ai-question" label="Focus question">
                      <TextField
                        as="textarea"
                        className="min-h-32"
                        id="admin-ai-question"
                        onChange={(event) => setAdminAiQuestion(event.target.value)}
                        placeholder="Example: Which operational issue should I fix first to improve student attachment conversion?"
                        value={adminAiQuestion}
                      />
                    </FormField>
                  </div>

                  <div className="mt-5">
                    <Button
                      disabled={isGeneratingAdminAi}
                      onClick={handleGenerateAdminAiInsight}
                      type="button"
                    >
                      {isGeneratingAdminAi ? "Analyzing..." : "Generate AI Summary"}
                    </Button>
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_56%,#fff7ed_100%)] p-5 shadow-[0_18px_46px_-34px_rgba(15,23,42,0.16)]">
                  {adminAiInsight ? (
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                          AI Headline
                        </p>
                        <h3 className="mt-3 text-2xl leading-snug text-slate-950">
                          {adminAiInsight.headline}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {adminAiInsight.summary}
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <article className="rounded-[22px] border border-white/70 bg-white/88 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Priorities
                          </p>
                          <div className="mt-4 grid gap-3">
                            {adminAiInsight.priorities?.map((item) => (
                              <p className="text-sm leading-7 text-slate-900" key={item}>
                                {item}
                              </p>
                            ))}
                          </div>
                        </article>

                        <article className="rounded-[22px] border border-white/70 bg-white/88 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Risks
                          </p>
                          <div className="mt-4 grid gap-3">
                            {adminAiInsight.risks?.map((item) => (
                              <p className="text-sm leading-7 text-slate-900" key={item}>
                                {item}
                              </p>
                            ))}
                          </div>
                        </article>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full min-h-64 items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white/75 p-6 text-center">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          AI Result
                        </p>
                        <p className="mt-3 text-base leading-7 text-slate-600">
                          Generate an AI summary to get a live operational view of vacancies, applications, and platform pressure points.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              description="Summary view of platform usage, vacancies, and application outcomes."
              eyebrow="Reports / Statistics"
              title="Operational overview"
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Accepted",
                    value: reportSummary.accepted,
                    accent: "emerald",
                    badge: "A1",
                  },
                  {
                    label: "Rejected",
                    value: reportSummary.rejected,
                    accent: "orange",
                    badge: "R1",
                  },
                  {
                    label: "Under Review",
                    value: reportSummary.review,
                    accent: "blue",
                    badge: "U1",
                  },
                  {
                    label: "Open Vacancies",
                    value: reportSummary.openVacancies,
                    accent: "slate",
                    badge: "V1",
                  },
                ].map((card) => (
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
              description="Current vacancy status and deadlines across the platform."
              eyebrow="Vacancy Preview"
              title="Live vacancy status"
            >
              {renderVacancyPreview()}
            </DashboardCard>

            {adminAiInsight && (
              <DashboardCard
                description="Specific operational actions the AI recommends based on the live admin dashboard data."
                eyebrow="AI Actions"
                title="Recommended next steps"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {adminAiInsight.actions?.map((item) => (
                    <article
                      className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5"
                      key={item}
                    >
                      <p className="text-sm leading-7 text-slate-700">{item}</p>
                    </article>
                  ))}
                </div>
              </DashboardCard>
            )}
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  const mobileActiveNav = ["post-vacancy", "manage-vacancies"].includes(activeSection)
    ? "manage-vacancies"
    : ["view-applications", "update-status"].includes(activeSection)
      ? "view-applications"
      : ["manage-students", "reports"].includes(activeSection)
        ? "manage-students"
        : activeSection;

  return (
    <section className="dashboard-shell relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#e9eef5_0%,#dde6ef_100%)] p-3 pb-28 sm:p-6 sm:pb-28 lg:p-7 lg:pb-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-7rem] top-6 hidden h-64 w-64 rounded-full bg-orange-300/18 blur-3xl sm:block" />
        <div className="absolute right-[-6rem] top-12 hidden h-64 w-64 rounded-full bg-sky-300/18 blur-3xl sm:block" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:gap-7">
        <Sidebar
          activeItem={activeSection}
          isOpen={sidebarOpen}
          items={sidebarItems}
          mobileSubtitle={adminName}
          mobileTitle="Admin Dashboard"
          onClose={() => setSidebarOpen(false)}
          onNotificationSelect={selectSection}
          onOpen={() => setSidebarOpen(true)}
          onSelect={selectSection}
          notifications={dashboardNotifications}
          subtitle={adminName}
          title="Admin Panel"
        />

        <div className="w-full flex-1 space-y-4 sm:space-y-5 lg:space-y-6">
          {renderMainContent()}
        </div>
      </div>

      <MobileBottomNav
        activeItem={mobileActiveNav}
        items={mobileBottomNavItems}
        onSelect={handleMobileNavSelect}
      />

      <DocumentPreviewModal
        eyebrow="Student CV"
        fileName={cvPreview.fileName}
        isOpen={cvPreview.isOpen}
        onClose={closeCvPreview}
        onDownload={handleDownloadPreviewCv}
        title="Student CV Preview"
        url={cvPreview.url}
      />
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Logout"
        isOpen={showLogoutConfirm}
        isProcessing={isLoggingOut}
        message="Are you sure you want to log out?"
        onCancel={() => {
          if (!isLoggingOut) {
            setShowLogoutConfirm(false);
          }
        }}
        onConfirm={handleLogout}
        title="Log out of your account?"
      />
    </section>
  );
}

export default AdminDashboard;

