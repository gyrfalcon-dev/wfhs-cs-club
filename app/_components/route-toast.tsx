"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast, type ToastTone } from "@/app/_components/toast-provider";

type RouteToastProps = {
  message?: string | null;
  tone?: ToastTone;
  scope?: string;
};

export function RouteToast({ message, tone = "success", scope }: RouteToastProps) {
  const seenKey = useRef<string | null>(null);
  const { dismissScope, pushToast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!message) {
      return;
    }

    const key = `${pathname}:${tone}:${scope ?? "global"}:${message}`;
    if (seenKey.current === key) {
      return;
    }

    seenKey.current = key;
    if (scope) {
      dismissScope(scope);
    }
    pushToast({ message, tone, scope });

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("toast");
    nextParams.delete("message");
    nextParams.delete("toastScope");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [dismissScope, message, pathname, pushToast, router, scope, searchParams, tone]);

  return null;
}
