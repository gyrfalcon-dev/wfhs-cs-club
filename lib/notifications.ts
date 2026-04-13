import "server-only";

import type { JoinSubmission } from "@/lib/supabase";

function getNotificationConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.NOTIFICATION_FROM_EMAIL,
    toEmails: (process.env.JOIN_NOTIFICATION_TO_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean),
  };
}

export function isJoinNotificationConfigured() {
  const { apiKey, fromEmail, toEmails } = getNotificationConfig();
  return Boolean(apiKey && fromEmail && toEmails.length > 0);
}

export async function sendJoinSubmissionNotification(
  submission: JoinSubmission,
) {
  const { apiKey, fromEmail, toEmails } = getNotificationConfig();

  if (!apiKey || !fromEmail || toEmails.length === 0) {
    return { configured: false as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: toEmails,
      subject: `New WFHS CS Club join form: ${submission.name}`,
      html: `
        <h1>New join form submission</h1>
        <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
        <p><strong>Grade:</strong> ${escapeHtml(submission.grade)}</p>
        <p><strong>Experience:</strong> ${escapeHtml(submission.experience)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(submission.message || "(No message provided)")}</p>
      `,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${text}`);
  }

  return { configured: true as const };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
