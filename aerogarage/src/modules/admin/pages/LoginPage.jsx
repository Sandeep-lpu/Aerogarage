import { useEffect, useState } from "react";
import { Badge, Button, Card, Input, Section, TextBlock, Title } from "../../../components/ui";
import { useAuth } from "../../../app/auth/authContext";
import { useRouter } from "../../../app/router/routerStore";

export default function AdminLoginPage() {
  const { login, authLoading, isAuthenticated, hasRole } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (isAuthenticated && hasRole("admin", "staff")) {
      navigate("/admin/dashboard");
    }
  }, [hasRole, isAuthenticated, navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const result = await login({ email, password });

    if (!result.ok) {
      setOk(false);
      setMessage(result.error?.message || "Login failed");
      return;
    }

    if (!["admin", "staff"].includes(result.data?.user?.role)) {
      setOk(false);
      setMessage("This account is not authorized for Admin System.");
      return;
    }

    setOk(true);
    navigate("/admin/dashboard");
  };

  return (
    <Section>
      <Card className="mx-auto max-w-xl">
        <Badge variant="warning">Admin System</Badge>
        <Title as="h2" className="mt-3 text-2xl">Admin Login</Title>
        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={authLoading}>{authLoading ? "Signing in..." : "Sign In"}</Button>
        </form>
        {message ? <TextBlock className={`mt-4 ${ok ? "text-emerald-300" : "text-rose-300"}`}>{message}</TextBlock> : null}
      </Card>
    </Section>
  );
}
