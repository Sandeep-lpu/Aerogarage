import "dotenv/config";

const PORT = process.env.PORT || "5000";
const API_BASE = process.env.API_BASE_URL || `http://localhost:${PORT}/api`;

function assert(condition, message, context = null) {
  if (!condition) {
    if (context) console.error("Assert Context:", JSON.stringify(context, null, 2));
    throw new Error(message);
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, options);
  } catch (error) {
    const message = error?.cause?.message || error.message || "Network failure";
    throw new Error(`Cannot reach API at ${API_BASE}. ${message}`);
  }
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  return { response, payload };
}

async function run() {
  const runId = Date.now();
  const email = `qa.admin.${runId}@test.com`;
  const password = "Pass@1234!";

  console.log("-> Registering Admin Test User...");
  const register = await request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "QA Admin",
      email,
      password,
      role: "admin",
    }),
  });
  assert(register.response.status === 201, "Admin register failed", register.payload);

  console.log("-> Logging in...");
  const login = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert(login.response.status === 200, "Admin login failed");

  const token = login.payload?.data?.accessToken;
  assert(token, "Missing access token");

  console.log("-> Testing Admin Health Endpoint...");
  const health = await request("/admin/health", {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(health.response.status === 200, "Authorized Admin health check failed");

  console.log("-> Testing Admin Users List with Pagination...");
  const listUsers = await request("/admin/users?page=1&limit=5&role=admin", {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(listUsers.response.status === 200, "Admin users list endpoint failed", listUsers.payload);
  assert(listUsers.payload?.data?.users, "Missing user data array", listUsers.payload);

  console.log("-> Testing Admin Service Requests List...");
  const listRequests = await request("/admin/requests?page=1&limit=10", {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(listRequests.response.status === 200, "Admin requests list endpoint failed", listRequests.payload);
  assert(listRequests.payload?.data?.requests !== undefined, "Missing requests data array", listRequests.payload);

  console.log("-> Testing Analytics Dashboard KPIs...");
  const dashboard = await request("/analytics/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(dashboard.response.status === 200, "Analytics dashboard endpoint failed", dashboard.payload);
  
  const kpis = dashboard.payload?.data?.kpis;
  assert(kpis !== undefined, "KPIs missing from analytics dashboard payload", dashboard.payload);
  assert(kpis.totalUsers !== undefined, "totalUsers metric missing");
  assert(kpis.pendingRequests !== undefined, "pendingRequests metric missing");

  // Client RBAC Test: Register a standard client and ensure they CANNOT access /admin
  const clientEmail = `qa.client.${runId}@test.com`;
  await request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "QA Client User",
      email: clientEmail,
      password,
      role: "client",
    }),
  });

  const clientLogin = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: clientEmail, password }),
  });
  const clientToken = clientLogin.payload?.data?.accessToken;

  console.log("-> Checking RBAC rule (Client accessing Admin)");
  const rbacCheck = await request("/admin/health", {
    headers: { Authorization: `Bearer ${clientToken}` },
  });
  assert(rbacCheck.response.status === 403, "RBAC Admin block failed! Client accessed admin route.");

  console.log("✅ Admin E2E smoke tests passed successfully!");
}

run().catch((error) => {
  console.error(`❌ Admin E2E smoke test failed: ${error.message}`);
  process.exit(1);
});
