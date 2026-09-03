"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Trash2,
  HelpCircle,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmDialogOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      type,
      title,
      message,
      duration = 4000,
    }: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => {
      showToast({ type: "success", message, title: title || "Успешно" });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string) => {
      showToast({ type: "error", message, title: title || "Ошибка" });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string) => {
      showToast({ type: "warning", message, title: title || "Внимание" });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string) => {
      showToast({ type: "info", message, title: title || "Информация" });
    },
    [showToast]
  );

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirmClose = (result: boolean) => {
    if (confirmState) {
      confirmState.resolve(result);
      setConfirmState(null);
    }
  };

  React.useEffect(() => {
    if (confirmState?.isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleConfirmClose(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [confirmState?.isOpen]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
        confirm,
      }}
    >
      {children}

      {/* Floating Toast Notification Stack (Top-Right) */}
      <div className="fixed top-20 right-4 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          const isWarning = toast.type === "warning";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-4 fade-in ${
                isSuccess
                  ? "bg-emerald-950/90 text-white border-emerald-700/50 shadow-emerald-950/20"
                  : isError
                  ? "bg-rose-950/90 text-white border-rose-700/50 shadow-rose-950/20"
                  : isWarning
                  ? "bg-amber-950/90 text-white border-amber-700/50 shadow-amber-950/20"
                  : "bg-[#07626A]/95 text-white border-[#05494F] shadow-teal-950/20"
              }`}
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {toast.type === "info" && <Info className="w-5 h-5 text-teal-300" />}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-1">
                {toast.title && (
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5 opacity-90">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs font-medium leading-relaxed opacity-95">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom Confirm Modal Dialog */}
      {confirmState && confirmState.isOpen && (
        <div
          onClick={() => handleConfirmClose(false)}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#0D0D0D]/60 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#E1E1E1] shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-200 cursor-default"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  confirmState.options.isDestructive
                    ? "bg-rose-100 text-rose-600"
                    : "bg-[rgba(7,98,106,0.10)] text-[#07626A]"
                }`}
              >
                {confirmState.options.isDestructive ? (
                  <Trash2 className="w-6 h-6" />
                ) : (
                  <HelpCircle className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-[#0D0D0D]">
                  {confirmState.options.title}
                </h3>
                <p className="text-xs text-[#0D0D0D]/70 font-medium mt-1.5 leading-relaxed">
                  {confirmState.options.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E1E1E1]">
              <button
                type="button"
                onClick={() => handleConfirmClose(false)}
                className="px-4 py-2.5 rounded-xl border border-[#E1E1E1] bg-white hover:bg-[#F3F3F3] text-xs font-bold text-[#0D0D0D] transition-colors cursor-pointer"
              >
                {confirmState.options.cancelText || "Отмена"}
              </button>

              <button
                type="button"
                onClick={() => handleConfirmClose(true)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer shadow-xs ${
                  confirmState.options.isDestructive
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-[#07626A] hover:bg-[#07626A]/90"
                }`}
              >
                {confirmState.options.confirmText || "Подтвердить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
