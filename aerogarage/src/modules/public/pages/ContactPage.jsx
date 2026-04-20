import { useMemo, useState } from "react";
import { Badge, Button, Card, Input, Section, Select, TextBlock, Title } from "../../../components/ui";
import {
  mapValidationErrors,
  parseApiError,
  submitContactInquiry,
} from "../../../services/api/publicApi";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  inquiryType: "sales",
  company: "",
  message: "",
};

const channels = {
  sales: { label: "Sales", email: "sales@aeroamc.com", target: "Commercial team" },
  careers: { label: "Careers", email: "careers@aeroamc.com", target: "Recruitment team" },
  contact: { label: "General Contact", email: "contact@aeroamc.com", target: "Corporate office" },
};

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email";

  if (!form.phone.trim()) errors.phone = "Phone is required";
  if (!form.message.trim() || form.message.trim().length < 20) {
    errors.message = "Message must be at least 20 characters";
  }

  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [apiFieldErrors, setApiFieldErrors] = useState({});

  const localErrors = useMemo(() => validate(form), [form]);
  const selectedChannel = channels[form.inquiryType] || channels.sales;

  const mergedErrors = {
    ...localErrors,
    ...apiFieldErrors,
  };

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setApiFieldErrors((prev) => ({ ...prev, [field]: "" }));
    if (apiMessage) setApiMessage("");
  };

  const onBlur = (field) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  const onSubmit = async (event) => {
    event.preventDefault();

    const nextTouched = {
      fullName: true,
      email: true,
      phone: true,
      message: true,
    };
    setTouched(nextTouched);

    if (Object.keys(localErrors).length > 0) {
      setSubmitted(false);
      setApiMessage("Please complete all required fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    setApiMessage("");
    setApiFieldErrors({});

    try {
      const response = await submitContactInquiry(form);
      setSubmitted(true);
      setApiMessage(response?.message || "Inquiry submitted successfully.");
      setForm(initialForm);
      setTouched({});
    } catch (error) {
      const parsed = parseApiError(error);
      const mapped = mapValidationErrors(parsed.details);
      setApiFieldErrors(mapped);
      setApiMessage(parsed.message || "Unable to submit inquiry.");
      setSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="amc-page-bg amc-page-bg-contact">
      <Section className="bg-[var(--amc-gradient-hero)] text-white">
        <Badge className="amc-hero-badge">Corporate Contact</Badge>
        <Title as="h1" className="mt-4 max-w-4xl text-4xl text-white md:text-5xl">
          Lead Conversion and Corporate Inquiry Center
        </Title>
        <TextBlock className="amc-hero-lead mt-5 max-w-3xl">
          Route your request to the correct AMC function and receive an organized response pathway.
        </TextBlock>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="amc-hero-channel-card rounded-[var(--amc-radius-md)] border p-4 text-sm">Sales: sales@aeroamc.com</div>
          <div className="amc-hero-channel-card rounded-[var(--amc-radius-md)] border p-4 text-sm">Careers: careers@aeroamc.com</div>
          <div className="amc-hero-channel-card rounded-[var(--amc-radius-md)] border p-4 text-sm">Corporate: contact@aeroamc.com</div>
        </div>
      </Section>

      <Section title="Submit Inquiry" subtitle="Form validation and channel routing are configured for conversion-focused lead capture." islandHeader={true}>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <form className="grid gap-4" onSubmit={onSubmit} noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Full Name" value={form.fullName} onChange={onChange("fullName")} onBlur={onBlur("fullName")} error={touched.fullName ? mergedErrors.fullName : ""} />
                <Input label="Company" value={form.company} onChange={onChange("company")} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Email" type="email" value={form.email} onChange={onChange("email")} onBlur={onBlur("email")} error={touched.email ? mergedErrors.email : ""} />
                <Input label="Phone" value={form.phone} onChange={onChange("phone")} onBlur={onBlur("phone")} error={touched.phone ? mergedErrors.phone : ""} />
              </div>

              <Select label="Inquiry Type" value={form.inquiryType} onChange={onChange("inquiryType")}>
                <option value="sales">Sales</option>
                <option value="careers">Careers</option>
                <option value="contact">General Contact</option>
              </Select>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-[var(--amc-text-strong)]">Message</span>
                <textarea
                  rows={5}
                  className="rounded-[var(--amc-radius-md)] border border-[var(--amc-border)] bg-[var(--amc-bg-field)] px-3 py-3 text-sm text-[var(--amc-text-strong)] outline-none transition duration-[var(--amc-dur-fast)] ease-[var(--amc-ease-standard)] focus:border-[var(--amc-accent-500)] focus:ring-2 focus:ring-[var(--amc-accent-400)]/25"
                  value={form.message}
                  onChange={onChange("message")}
                  onBlur={onBlur("message")}
                  placeholder="Describe your requirement, timeline, and service area."
                />
                {touched.message && mergedErrors.message ? <span className="text-xs text-rose-600">{mergedErrors.message}</span> : null}
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={isSubmitting} className={isSubmitting ? "opacity-70" : ""}>
                  {isSubmitting ? "Submitting..." : "Send Inquiry"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={() => {
                    setForm(initialForm);
                    setTouched({});
                    setSubmitted(false);
                    setApiMessage("");
                    setApiFieldErrors({});
                  }}
                >
                  Reset
                </Button>
              </div>

              {apiMessage ? (
                <p
                  className={`text-sm font-medium ${submitted ? "text-emerald-700" : "text-rose-700"}`}
                  role="status"
                  aria-live="polite"
                >
                  {apiMessage}
                </p>
              ) : null}
            </form>
          </Card>

          <div className="grid gap-4">
            <Card>
              <h3 className="text-xl">Routing Summary</h3>
              <TextBlock className="mt-3">Selected channel: <strong>{selectedChannel.label}</strong></TextBlock>
              <TextBlock className="mt-2">Destination: {selectedChannel.email}</TextBlock>
              <TextBlock className="mt-2">Owner: {selectedChannel.target}</TextBlock>
            </Card>

            <Card>
              <h3 className="text-xl">Riyadh Office</h3>
              <div className="mt-3 grid gap-1">
                <TextBlock>3869, Wadi Al Raihan,</TextBlock>
                <TextBlock>Al Qadisiyah District - 7777</TextBlock>
                <TextBlock>Dammam Road, Riyadh</TextBlock>
                <TextBlock>Kingdom of Saudi Arabia – 13261</TextBlock>
              </div>
              <TextBlock className="mt-3">Mobile: +966 580 722 815</TextBlock>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="bg-[var(--amc-gradient-surface)]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--amc-text-strong)]">Office Map</h2>
          <p className="mt-1 text-sm text-[var(--amc-text-muted)]">Location and access support for partners and visitors.</p>
        </div>
        <div className="overflow-hidden rounded-[var(--amc-radius-lg)] border border-[var(--amc-border)] shadow-[var(--amc-shadow-md)]">
          <iframe
            title="Aerogarage Riyadh Office – Al Qadisiyah"
            src="https://maps.google.com/maps?q=24.8299748,46.828774&t=m&z=16&output=embed"
            className="h-[480px] w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-[var(--amc-radius-md)] border border-[var(--amc-border)] bg-[var(--amc-glass-bg)] px-4 py-3 backdrop-blur">
          <span className="mt-0.5 text-lg" aria-hidden="true">📍</span>
          <div>
            <p className="text-sm font-semibold text-[var(--amc-text-strong)]">Aerogarage Company (AMC)</p>
            <p className="mt-0.5 text-sm text-[var(--amc-text-muted)]">3869, Wadi Al Raihan, Al Qadisiyah District - 7777, Dammam Road, Riyadh, Kingdom of Saudi Arabia – 13261</p>
          </div>
          <a
            href="https://maps.app.goo.gl/6v26vLot6SW1TH427"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto shrink-0 rounded-[var(--amc-radius-sm)] bg-[var(--amc-accent-600)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Open in Maps
          </a>
        </div>
      </Section>
    </main>
  );
}
