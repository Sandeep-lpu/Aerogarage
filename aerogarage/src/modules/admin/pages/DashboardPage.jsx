import { Button, Card, Section, TextBlock, Title } from "../../../components/ui";
import { useAuth } from "../../../app/auth/authContext";

export default function AdminDashboardPage() {
  const { authState, logout } = useAuth();

  return (
    <Section>
      <Card>
        <Title as="h2" className="text-2xl">Admin Dashboard</Title>
        <TextBlock className="mt-3">Welcome, {authState?.user?.fullName || "User"}</TextBlock>
        <TextBlock className="mt-2">Role: {authState?.user?.role}</TextBlock>
        <Button className="mt-5" variant="secondary" onClick={logout}>Logout</Button>
      </Card>
    </Section>
  );
}



