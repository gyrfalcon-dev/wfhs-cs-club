import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const submission = {
    name: formData.get("name"),
    grade: formData.get("grade"),
    experience: formData.get("experience"),
    email: formData.get("email"),
    message: formData.get("message") ?? "",
  };

  console.log("Join submission", submission);

  return NextResponse.json(
    {
      status: "ok",
      message: "Thanks — we'll be in touch soon.",
    },
    { status: 201 },
  );
}
