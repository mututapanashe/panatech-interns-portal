import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/config";

function ensureAiServiceConfigured() {
  if (!functions) {
    throw new Error("AI service is not configured yet.");
  }
}

function callInsightFunction(payload) {
  ensureAiServiceConfigured();
  const generateDashboardInsight = httpsCallable(functions, "generateDashboardInsight");
  return generateDashboardInsight(payload);
}

export async function generateStudentAiInsight(payload) {
  const response = await callInsightFunction({
    audience: "student",
    payload,
  });

  return response.data;
}

export async function rewriteStudentCvSection(payload) {
  const response = await callInsightFunction({
    audience: "student-rewrite",
    payload,
  });

  return response.data;
}

export async function generateAdminAiInsight(payload) {
  const response = await callInsightFunction({
    audience: "admin",
    payload,
  });

  return response.data;
}
