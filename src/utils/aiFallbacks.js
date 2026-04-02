function uniqueItems(items = []) {
  return Array.from(new Set(items.filter(Boolean)));
}

export function buildStudentFallbackInsight({
  studentFirstName,
  cvAnalysis,
  savedOpportunities = [],
  applications = [],
  profileState = {},
  question = "",
}) {
  const strengths = [];
  const risks = [];
  const nextSteps = [];

  if (profileState.program) {
    strengths.push(`Your program is already filled in, which helps employers understand your track.`);
  }

  if (cvAnalysis.score >= 65) {
    strengths.push(`Your profile readiness is already in a ${cvAnalysis.readinessLabel.toLowerCase()} range.`);
  }

  if (applications.length > 0) {
    strengths.push(`You have started applying, which gives you real traction instead of waiting too long.`);
  }

  if (!profileState.university) {
    risks.push("Your university is still missing, which weakens the profile for attachment review.");
    nextSteps.push("Add your university details so your student profile feels complete.");
  }

  if (!cvAnalysis.checks.find((item) => item.label === "CV uploaded as PDF")?.complete) {
    risks.push("Your CV is not yet uploaded as a PDF, so you are not fully application-ready.");
    nextSteps.push("Upload a polished CV in PDF format before sending more applications.");
  }

  if (!savedOpportunities.length && !applications.length) {
    risks.push("You have not saved or submitted enough opportunities yet.");
    nextSteps.push("Save at least 3 relevant vacancies and apply to the best matches first.");
  }

  if (!nextSteps.length) {
    nextSteps.push("Keep applying consistently to the most relevant opportunities this week.");
  }

  const suggestedSearches = uniqueItems([
    profileState.program ? `${profileState.program} attachment Zimbabwe` : "",
    profileState.level ? `level ${profileState.level} attachment opportunities` : "",
    savedOpportunities[0]?.vacancyTitle ? savedOpportunities[0].vacancyTitle : "",
    question || "",
  ]).slice(0, 4);

  return {
    headline: `Here is your attachment readiness review, ${studentFirstName}.`,
    score: cvAnalysis.score,
    answer:
      question && question.trim()
        ? `Based on your question, the strongest next move is to tighten your profile readiness and focus on vacancies that match your program and level. Your current score is ${cvAnalysis.score}% and the most important improvements are around profile completeness and application momentum.`
        : `Your current profile looks ${cvAnalysis.readinessLabel.toLowerCase()}, with a readiness score of ${cvAnalysis.score}%. The best results will come from tightening any missing academic details and applying more deliberately to relevant vacancies.`,
    strengths: uniqueItems(
      strengths.length
        ? strengths
        : ["You already have a workable starting profile for attachment applications."],
    ).slice(0, 4),
    risks: uniqueItems(
      risks.length
        ? risks
        : ["Your next risk is slowing down after a good start instead of applying consistently."],
    ).slice(0, 4),
    nextSteps: uniqueItems(nextSteps).slice(0, 5),
    suggestedSearches,
  };
}

export function buildAdminFallbackInsight({
  reportSummary,
  students = [],
  applications = [],
  vacancies = [],
  question = "",
}) {
  const priorities = [];
  const risks = [];
  const actions = [];

  if (reportSummary.openVacancies === 0) {
    priorities.push("Post fresh vacancies immediately so students have live opportunities to pursue.");
    risks.push("Students cannot progress if the vacancy pipeline is empty.");
  } else {
    priorities.push(`Keep the ${reportSummary.openVacancies} open vacancies current and visible.`);
  }

  if (reportSummary.review > 0) {
    priorities.push(`Clear the ${reportSummary.review} applications under review to reduce waiting time.`);
    actions.push("Update pending application statuses so students get timely feedback.");
  }

  if (students.length > applications.length && students.length > 0) {
    risks.push("A large share of registered students may not be converting into active applications.");
    actions.push("Encourage inactive students to complete profiles, upload CVs, and apply.");
  }

  if (vacancies.some((item) => item.status === "Closed")) {
    actions.push("Archive or refresh closed vacancies so the dashboard stays clean.");
  }

  if (!actions.length) {
    actions.push("Maintain consistent vacancy posting and application review cadence this week.");
  }

  return {
    headline: "Admin operations snapshot is ready.",
    summary:
      question && question.trim()
        ? `Based on your question, the main operational focus should be vacancy freshness, review speed, and student conversion from registration into application activity.`
        : `The platform is currently being shaped by vacancy availability, application review speed, and how effectively registered students are moving into active applications.`,
    priorities: uniqueItems(
      priorities.length ? priorities : ["Maintain steady vacancy and application monitoring."],
    ).slice(0, 4),
    risks: uniqueItems(
      risks.length ? risks : ["Operational drift can happen if vacancy and status updates slow down."],
    ).slice(0, 4),
    actions: uniqueItems(actions).slice(0, 5),
  };
}

export function buildCvRewriteFallback(cvText = "", focus = "") {
  const trimmedText = String(cvText || "").trim();
  const trimmedFocus = String(focus || "").trim();

  if (!trimmedText) {
    return {
      headline: "Paste a CV point first.",
      rewrittenText: "",
      improvements: [
        "Add one CV bullet, profile summary, or experience line before requesting a rewrite.",
      ],
    };
  }

  const normalized = trimmedText.replace(/\s+/g, " ").trim();
  const startsWithVerb = /^(led|built|managed|designed|developed|supported|coordinated|implemented|analysed|analyzed|maintained|created|improved|delivered)\b/i.test(
    normalized,
  );

  const rewrittenText = startsWithVerb
    ? `${normalized}${normalized.endsWith(".") ? "" : "."}`
    : `Supported ${normalized.charAt(0).toLowerCase()}${normalized.slice(1)}${normalized.endsWith(".") ? "" : "."}`;

  const improvements = uniqueItems([
    trimmedFocus ? `Tailor the wording to ${trimmedFocus}.` : "",
    "Start with a strong action verb.",
    "Keep the point outcome-focused instead of describing duties only.",
    "Add a measurable result where possible.",
  ]).slice(0, 4);

  return {
    headline: "Your CV point has been tightened for clarity.",
    rewrittenText,
    improvements,
  };
}
