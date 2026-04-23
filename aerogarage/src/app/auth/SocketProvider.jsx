import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  // isAuthenticated is a top-level flag on the context; accessToken lives on authState
  const { isAuthenticated, authState } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Cleanup previous socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const token = authState?.accessToken;
    if (!isAuthenticated || !token) return;

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const newSocket = io(backendUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("🟢 Connected to Real-time API");
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (err) => {
      console.warn("🔴 Real-time API Connection Error:", err.message);
      // Don't crash the app — socket errors are non-fatal
    });

    newSocket.on("disconnect", () => {
      console.log("🟡 Real-time API Disconnected");
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
   
  }, [isAuthenticated, authState?.accessToken]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
