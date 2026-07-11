import { google } from "googleapis";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const targetDate =
  searchParams.get("date") ?? "";

  const session = await auth();

console.log("===== SESSION =====");
console.log(session);
console.log("accessToken =", session?.accessToken);

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "ログインしてください" },
      { status: 401 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });


  const timeMin = `${targetDate}T00:00:00+09:00`;
  const timeMax = `${targetDate}T23:59:59+09:00`;

try {
  const events = await calendar.events.list({
    calendarId: "primary",
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
  });

  console.log("===== Events =====");
  console.log(events.data.items);

    return NextResponse.json({
    events: events.data.items,
  });

} catch (error) {
  console.error("===== Calendar Error =====");
  console.error(error);

  return NextResponse.json(
    {
      error: "Calendar API Error",
      detail: String(error),
    },
    { status: 500 }
  );
}}