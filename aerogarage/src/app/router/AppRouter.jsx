import { Suspense, lazy } from "react";
import { useRouter } from "./routerStore";
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../../layouts/PublicLayout";
import ClientLayout from "../../layouts/ClientLayout";
import TrainingLayout from "../../layouts/TrainingLayout";
import AdminLayout from "../../layouts/AdminLayout";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import HomePage from "../../modules/public/pages/HomePage";
import NotFoundPage from "../../modules/public/pages/NotFoundPage";
import { DashboardSkeleton } from "../../components/ui";

const AboutPage = lazy(() => import("../../modules/public/pages/AboutPage"));
const ServicesPage = lazy(() => import("../../modules/public/pages/ServicesPage"));
const TrainingPage = lazy(() => import("../../modules/public/pages/TrainingPage"));
const CareersPage = lazy(() => import("../../modules/public/pages/CareersPage"));
const ContactPage = lazy(() => import("../../modules/public/pages/ContactPage"));
const AircraftCleaningPage = lazy(() => import("../../modules/public/pages/ServiceAircraftCleaningPage"));
const PbbOperationsPage = lazy(() => import("../../modules/public/pages/ServicePbbOperationsPage"));
const SurfaceTransportationPage = lazy(() => import("../../modules/public/pages/ServiceSurfaceTransportationPage"));
const LineMaintenancePage = lazy(() => import("../../modules/public/pages/ServiceLineMaintenancePage"));
const AircraftSecurityPage = lazy(() => import("../../modules/public/pages/ServiceAircraftSecurityPage"));
const RepairShopPage = lazy(() => import("../../modules/public/pages/ServiceRepairShopPage"));
const AirportsPage = lazy(() => import("../../modules/public/pages/AirportsPage"));
const ClientLoginPage = lazy(() => import("../../modules/client/pages/LoginPage"));
const ClientRegisterPage = lazy(() => import("../../modules/client/pages/RegisterPage"));
const ClientDashboardPage = lazy(() => import("../../modules/client/pages/DashboardPage"));
const TrainingLoginPage = lazy(() => import("../../modules/training/pages/LoginPage"));
const TrainingDashboardPage = lazy(() => import("../../modules/training/pages/DashboardPage"));
const AdminLoginPage = lazy(() => import("../../modules/admin/pages/LoginPage"));
const AdminDashboardPage = lazy(() => import("../../modules/admin/pages/DashboardPage"));
const EmployeeLoginPage = lazy(() => import("../../modules/employee/pages/LoginPage"));
const EmployeeDashboardPage = lazy(() => import("../../modules/employee/pages/DashboardPage"));

const ROUTES = [
  { path: "/", layout: PublicLayout, page: HomePage },
  { path: "/about", layout: PublicLayout, page: AboutPage },
  { path: "/services", layout: PublicLayout, page: ServicesPage },
  { path: "/services/aircraft-cleaning", layout: PublicLayout, page: AircraftCleaningPage },
  { path: "/services/pbb-operations-maintenance", layout: PublicLayout, page: PbbOperationsPage },
  { path: "/services/surface-transportation", layout: PublicLayout, page: SurfaceTransportationPage },
  { path: "/services/line-maintenance", layout: PublicLayout, page: LineMaintenancePage },
  { path: "/services/aircraft-security", layout: PublicLayout, page: AircraftSecurityPage },
  { path: "/repair-organization", layout: PublicLayout, page: RepairShopPage },
  { path: "/airports", layout: PublicLayout, page: AirportsPage },
  { path: "/training", layout: PublicLayout, page: TrainingPage },
  { path: "/careers", layout: PublicLayout, page: CareersPage },
  { path: "/contact", layout: PublicLayout, page: ContactPage },
  { path: "/client/login", layout: ClientLayout, page: ClientLoginPage },
  { path: "/client/register", layout: ClientLayout, page: ClientRegisterPage },
  {
    path: "/client/dashboard",
    layout: ClientLayout,
    page: ClientDashboardPage,
    protected: true,
    roles: ["client", "staff", "admin"],
    loginPath: "/client/login",
    portalTitle: "Client Portal",
  },
  { path: "/training/login", layout: TrainingLayout, page: TrainingLoginPage },
  {
    path: "/training/dashboard",
    layout: TrainingLayout,
    page: TrainingDashboardPage,
    protected: true,
    roles: ["student", "staff", "admin"],
    loginPath: "/training/login",
    portalTitle: "Training Portal",
  },
  { path: "/admin/login", layout: AdminLayout, page: AdminLoginPage },
  {
    path: "/admin/dashboard",
    layout: AdminLayout,
    page: AdminDashboardPage,
    protected: true,
    roles: ["admin", "staff"],
    loginPath: "/admin/login",
    portalTitle: "Admin System",
  },
  { path: "/employee/login", layout: EmployeeLayout, page: EmployeeLoginPage },
  {
    path: "/employee/dashboard",
    layout: EmployeeLayout,
    page: EmployeeDashboardPage,
    protected: true,
    roles: ["employee", "staff", "admin"],
    loginPath: "/employee/login",
    portalTitle: "Employee Portal",
  },
];

export default function AppRouter() {
  const { path, navigate } = useRouter();

  // Normalize trailing slashes: /about/ → /about (except root "/")
  const normalizedPath = path.length > 1 && path.endsWith("/")
    ? path.slice(0, -1)
    : path;

  // If the raw path had a trailing slash, redirect to the clean version
  if (normalizedPath !== path) {
    navigate(normalizedPath);
    return null;
  }

  const route = ROUTES.find((item) => item.path === normalizedPath);

  if (!route) {
    return (
      <PublicLayout>
        <NotFoundPage />
      </PublicLayout>
    );
  }

  const Layout = route.layout;
  const Page = route.page;

  // Protected routes (dashboards) get a rich skeleton;
  // public lazy pages get a slim pulsing bar.
  const fallback = route.protected
    ? <DashboardSkeleton title={route.portalTitle || "Loading"} />
    : <div className="amc-skeleton mx-auto mt-24 h-2 w-24 rounded-full" />;

  return (
    <Layout>
      <Suspense fallback={fallback}>
        {route.protected ? (
          <ProtectedRoute
            allowRoles={route.roles}
            loginPath={route.loginPath}
            portalTitle={route.portalTitle}
          >
            <Page />
          </ProtectedRoute>
        ) : (
          <Page />
        )}
      </Suspense>
    </Layout>
  );
}
