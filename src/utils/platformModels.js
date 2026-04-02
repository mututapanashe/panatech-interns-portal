function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeUrl(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return "";
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return `https://${normalized}`;
}

export function normalizeApplicationMethod(value) {
  const normalized = normalizeText(value).toLowerCase();

  if (normalized === "email" || normalized === "external" || normalized === "portal") {
    return normalized;
  }

  return "portal";
}

function titleCaseWords(value) {
  return normalizeText(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

export function normalizeTextList(value) {
  const rawValues = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/[\n,;|]/)
        .map((item) => item.trim());

  return [...new Set(rawValues.map((item) => normalizeText(item)).filter(Boolean))];
}

export function joinTextList(value) {
  return normalizeTextList(value).join(", ");
}

export function getVacancyApplicationMeta(value) {
  const method =
    typeof value === "string"
      ? normalizeApplicationMethod(value)
      : normalizeApplicationMethod(value?.applicationMethod);

  const applicationMeta = {
    portal: {
      actionLabel: "Apply Now",
      badgeLabel: "Portal Apply",
      eyebrow: "Portal Application",
      helperLabel: "Apply directly inside the portal.",
      method,
    },
    email: {
      actionLabel: "Apply via Email",
      badgeLabel: "Email Apply",
      eyebrow: "Email Application",
      helperLabel: "Follow the email instructions before marking this as applied.",
      method,
    },
    external: {
      actionLabel: "Open Application Link",
      badgeLabel: "External Apply",
      eyebrow: "External Application",
      helperLabel: "Complete the application on the destination website, then track it here.",
      method,
    },
  };

  return applicationMeta[method] || applicationMeta.portal;
}

export function normalizeStudentProfileFields(profileInput = {}, currentProfile = {}) {
  const nextProfile = {
    ...currentProfile,
    name: normalizeText(profileInput.name ?? currentProfile.name ?? ""),
    email: normalizeText(profileInput.email ?? currentProfile.email ?? "").toLowerCase(),
    university: normalizeText(profileInput.university ?? currentProfile.university ?? ""),
    program: normalizeText(profileInput.program ?? currentProfile.program ?? ""),
    level: normalizeText(profileInput.level ?? currentProfile.level ?? ""),
    preferredLocation: normalizeText(
      profileInput.preferredLocation ?? currentProfile.preferredLocation ?? "",
    ),
    skills: normalizeTextList(profileInput.skills ?? currentProfile.skills ?? []),
    interests: normalizeTextList(profileInput.interests ?? currentProfile.interests ?? []),
    cvURL:
      Object.prototype.hasOwnProperty.call(profileInput, "cvURL")
        ? profileInput.cvURL
        : currentProfile.cvURL ?? null,
    cvFileName:
      Object.prototype.hasOwnProperty.call(profileInput, "cvFileName")
        ? profileInput.cvFileName
        : currentProfile.cvFileName ?? null,
    cvStoragePath:
      Object.prototype.hasOwnProperty.call(profileInput, "cvStoragePath")
        ? profileInput.cvStoragePath
        : currentProfile.cvStoragePath ?? null,
    cvUploadedAt:
      Object.prototype.hasOwnProperty.call(profileInput, "cvUploadedAt")
        ? profileInput.cvUploadedAt
        : currentProfile.cvUploadedAt ?? null,
    cvVersions: Array.isArray(profileInput.cvVersions ?? currentProfile.cvVersions)
      ? [...(profileInput.cvVersions ?? currentProfile.cvVersions)]
      : [],
  };

  return nextProfile;
}

export function normalizeVacancyPayload(payload = {}, options = {}) {
  const category = normalizeText(payload.category || payload.programCategory || payload.program);
  const companyName = normalizeText(payload.companyName || payload.company);
  const vacancyTitle = normalizeText(payload.vacancyTitle || payload.position || payload.title);
  const location = normalizeText(payload.location);
  const deadline = normalizeText(payload.deadline);
  const status = titleCaseWords(payload.status || "Open") || "Open";
  const vacancyType = titleCaseWords(payload.vacancyType || payload.type || "On-site") || "On-site";
  const companyId = normalizeText(payload.companyId || options.companyId || "");
  const tags = normalizeTextList(payload.tags);
  const requiredSkills = normalizeTextList(payload.requiredSkills || payload.skills);
  const requiredDocuments = normalizeTextList(
    payload.requiredDocuments || payload.documents || payload.requiredFiles,
  );
  const ownerRole = normalizeText(payload.ownerRole || options.ownerRole || "admin").toLowerCase();
  const applicationMethod = normalizeApplicationMethod(payload.applicationMethod);

  return {
    companyId,
    companyName,
    vacancyTitle,
    category,
    location,
    vacancyType,
    deadline,
    status,
    description: normalizeText(payload.description),
    requiredSkills,
    requiredDocuments,
    tags,
    applicationMethod,
    applicationEmail: normalizeText(payload.applicationEmail).toLowerCase(),
    applicationLink: normalizeUrl(payload.applicationLink),
    applicationInstructions: normalizeText(payload.applicationInstructions),
    ownerRole: ownerRole || "admin",
    sourceAccountType: ownerRole || "admin",
  };
}

export function normalizeVacancyRecord(vacancy = {}) {
  const normalized = normalizeVacancyPayload(vacancy, {
    companyId: vacancy.companyId,
    ownerRole: vacancy.ownerRole || vacancy.sourceAccountType || "admin",
  });

  return {
    id: vacancy.id,
    ...vacancy,
    ...normalized,
  };
}
