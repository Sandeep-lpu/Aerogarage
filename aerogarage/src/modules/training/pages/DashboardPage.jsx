import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Section,
  Select,
  Table,
  Tabs,
  TextBlock,
  Title,
} from "../../../components/ui";
import { useAuth } from "../../../app/auth/authContext";
import {
  downloadTrainingResource,
  fetchTrainingDashboard,
  fetchTrainingExams,
  fetchTrainingModules,
  fetchTrainingResources,
} from "../../../services/api/trainingApi";
import { parseApiError } from "../../../services/api/publicApi";

function moduleStatusVariant(status) {
  const value = String(status || "").toLowerCase();
  if (value === "completed") return "success";
  if (value === "in progress") return "info";
  return "warning";
}

function examResultVariant(result) {
  const value = String(result || "").toLowerCase();
  if (value === "pass") return "success";
  if (value === "fail") return "danger";
  return "warning";
}

function getFileNameFromContentDisposition(headerValue, fallbackName) {
  if (!headerValue) return fallbackName;
  const utf8Match = headerValue.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1]);
  const basicMatch = headerValue.match(/filename="?([^"]+)"?/i);
  if (basicMatch?.[1]) return basicMatch[1];
  return fallbackName;
}

export default function TrainingDashboardPage() {
  const { authState, logout, withAuthRequest } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [modules, setModules] = useState([]);
  const [exams, setExams] = useState([]);
  const [resources, setResources] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [moduleSearch, setModuleSearch] = useState("");
  const [moduleStatus, setModuleStatus] = useState("all");
  const [examStatus, setExamStatus] = useState("all");
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceType, setResourceType] = useState("all");
  const [downloadingResourceId, setDownloadingResourceId] = useState("");

  const loadTrainingData = useCallback(async () => {
    setLoadingData(true);
    setLoadError("");

    try {
      const [dashboardRes, modulesRes, examsRes, resourcesRes] = await withAuthRequest((token) =>
        Promise.all([
          fetchTrainingDashboard(token),
          fetchTrainingModules(token),
          fetchTrainingExams(token),
          fetchTrainingResources(token),
        ]));

      setDashboard(dashboardRes?.data?.dashboard || null);
      setModules(modulesRes?.data?.modules || []);
      setExams(examsRes?.data?.exams || []);
      setResources(resourcesRes?.data?.resources || []);
    } catch (error) {
      const fallbackMessage = error?.message || parseApiError(error).message;
      setLoadError(fallbackMessage || "Unable to load training portal data.");
    } finally {
      setLoadingData(false);
    }
  }, [withAuthRequest]);

  useEffect(() => {
    loadTrainingData();
  }, [loadTrainingData]);

  const onDownloadResource = useCallback(async (resource) => {
    setLoadError("");
    setDownloadingResourceId(resource.id);

    try {
      const response = await withAuthRequest((token) =>
        downloadTrainingResource(token, resource.id));
      const disposition = response.headers?.["content-disposition"];
      const fileName = getFileNameFromContentDisposition(
        disposition,
        `${resource.id}.${String(resource.type || "file").toLowerCase()}`,
      );

      const objectUrl = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      const parsed = parseApiError(error);
      setLoadError(parsed.message || "Failed to download resource");
    } finally {
      setDownloadingResourceId("");
    }
  }, [withAuthRequest]);

  const moduleRows = useMemo(() => {
    const query = moduleSearch.trim().toLowerCase();
    return modules
      .filter((moduleItem) => {
        const matchesQuery =
          !query ||
          String(moduleItem.title || "").toLowerCase().includes(query) ||
          String(moduleItem.code || "").toLowerCase().includes(query) ||
          String(moduleItem.instructor || "").toLowerCase().includes(query);
        const matchesStatus =
          moduleStatus === "all" || String(moduleItem.status || "").toLowerCase() === moduleStatus;
        return matchesQuery && matchesStatus;
      })
      .map((moduleItem) => ({
        code: moduleItem.code,
        title: moduleItem.title,
        instructor: moduleItem.instructor,
        progress: `${moduleItem.progress}%`,
        status: <Badge variant={moduleStatusVariant(moduleItem.status)}>{moduleItem.status}</Badge>,
      }));
  }, [moduleSearch, moduleStatus, modules]);

  const examRows = useMemo(() => {
    return exams
      .filter((exam) => examStatus === "all" || String(exam.status || "").toLowerCase() === examStatus)
      .map((exam) => ({
        module: exam.module,
        date: new Date(exam.examDate).toLocaleDateString(),
        location: exam.location,
        score: exam.score ?? "-",
        result: <Badge variant={examResultVariant(exam.result)}>{exam.result}</Badge>,
      }));
  }, [examStatus, exams]);

  const resourceRows = useMemo(() => {
    const query = resourceSearch.trim().toLowerCase();
    return resources
      .filter((resource) => {
        const matchesQuery =
          !query ||
          String(resource.title || "").toLowerCase().includes(query) ||
          String(resource.id || "").toLowerCase().includes(query);
        const matchesType =
          resourceType === "all" || String(resource.type || "").toLowerCase() === resourceType;
        return matchesQuery && matchesType;
      })
      .map((resource) => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        category: resource.category,
        updatedAt: new Date(resource.updatedAt).toLocaleDateString(),
        action: (
          <Button
            type="button"
            variant="secondary"
            className="h-9"
            disabled={downloadingResourceId === resource.id}
            onClick={() => onDownloadResource(resource)}
          >
            {downloadingResourceId === resource.id ? "Downloading..." : "Download"}
          </Button>
        ),
      }));
  }, [downloadingResourceId, onDownloadResource, resourceSearch, resourceType, resources]);

  const tabs = [
    {
      id: "modules",
      label: "Course Modules",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Course Modules</Title>
          <TextBlock className="mt-2">Track your EASA Part-66 module progression and instructors.</TextBlock>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Search Modules"
              placeholder="Code, title, instructor..."
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
            />
            <Select label="Status" value={moduleStatus} onChange={(e) => setModuleStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
          <Table
            className="mt-4"
            columns={[
              { key: "code", label: "Code" },
              { key: "title", label: "Module" },
              { key: "instructor", label: "Instructor" },
              { key: "progress", label: "Progress" },
              { key: "status", label: "Status" },
            ]}
            data={moduleRows}
          />
        </Card>
      ),
    },
    {
      id: "exams",
      label: "Exam Schedule/Results",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Exam Schedule and Results</Title>
          <TextBlock className="mt-2">View upcoming exams and historical performance outcomes.</TextBlock>
          <div className="mt-4 max-w-xs">
            <Select label="Exam Status" value={examStatus} onChange={(e) => setExamStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
          <Table
            className="mt-4"
            columns={[
              { key: "module", label: "Module" },
              { key: "date", label: "Exam Date" },
              { key: "location", label: "Location" },
              { key: "score", label: "Score" },
              { key: "result", label: "Result" },
            ]}
            data={examRows}
          />
        </Card>
      ),
    },
    {
      id: "resources",
      label: "Resource Center",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Resource Center</Title>
          <TextBlock className="mt-2">Download study materials, lecture assets, and compliance references.</TextBlock>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Search Resources"
              placeholder="Resource ID or title..."
              value={resourceSearch}
              onChange={(e) => setResourceSearch(e.target.value)}
            />
            <Select label="Type" value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
              <option value="all">All</option>
              <option value="pdf">PDF</option>
              <option value="pptx">PPTX</option>
              <option value="docx">DOCX</option>
            </Select>
          </div>
          <Table
            className="mt-4"
            columns={[
              { key: "id", label: "ID" },
              { key: "title", label: "Title" },
              { key: "type", label: "Type" },
              { key: "category", label: "Category" },
              { key: "updatedAt", label: "Updated" },
              { key: "action", label: "Action" },
            ]}
            data={resourceRows}
          />
        </Card>
      ),
    },
  ];

  return (
    <Section>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Title as="h2" className="text-2xl">Training Dashboard</Title>
            <TextBlock className="mt-2">Welcome, {authState?.user?.fullName || "Student"}</TextBlock>
            <TextBlock className="mt-1">Role: {authState?.user?.role}</TextBlock>
            <TextBlock className="mt-1">Active Modules: {dashboard?.summary?.activeModules ?? "-"}</TextBlock>
            <TextBlock className="mt-1">Upcoming Exams: {dashboard?.summary?.upcomingExams ?? "-"}</TextBlock>
          </div>
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
      </Card>

      {loadError ? (
        <Alert variant="danger" className="mt-6" title="Data Load Failed">
          {loadError}
        </Alert>
      ) : null}

      {loadingData ? (
        <Card className="mt-6">
          <TextBlock>Loading training modules...</TextBlock>
        </Card>
      ) : (
        <div className="mt-6">
          <Tabs items={tabs} />
        </div>
      )}
    </Section>
  );
}
