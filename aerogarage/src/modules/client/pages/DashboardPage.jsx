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
  const [requests, setRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState("");

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

  const loadPortalData = useCallback(async () => {
    setLoadingData(true);
    setLoadError("");

    try {
      const [profileRes, requestsRes, documentsRes] = await withAuthRequest((token) =>
        Promise.all([
          fetchClientProfile(token),
          fetchClientRequests(token),
          fetchClientDocuments(token),
        ]));

      const profileData = profileRes?.data?.profile || null;
      setProfile(profileData);
      setProfileForm({ fullName: profileData?.fullName || "" });
      setRequests(requestsRes?.data?.requests || []);
      setDocuments(documentsRes?.data?.documents || []);
    } catch (error) {
      const fallbackMessage = error?.message || parseApiError(error).message;
      setLoadError(fallbackMessage || "Unable to load client dashboard data.");
    } finally {
      setLoadingData(false);
    }
  }, [withAuthRequest]);

  useEffect(() => {
    loadPortalData();
  }, [loadPortalData]);

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
      await loadPortalData();
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
      setProfile(response?.data?.profile || null);
      setProfileMessage(response?.message || "Profile updated");
    } catch (error) {
      const parsed = parseApiError(error);
      setProfileMessage(parsed.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

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
                  className="rounded-[var(--amc-radius-md)] border border-[var(--amc-border)] bg-white px-3 py-3 text-sm text-[var(--amc-text-strong)] outline-none transition duration-[var(--amc-dur-fast)] ease-[var(--amc-ease-standard)] focus:border-[var(--amc-accent-500)] focus:ring-2 focus:ring-[var(--amc-accent-400)]/25"
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

  return (
    <Section>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Title as="h2" className="text-2xl">Client Portal Dashboard</Title>
            <TextBlock className="mt-2">Welcome, {authState?.user?.fullName || "Client User"}</TextBlock>
            <TextBlock className="mt-1">Role: {authState?.user?.role}</TextBlock>
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
          <TextBlock>Loading portal modules...</TextBlock>
        </Card>
      ) : (
        <div className="mt-6">
          <Tabs items={tabs} />
        </div>
      )}
    </Section>
  );
}
