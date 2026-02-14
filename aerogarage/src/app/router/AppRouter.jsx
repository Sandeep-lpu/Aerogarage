import { useRouter } from "./routerStore";
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../../layouts/PublicLayout";
import ClientLayout from "../../layouts/ClientLayout";
import TrainingLayout from "../../layouts/TrainingLayout";
import AdminLayout from "../../layouts/AdminLayout";
import HomePage from "../../modules/public/pages/HomePage";
import AboutPage from "../../modules/public/pages/AboutPage";
import ServicesPage from "../../modules/public/pages/ServicesPage";
import TrainingPage from "../../modules/public/pages/TrainingPage";
import CareersPage from "../../modules/public/pages/CareersPage";
import ContactPage from "../../modules/public/pages/ContactPage";
import AircraftCleaningPage from "../../modules/public/pages/ServiceAircraftCleaningPage";
import PbbOperationsPage from "../../modules/public/pages/ServicePbbOperationsPage";
import SurfaceTransportationPage from "../../modules/public/pages/ServiceSurfaceTransportationPage";
import LineMaintenancePage from "../../modules/public/pages/ServiceLineMaintenancePage";
import AircraftSecurityPage from "../../modules/public/pages/ServiceAircraftSecurityPage";
import RepairShopPage from "../../modules/public/pages/ServiceRepairShopPage";
import ClientLoginPage from "../../modules/client/pages/LoginPage";
import ClientRegisterPage from "../../modules/client/pages/RegisterPage";
import ClientDashboardPage from "../../modules/client/pages/DashboardPage";
import TrainingLoginPage from "../../modules/training/pages/LoginPage";
import TrainingDashboardPage from "../../modules/training/pages/DashboardPage";
import AdminLoginPage from "../../modules/admin/pages/LoginPage";
import AdminDashboardPage from "../../modules/admin/pages/DashboardPage";
import NotFoundPage from "../../modules/public/pages/NotFoundPage";

const ROUTES = [
  { path: "/", layout: PublicLayout, page: HomePage },
  { path: "/about", layout: PublicLayout, page: AboutPage },
  { path: "/services", layout: PublicLayout, page: ServicesPage },
  { path: "/services/aircraft-cleaning", layout: PublicLayout, page: AircraftCleaningPage },
  { path: "/services/pbb-operations-maintenance", layout: PublicLayout, page: PbbOperationsPage },
  { path: "/services/surface-transportation", layout: PublicLayout, page: SurfaceTransportationPage },
  { path: "/services/line-maintenance", layout: PublicLayout, page: LineMaintenancePage },
  { path: "/services/aircraft-security", layout: PublicLayout, page: AircraftSecurityPage },
  { path: "/services/repair-shop", layout: PublicLayout, page: RepairShopPage },
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
];

export default function AppRouter() {
  const { path } = useRouter();
  const route = ROUTES.find((item) => item.path === path);

  if (!route) {
    return (
      <PublicLayout>
        <NotFoundPage />
      </PublicLayout>
    );
  }

  const Layout = route.layout;
  const Page = route.page;

  return (
    <Layout>
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
    </Layout>
  );
}
