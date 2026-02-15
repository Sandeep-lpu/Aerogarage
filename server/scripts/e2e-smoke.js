import "dotenv/config";

const PORT = process.env.PORT || "5000";
const API_BASE = process.env.API_BASE_URL || `http://localhost:${PORT}/api`;

function assert(condition, message) {
  if (!condition) {
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
  const email = `qa.client.${runId}@test.com`;
  const password = "Pass@1234";

  const register = await request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "QA Client",
      email,
      password,
      role: "client",
    }),
  });
  assert(register.response.status === 201, "register failed");

  const login = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert(login.response.status === 200, "login failed");

  const token = login.payload?.data?.accessToken;
  assert(token, "missing access token");

  const unauthorized = await request("/client/health");
  assert(unauthorized.response.status === 401, "missing-token check failed");

  const authorized = await request("/client/health", {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(authorized.response.status === 200, "authorized client health failed");

  const adminBlocked = await request("/admin/health", {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(adminBlocked.response.status === 403, "rbac admin block failed");

  const trainingContent = await request("/public/content/training");
  assert(trainingContent.response.status === 200, "public content endpoint failed");

  console.log("E2E smoke passed");
}

run().catch((error) => {
  console.error(`E2E smoke failed: ${error.message}`);
  process.exit(1);
});
