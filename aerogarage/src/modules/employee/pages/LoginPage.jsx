import { useEffect, useState } from "react";
import { Badge, Button, Card, Input, Section, TextBlock, Title } from "../../../components/ui";
import { useAuth } from "../../../app/auth/authContext";
import { useRouter } from "../../../app/router/routerStore";

export default function EmployeeLoginPage() {
  const { login, authLoading, isAuthenticated, hasRole } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (isAuthenticated && hasRole("employee", "staff", "admin")) {
      navigate("/employee/dashboard");
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

    if (!["employee", "staff", "admin"].includes(result.data?.user?.role)) {
      setOk(false);
      setMessage("This account is not authorized for Employee Portal.");
      return;
    }

    setOk(true);
    navigate("/employee/dashboard");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 overflow-y-auto z-10 relative">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

        <Card className="w-full amc-glass-card border border-white/10 bg-slate-900/60 p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

          <div className="flex justify-center mb-6">
            <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] py-1.5 px-4">Employee Authentication</Badge>
          </div>

          <Title as="h2" className="text-3xl font-bold text-center text-white mb-2">Employee Portal</Title>
          <TextBlock className="text-center text-slate-400 mb-8 text-sm">Handle assigned operations, submit requests for approval, and track work status.</TextBlock>

          <form className="grid gap-5 relative z-10" onSubmit={onSubmit}>
            <Input 
              label="Employee Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="employee@aerogarage.com"
              className="bg-slate-950/50 border-white/10 text-white placeholder-slate-600"
            />
            <Input 
              label="Passkey" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              className="bg-slate-950/50 border-white/10 text-white placeholder-slate-600"
            />
            <Button 
              type="submit" 
              disabled={authLoading}
              className="mt-4 w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-0 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] text-white font-bold tracking-wide transition-all"
            >
              {authLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verifying...
                </span>
              ) : "Authenticate Session"}
            </Button>
          </form>
          {message && (
            <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 ${ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-red-500/10 border-red-500/20 text-red-300"}`}>
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
