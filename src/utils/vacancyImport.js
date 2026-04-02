import * as XLSX from "xlsx";
import { normalizeVacancyPayload } from "./platformModels";

const headerAliases = {
  applicationEmail: ["application email", "email", "apply email", "destination email"],
  applicationInstructions: ["application instructions", "instructions", "how to apply"],
  applicationLink: ["application link", "external link", "website", "apply link"],
  applicationMethod: ["application method", "apply method", "submission method", "method"],
  category: ["category", "program", "program category", "major"],
  companyName: ["company", "company name", "organisation", "organization"],
  deadline: ["deadline", "closing date", "closing"],
  description: ["description", "role description", "details"],
  location: ["location", "city", "town"],
  requiredDocuments: ["required documents", "documents", "required files"],
  requiredSkills: ["required skills", "skills", "skill requirements"],
  status: ["status"],
  tags: ["tags", "keywords", "interests"],
  vacancyTitle: ["vacancy", "vacancy title", "title", "position", "role"],
};

function findValue(row, aliases) {
  const rowEntries = Object.entries(row || {});
  const matched = rowEntries.find(([key]) =>
    aliases.includes(String(key || "").trim().toLowerCase()),
  );
  return matched ? matched[1] : "";
}

function mapImportRow(row) {
  return Object.entries(headerAliases).reduce((accumulator, [field, aliases]) => {
    accumulator[field] = findValue(row, aliases);
    return accumulator;
  }, {});
}

function validateVacancyPayload(payload) {
  const errors = [];

  if (!payload.companyName) {
    errors.push("Company name is required.");
  }
  if (!payload.vacancyTitle) {
    errors.push("Vacancy title is required.");
  }
  if (!payload.category) {
    errors.push("Category/program is required.");
  }
  if (!payload.location) {
    errors.push("Location is required.");
  }
  if (!payload.deadline) {
    errors.push("Deadline is required.");
  }
  if (payload.applicationMethod === "email" && !payload.applicationEmail) {
    errors.push("Application email is required for email-based vacancies.");
  }
  if (payload.applicationMethod === "external" && !payload.applicationLink) {
    errors.push("Application link is required for external vacancies.");
  }

  return errors;
}

export async function parseVacancyImportFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  return rows.map((row, index) => {
    const payload = normalizeVacancyPayload(mapImportRow(row));
    const errors = validateVacancyPayload(payload);

    return {
      id: `import-row-${index + 1}`,
      rowNumber: index + 2,
      payload,
      errors,
      isValid: errors.length === 0,
    };
  });
}
