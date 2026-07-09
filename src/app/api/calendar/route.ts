import { google } from "googleapis";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("APIが呼ばれた！");

  const session = await auth();

  console.log(session);
  
  if (!session) {
    return NextResponse.json(
      { error: "ログインしてください" },
      { status: 401 }
    );
  }
  console.log("accessToken:", session.accessToken);

  const oauth2Client = new google.auth.OAuth2();

oauth2Client.setCredentials({
  access_token: session.accessToken,
});

const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

try {
  const result = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: "Project Torch テスト予約",
      start: {
        dateTime: "2026-07-15T13:00:00+09:00",
      },
      end: {
        dateTime: "2026-07-15T13:30:00+09:00",
      },
    },
  });

  console.log("イベント作成成功！");
  console.log(result.data);

} catch (error) {
  console.error("イベント作成失敗");
  console.error(error);

  return NextResponse.json(
    { error: "イベント作成失敗" },
    { status: 500 }
  );
}

  return NextResponse.json({
    message: "Calendar API 接続成功",
  });
}