import { useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Input, Section, TextBlock, Title } from "../../../components/ui";
import Link from "../../../app/router/Link";
import { register } from "../../../services/auth/authApi";
import { parseApiError } from "../../../services/api/publicApi";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validateRegistration(form) {
  const errors = {};

  if (!form.fullName.trim() || form.fullName.trim().length < 3) {
    errors.fullName = "Enter a valid full name (min 3 characters).";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid business email address.";
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,120}$/.test(form.password)) {
    errors.password = "Password must be 8+ characters with letters and numbers.";
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export default function ClientRegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const errors = useMemo(() => validateRegistration(form), [form]);

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    setMessage("");

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      const response = await register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: "client",
      });

      setOk(true);
      setMessage(response?.message || "Registration successful. Please sign in.");
      setForm(initialForm);
      setTouched({});
    } catch (error) {
      const parsed = parseApiError(error);
      setOk(false);
      setMessage(parsed.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 overflow-y-auto z-10 relative">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

        <Card className="w-full border border-white/10 bg-slate-900/60 p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

          <div className="flex justify-center mb-5">
            <Badge variant="info" className="bg-violet-500/10 text-violet-400 border-violet-500/20 py-1.5 px-4">Client Portal</Badge>
          </div>

          <Title as="h2" className="text-2xl font-bold text-center text-white mb-1">Create Client Account</Title>
          <TextBlock className="text-center text-slate-400 mb-6 text-sm">Register your airline or airport representative account.</TextBlock>

          <form className="grid gap-4 relative z-10" onSubmit={onSubmit}>
            <Input
              label="Full Name"
              value={form.fullName}
              onChange={onChange("fullName")}
              error={touched.fullName ? errors.fullName : ""}
              required
              placeholder="Your full name"
              className="bg-slate-950/50 border-white/10 text-white"
            />
            <Input
              label="Business Email"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              error={touched.email ? errors.email : ""}
              required
              placeholder="client@company.com"
              className="bg-slate-950/50 border-white/10 text-white"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={onChange("password")}
              error={touched.password ? errors.password : ""}
              required
              placeholder="Min 8 chars with letters & numbers"
              className="bg-slate-950/50 border-white/10 text-white"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={onChange("confirmPassword")}
              error={touched.confirmPassword ? errors.confirmPassword : ""}
              required
              placeholder="••••••••"
              className="bg-slate-950/50 border-white/10 text-white"
            />

            <div className="flex gap-3 mt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 border-0 shadow-[0_0_20px_rgba(139,92,246,0.2)] text-white font-bold tracking-wide transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Registering...
                  </span>
                ) : "Create Account"}
              </Button>
              <Button as={Link} to="/client/login" variant="secondary" className="h-11 bg-slate-800 hover:bg-slate-700 border-white/10 text-slate-200">
                Back to Login
              </Button>
            </div>
          </form>

          {message && (
            <div className={`mt-5 p-4 rounded-lg border flex items-start gap-3 ${ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-red-500/10 border-red-500/20 text-red-300"}`}>
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

