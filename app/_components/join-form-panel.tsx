"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { ToastForm } from "@/app/_components/toast-form";
import { useToast } from "@/app/_components/toast-provider";

const JOIN_TOAST_SCOPE = "join-form";

type SubmitState =
  | {
      message: string;
      tone: "success" | "error";
    }
  | null;

export function JoinFormPanel() {
  const fieldIdPrefix = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>(null);
  const { dismissScope, pushToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setSubmitState(null);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          payload?.message ?? "Could not save your submission right now.",
        );
      }

      const toastMessage = payload?.message ?? "Thanks - we'll be in touch soon.";

      dismissScope(JOIN_TOAST_SCOPE);
      pushToast({
        message: toastMessage,
        tone: "success",
        scope: JOIN_TOAST_SCOPE,
      });

      setSubmitState({
        tone: "success",
        message:
          "You're on the list. We'll follow up with meeting info, project ideas, and the Slack invite.",
      });
      form.reset();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not save your submission right now.";

      dismissScope(JOIN_TOAST_SCOPE);
      pushToast({
        message,
        tone: "error",
        scope: JOIN_TOAST_SCOPE,
        durationMs: 5000,
      });
      setSubmitState({
        tone: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const nameId = `${fieldIdPrefix}-name`;
  const gradeId = `${fieldIdPrefix}-grade`;
  const experienceId = `${fieldIdPrefix}-experience`;
  const emailId = `${fieldIdPrefix}-email`;
  const messageId = `${fieldIdPrefix}-message`;

  return (
    <div className="join-form-shell">
      <div className="card join-form-card">
        <ToastForm
          id="join-form"
          action="/api/join"
          method="post"
          className="join-form-stack"
          pendingMessage="Sending your info..."
          invalidMessage="Please complete the required fields before submitting."
          toastScope={JOIN_TOAST_SCOPE}
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label className="form-label" htmlFor={nameId}>
              Name
            </label>
            <input id={nameId} type="text" name="name" required className="form-input" />
          </div>

          <div className="join-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor={gradeId}>
                Grade
              </label>
              <input
                id={gradeId}
                name="grade"
                required
                placeholder="e.g. 10"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor={experienceId}>
                Experience
              </label>
              <select id={experienceId} name="experience" required className="form-input">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={emailId}>
              Email
            </label>
            <input id={emailId} type="email" name="email" required className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={messageId}>
              Message (optional)
            </label>
            <textarea
              id={messageId}
              name="message"
              rows={3}
              className="form-input"
              style={{ resize: "vertical", minHeight: "100px" }}
            />
          </div>

          <div className="join-form-actions">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send it over"}
            </button>
            <p className="admin-muted">
              We use this to follow up with meeting details and Slack access.
            </p>
          </div>

          {submitState ? (
            <div
              className={`join-form-feedback ${
                submitState.tone === "success" ? "is-success" : "is-error"
              }`}
              role={submitState.tone === "error" ? "alert" : "status"}
            >
              {submitState.message}
            </div>
          ) : null}
        </ToastForm>
      </div>

      <div className="card join-form-aside">
        <div>
          <h3>What happens next</h3>
          <p>
            One of the officers will follow up with the next meeting date, the Slack invite,
            and a few projects that match your experience level.
          </p>
        </div>
        <ul className="join-info-list">
          <li>We meet every other Wednesday at 2:15 in room 1110.</li>
          <li>You do not need prior experience to join.</li>
          <li>Bring a laptop if you can. If not, still show up.</li>
        </ul>
        <div className="join-form-link-row">
          <Link href="/terminal" className="text-link text-link-strong">
            View upcoming events {"->"}
          </Link>
          <Link href="/projects" className="text-link text-link-strong">
            Browse recent projects {"->"}
          </Link>
        </div>
      </div>
    </div>
  );
}
