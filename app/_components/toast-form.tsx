"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useToast } from "@/app/_components/toast-provider";

type ToastFormProps = Omit<ComponentPropsWithoutRef<"form">, "children"> & {
  children: ReactNode;
  pendingMessage?: string;
  invalidMessage?: string;
  toastScope?: string;
};

export function ToastForm({
  children,
  pendingMessage,
  invalidMessage,
  toastScope,
  onSubmit,
  onInvalidCapture,
  ...props
}: ToastFormProps) {
  const { dismissScope, pushToast } = useToast();

  return (
    <form
      {...props}
      onInvalidCapture={(event) => {
        if (invalidMessage) {
          if (toastScope) {
            dismissScope(toastScope);
          }
          pushToast({
            message: invalidMessage,
            tone: "error",
            scope: toastScope,
            durationMs: 5000,
          });
        }

        onInvalidCapture?.(event);
      }}
      onSubmit={(event) => {
        if (pendingMessage) {
          if (toastScope) {
            dismissScope(toastScope);
          }
          pushToast({
            message: pendingMessage,
            tone: "loading",
            scope: toastScope,
          });
        }

        onSubmit?.(event);
      }}
    >
      {children}
    </form>
  );
}
