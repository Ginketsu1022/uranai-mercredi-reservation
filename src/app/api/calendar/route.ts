import { google } from "googleapis";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "ログインしてください" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Calendar API 接続成功",
  });
}