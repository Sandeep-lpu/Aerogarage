import { useMemo, useState } from "react";
import { Badge, Button, Card, Input, Section, Select, Table, TextBlock, Title } from "../../../components/ui";
import {
  mapValidationErrors,
  parseApiError,
  submitCareerApplication,
} from "../../../services/api/publicApi";

const valueProps = [
  "Safety-first operating culture",
  "Clear technical and leadership progression",
  "Exposure to large-scale aviation infrastructure operations",
  "Continuous learning with performance-driven standards",
];

const openings = [
  { role: "Aircraft Engineer", location: "Riyadh", team: "Line Maintenance", type: "Full-time", quantity: "00" },
  { role: "PBB Technician", location: "Riyadh", team: "Infrastructure", type: "Full-time", quantity: "00" },
  { role: "Security Supervisor", location: "Riyadh", team: "Aircraft Security", type: "Full-time", quantity: "00" },
  { role: "Training Coordinator", location: "Riyadh", team: "Training Org", type: "Full-time", quantity: "00" },
];

const availablePositions = [
  "Aircraft Engineer",
  "PBB Technician",
  "Security Supervisor",
  "Training Coordinator",
  "Other / Open Application",
];

const hiringSteps = [
  "Application and profile review",
  "Technical and behavioral assessment",
  "Panel interview and compliance screening",
  "Offer, onboarding, and induction",
];

const initialApplication = {
  fullName: "",
  email: "",
  phone: "",
  position: "Aircraft Engineer",
  yearsOfExperience: "",
  linkedInUrl: "",
  coverLetter: "",
};

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email";

  if (!form.phone.trim()) errors.phone = "Phone is required";
  if (!form.position.trim()) errors.position = "Position is required";

  const years = Number(form.yearsOfExperience);
  if (form.yearsOfExperience === "") errors.yearsOfExperience = "Experience is required";
  else if (!Number.isFinite(years) || years < 0 || years > 60) {
    errors.yearsOfExperience = "Experience must be between 0 and 60";
  }

  if (form.linkedInUrl && !/^https?:\/\/.+/.test(form.linkedInUrl)) {
    errors.linkedInUrl = "LinkedIn URL must start with http:// or https://";
  }

  return errors;
}

