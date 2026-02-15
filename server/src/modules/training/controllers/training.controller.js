import {
  getExamScheduleAndResults,
  getTrainingResourceById,
  getTrainingDashboard,
  getTrainingModules,
  getTrainingResources,
} from "../services/training.service.js";

export function getTrainingDashboardController(req, res) {
  const dashboard = getTrainingDashboard(req.user);
  return res.success({ dashboard }, "Training dashboard fetched");
}

export function getTrainingModulesController(req, res) {
  const modules = getTrainingModules();
  return res.success({ modules }, "Training modules fetched");
}

export function getTrainingExamsController(req, res) {
  const exams = getExamScheduleAndResults();
  return res.success({ exams }, "Exam schedule and results fetched");
}

export function getTrainingResourcesController(req, res) {
  const resources = getTrainingResources();
  return res.success({ resources }, "Training resources fetched");
}

export function downloadTrainingResourceController(req, res) {
  const resource = getTrainingResourceById(req.params.resourceId);

  if (!resource) {
    return res.fail("Training resource not found", 404);
  }

  if (!resource.exists) {
    return res.fail(
      `Resource file missing on server: ${resource.filename}. Add it under server/storage/training-resources`,
      404,
    );
  }

  return res.download(resource.filePath, resource.filename);
}
