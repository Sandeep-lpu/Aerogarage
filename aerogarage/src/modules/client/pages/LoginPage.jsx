import { useEffect, useState } from "react";
import { Badge, Button, Card, Input, Section, TextBlock, Title } from "../../../components/ui";
import Link from "../../../app/router/Link";
import { useAuth } from "../../../app/auth/authContext";
import { useRouter } from "../../../app/router/routerStore";

export default function ClientLoginPage() {
  const { login, authLoading, isAuthenticated, hasRole } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (isAuthenticated && hasRole("client", "staff", "admin")) {
      navigate("/client/dashboard");
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

    if (!["client", "staff", "admin"].includes(result.data?.user?.role)) {
      setOk(false);
      setMessage("This account is not authorized for Client Portal.");
      return;
    }

    setOk(true);
    navigate("/client/dashboard");
  };

  return (
    <Section>
      <Card className="mx-auto max-w-xl">
        <Badge variant="info">Client Portal</Badge>
        <Title as="h2" className="mt-3 text-2xl">Client Login</Title>
        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={authLoading}>{authLoading ? "Signing in..." : "Sign In"}</Button>
            <Button as={Link} to="/client/register" variant="secondary">Register</Button>
          </div>
        </form>
        {message ? <TextBlock className={`mt-4 ${ok ? "text-emerald-700" : "text-rose-700"}`}>{message}</TextBlock> : null}
      </Card>
    </Section>
  );
}
