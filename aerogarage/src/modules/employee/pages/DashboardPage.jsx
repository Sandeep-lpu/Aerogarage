import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useSocket } from "../../../app/auth/SocketProvider";
import {
  createEmployeeRequest,
  fetchEmployeeDashboard,
  fetchEmployeeDocuments,
  fetchEmployeeProfile,
  fetchEmployeeRequests,
  fetchEmployeeAssignedRequests,
  fetchEmployeeTrainingEnrollments,
  fetchEmployeeTasks,
  submitEmployeeRequest,
  updateEmployeeProfile,
  updateEmployeeTask,
} from "../../../services/api/employeeApi";
import { parseApiError } from "../../../services/api/publicApi";

const initialRequest = {
  title: "",
  type: "Operations",
  priority: "medium",
  description: "",
};

function validateRequestForm(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required";
  if (!form.type.trim()) errors.type = "Type is required";
  if (!form.description.trim() || form.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters";
  }
  return errors;
}

function statusBadge(status) {
  const value = String(status || "").toLowerCase();
  if (["approved", "executed", "closed"].includes(value)) return "success";
  if (value === "rejected") return "danger";
  if (["submitted", "under_review"].includes(value)) return "warning";
  return "info";
}

function downloadDocumentFile(doc) {
  const fileName = `${doc.id || "employee-document"}.txt`;
  const content = [
    `Document ID: ${doc.id || ""}`,
    `Title: ${doc.title || ""}`,
    `Type: ${doc.type || ""}`,
    `Updated: ${new Date(doc.updatedAt).toLocaleString()}`,
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function EmployeeDashboardPage() {
  const { authState, logout, withAuthRequest } = useAuth();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const [statusMessage, setStatusMessage] = useState("");

  const [requestForm, setRequestForm] = useState(initialRequest);
  const [requestTouched, setRequestTouched] = useState({});
  const [requestLoading, setRequestLoading] = useState(false);
  const requestErrors = useMemo(() => validateRequestForm(requestForm), [requestForm]);

  const [taskNoteById, setTaskNoteById] = useState({});
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    department: "",
    designation: "",
    shift: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  const { data: portalData, isLoading: loadingData, error: queryError } = useQuery({
    queryKey: ["employeePortalData"],
    queryFn: async () => {
      const [dashboardRes, profileRes, requestsRes, assignedRequestsRes, trainingRes, tasksRes, documentsRes] = await withAuthRequest((token) =>
        Promise.all([
          fetchEmployeeDashboard(token),
          fetchEmployeeProfile(token),
          fetchEmployeeRequests(token),
          fetchEmployeeAssignedRequests(token),
          fetchEmployeeTrainingEnrollments(token),
          fetchEmployeeTasks(token),
          fetchEmployeeDocuments(token),
        ]));
      return {
        dashboard: dashboardRes?.data?.dashboard || null,
        profile: profileRes?.data?.profile || null,
        requests: requestsRes?.data?.requests || [],
        assignedRequests: assignedRequestsRes?.data?.requests || [],
        trainingEnrollments: trainingRes?.data?.enrollments || [],
        tasks: tasksRes?.data?.tasks || [],
        documents: documentsRes?.data?.documents || []
      };
    }
  });

  const loadError = queryError ? parseApiError(queryError).message || "Unable to load employee portal data." : "";

  useEffect(() => {
    if (portalData?.profile) {
      setProfileForm({
        fullName: portalData.profile.fullName || "",
        department: portalData.profile.department || "",
        designation: portalData.profile.designation || "",
        shift: portalData.profile.shift || "",
      });
    }
  }, [portalData?.profile]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["employeePortalData"] });
    };
    socket.on("data_updated", handleUpdate);
    return () => socket.off("data_updated", handleUpdate);
  }, [socket, queryClient]);

  const onRequestChange = (field) => (event) => {
    setRequestForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onCreateRequest = async (event) => {
    event.preventDefault();
    setRequestTouched({ title: true, type: true, description: true });
    setStatusMessage("");
    if (Object.keys(requestErrors).length > 0) return;

    setRequestLoading(true);
    try {
      const response = await withAuthRequest((token) => createEmployeeRequest(token, requestForm));
      setStatusMessage(response?.message || "Request draft created");
      setRequestForm(initialRequest);
      setRequestTouched({});
      await queryClient.invalidateQueries({ queryKey: ["employeePortalData"] });
    } catch (error) {
      setStatusMessage(parseApiError(error).message || "Failed to create draft");
    } finally {
      setRequestLoading(false);
    }
  };

  const onSubmitForApproval = async (workItemId) => {
    setStatusMessage("");
    try {
      const response = await withAuthRequest((token) => submitEmployeeRequest(token, workItemId));
      setStatusMessage(response?.message || "Submitted for approval");
      await queryClient.invalidateQueries({ queryKey: ["employeePortalData"] });
    } catch (error) {
      setStatusMessage(parseApiError(error).message || "Failed to submit request");
    }
  };

  const onUpdateTaskStatus = async (workItemId, status) => {
    setStatusMessage("");
    try {
      const note = taskNoteById[workItemId] || "";
      const response = await withAuthRequest((token) => updateEmployeeTask(token, workItemId, { status, note }));
      setStatusMessage(response?.message || "Task updated");
      await queryClient.invalidateQueries({ queryKey: ["employeePortalData"] });
    } catch (error) {
      setStatusMessage(parseApiError(error).message || "Task update failed");
    }
  };

  const onSaveProfile = async (event) => {
    event.preventDefault();
    setProfileSaving(true);
    setStatusMessage("");
    try {
      const response = await withAuthRequest((token) => updateEmployeeProfile(token, profileForm));
      setStatusMessage(response?.message || "Profile updated");
      await queryClient.invalidateQueries({ queryKey: ["employeePortalData"] });
    } catch (error) {
      setStatusMessage(parseApiError(error).message || "Profile update failed");
    } finally {
      setProfileSaving(false);
    }
  };

  const dashboard = portalData?.dashboard || null;
  const requests = portalData?.requests || [];
  const assignedRequests = portalData?.assignedRequests || [];
  const trainingEnrollments = portalData?.trainingEnrollments || [];
  const tasks = portalData?.tasks || [];
  const documents = portalData?.documents || [];
  const profile = portalData?.profile || null;

  const requestRows = requests.map((item) => ({
    title: item.title,
    type: item.type,
    priority: String(item.priority || "").toUpperCase(),
    status: <Badge variant={statusBadge(item.status)}>{item.status}</Badge>,
    action: ["draft", "rejected"].includes(item.status) ? (
      <Button type="button" variant="secondary" className="h-9" onClick={() => onSubmitForApproval(item._id)}>
        Submit
      </Button>
    ) : (
      <span className="text-xs text-[var(--amc-text-muted)]">Awaiting workflow</span>
    ),
  }));

  const assignedRequestRows = assignedRequests.map((item) => ({
    title: item.title,
    serviceType: item.serviceType,
    client: item.userId?.fullName || "Unknown Client",
    priority: String(item.priority || "").toUpperCase(),
    status: <Badge variant={item.status === "completed" ? "success" : "info"}>{item.status}</Badge>,
  }));

  const trainingRows = trainingEnrollments.map((item) => ({
    module: item.moduleInfo?.title || item.moduleId,
    code: item.moduleInfo?.code || "N/A",
    status: <Badge variant={statusBadge(item.status)}>{item.status}</Badge>,
    score: item.score !== null ? `${item.score}%` : "Pending",
    certifiedAt: item.certifiedAt ? new Date(item.certifiedAt).toLocaleDateString() : "N/A",
  }));

  const taskRows = tasks.map((item) => ({
    title: item.title,
    status: <Badge variant={statusBadge(item.status)}>{item.status}</Badge>,
    note: (
      <Input
        placeholder="Execution note"
        value={taskNoteById[item._id] || ""}
        onChange={(event) => setTaskNoteById((prev) => ({ ...prev, [item._id]: event.target.value }))}
      />
    ),
    action: (
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" className="h-9" onClick={() => onUpdateTaskStatus(item._id, "executed")}>
          Mark Executed
        </Button>
        <Button type="button" variant="secondary" className="h-9" onClick={() => onUpdateTaskStatus(item._id, "closed")}>
          Close
        </Button>
      </div>
    ),
  }));

  const documentRows = documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    type: doc.type,
    updatedAt: new Date(doc.updatedAt).toLocaleDateString(),
    action: (
      <Button type="button" variant="secondary" className="h-9" onClick={() => downloadDocumentFile(doc)}>
        Download
      </Button>
    ),
  }));

  const tabs = [
    {
      id: "requests",
      label: "Requests",
      content: (
        <div className="grid gap-6">
          <Card>
            <Title as="h3" className="text-xl">Create Operational Request</Title>
            <form className="mt-4 grid gap-4" onSubmit={onCreateRequest}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Title"
                  value={requestForm.title}
                  onChange={onRequestChange("title")}
                  error={requestTouched.title ? requestErrors.title : ""}
                />
                <Select label="Type" value={requestForm.type} onChange={onRequestChange("type")}>
                  <option value="Operations">Operations</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Security">Security</option>
                  <option value="Training">Training Support</option>
                </Select>
              </div>
              <Select label="Priority" value={requestForm.priority} onChange={onRequestChange("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-[var(--amc-text-strong)]">Description</span>
                <textarea
                  rows={4}
                  className="rounded-[var(--amc-radius-md)] border border-[var(--amc-border)] bg-[var(--amc-bg-field)] px-3 py-3 text-sm text-[var(--amc-text-strong)] outline-none transition duration-[var(--amc-dur-fast)] ease-[var(--amc-ease-standard)] focus:border-[var(--amc-accent-500)] focus:ring-2 focus:ring-[var(--amc-accent-400)]/25"
                  value={requestForm.description}
                  onChange={onRequestChange("description")}
                />
                {requestTouched.description && requestErrors.description ? <span className="text-xs text-rose-600">{requestErrors.description}</span> : null}
              </label>
              <Button type="submit" disabled={requestLoading}>{requestLoading ? "Saving..." : "Save Draft"}</Button>
            </form>
          </Card>

          <Card>
            <Title as="h3" className="text-xl">My Requests</Title>
            <TextBlock className="mt-2">Submit draft/rejected items to admin for approval.</TextBlock>
            <Table
              className="mt-4"
              columns={[
                { key: "title", label: "Title" },
                { key: "type", label: "Type" },
                { key: "priority", label: "Priority" },
                { key: "status", label: "Status" },
                { key: "action", label: "Action" },
              ]}
              data={requestRows}
            />
          </Card>
        </div>
      ),
    },
    {
      id: "tasks",
      label: "Tasks",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Assigned Tasks</Title>
          <TextBlock className="mt-2">
            Execution updates are blocked by server until admin approval is granted.
          </TextBlock>
          <Table
            className="mt-4"
            columns={[
              { key: "title", label: "Task" },
              { key: "status", label: "Status" },
              { key: "note", label: "Execution Note" },
              { key: "action", label: "Update" },
            ]}
            data={taskRows}
          />
        </Card>
      ),
    },
    {
      id: "client-requests",
      label: "Client Assignments",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Client Service Requests</Title>
          <TextBlock className="mt-2">
            These are the official service requests submitted by the client that you are currently assigned to execute.
          </TextBlock>
          <Table
            className="mt-4"
            columns={[
              { key: "title", label: "Request Title" },
              { key: "serviceType", label: "Service Type" },
              { key: "client", label: "Client" },
              { key: "priority", label: "Priority" },
              { key: "status", label: "Status" },
            ]}
            data={assignedRequestRows}
          />
        </Card>
      ),
    },
    {
      id: "training",
      label: "Training",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Assigned Training Modules</Title>
          <TextBlock className="mt-2">
            Below are your active enrollments and certifications imported from the Training Portal.
          </TextBlock>
          <Table
            className="mt-4"
            columns={[
              { key: "code", label: "Module Code" },
              { key: "module", label: "Title" },
              { key: "status", label: "Status" },
              { key: "score", label: "Score" },
              { key: "certifiedAt", label: "Certified Date" },
            ]}
            data={trainingRows}
          />
        </Card>
      ),
    },
    {
      id: "documents",
      label: "Documents",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Documents</Title>
          <Table
            className="mt-4"
            columns={[
              { key: "id", label: "ID" },
              { key: "title", label: "Title" },
              { key: "type", label: "Type" },
              { key: "updatedAt", label: "Updated" },
              { key: "action", label: "Action" },
            ]}
            data={documentRows}
          />
        </Card>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Employee Profile</Title>
          <form className="mt-4 grid gap-4 md:max-w-2xl" onSubmit={onSaveProfile}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full Name" value={profileForm.fullName} onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))} />
              <Input label="Email" value={profile?.email || authState?.user?.email || ""} disabled />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Input label="Department" value={profileForm.department} onChange={(e) => setProfileForm((prev) => ({ ...prev, department: e.target.value }))} />
              <Input label="Designation" value={profileForm.designation} onChange={(e) => setProfileForm((prev) => ({ ...prev, designation: e.target.value }))} />
              <Input label="Shift" value={profileForm.shift} onChange={(e) => setProfileForm((prev) => ({ ...prev, shift: e.target.value }))} />
            </div>
            <Button type="submit" disabled={profileSaving}>{profileSaving ? "Saving..." : "Save Profile"}</Button>
          </form>
        </Card>
      ),
    },
  ];

  const [activeView, setActiveView] = useState("requests");

  return (
    <div className="flex h-full w-full overflow-hidden bg-transparent">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-slate-900/40 backdrop-blur-xl flex flex-col pt-6 z-10">
        <div className="px-6 mb-4">
          <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Workforce Tools</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1.5 px-3 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeView === tab.id
                  ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className={`h-1.5 w-1.5 rounded-full ${activeView === tab.id ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-transparent"}`} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-5 border-t border-white/10 mt-auto bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border border-white/20 shadow-lg">
              <span className="text-sm font-bold text-white uppercase">{authState?.user?.fullName?.charAt(0) || "E"}</span>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-white truncate">{authState?.user?.fullName || "Employee"}</p>
              <p className="text-xs text-emerald-300 truncate uppercase tracking-wide">{authState?.user?.role}</p>
            </div>
          </div>
          <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 border-white/10 text-slate-200 shadow-md" onClick={logout}>
            Sign Out Securely
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Welcome Header with live stats */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-20 -mr-20 h-72 w-72 rounded-full bg-emerald-600/10 blur-[80px] pointer-events-none" />
            <div className="absolute left-1/4 bottom-0 -mb-10 h-40 w-40 rounded-full bg-teal-600/10 blur-[60px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-3">Operational Status</Badge>
                <Title as="h2" className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                  Ready, {authState?.user?.fullName?.split(' ')[0] || "Employee"}
                </Title>
                <TextBlock className="text-slate-400 mt-2 max-w-2xl text-lg">
                  Manage operational requests, task executions, training progress, and documents.
                </TextBlock>
              </div>
              <div className="grid grid-cols-3 gap-3 bg-slate-950/50 p-4 rounded-xl border border-white/10">
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Assigned</p>
                  <p className="text-2xl font-bold text-blue-400">{dashboard?.summary?.assignedClientRequests || 0}</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Pending</p>
                  <p className="text-2xl font-bold text-amber-400">{dashboard?.summary?.pendingApproval || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Approved</p>
                  <p className="text-2xl font-bold text-emerald-400">{dashboard?.summary?.approved || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {loadError && (
            <Alert variant="danger" className="mb-6 bg-red-950/40 border-red-500/30 text-red-200" title="Data Load Failed">
              {loadError}
            </Alert>
          )}
          {statusMessage && (
            <Alert variant="info" className="mb-6 bg-emerald-950/40 border-emerald-500/30 text-emerald-200" title="Portal Status">
              {statusMessage}
            </Alert>
          )}

          {loadingData ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-16 text-center shadow-xl backdrop-blur-md">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
              <p className="mt-6 text-slate-400 font-medium text-lg tracking-wide">Loading employee modules...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              {tabs.find(t => t.id === activeView)?.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
