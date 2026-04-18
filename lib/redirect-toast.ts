export type RedirectToastTone = "success" | "error" | "warn";

export function setRedirectToast(
  url: URL,
  tone: RedirectToastTone,
  message: string,
) {
  url.searchParams.set("toast", tone);
  url.searchParams.set("message", message);
  return url;
}

export function getToastFromSearchParams(params: {
  toast?: string;
  message?: string;
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
  } as const;
}
