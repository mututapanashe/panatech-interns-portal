import { normalizeTextList, normalizeVacancyRecord } from "./platformModels";

function tokenize(value) {
  return String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function tokenSet(value) {
  return new Set(tokenize(value));
}

function intersection(left, right) {
  return left.filter((item) => right.includes(item));
}

function hasProgramAlignment(studentProgram, vacancyCategory) {
  const studentTokens = [...tokenSet(studentProgram)];
  const vacancyTokens = [...tokenSet(vacancyCategory)];

  if (!studentTokens.length || !vacancyTokens.length) {
    return false;
  }

  const overlap = intersection(studentTokens, vacancyTokens);
  const minimumOverlap = Math.min(2, Math.min(studentTokens.length, vacancyTokens.length));

  return overlap.length >= minimumOverlap || studentProgram.toLowerCase().includes(vacancyCategory.toLowerCase()) || vacancyCategory.toLowerCase().includes(studentProgram.toLowerCase());
}

export function calculateProfileCompletion(profile = {}, hasCv = false) {
  const checks = [
    { label: "Full name", complete: Boolean(String(profile.name || "").trim()) },
    { label: "University", complete: Boolean(String(profile.university || "").trim()) },
    { label: "Program", complete: Boolean(String(profile.program || "").trim()) },
    { label: "Level", complete: Boolean(String(profile.level || "").trim()) },
    {
      label: "Preferred location",
      complete: Boolean(String(profile.preferredLocation || "").trim()),
    },
    { label: "Skills", complete: normalizeTextList(profile.skills).length > 0 },
    { label: "Interests", complete: normalizeTextList(profile.interests).length > 0 },
    { label: "CV uploaded", complete: Boolean(hasCv) },
  ];

  const completed = checks.filter((item) => item.complete).length;

  return {
    checks,
    percentage: Math.round((completed / checks.length) * 100),
  };
}

export function scoreVacancyMatch(profile = {}, vacancyInput = {}) {
  const vacancy = normalizeVacancyRecord(vacancyInput);
  const studentSkills = normalizeTextList(profile.skills).map((item) => item.toLowerCase());
  const vacancySkills = normalizeTextList(vacancy.requiredSkills).map((item) => item.toLowerCase());
  const studentInterests = normalizeTextList(profile.interests).map((item) => item.toLowerCase());
  const vacancyTags = normalizeTextList(vacancy.tags).map((item) => item.toLowerCase());

  const programMatch = hasProgramAlignment(profile.program, vacancy.category);
  const sharedSkills = intersection(studentSkills, vacancySkills);
  const sharedInterests = intersection(studentInterests, vacancyTags);
  const locationMatch =
    String(profile.preferredLocation || "").trim() &&
    String(vacancy.location || "")
      .toLowerCase()
      .includes(String(profile.preferredLocation || "").trim().toLowerCase());

  const score =
    (programMatch ? 52 : 0) +
    Math.min(sharedSkills.length * 14, 30) +
    (locationMatch ? 13 : 0) +
    Math.min(sharedInterests.length * 5, 10);

  const reasons = [];

  if (programMatch) {
    reasons.push("Matches your program");
  }
  if (sharedSkills.length) {
    reasons.push("Matches your skills");
  }
  if (locationMatch) {
    reasons.push("Matches your location");
  }
  if (!reasons.length && sharedInterests.length) {
    reasons.push("Matches your interests");
  }

  return {
    recommended: score >= 18 || reasons.length > 0,
    score,
    reasons,
    sharedSkills,
    sharedInterests,
    locationMatch,
    programMatch,
  };
}

export function rankVacanciesForStudent(profile = {}, vacancies = []) {
  return vacancies
    .map((vacancy) => {
      const match = scoreVacancyMatch(profile, vacancy);
      return {
        ...normalizeVacancyRecord(vacancy),
        match,
      };
    })
    .sort((left, right) => {
      if (right.match.score !== left.match.score) {
        return right.match.score - left.match.score;
      }

      return String(left.deadline || "").localeCompare(String(right.deadline || ""));
    });
}
