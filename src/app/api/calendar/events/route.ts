console.log("★★★★★ NEW EVENTS API ★★★★★");

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const targetDate = searchParams.get("date");

  if (!targetDate) {
    return NextResponse.json(
      { error: "日付がありません" },
      { status: 400 }
    );
  }

  const calendarId = encodeURIComponent(
    "chii.hono.official@gmail.com"
  );

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events` +
    `?key=${process.env.GOOGLE_API_KEY}` +
    `&singleEvents=true` +
    `&orderBy=startTime` +
    `&timeMin=${targetDate}T00:00:00+09:00` +
    `&timeMax=${targetDate}T23:59:59+09:00`;

  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    console.error(data);

    return NextResponse.json(data, {
      status: response.status,
    });
  }

  return NextResponse.json({
    reservedTimes: data.items ?? [],
  });
}