export default function CareersPage() {
  const [form, setForm] = useState(initialApplication);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [apiFieldErrors, setApiFieldErrors] = useState({});

  const localErrors = useMemo(() => validate(form), [form]);
  const mergedErrors = { ...localErrors, ...apiFieldErrors };

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setApiFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const onBlur = (field) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  const onSubmit = async (event) => {
    event.preventDefault();

    const requiredTouched = {
      fullName: true,
      email: true,
      phone: true,
      position: true,
      yearsOfExperience: true,
      linkedInUrl: true,
    };
    setTouched(requiredTouched);

    if (Object.keys(localErrors).length > 0) return;

    setIsSubmitting(true);
    setApiMessage("");
    setApiFieldErrors({});

    try {
      const payload = {
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience),
      };

      const response = await submitCareerApplication(payload);
      setSubmitted(true);
      setApiMessage(response?.message || "Application submitted successfully.");
      setForm(initialApplication);
      setTouched({});
    } catch (error) {
      const parsed = parseApiError(error);
      const mapped = mapValidationErrors(parsed.details);
      setApiFieldErrors(mapped);
      setApiMessage(parsed.message || "Unable to submit application.");
      setSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="amc-page-bg amc-page-bg-careers">
      <Section className="bg-[var(--amc-gradient-hero)] text-white">
        <Badge className="amc-hero-badge">Careers at AMC</Badge>
        <Title as="h1" className="mt-4 max-w-4xl text-4xl text-white md:text-5xl">
          Build a Career in Safety-Critical Aviation Operations
        </Title>
        <TextBlock className="amc-hero-lead mt-5 max-w-3xl">
          Join a team focused on operational excellence, regulatory discipline, and national aviation capability building.
        </TextBlock>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as="a" href="#careers-apply">Apply Now</Button>
          <Button as="a" href="mailto:careers@aeroamc.com" variant="secondary" className="amc-hero-secondary-btn">
            Contact Recruitment
          </Button>
        </div>
      </Section>

      <Section title="Talent Value Proposition" subtitle="Reasons technical professionals choose AMC.">
        <div className="grid gap-4 md:grid-cols-2">
          {valueProps.map((item) => (
            <Card key={item}><TextBlock>{item}</TextBlock></Card>
          ))}
        </div>
      </Section>

      <Section className="bg-[var(--amc-gradient-surface)]" title="Current Openings" subtitle="Priority hiring lanes across operations and technical teams.">
        <Table
          columns={[
            { key: "role", label: "Role" },
            { key: "location", label: "Location" },
            { key: "team", label: "Team" },
            { key: "type", label: "Type" },
            { key: "quantity", label: "Openings" },
          ]}
          data={openings}
        />
      </Section>

      <Section id="careers-apply" title="Apply for a Role" subtitle="Submit your profile for recruitment screening.">
        <Card>
          <form className="grid gap-4" onSubmit={onSubmit} noValidate>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full Name" value={form.fullName} onChange={onChange("fullName")} onBlur={onBlur("fullName")} error={touched.fullName ? mergedErrors.fullName : ""} />
              <Input label="Email" type="email" value={form.email} onChange={onChange("email")} onBlur={onBlur("email")} error={touched.email ? mergedErrors.email : ""} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Phone" value={form.phone} onChange={onChange("phone")} onBlur={onBlur("phone")} error={touched.phone ? mergedErrors.phone : ""} />
              <Select label="Position" value={form.position} onChange={onChange("position")}>
                {availablePositions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Years of Experience" type="number" min="0" max="60" value={form.yearsOfExperience} onChange={onChange("yearsOfExperience")} onBlur={onBlur("yearsOfExperience")} error={touched.yearsOfExperience ? mergedErrors.yearsOfExperience : ""} />
              <Input label="LinkedIn URL (Optional)" value={form.linkedInUrl} onChange={onChange("linkedInUrl")} onBlur={onBlur("linkedInUrl")} error={touched.linkedInUrl ? mergedErrors.linkedInUrl : ""} />
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-[var(--amc-text-strong)]">Cover Letter (Optional)</span>
              <textarea
                rows={5}
                className="rounded-[var(--amc-radius-md)] border border-[var(--amc-border)] bg-[var(--amc-bg-field)] px-3 py-3 text-sm text-[var(--amc-text-strong)] outline-none transition duration-[var(--amc-dur-fast)] ease-[var(--amc-ease-standard)] focus:border-[var(--amc-accent-500)] focus:ring-2 focus:ring-[var(--amc-accent-400)]/25"
                value={form.coverLetter}
                onChange={onChange("coverLetter")}
                placeholder="Share your relevant aviation experience and career objective."
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isSubmitting} className={isSubmitting ? "opacity-70" : ""}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => {
                  setForm(initialApplication);
                  setTouched({});
                  setSubmitted(false);
                  setApiFieldErrors({});
                  setApiMessage("");
                }}
              >
                Reset
              </Button>
            </div>

            {apiMessage ? (
              <p className={`text-sm font-medium ${submitted ? "text-emerald-700" : "text-rose-700"}`} role="status" aria-live="polite">
                {apiMessage}
              </p>
            ) : null}
          </form>
        </Card>
      </Section>

      <Section title="Hiring Process" subtitle="Transparent selection framework for candidates.">
        <div className="grid gap-4 md:grid-cols-2">
          {hiringSteps.map((item, index) => (
            <Card key={item}>
              <p className="text-sm font-semibold text-[var(--amc-accent-600)]">Step {index + 1}</p>
              <TextBlock className="mt-2">{item}</TextBlock>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
