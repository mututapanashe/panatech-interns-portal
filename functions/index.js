/* global exports, require */
const admin = require("firebase-admin");
const { defineSecret, defineString } = require("firebase-functions/params");
const { HttpsError, onCall } = require("firebase-functions/v2/https");

admin.initializeApp();

const db = admin.firestore();
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");
const OPENAI_MODEL = defineString("OPENAI_MODEL", {
  default: "gpt-5.4",
});

function extractOutputText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  if (!Array.isArray(payload.output)) {
    return "";
  }

  return payload.output
    .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
    .map((item) => item.text || item.output_text || "")
    .filter(Boolean)
    .join("\n");
}

async function isAdmin(uid) {
  const snapshot = await db.collection("admins").doc(uid).get();
  return snapshot.exists;
}

function buildStudentPrompt(payload) {
  return [
    "You are panaTECH Attachment Hub AI, helping Zimbabwean university students prepare for industrial attachment.",
    "Be practical, specific, and honest.",
    "Focus on employability, profile gaps, application momentum, and next steps.",
    "When the student asks a question, answer it directly while still giving structured guidance.",
    "",
    JSON.stringify(payload),
  ].join("\n");
}

function buildAdminPrompt(payload) {
  return [
    "You are panaTECH Attachment Hub AI for administrators managing student attachment operations.",
    "Analyze the current vacancy pipeline, application flow, and platform bottlenecks.",
    "Be operational, concise, and action-oriented.",
    "Highlight the most important priorities first.",
    "",
    JSON.stringify(payload),
  ].join("\n");
}

function buildStudentRewritePrompt(payload) {
  return [
    "You are panaTECH Attachment Hub AI, rewriting CV content for Zimbabwean university students preparing for industrial attachment.",
    "Rewrite the student's CV text professionally and clearly.",
    "Make it concise, action-oriented, and stronger for employers.",
    "Do not fabricate achievements.",
    "",
    JSON.stringify(payload),
  ].join("\n");
}

function buildSchema(audience) {
  if (audience === "admin") {
    return {
      type: "object",
      additionalProperties: false,
      properties: {
        headline: { type: "string" },
        summary: { type: "string" },
        priorities: {
          type: "array",
          items: { type: "string" },
        },
        risks: {
          type: "array",
          items: { type: "string" },
        },
        actions: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["headline", "summary", "priorities", "risks", "actions"],
    };
  }

  if (audience === "student-rewrite") {
    return {
      type: "object",
      additionalProperties: false,
      properties: {
        headline: { type: "string" },
        rewrittenText: { type: "string" },
        improvements: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["headline", "rewrittenText", "improvements"],
    };
  }

  return {
    type: "object",
    additionalProperties: false,
    properties: {
      headline: { type: "string" },
      score: {
        type: "number",
        minimum: 0,
        maximum: 100,
      },
      answer: { type: "string" },
      strengths: {
        type: "array",
        items: { type: "string" },
      },
      risks: {
        type: "array",
        items: { type: "string" },
      },
      nextSteps: {
        type: "array",
        items: { type: "string" },
      },
      suggestedSearches: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: [
      "headline",
      "score",
      "answer",
      "strengths",
      "risks",
      "nextSteps",
      "suggestedSearches",
    ],
  };
}

exports.generateDashboardInsight = onCall(
  {
    region: "us-central1",
    secrets: [OPENAI_API_KEY],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be signed in to use AI insights.");
    }

    const { audience, payload } = request.data || {};

    if (audience !== "student" && audience !== "student-rewrite" && audience !== "admin") {
      throw new HttpsError("invalid-argument", "Invalid AI audience.");
    }

    if (audience === "admin" && !(await isAdmin(request.auth.uid))) {
      throw new HttpsError("permission-denied", "Only admins can request admin AI insights.");
    }

    const apiKey = OPENAI_API_KEY.value();
    if (!apiKey) {
      throw new HttpsError("failed-precondition", "OpenAI API key is not configured.");
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL.value(),
        max_output_tokens: audience === "admin" ? 900 : 1100,
        input: [
          {
            role: "system",
            content:
              audience === "admin"
                ? "Return structured JSON only. Do not include markdown."
                : "Return structured JSON only. Do not include markdown.",
          },
          {
            role: "user",
            content:
              audience === "admin"
                ? buildAdminPrompt(payload)
                : audience === "student-rewrite"
                  ? buildStudentRewritePrompt(payload)
                  : buildStudentPrompt(payload),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name:
              audience === "admin"
                ? "admin_dashboard_ai"
                : audience === "student-rewrite"
                  ? "student_cv_rewrite_ai"
                  : "student_dashboard_ai",
            strict: true,
            schema: buildSchema(audience),
          },
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new HttpsError(
        "internal",
        result?.error?.message || "OpenAI request failed.",
      );
    }

    const outputText = extractOutputText(result);
    if (!outputText) {
      throw new HttpsError("internal", "AI response was empty.");
    }

    try {
      return JSON.parse(outputText);
    } catch (error) {
      console.error("Failed to parse AI response:", error, outputText);
      throw new HttpsError("internal", "AI response could not be parsed.");
    }
  },
);
