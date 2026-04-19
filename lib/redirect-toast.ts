export type RedirectToastTone = "success" | "error" | "warn";

export function setRedirectToast(
  url: URL,
  tone: RedirectToastTone,
  message: string,
  scope?: string,
) {
  url.searchParams.set("toast", tone);
  url.searchParams.set("message", message);
  if (scope) {
    url.searchParams.set("toastScope", scope);
  }
  return url;
}

export function getToastFromSearchParams(params: {
  toast?: string;
  message?: string;
  toastScope?: string;
}) {
  if (!params.message) {
    return null;
  }

  const tone =
    params.toast === "error" || params.toast === "warn" || params.toast === "success"
      ? params.toast
      : "success";

  return {
    tone,
    message: decodeURIComponent(params.message),
    scope: params.toastScope ? decodeURIComponent(params.toastScope) : undefined,
  } as const;
}
