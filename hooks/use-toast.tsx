"use client";

import * as React from "react";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";

interface ToastContextType {
  toasts: any[];
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  hideToast: (id?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const showSuccess = React.useCallback((message: string) => {
    sonnerToast.success(message);
  }, []);

  const showError = React.useCallback((message: string) => {
    sonnerToast.error(message);
  }, []);

  const showInfo = React.useCallback((message: string) => {
    sonnerToast.info(message);
  }, []);

  const showWarning = React.useCallback((message: string) => {
    sonnerToast.warning(message);
  }, []);

  const hideToast = React.useCallback((id?: string) => {
    sonnerToast.dismiss(id);
  }, []);

  const value = React.useMemo(() => ({
    toasts: [], // This could be enhanced to track actual toasts if needed
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
  }), [showSuccess, showError, showInfo, showWarning, hideToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Sonner
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
        {...props}
      />
    </ToastContext.Provider>
  );
}

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const toast = ({
  title,
  description,
  variant = "default",
  ...props
}: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
} & React.ComponentPropsWithoutRef<typeof Sonner>) => {
  const sonnerProps = {
    ...props,
  };
  
  return import("sonner").then(({ toast }) => {
    toast(title, {
      description,
      ...sonnerProps,
    });
  });
};