"use client";

import * as React from "react";
import { Toaster as Sonner } from "sonner";

const ToastContext = React.createContext({ toast: (options: any) => {} });

export function ToastProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastContext.Provider value={{ toast }}>
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

export const useToast = () => {
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