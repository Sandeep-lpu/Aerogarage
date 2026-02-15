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
  fetchAdminPublicContent,
  fetchAdminRequests,
  fetchAdminTrainingModules,
  fetchAdminUsers,
  updateAdminRequestStatus,
  updateAdminServiceContent,
  updateAdminTrainingContent,
  updateAdminTrainingModule,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "../../../services/api/adminApi";
import { parseApiError } from "../../../services/api/publicApi";

function boolBadge(flag) {
  return flag ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>;
}

function roleBadge(role) {
  const value = String(role || "").toLowerCase();
  if (value === "admin") return <Badge variant="warning">admin</Badge>;
  if (value === "staff") return <Badge variant="info">staff</Badge>;
  if (value === "student") return <Badge variant="success">student</Badge>;
  return <Badge variant="info">client</Badge>;
}

export default function AdminDashboardPage() {
  const { authState, logout, withAuthRequest } = useAuth();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [trainingModules, setTrainingModules] = useState([]);
  const [publicContent, setPublicContent] = useState({ services: [], training: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [selectedServiceSlug, setSelectedServiceSlug] = useState("");
  const [serviceSummaryDraft, setServiceSummaryDraft] = useState("");
  const [trainingOrgDraft, setTrainingOrgDraft] = useState("");

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError("");
    setStatusMessage("");

    try {
      const [usersRes, requestsRes, modulesRes, contentRes] = await withAuthRequest((token) =>
        Promise.all([
          fetchAdminUsers(token),
          fetchAdminRequests(token),
          fetchAdminTrainingModules(token),
          fetchAdminPublicContent(token),
        ]));

      const services = contentRes?.data?.content?.services || [];
      const training = contentRes?.data?.content?.training || null;

      setUsers(usersRes?.data?.users || []);
      setRequests(requestsRes?.data?.requests || []);
      setTrainingModules(modulesRes?.data?.modules || []);
      setPublicContent({ services, training });
      setSelectedServiceSlug(services[0]?.slug || "");
      setServiceSummaryDraft(services[0]?.summary || "");
      setTrainingOrgDraft(training?.organization || "");
    } catch (loadError) {
      const parsed = parseApiError(loadError);
      setError(parsed.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [withAuthRequest]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter((entry) =>
      String(entry.fullName || "").toLowerCase().includes(query) ||
      String(entry.email || "").toLowerCase().includes(query));
  }, [userSearch, users]);

  const usersRows = filteredUsers.map((entry) => ({
    name: entry.fullName,
    email: entry.email,
    role: roleBadge(entry.role),
    status: boolBadge(entry.isActive),
    actions: (
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          className="h-9"
          onClick={async () => {
            try {
              await withAuthRequest((token) =>
                updateAdminUserRole(token, entry._id, entry.role === "client" ? "staff" : "client"));
              setStatusMessage(`Role updated for ${entry.email}`);
              await loadAdminData();
            } catch (updateError) {
              setError(parseApiError(updateError).message || "Failed to update role");
            }
          }}
        >
          Toggle Role
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-9"
          onClick={async () => {
            try {
              await withAuthRequest((token) =>
                updateAdminUserStatus(token, entry._id, !entry.isActive));
              setStatusMessage(`Status updated for ${entry.email}`);
              await loadAdminData();
            } catch (updateError) {
              setError(parseApiError(updateError).message || "Failed to update status");
            }
          }}
        >
          {entry.isActive ? "Deactivate" : "Activate"}
        </Button>
      </div>
    ),
  }));

  const requestRows = requests.map((entry) => ({
    title: entry.title,
    client: entry.userId?.email || "-",
    priority: String(entry.priority || "").toUpperCase(),
    status: entry.status,
    action: (
      <Select
        value={entry.status}
        onChange={async (event) => {
          try {
            await withAuthRequest((token) =>
              updateAdminRequestStatus(token, entry._id, event.target.value));
            setStatusMessage(`Request status updated: ${entry.title}`);
            await loadAdminData();
          } catch (updateError) {
            setError(parseApiError(updateError).message || "Failed to update request status");
          }
        }}
      >
        <option value="submitted">submitted</option>
        <option value="reviewing">reviewing</option>
        <option value="in_progress">in_progress</option>
        <option value="completed">completed</option>
      </Select>
    ),
  }));

  const trainingRows = trainingModules.map((entry) => ({
    code: entry.code,
    title: entry.title,
    instructor: entry.instructor,
    progress: `${entry.progress}%`,
    action: (
      <Button
        type="button"
        variant="secondary"
        className="h-9"
        onClick={async () => {
          const next = Math.min(100, Number(entry.progress || 0) + 5);
          const status = next >= 100 ? "completed" : "in progress";
          try {
            await withAuthRequest((token) =>
              updateAdminTrainingModule(token, entry.id, { progress: next, status }));
            setStatusMessage(`Training module updated: ${entry.code}`);
            await loadAdminData();
          } catch (updateError) {
            setError(parseApiError(updateError).message || "Failed to update training module");
          }
        }}
      >
        +5%
      </Button>
    ),
  }));

  const selectedService = publicContent.services.find((entry) => entry.slug === selectedServiceSlug);

  const tabs = [
    {
      id: "users",
      label: "Users/Roles",
      content: (
        <Card>
          <Title as="h3" className="text-xl">User and Role Management</Title>
          <div className="mt-4 max-w-md">
            <Input label="Search Users" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Name or email..." />
          </div>
          <Table
            className="mt-4"
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "role", label: "Role" },
              { key: "status", label: "Status" },
              { key: "actions", label: "Actions" },
            ]}
            data={usersRows}
          />
        </Card>
      ),
    },
    {
      id: "requests",
      label: "Service Requests",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Service Request Operations</Title>
          <Table
            className="mt-4"
            columns={[
              { key: "title", label: "Title" },
              { key: "client", label: "Client" },
              { key: "priority", label: "Priority" },
              { key: "status", label: "Status" },
              { key: "action", label: "Update" },
            ]}
            data={requestRows}
          />
        </Card>
      ),
    },
    {
      id: "training",
      label: "Training Mgmt",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Training Management</Title>
          <Table
            className="mt-4"
            columns={[
              { key: "code", label: "Code" },
              { key: "title", label: "Module" },
              { key: "instructor", label: "Instructor" },
              { key: "progress", label: "Progress" },
              { key: "action", label: "Update" },
            ]}
            data={trainingRows}
          />
        </Card>
      ),
    },
    {
      id: "content",
      label: "Public Content",
      content: (
        <Card>
          <Title as="h3" className="text-xl">Public Content Management</Title>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Select
              label="Service Page"
              value={selectedServiceSlug}
              onChange={(event) => {
                const slug = event.target.value;
                setSelectedServiceSlug(slug);
                const next = publicContent.services.find((entry) => entry.slug === slug);
                setServiceSummaryDraft(next?.summary || "");
              }}
            >
              {publicContent.services.map((entry) => (
                <option key={entry.slug} value={entry.slug}>{entry.name}</option>
              ))}
            </Select>
            <Input
              label="Training Organization"
              value={trainingOrgDraft}
              onChange={(event) => setTrainingOrgDraft(event.target.value)}
            />
          </div>

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-medium text-[var(--amc-text-strong)]">Service Summary</span>
            <textarea
              rows={4}
              className="rounded-[var(--amc-radius-md)] border border-[var(--amc-border)] bg-white px-3 py-3 text-sm text-[var(--amc-text-strong)] outline-none transition duration-[var(--amc-dur-fast)] ease-[var(--amc-ease-standard)] focus:border-[var(--amc-accent-500)] focus:ring-2 focus:ring-[var(--amc-accent-400)]/25"
              value={serviceSummaryDraft}
              onChange={(event) => setServiceSummaryDraft(event.target.value)}
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={async () => {
                if (!selectedService) return;
                try {
                  await withAuthRequest((token) =>
                    updateAdminServiceContent(token, selectedService.slug, {
                      summary: serviceSummaryDraft,
                    }));
                  setStatusMessage(`Service content updated: ${selectedService.name}`);
                  await loadAdminData();
                } catch (updateError) {
                  setError(parseApiError(updateError).message || "Failed to update service content");
                }
              }}
            >
              Save Service Content
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                try {
                  await withAuthRequest((token) =>
                    updateAdminTrainingContent(token, { organization: trainingOrgDraft }));
                  setStatusMessage("Training content updated");
                  await loadAdminData();
                } catch (updateError) {
                  setError(parseApiError(updateError).message || "Failed to update training content");
                }
              }}
            >
              Save Training Content
            </Button>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <Section>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Title as="h2" className="text-2xl">Admin Dashboard</Title>
            <TextBlock className="mt-2">Welcome, {authState?.user?.fullName || "User"}</TextBlock>
            <TextBlock className="mt-1">Role: {authState?.user?.role}</TextBlock>
          </div>
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
      </Card>

      {error ? (
        <Alert variant="danger" className="mt-6" title="Operation Failed">
          {error}
        </Alert>
      ) : null}
      {statusMessage ? (
        <Alert variant="success" className="mt-6" title="Update Complete">
          {statusMessage}
        </Alert>
      ) : null}

      {loading ? (
        <Card className="mt-6">
          <TextBlock>Loading admin system data...</TextBlock>
        </Card>
      ) : (
        <div className="mt-6">
          <Tabs items={tabs} />
        </div>
      )}
    </Section>
  );
}
