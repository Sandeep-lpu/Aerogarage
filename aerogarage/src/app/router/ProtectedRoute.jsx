import { Badge, Button, Card, Section, TextBlock, Title } from "../../components/ui";
import Link from "./Link";
import { useAuth } from "../auth/authContext";

export default function ProtectedRoute({
  children,
  allowRoles = [],
  loginPath = "/client/login",
  portalTitle = "Portal",
}) {
  const { sessionReady, isAuthenticated, hasRole } = useAuth();

  if (!sessionReady) {
    return (
      <Section>
        <Card>
          <Badge variant="info">Session Check</Badge>
          <Title as="h2" className="mt-3 text-2xl">Verifying Access</Title>
          <TextBlock className="mt-2">Please wait while we validate your session.</TextBlock>
        </Card>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section>
        <Card>
          <Badge variant="warning">Authentication Required</Badge>
          <Title as="h2" className="mt-3 text-2xl">{portalTitle} Access Restricted</Title>
          <TextBlock className="mt-2">Please sign in with an authorized account to continue.</TextBlock>
          <Button as={Link} to={loginPath} className="mt-5">Go to Login</Button>
        </Card>
      </Section>
    );
  }

  if (allowRoles.length > 0 && !hasRole(...allowRoles)) {
    return (
      <Section>
        <Card>
          <Badge variant="danger">Forbidden</Badge>
          <Title as="h2" className="mt-3 text-2xl">Insufficient Role Permission</Title>
          <TextBlock className="mt-2">Your account is authenticated but not authorized for this portal.</TextBlock>
          <Button as={Link} to="/" className="mt-5">Return to Website</Button>
        </Card>
      </Section>
    );
  }

  return children;
}


