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
    <Section>
      <Card className="mx-auto max-w-xl">
        <Badge variant="info">Client Portal</Badge>
        <Title as="h2" className="mt-3 text-2xl">Create Client Account</Title>
        <TextBlock className="mt-2">Register your airline or airport representative account.</TextBlock>

        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          <Input
            label="Full Name"
            value={form.fullName}
            onChange={onChange("fullName")}
            error={touched.fullName ? errors.fullName : ""}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={onChange("email")}
            error={touched.email ? errors.email : ""}
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={onChange("password")}
            error={touched.password ? errors.password : ""}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={onChange("confirmPassword")}
            error={touched.confirmPassword ? errors.confirmPassword : ""}
            required
          />

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Registering..." : "Register"}</Button>
            <Button as={Link} to="/client/login" variant="secondary">Back to Login</Button>
          </div>
        </form>

        {message ? (
          <Alert className="mt-4" variant={ok ? "success" : "danger"} title={ok ? "Registration Complete" : "Registration Failed"}>
            {message}
          </Alert>
        ) : null}
      </Card>
    </Section>
  );
}
