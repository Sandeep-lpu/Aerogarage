import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
const EMPTY_ARRAY = [];
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
import { ActivityFeed } from "../components/ActivityFeed";
import { AnalyticsOverview } from "../components/charts/AnalyticsOverview";
import {
  approveAdminWorkItem,
  enrollAdminTraining,
  fetchAdminApprovals,
  fetchAdminPublicContent,
  fetchAdminRequests,
  fetchAdminTrainingModules,
  fetchAdminUsers,
  rejectAdminWorkItem,
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
  if (value === "employee") return <Badge variant="info">employee</Badge>;
  return <Badge variant="info">client</Badge>;
}

export default function AdminDashboardPage() {
  const { authState, logout, withAuthRequest } = useAuth();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const [formError, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [activeView, setActiveView] = useState("analytics");

  const [userSearch, setUserSearch] = useState("");
  const [selectedServiceSlug, setSelectedServiceSlug] = useState("");
  const [serviceSummaryDraft, setServiceSummaryDraft] = useState("");
  const [trainingOrgDraft, setTrainingOrgDraft] = useState("");

  const [enrollForm, setEnrollForm] = useState({ employeeId: "", moduleId: "", note: "" });
  const [enrollLoading, setEnrollLoading] = useState(false);

  const { data: portalData, isLoading: loading, error: queryError } = useQuery({
    queryKey: ["adminPortalData"],
    queryFn: async () => {
      const [usersRes, requestsRes, modulesRes, contentRes, approvalsRes] = await withAuthRequest((token) =>
        Promise.all([
          fetchAdminUsers(token),
          fetchAdminRequests(token),
          fetchAdminTrainingModules(token),
          fetchAdminPublicContent(token),
          fetchAdminApprovals(token),
        ]));

      return {
        users: usersRes?.data?.users || [],
        requests: requestsRes?.data?.requests || [],
        trainingModules: modulesRes?.data?.modules || [],
        approvals: approvalsRes?.data?.approvals || [],
        publicContent: {
          services: contentRes?.data?.content?.services || [],
          training: contentRes?.data?.content?.training || null
        }
      };
    }
  });

  const error = queryError ? parseApiError(queryError).message || "Failed to load admin data" : formError;

  useEffect(() => {
    if (portalData?.publicContent?.services?.length > 0 && !selectedServiceSlug) {
      setSelectedServiceSlug(portalData.publicContent.services[0].slug);
      setServiceSummaryDraft(portalData.publicContent.services[0].summary);
    }
    if (portalData?.publicContent?.training && !trainingOrgDraft) {
      setTrainingOrgDraft(portalData.publicContent.training.organization);
    }
  }, [portalData?.publicContent, selectedServiceSlug, trainingOrgDraft]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
    };
    socket.on("data_updated", handleUpdate);
    return () => socket.off("data_updated", handleUpdate);
  }, [socket, queryClient]);

  const onEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!enrollForm.employeeId || !enrollForm.moduleId) {
      setError("Please select both an employee and a training module");
      return;
    }
    setEnrollLoading(true);
    setError("");
    setStatusMessage("");
    try {
      await withAuthRequest((token) => enrollAdminTraining(token, enrollForm));
      setStatusMessage("Employee successfully enrolled in training module");
      setEnrollForm({ employeeId: "", moduleId: "", note: "" });
      await queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
    } catch (err) {
      setError(parseApiError(err).message || "Enrollment failed");
    } finally {
      setEnrollLoading(false);
    }
  };

  const users = portalData?.users || EMPTY_ARRAY;
  const requests = portalData?.requests || EMPTY_ARRAY;
  const trainingModules = portalData?.trainingModules || EMPTY_ARRAY;
  const approvals = portalData?.approvals || EMPTY_ARRAY;
  const publicContent = portalData?.publicContent || { services: EMPTY_ARRAY, training: null };

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
              await queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
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
                updateAdminUserRole(token, entry._id, "employee"));
              setStatusMessage(`Employee role assigned to ${entry.email}`);
              await queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
            } catch (updateError) {
              setError(parseApiError(updateError).message || "Failed to assign employee role");
            }
          }}
        >
          Set Employee
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
              await queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
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
            await queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
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
            await queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
          } catch (updateError) {
            setError(parseApiError(updateError).message || "Failed to update training module");
          }
        }}
      >
        +5%
      </Button>
    ),
  }));

  const approvalRows = approvals.map((entry) => ({
    title: entry.title,
    requestedBy: entry.createdBy?.email || "-",
    assignee: entry.assignedTo?.email || "-",
    status: entry.status,
    action: (
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          className="h-9"
          onClick={async () => {
            try {
              await withAuthRequest((token) => approveAdminWorkItem(token, entry._id, "Approved by admin dashboard"));
              setStatusMessage(`Approved: ${entry.title}`);
              await queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
            } catch (updateError) {
              setError(parseApiError(updateError).message || "Failed to approve item");
            }
          }}
        >
          Approve
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-9"
          onClick={async () => {
            try {
              await withAuthRequest((token) => rejectAdminWorkItem(token, entry._id, "Rejected by admin dashboard"));
              setStatusMessage(`Rejected: ${entry.title}`);
              await queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
            } catch (updateError) {
              setError(parseApiError(updateError).message || "Failed to reject item");
            }
          }}
        >
          Reject
        </Button>
      </div>
    ),
  }));

  const selectedService = publicContent.services.find((entry) => entry.slug === selectedServiceSlug);

  const tabs = [
    {
      id: "users",
      label: "Users/Roles",
      content: (
        <Card className="amc-glass-card border-white/10 bg-slate-900/40 backdrop-blur-md shadow-xl">
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
        <Card className="amc-glass-card border-white/10 bg-slate-900/40 backdrop-blur-md shadow-xl">
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
        <div className="grid gap-6">
          <Card className="amc-glass-card border-white/10 bg-slate-900/40 backdrop-blur-md shadow-xl">
            <Title as="h3" className="text-xl">Enroll Employee in Training</Title>
            <form className="mt-4 grid gap-4" onSubmit={onEnrollSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Employee"
                  value={enrollForm.employeeId}
                  onChange={(e) => setEnrollForm((prev) => ({ ...prev, employeeId: e.target.value }))}
                >
                  <option value="">-- Select Employee --</option>
                  {users.filter((u) => u.role === "employee").map((u) => (
                    <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>
                  ))}
                </Select>
                <Select
                  label="Training Module"
                  value={enrollForm.moduleId}
                  onChange={(e) => setEnrollForm((prev) => ({ ...prev, moduleId: e.target.value }))}
                >
                  <option value="">-- Select Module --</option>
                  {trainingModules.map((m) => (
                    <option key={m.id} value={m.id}>{m.code} - {m.title}</option>
                  ))}
                </Select>
              </div>
              <Input
                label="Enrollment Note (Optional)"
                value={enrollForm.note}
                onChange={(e) => setEnrollForm((prev) => ({ ...prev, note: e.target.value }))}
                placeholder="Reason for assignment..."
              />
              <Button type="submit" disabled={enrollLoading}>
                {enrollLoading ? "Enrolling..." : "Enroll Employee"}
              </Button>
            </form>
          </Card>

          <Card className="amc-glass-card border-white/10 bg-slate-900/40 backdrop-blur-md shadow-xl">
            <Title as="h3" className="text-xl">Training Module Directory</Title>
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
        </div>
      ),
    },
    {
      id: "approvals",
      label: "Approvals",
      content: (
        <Card className="amc-glass-card border-white/10 bg-slate-900/40 backdrop-blur-md shadow-xl">
          <Title as="h3" className="text-xl">Employee Approval Queue</Title>
          <TextBlock className="mt-2">Only admin decisions can authorize employee execution actions.</TextBlock>
          <Table
            className="mt-4"
            columns={[
              { key: "title", label: "Work Item" },
              { key: "requestedBy", label: "Requested By" },
              { key: "assignee", label: "Assigned To" },
              { key: "status", label: "Status" },
              { key: "action", label: "Decision" },
            ]}
            data={approvalRows}
          />
        </Card>
      ),
    },
    {
      id: "content",
      label: "Public Content",
      content: (
        <Card className="amc-glass-card border-white/10 bg-slate-900/40 backdrop-blur-md shadow-xl">
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
              className="rounded-[var(--amc-radius-md)] border border-[var(--amc-border)] bg-[var(--amc-bg-field)] px-3 py-3 text-sm text-[var(--amc-text-strong)] outline-none transition duration-[var(--amc-dur-fast)] ease-[var(--amc-ease-standard)] focus:border-[var(--amc-accent-500)] focus:ring-2 focus:ring-[var(--amc-accent-400)]/25"
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
                  await queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
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
                  await queryClient.invalidateQueries({ queryKey: ["adminPortalData"] });
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
    {
      id: "activity",
      label: "Live Activity",
      content: <ActivityFeed />,
    },
    {
      id: "analytics",
      label: "Analytics & BI",
      content: <AnalyticsOverview />,
    },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-transparent">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-slate-900/40 backdrop-blur-xl flex flex-col pt-6 z-10 transition-all">
        <div className="px-6 mb-4">
          <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Navigation</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1.5 px-3 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeView === tab.id 
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className={`h-1.5 w-1.5 rounded-full ${activeView === tab.id ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "bg-transparent"}`} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-5 border-t border-white/10 mt-auto bg-slate-900/50">
           <div className="flex items-center gap-3 mb-4">
             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/20 shadow-lg">
               <span className="text-sm font-bold text-white uppercase">{authState?.user?.fullName?.charAt(0) || "A"}</span>
             </div>
             <div className="overflow-hidden flex-1">
               <p className="text-sm font-semibold text-white truncate">{authState?.user?.fullName || "System Admin"}</p>
               <p className="text-xs text-blue-300 truncate uppercase tracking-wide">{authState?.user?.role}</p>
             </div>
           </div>
           <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 border-white/10 text-slate-200 shadow-md" onClick={logout}>
             Sign Out Securely
           </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8 amc-glass-card rounded-2xl border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-20 -mr-20 h-72 w-72 rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />
            <div className="absolute left-1/4 bottom-0 -mb-10 h-40 w-40 rounded-full bg-emerald-600/10 blur-[60px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge variant="warning" className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">System Connected</Badge>
                <Title as="h2" className="text-3xl md:text-4xl font-bold text-white tracking-wide font-[var(--amc-font-heading)]">
                  Welcome to Operations, {authState?.user?.fullName?.split(' ')[0] || "Admin"}
                </Title>
                <TextBlock className="text-slate-400 mt-2 max-w-2xl text-lg">
                  Monitor network health, service requests, and governance approvals in real-time.
                </TextBlock>
              </div>
              <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-white/10">
                 <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Active Users</p>
                    <p className="text-2xl font-bold text-white">{users.length}</p>
                 </div>
                 <div className="w-px h-10 bg-white/10" />
                 <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Pending Req</p>
                    <p className="text-2xl font-bold text-blue-400">{requests.filter(r => r.status === 'submitted').length}</p>
                 </div>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-6 bg-red-950/40 border-red-500/30 text-red-200" title="Operation Alert">
              {error}
            </Alert>
          )}
          {statusMessage && (
            <Alert variant="success" className="mb-6 bg-emerald-950/40 border-emerald-500/30 text-emerald-200" title="Update Confirmed">
              {statusMessage}
            </Alert>
          )}

          {loading ? (
            <div className="amc-glass-card rounded-2xl border border-white/10 bg-slate-900/40 p-16 text-center shadow-xl backdrop-blur-md">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
              <p className="mt-6 text-slate-400 font-medium text-lg tracking-wide">Syncing institutional array...</p>
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

