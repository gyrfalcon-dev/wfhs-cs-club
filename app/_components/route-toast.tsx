"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast, type ToastTone } from "@/app/_components/toast-provider";

type RouteToastProps = {
  message?: string | null;
  tone?: ToastTone;
};

export function RouteToast({ message, tone = "success" }: RouteToastProps) {
  const seenKey = useRef<string | null>(null);
  const { pushToast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!message) {
      return;
    }

    const key = `${pathname}:${tone}:${message}`;
    if (seenKey.current === key) {
      return;
    }

    seenKey.current = key;
    pushToast({ message, tone });

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("toast");
    nextParams.delete("message");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [message, pathname, pushToast, router, searchParams, tone]);

  return null;
}
