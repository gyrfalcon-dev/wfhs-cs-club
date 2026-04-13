import { NextResponse } from "next/server";
import { sendJoinSubmissionNotification } from "@/lib/notifications";
import { insertJoinSubmission } from "@/lib/supabase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const submission = {
    name: String(formData.get("name") ?? "").trim(),
    grade: String(formData.get("grade") ?? "").trim(),
    experience: String(formData.get("experience") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  if (
    !submission.name ||
    !submission.grade ||
    !submission.experience ||
    !submission.email
  ) {
    return NextResponse.json(
      {
        status: "error",
        message: "Missing required fields.",
      },
      { status: 400 },
    );
  }

  try {
    await insertJoinSubmission(submission);
  } catch (error) {
    console.error("Join submission failed", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Could not save your submission right now.",
      },
      { status: 500 },
    );
  }

  try {
    await sendJoinSubmissionNotification(submission);
  } catch (error) {
    console.error("Join notification email failed", error);
  }

  return NextResponse.json(
    {
      status: "ok",
      message: "Thanks - we'll be in touch soon.",
    },
    { status: 201 },
  );
}
