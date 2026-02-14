import AuthProvider from "./app/auth/AuthProvider";
import RouterProvider from "./app/router/RouterProvider";
import AppRouter from "./app/router/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppRouter />
      </RouterProvider>
    </AuthProvider>
  );
}
