import { useRouter } from "./routerStore";
import PublicLayout from "../../layouts/PublicLayout";
import ClientLayout from "../../layouts/ClientLayout";
import TrainingLayout from "../../layouts/TrainingLayout";
import AdminLayout from "../../layouts/AdminLayout";
import HomePage from "../../modules/public/pages/HomePage";
import AboutPage from "../../modules/public/pages/AboutPage";
import ServicesPage from "../../modules/public/pages/ServicesPage";
import ContactPage from "../../modules/public/pages/ContactPage";
import ClientLoginPage from "../../modules/client/pages/LoginPage";
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
  { path: "/contact", layout: PublicLayout, page: ContactPage },
  { path: "/client/login", layout: ClientLayout, page: ClientLoginPage },
  { path: "/client/dashboard", layout: ClientLayout, page: ClientDashboardPage },
  { path: "/training/login", layout: TrainingLayout, page: TrainingLoginPage },
  { path: "/training/dashboard", layout: TrainingLayout, page: TrainingDashboardPage },
  { path: "/admin/login", layout: AdminLayout, page: AdminLoginPage },
  { path: "/admin/dashboard", layout: AdminLayout, page: AdminDashboardPage },
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
      <Page />
    </Layout>
  );
}
