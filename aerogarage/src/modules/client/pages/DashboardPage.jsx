import { useEffect, useMemo, useState } from "react";
const EMPTY_ARRAY = [];
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
  createClientRequest,
  fetchClientDocuments,
  fetchClientProfile,
  fetchClientRequests,
  updateClientProfile,
} from "../../../services/api/clientApi";
import { parseApiError } from "../../../services/api/publicApi";

const initialRequest = {
  title: "",
  serviceType: "Aircraft Cleaning",
  priority: "medium",
  description: "",
};

function validateRequestForm(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required";
  if (!form.serviceType.trim()) errors.serviceType = "Service type is required";
  if (!form.description.trim() || form.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters";
  }
  return errors;
}

function statusBadgeVariant(status) {
  const value = String(status || "").toLowerCase();
  if (value === "resolved" || value === "completed") return "success";
  if (value === "cancelled" || value === "rejected") return "danger";
  if (value === "in progress") return "info";
  return "warning";
}

function priorityRank(priority) {
  const p = String(priority || "").toLowerCase();
  if (p === "high") return 3;
  if (p === "medium") return 2;
  return 1;
}

function downloadDocumentFile(doc) {
  const fileName = `${doc.id || "document"}.txt`;
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

export default function ClientDashboardPage() {
  const { authState, logout, withAuthRequest } = useAuth();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const [requestForm, setRequestForm] = useState(initialRequest);
  const [requestTouched, setRequestTouched] = useState({});
  const [requestMessage, setRequestMessage] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSearch, setRequestSearch] = useState("");
  const [requestStatus, setRequestStatus] = useState("all");
  const [requestPriority, setRequestPriority] = useState("all");
  const [requestSortBy, setRequestSortBy] = useState("createdAt");
  const [requestSortDir, setRequestSortDir] = useState("desc");

  const [documentSearch, setDocumentSearch] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [documentSortBy, setDocumentSortBy] = useState("updatedAt");

  const [profileForm, setProfileForm] = useState({ fullName: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const requestErrors = useMemo(() => validateRequestForm(requestForm), [requestForm]);

  const { data: portalData, isLoading: loadingData, error: queryError } = useQuery({
    queryKey: ["clientPortalData"],
    queryFn: async () => {
      const [profileRes, requestsRes, documentsRes] = await withAuthRequest((token) =>
        Promise.all([
          fetchClientProfile(token),
          fetchClientRequests(token),
          fetchClientDocuments(token),
        ]));
      return {
        profile: profileRes?.data?.profile || null,
        requests: requestsRes?.data?.requests || [],
        documents: documentsRes?.data?.documents || []
      };
    }
  });

  const loadError = queryError ? parseApiError(queryError).message || "Unable to load client dashboard data." : "";

  useEffect(() => {
    if (portalData?.profile) {
      setProfileForm({ fullName: portalData.profile.fullName || "" });
    }
  }, [portalData?.profile]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["clientPortalData"] });
    };
    socket.on("data_updated", handleUpdate);
    return () => socket.off("data_updated", handleUpdate);
  }, [socket, queryClient]);

  const onRequestChange = (field) => (event) => {
    setRequestForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    setRequestTouched({ title: true, serviceType: true, description: true });
    setRequestMessage("");

    if (Object.keys(requestErrors).length > 0) return;

    setRequestLoading(true);

    try {
      const response = await withAuthRequest((token) => createClientRequest(token, requestForm));
      setRequestMessage(response?.message || "Request created");
      setRequestForm(initialRequest);
      setRequestTouched({});
      await queryClient.invalidateQueries({ queryKey: ["clientPortalData"] });
    } catch (error) {
      const parsed = parseApiError(error);
      setRequestMessage(parsed.message || "Failed to create request");
    } finally {
      setRequestLoading(false);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileMessage("");
    setProfileLoading(true);

    try {
      const response = await withAuthRequest((token) =>
        updateClientProfile(token, { fullName: profileForm.fullName.trim() }));
      setProfileMessage(response?.message || "Profile updated");
      await queryClient.invalidateQueries({ queryKey: ["clientPortalData"] });
    } catch (error) {
      const parsed = parseApiError(error);
      setProfileMessage(parsed.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const requests = portalData?.requests || EMPTY_ARRAY;
  const documents = portalData?.documents || EMPTY_ARRAY;
  const profile = portalData?.profile || null;

  const filteredSortedRequests = useMemo(() => {
    const query = requestSearch.trim().toLowerCase();

    const filtered = requests.filter((request) => {
      const matchesQuery =
        !query ||
        String(request.title || "").toLowerCase().includes(query) ||
        String(request.serviceType || "").toLowerCase().includes(query) ||
        String(request.status || "").toLowerCase().includes(query);
      const matchesStatus = requestStatus === "all" || String(request.status || "").toLowerCase() === requestStatus;
      const matchesPriority = requestPriority === "all" || String(request.priority || "").toLowerCase() === requestPriority;
      return matchesQuery && matchesStatus && matchesPriority;
    });

    filtered.sort((a, b) => {
      let compare = 0;

      if (requestSortBy === "priority") {
        compare = priorityRank(a.priority) - priorityRank(b.priority);
      } else if (requestSortBy === "title") {
        compare = String(a.title || "").localeCompare(String(b.title || ""));
      } else {
        compare = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }

      return requestSortDir === "asc" ? compare : -compare;
    });

    return filtered;
  }, [requestPriority, requestSearch, requestSortBy, requestSortDir, requestStatus, requests]);

  const filteredSortedDocuments = useMemo(() => {
    const query = documentSearch.trim().toLowerCase();
    const filtered = documents.filter((doc) => {
      const matchesQuery =
        !query ||
        String(doc.title || "").toLowerCase().includes(query) ||
        String(doc.id || "").toLowerCase().includes(query);
      const matchesType = documentType === "all" || String(doc.type || "").toLowerCase() === documentType;
      return matchesQuery && matchesType;
    });

    filtered.sort((a, b) => {
      if (documentSortBy === "title") {
        return String(a.title || "").localeCompare(String(b.title || ""));
      }
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });

    return filtered;
  }, [documentSearch, documentSortBy, documentType, documents]);

  const requestRows = filteredSortedRequests.map((request) => ({
    title: request.title,
    serviceType: request.serviceType,
    priority: String(request.priority || "").toUpperCase(),
    status: <Badge variant={statusBadgeVariant(request.status)}>{request.status}</Badge>,
  }));

  const documentRows = filteredSortedDocuments.map((doc) => ({
    id: doc.id,
    title: doc.title,
    type: doc.type,
    updatedAt: new Date(doc.updatedAt).toLocaleDateString(),
    actions: (
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
            <Title as="h3" className="text-xl">Create Request</Title>
            <form className="mt-4 grid gap-4" onSubmit={submitRequest}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Request Title"
                  value={requestForm.title}
                  onChange={onRequestChange("title")}
                  error={requestTouched.title ? requestErrors.title : ""}
                />
                <Select label="Service Type" value={requestForm.serviceType} onChange={onRequestChange("serviceType")}>
                  <option>Aircraft Cleaning</option>
                  <option>PBB Operations</option>
                  <option>Surface Transportation</option>
                  <option>Line Maintenance</option>
                  <option>Aircraft Security</option>
                  <option>Repair Shop</option>
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

              <Button type="submit" disabled={requestLoading}>{requestLoading ? "Submitting..." : "Create Request"}</Button>
              {requestMessage ? <TextBlock className="text-sm text-[var(--amc-text-body)]">{requestMessage}</TextBlock> : null}
            </form>
          </Card>

          <Card>
            <Title as="h3" className="text-xl">Request Tracking</Title>
            <TextBlock className="mt-2">Monitor submitted request statuses and priorities.</TextBlock>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <Input label="Search" placeholder="Title, service, status..." value={requestSearch} onChange={(e) => setRequestSearch(e.target.value)} />
              <Select label="Status" value={requestStatus} onChange={(e) => setRequestStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="submitted">Submitted</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>
              <Select label="Priority" value={requestPriority} onChange={(e) => setRequestPriority(e.target.value)}>
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
              <Select label="Sort By" value={requestSortBy} onChange={(e) => setRequestSortBy(e.target.value)}>
                <option value="createdAt">Created Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </Select>
              <Select label="Sort Direction" value={requestSortDir} onChange={(e) => setRequestSortDir(e.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Select>
            </div>

            <Table
              className="mt-4"
              columns={[
                { key: "title", label: "Title" },
                { key: "serviceType", label: "Service" },
                { key: "priority", label: "Priority" },
                { key: "status", label: "Status" },
              ]}
              data={requestRows}
            />
          </Card>
        </div>
      ),
    },
    {
      id: "documents",
      label: "Documents/Reports",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Documents and Reports</Title>
          <TextBlock className="mt-2">Access client-shared documents and operational reports.</TextBlock>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Input label="Search" placeholder="Document ID or title..." value={documentSearch} onChange={(e) => setDocumentSearch(e.target.value)} />
            <Select label="Type" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
              <option value="all">All</option>
              <option value="pdf">PDF</option>
              <option value="xlsx">XLSX</option>
              <option value="docx">DOCX</option>
            </Select>
            <Select label="Sort By" value={documentSortBy} onChange={(e) => setDocumentSortBy(e.target.value)}>
              <option value="updatedAt">Updated Date</option>
              <option value="title">Title</option>
            </Select>
          </div>

          <Table
            className="mt-4"
            columns={[
              { key: "id", label: "Document ID" },
              { key: "title", label: "Title" },
              { key: "type", label: "Type" },
              { key: "updatedAt", label: "Updated" },
              { key: "actions", label: "Action" },
            ]}
            data={documentRows}
          />
        </Card>
      ),
    },
    {
      id: "profile",
      label: "Profile/Settings",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Profile Settings</Title>
          <form className="mt-4 grid gap-4 md:max-w-xl" onSubmit={saveProfile}>
            <Input label="Full Name" value={profileForm.fullName} onChange={(e) => setProfileForm({ fullName: e.target.value })} />
            <Input label="Email" value={profile?.email || authState?.user?.email || ""} disabled />
            <Button type="submit" disabled={profileLoading}>{profileLoading ? "Saving..." : "Save Profile"}</Button>
            {profileMessage ? <TextBlock>{profileMessage}</TextBlock> : null}
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
          <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Client Services</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1.5 px-3 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeView === tab.id
                  ? "bg-violet-600/15 text-violet-400 border border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className={`h-1.5 w-1.5 rounded-full ${activeView === tab.id ? "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" : "bg-transparent"}`} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-5 border-t border-white/10 mt-auto bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center border border-white/20 shadow-lg">
              <span className="text-sm font-bold text-white uppercase">{authState?.user?.fullName?.charAt(0) || "C"}</span>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-white truncate">{authState?.user?.fullName || "Client User"}</p>
              <p className="text-xs text-violet-300 truncate uppercase tracking-wide">{authState?.user?.role}</p>
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
          {/* Welcome Header */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-20 -mr-20 h-72 w-72 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />
            <div className="absolute left-1/4 bottom-0 -mb-10 h-40 w-40 rounded-full bg-purple-600/10 blur-[60px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge variant="info" className="bg-violet-500/10 text-violet-400 border-violet-500/20 mb-3">Client Operations</Badge>
                <Title as="h2" className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                  Welcome, {authState?.user?.fullName?.split(' ')[0] || "Client"}
                </Title>
                <TextBlock className="text-slate-400 mt-2 max-w-2xl text-lg">
                  Track turnaround-critical requests, reports, and account-level operations from one dashboard.
                </TextBlock>
              </div>
              <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-white/10">
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Total Requests</p>
                  <p className="text-2xl font-bold text-white">{requests.length}</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Documents</p>
                  <p className="text-2xl font-bold text-violet-400">{documents.length}</p>
                </div>
              </div>
            </div>
          </div>

          {loadError && (
            <Alert variant="danger" className="mb-6 bg-red-950/40 border-red-500/30 text-red-200" title="Data Load Failed">
              {loadError}
            </Alert>
          )}

          {loadingData ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-16 text-center shadow-xl backdrop-blur-md">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]" />
              <p className="mt-6 text-slate-400 font-medium text-lg tracking-wide">Loading portal modules...</p>
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



