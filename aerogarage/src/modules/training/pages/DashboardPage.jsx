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
  const [activeView, setActiveView] = useState("modules");

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
    <div className="flex h-full w-full overflow-hidden bg-transparent">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-slate-900/40 backdrop-blur-xl flex flex-col pt-6 z-10 transition-all">
        <div className="px-6 mb-4">
          <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Learning Tools</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1.5 px-3 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeView === tab.id 
                  ? "bg-cyan-600/15 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className={`h-1.5 w-1.5 rounded-full ${activeView === tab.id ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-transparent"}`} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-5 border-t border-white/10 mt-auto bg-slate-900/50">
           <div className="flex items-center gap-3 mb-4">
             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border border-white/20 shadow-lg">
               <span className="text-sm font-bold text-white uppercase">{authState?.user?.fullName?.charAt(0) || "S"}</span>
             </div>
             <div className="overflow-hidden flex-1">
               <p className="text-sm font-semibold text-white truncate">{authState?.user?.fullName || "Student User"}</p>
               <p className="text-xs text-cyan-300 truncate uppercase tracking-wide">{authState?.user?.role}</p>
             </div>
           </div>
           <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 border-white/10 text-slate-200 shadow-md" onClick={logout}>
             Sign Out Securely
           </Button>
        </div>
      </aside>

      {/* Main Learning Canvas */}
      <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8 amc-glass-card rounded-2xl border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-20 -mr-20 h-72 w-72 rounded-full bg-cyan-600/10 blur-[80px] pointer-events-none" />
            <div className="absolute left-1/4 bottom-0 -mb-10 h-40 w-40 rounded-full bg-blue-600/10 blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge variant="info" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">EASA Part-66 Certified</Badge>
                <Title as="h2" className="text-3xl md:text-4xl font-bold text-white tracking-wide font-[var(--amc-font-heading)]">
                  Learning Hub, {authState?.user?.fullName?.split(' ')[0] || "Student"}
                </Title>
                <TextBlock className="text-slate-400 mt-2 max-w-2xl text-lg">
                  Track course progress, schedule certification exams, and download vital compliance resources.
                </TextBlock>
              </div>
              
              <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-white/10 md:min-w-[280px]">
                 <div className="flex-1 text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Active Modules</p>
                    <p className="text-3xl font-bold text-white mt-1">{dashboard?.summary?.activeModules ?? "-"}</p>
                 </div>
                 <div className="w-px h-12 bg-white/10" />
                 <div className="flex-1 text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Exams</p>
                    <p className="text-3xl font-bold text-cyan-400 mt-1">{dashboard?.summary?.upcomingExams ?? "-"}</p>
                 </div>
              </div>
            </div>
          </div>

          {loadError && (
            <Alert variant="danger" className="mb-6 bg-red-950/40 border-red-500/30 text-red-200" title="System Notice">
              {loadError}
            </Alert>
          )}

          {loadingData ? (
            <div className="amc-glass-card rounded-2xl border border-white/10 bg-slate-900/40 p-16 text-center shadow-xl backdrop-blur-md">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]" />
              <p className="mt-6 text-slate-400 font-medium text-lg tracking-wide">Retrieving course library...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              {/* Inherit Glassmorphism styling for internal tab contents dynamically */}
              <div className="[&>div]:amc-glass-card [&>div]:border-white/10 [&>div]:bg-slate-900/40 [&>div]:backdrop-blur-md [&>div]:shadow-2xl [&>div]:rounded-2xl">
                {tabs.find(t => t.id === activeView)?.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

