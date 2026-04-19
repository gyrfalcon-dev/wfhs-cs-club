"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastTone = "success" | "error" | "warn" | "loading";

export type ToastInput = {
  message: string;
  tone?: ToastTone;
  durationMs?: number;
  persist?: boolean;
  scope?: string;
};

type ToastRecord = {
  id: number;
  message: string;
  tone: ToastTone;
  durationMs: number;
  persist: boolean;
  scope?: string;
};

type ToastContextValue = {
  pushToast: (toast: ToastInput) => number;
  dismissToast: (id: number) => void;
  dismissScope: (scope: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const defaultDurationByTone: Record<Exclude<ToastTone, "loading">, number> = {
  success: 3200,
  warn: 4200,
  error: 6200,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  const dismissToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const dismissScope = useCallback((scope: string) => {
    setToasts((current) =>
      current.filter((toast) => {
        const shouldKeep = toast.scope !== scope;
        if (!shouldKeep) {
          const timer = timers.current.get(toast.id);
          if (timer) {
            window.clearTimeout(timer);
            timers.current.delete(toast.id);
          }
        }
        return shouldKeep;
      }),
    );
  }, []);

  const pushToast = useCallback((toast: ToastInput) => {
    const tone = toast.tone ?? "success";
    const id = nextId.current++;
    const durationMs =
      tone === "loading"
        ? toast.durationMs ?? 12000
        : toast.durationMs ?? defaultDurationByTone[tone];
    const persist = toast.persist ?? tone === "loading";

    if (toast.scope) {
      setToasts((current) =>
        current.filter((item) => {
          const shouldKeep = item.scope !== toast.scope;
          if (!shouldKeep) {
            const timer = timers.current.get(item.id);
            if (timer) {
              window.clearTimeout(timer);
              timers.current.delete(item.id);
            }
          }
          return shouldKeep;
        }),
      );
    }

    setToasts((current) => [
      ...current,
      {
        id,
        message: toast.message,
        tone,
        durationMs,
        persist,
        scope: toast.scope,
      },
    ]);

    if (!persist) {
      const timer = window.setTimeout(() => {
        dismissToast(id);
      }, durationMs);
      timers.current.set(id, timer);
    }

    return id;
  }, [dismissToast]);

  const value = useMemo(
    () => ({ pushToast, dismissToast, dismissScope }),
    [dismissScope, dismissToast, pushToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.tone}`}
            role={toast.tone === "error" ? "alert" : "status"}
          >
            <div className="toast-copy">
              <span className="toast-label">{toast.tone}</span>
              <p>{toast.message}</p>
            </div>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
