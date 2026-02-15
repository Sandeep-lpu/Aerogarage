import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TRAINING_RESOURCE_DIR = path.resolve(__dirname, "../../../../storage/training-resources");

const TRAINING_RESOURCE_CATALOG = [
  {
    id: "RES-001",
    title: "Part-66 Module Guidebook",
    type: "PDF",
    category: "study",
    updatedAt: "2026-02-01T08:00:00.000Z",
    filename: "part66-guidebook.pdf",
  },
  {
    id: "RES-002",
    title: "Avionics Fundamentals Slides",
    type: "PPTX",
    category: "lecture",
    updatedAt: "2026-01-21T09:30:00.000Z",
    filename: "avionics-fundamentals.pptx",
  },
  {
    id: "RES-003",
    title: "Workshop Safety Checklist",
    type: "PDF",
    category: "compliance",
    updatedAt: "2026-02-10T11:15:00.000Z",
    filename: "workshop-safety-checklist.pdf",
  },
];

const trainingModules = [
  {
    id: "M01",
    code: "B1-01",
    title: "EASA Part-66 Mathematics and Physics",
    progress: 82,
    status: "in progress",
    instructor: "Eng. Faisal Al-Harbi",
  },
  {
    id: "M02",
    code: "B1-07A",
    title: "Maintenance Practices",
    progress: 100,
    status: "completed",
    instructor: "Eng. Omar Al-Qahtani",
  },
  {
    id: "M03",
    code: "B2-13",
    title: "Aircraft Aerodynamics and Systems",
    progress: 45,
    status: "in progress",
    instructor: "Eng. Areej Al-Mutairi",
  },
];

const examScheduleAndResults = [
  {
    id: "EX-2026-031",
    module: "B1-01 Mathematics and Physics",
    examDate: "2026-03-14T09:00:00.000Z",
    location: "Riyadh Training Center - Hall A",
    status: "scheduled",
    score: null,
    result: "pending",
  },
  {
    id: "EX-2026-024",
    module: "B1-07A Maintenance Practices",
    examDate: "2026-01-28T10:00:00.000Z",
    location: "Riyadh Training Center - Hall B",
    status: "completed",
    score: 88,
    result: "pass",
  },
  {
    id: "EX-2025-119",
    module: "B2-11 Electronic Fundamentals",
    examDate: "2025-12-10T13:00:00.000Z",
    location: "Riyadh Training Center - Hall C",
    status: "completed",
    score: 73,
    result: "pass",
  },
];

function getTrainingModules() {
  return trainingModules;
}

function updateTrainingModule(moduleId, updates) {
  const moduleItem = trainingModules.find((entry) => entry.id === moduleId);
  if (!moduleItem) return null;

  if (typeof updates.title === "string") moduleItem.title = updates.title;
  if (typeof updates.instructor === "string") moduleItem.instructor = updates.instructor;
  if (typeof updates.status === "string") moduleItem.status = updates.status;
  if (typeof updates.progress === "number") {
    const safeProgress = Math.max(0, Math.min(100, Math.floor(updates.progress)));
    moduleItem.progress = safeProgress;
  }

  return moduleItem;
}

function getExamScheduleAndResults() {
  return examScheduleAndResults;
}

function getTrainingResources() {
  return TRAINING_RESOURCE_CATALOG.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    category: item.category,
    updatedAt: item.updatedAt,
    downloadPath: `/api/training/resources/${item.id}/download`,
  }));
}

function getTrainingResourceById(resourceId) {
  const resource = TRAINING_RESOURCE_CATALOG.find((item) => item.id === resourceId);
  if (!resource) return null;

  const filePath = path.resolve(TRAINING_RESOURCE_DIR, resource.filename);
  const exists = fs.existsSync(filePath);

  return {
    ...resource,
    filePath,
    exists,
  };
}

export function getTrainingDashboard(user) {
  const activeModules = trainingModules.filter((entry) => entry.status !== "completed").length;
  const upcomingExams = examScheduleAndResults.filter((entry) => entry.status === "scheduled").length;
  const completedExams = examScheduleAndResults.filter((entry) => entry.status === "completed").length;

  return {
    studentName: user?.email || "Student",
    summary: {
      activeModules,
      upcomingExams,
      completedExams,
    },
  };
}

export {
  getTrainingModules,
  getExamScheduleAndResults,
  getTrainingResources,
  getTrainingResourceById,
  updateTrainingModule,
};
