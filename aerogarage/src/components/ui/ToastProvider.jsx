import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContext } from "./toastContext";

// ─── Toast types and their visual treatments ──────────────────────────────────
const TOAST_STYLES = {
  success: "border-l-4 border-emerald-500 bg-(--amc-bg-surface) text-(--amc-text-body)",
  error:   "border-l-4 border-red-500    bg-(--amc-bg-surface) text-(--amc-text-body)",
  warning: "border-l-4 border-amber-500  bg-(--amc-bg-surface) text-(--amc-text-body)",
  info:    "border-l-4 border-blue-500   bg-(--amc-bg-surface) text-(--amc-text-body)",
};

const TOAST_ICONS = {
  success: "✓",
  error:   "✕",
  warning: "⚠",
  info:    "ℹ",
};

const ICON_COLORS = {
  success: "text-emerald-500",
  error:   "text-red-500",
  warning: "text-amber-500",
  info:    "text-blue-400",
};

const DEFAULT_DURATION = 4500; // ms

// ─── Single Toast Item ────────────────────────────────────────────────────────
function ToastItem({ id, message, type = "info", onRemove }) {
  const [visible, setVisible] = useState(false);

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => onRemove(id), 300); // wait for slide-out
  }, [id, onRemove]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        "flex w-full max-w-sm items-start gap-3 rounded-(--amc-radius-lg) p-4 shadow-lg",
        "transition-all duration-300 ease-in-out",
        TOAST_STYLES[type] || TOAST_STYLES.info,
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0",
      ].join(" ")}
    >
      {/* Icon */}
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-sm font-bold ${ICON_COLORS[type] || ICON_COLORS.info}`}
        aria-hidden="true"
      >
        {TOAST_ICONS[type]}
      </span>

      {/* Message */}
      <p className="flex-1 text-sm leading-snug">{message}</p>

      {/* Dismiss button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="ml-auto mt-0.5 shrink-0 text-(--amc-text-muted) transition hover:text-(--amc-text-body)"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
let _idCounter = 0;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const addToast = useCallback(
    (message, type = "info", duration = DEFAULT_DURATION) => {
      const id = ++_idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        timers.current[id] = setTimeout(() => removeToast(id), duration);
      }

      return id; // allows programmatic dismissal
    },
    [removeToast],
  );

  // Helper shortcuts
  const toast = useCallback(
    (msg, dur) => addToast(msg, "info", dur),
    [addToast],
  );
  toast.success = (msg, dur) => addToast(msg, "success", dur);
  toast.error   = (msg, dur) => addToast(msg, "error",   dur);
  toast.warning = (msg, dur) => addToast(msg, "warning", dur);
  toast.info    = (msg, dur) => addToast(msg, "info",    dur);
  toast.dismiss = removeToast;

  // Cleanup timers on unmount
  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast viewport — fixed bottom-right, above everything */}
      <div
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-9999 flex flex-col-reverse gap-3"
      >
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            id={t.id}
            message={t.message}
            type={t.type}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
