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
  const empEmail = `qa.emp.${runId}@test.com`;
  const adminEmail = `qa.admin.${runId}@test.com`;
  const password = "Pass@1234";

  console.log("1. Registering Employee...");
  const empReg = await request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName: "QA Employee", email: empEmail, password, role: "employee" }),
  });
  assert(empReg.response.status === 201, "Employee register failed");

  console.log("2. Logging in Employee...");
  const empLogin = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: empEmail, password }),
  });
  const empToken = empLogin.payload?.data?.accessToken;
  assert(empToken, "Missing employee token");

  console.log("3. Registering Admin...");
  const adminReg = await request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName: "QA Admin", email: adminEmail, password, role: "admin" }),
  });
  assert(adminReg.response.status === 201, "Admin register failed");

  console.log("4. Logging in Admin...");
  const adminLogin = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: adminEmail, password }),
  });
  const adminToken = adminLogin.payload?.data?.accessToken;
  assert(adminToken, "Missing admin token");

  console.log("5. Employee: Creating draft request...");
  const createDraft = await request("/employee/requests", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${empToken}`
    },
    body: JSON.stringify({
      title: "New E2E QA Test Item",
      type: "Feature Implementation",
      description: "Testing the flow extensively over multiple steps."
    }),
  });
  assert(createDraft.response.status === 201, `Draft creation failed: ${JSON.stringify(createDraft.payload)}`);
  
  // The backend controller explicitly maps workItem._id to .id in the response body!
  const workItemId = createDraft.payload?.data?.id;
  assert(workItemId, "Missing workItemId in response");

  console.log("6. Employee: Submitting draft...");
  const submitDraft = await request(`/employee/requests/${workItemId}/submit`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${empToken}` },
  });
  assert(submitDraft.response.status === 200, "Draft submission failed");

  console.log("7. Non-Admin (Employee): Attempting to approve (Should Fail 403)...");
  const failedApprove = await request(`/admin/approvals/${workItemId}/approve`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${empToken}` 
    },
    body: JSON.stringify({ note: "Employee trying to approve" })
  });
  assert(failedApprove.response.status === 403, "Non-admin approval check failed (expected 403)");
  console.log("   -> Correctly blocked non-admin with 403.");

  console.log("8. Admin: Approving request...");
  const approveReq = await request(`/admin/approvals/${workItemId}/approve`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${adminToken}` 
    },
    body: JSON.stringify({ note: "Looks good, approved." })
  });
  assert(approveReq.response.status === 200, "Admin approval failed");

  console.log("9. Employee: Marking task as executed...");
  const execReq = await request(`/employee/tasks/${workItemId}`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${empToken}` 
    },
    body: JSON.stringify({ status: "executed", note: "Task executed successfully" })
  });
  assert(execReq.response.status === 200, "Employee execution failed");

  console.log("✅ E2E Employee Validation passed end-to-end!");
}

run().catch((error) => {
  console.error(`❌ E2E Employee Validation failed: ${error.message}`);
  process.exit(1);
});
