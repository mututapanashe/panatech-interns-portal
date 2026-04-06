import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  where,
  query,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { normalizeVacancyPayload, normalizeVacancyRecord } from "../utils/platformModels";

function sortByDate(items, primaryField) {
  return [...items].sort((left, right) => {
    const leftValue = left[primaryField] || left.updatedAt || left.createdAt || "";
    const rightValue = right[primaryField] || right.updatedAt || right.createdAt || "";
    return String(rightValue).localeCompare(String(leftValue));
  });
}

function sanitizeFileName(fileName) {
  return String(fileName || "document")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

function applicationDocId(studentId, vacancyId) {
  return `${studentId}_${vacancyId}`.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

function mapVacancySnapshot(snapshot) {
  return snapshot.docs.map((item) => normalizeVacancyRecord({ id: item.id, ...item.data() }));
}

export function subscribeToStudentApplications(studentId, callback, onError) {
  const applicationsQuery = query(
    collection(db, "applications"),
    where("studentId", "==", studentId),
  );

  let active = true;

  getDocs(applicationsQuery)
    .then((snapshot) => {
      if (!active) {
        return;
      }

      callback(sortByDate(mapSnapshot(snapshot), "dateApplied"));
    })
    .catch((error) => {
      if (active && onError) {
        onError(error);
      }
    });

  return () => {
    active = false;
  };
}

export function subscribeToAllApplications(callback, onError) {
  return onSnapshot(
    collection(db, "applications"),
    (snapshot) => {
      callback(sortByDate(mapSnapshot(snapshot), "dateApplied"));
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
}

export function subscribeToVacancies(callback, onError) {
  return onSnapshot(
    collection(db, "vacancies"),
    (snapshot) => {
      callback(sortByDate(mapVacancySnapshot(snapshot), "createdAt"));
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
}

export function subscribeToStudents(callback, onError) {
  return onSnapshot(
    collection(db, "students"),
    (snapshot) => {
      callback(sortByDate(mapSnapshot(snapshot), "updatedAt"));
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
}

export async function createVacancy(payload) {
  const nextVacancy = {
    ...normalizeVacancyPayload(payload),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const vacancyReference = await addDoc(collection(db, "vacancies"), nextVacancy);
  return { id: vacancyReference.id, ...nextVacancy };
}

export async function bulkCreateVacancies(records = []) {
  const items = records
    .map((item) => normalizeVacancyPayload(item))
    .filter((item) => item.companyName && item.vacancyTitle && item.category && item.deadline);

  if (!items.length) {
    return [];
  }

  const timestamp = new Date().toISOString();
  const vacanciesCollection = collection(db, "vacancies");
  const write = writeBatch(db);

  const createdItems = items.map((item) => {
    const vacancyReference = doc(vacanciesCollection);
    const payload = {
      ...item,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    write.set(vacancyReference, payload);

    return {
      id: vacancyReference.id,
      ...payload,
    };
  });

  await write.commit();
  return createdItems;
}

export async function createApplicationFromVacancy({
  student,
  vacancy,
  status = "Submitted",
  submittedExternally = false,
}) {
  const docId = applicationDocId(student.uid, vacancy.id);
  const applicationReference = doc(db, "applications", docId);
  const existingApplication = await getDoc(applicationReference);

  if (existingApplication.exists()) {
    throw new Error("You already applied for this attachment vacancy.");
  }

  const now = new Date().toISOString();
  const payload = {
    studentId: student.uid,
    studentName: student.name,
    studentEmail: student.email,
    studentProgram: student.program,
    studentSkills: student.skills || [],
    studentLevel: student.level,
    studentPreferredLocation: student.preferredLocation || "",
    university: student.university || "Zimbabwean University Student",
    vacancyId: vacancy.id,
    companyId: vacancy.companyId || "",
    vacancyCategory: vacancy.category || "",
    vacancyLocation: vacancy.location || "",
    vacancyTags: vacancy.tags || [],
    company: vacancy.companyName || vacancy.company,
    companyApplied: vacancy.companyName || vacancy.company,
    position: vacancy.vacancyTitle || vacancy.position,
    status,
    applicationMethod: vacancy.applicationMethod || "portal",
    applicationEmail: vacancy.applicationEmail || "",
    applicationLink: vacancy.applicationLink || "",
    applicationInstructions: vacancy.applicationInstructions || "",
    requiredDocuments: vacancy.requiredDocuments || [],
    submittedExternally,
    dateApplied: now,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(applicationReference, payload);
  return { id: docId, ...payload };
}

export async function updateApplicationStatus(applicationId, status) {
  await updateDoc(doc(db, "applications", applicationId), {
    status,
    updatedAt: new Date().toISOString(),
  });
}

export async function uploadStudentCv(userId, file, previousStoragePath = "") {
  if (previousStoragePath) {
    try {
      await deleteObject(ref(storage, previousStoragePath));
    } catch (error) {
      if (error?.code !== "storage/object-not-found") {
        throw error;
      }
    }
  }

  const storagePath = `student-cvs/${userId}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const cvReference = ref(storage, storagePath);
  await uploadBytes(cvReference, file);
  const cvURL = await getDownloadURL(cvReference);

  return {
    cvURL,
    cvFileName: sanitizeFileName(file.name),
    cvStoragePath: storagePath,
    cvUploadedAt: new Date().toISOString(),
  };
}

export async function removeStudentCv(storagePath) {
  if (!storagePath) {
    return;
  }

  await deleteObject(ref(storage, storagePath));
}

export async function getStudentCvViewUrl(storagePath, fallbackUrl = "") {
  if (storagePath) {
    return getDownloadURL(ref(storage, storagePath));
  }

  if (fallbackUrl) {
    return fallbackUrl;
  }

  throw new Error("No CV is currently available.");
}
