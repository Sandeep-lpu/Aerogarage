import AuthProvider from "./app/auth/AuthProvider";
import { SocketProvider } from "./app/auth/SocketProvider";
import RouterProvider from "./app/router/RouterProvider";
import AppRouter from "./app/router/AppRouter";
import { ToastProvider } from "./components/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./app/theme/ThemeProvider";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
            <ThemeProvider>
              <RouterProvider>
                <AppRouter />
              </RouterProvider>
            </ThemeProvider>
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
