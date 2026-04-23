// ── Root Application Component ─────────────────────────────────────────────────
// App.jsx composes all global context providers and renders the application router.
// Provider order matters: inner providers can access context from outer providers.
import AuthProvider from "./app/auth/AuthProvider";         // Manages authentication state
import { SocketProvider } from "./app/auth/SocketProvider"; // WebSocket connection via Socket.IO
import RouterProvider from "./app/router/RouterProvider";   // React Router setup
import AppRouter from "./app/router/AppRouter";             // Route definitions
import { ToastProvider } from "./components/ui";            // Global toast notifications
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Server state management
import { ThemeProvider } from "./app/theme/ThemeProvider";  // Dark/light theme context

// A single QueryClient instance is created here so it is shared across the entire app.
// This prevents duplicate caches when navigating between pages.
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
