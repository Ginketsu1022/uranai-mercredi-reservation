import { google } from "googleapis";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getPrice } from "@/lib/price";

export async function POST(request: Request) {
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

  const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  access_token: session.accessToken,
});

const tokenInfo = await oauth2Client.getTokenInfo(session.accessToken!);
console.log("===== Token Info =====");
console.log(tokenInfo);

const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

const reservation = await request.json();

console.log("========== 予約データ ==========");
console.log(reservation);
console.log("================================");
const start = new Date(`${reservation.date}T${reservation.time}:00`);

const end = new Date(start);
end.setMinutes(end.getMinutes() + reservation.duration);

const price = getPrice(reservation.duration);

const subject = "【予約確認】占いメルクルディ";
const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

const body = `${reservation.name} 様

ご予約ありがとうございます。

──────────────

お名前：${reservation.name}
日時：${reservation.date} ${reservation.time}
鑑定時間：${reservation.duration}分
料金：${price.toLocaleString()}円

──────────────

当日はお気をつけてお越しください。

ちいさなほのお
銀潔
`;

const message = [
  `To: ${reservation.email}`,
  `Subject: ${encodedSubject}`,
  "Content-Type: text/plain; charset=UTF-8",
  "",
  body,
].join("\n");

const encodedMessage = Buffer.from(message)
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");

try {
  const result = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
  summary: `${reservation.name}様　タロット鑑定`,

  description:
    `お名前：${reservation.name}

${reservation.email ? `メール：${reservation.email}\n\n` : ""}

鑑定時間：${reservation.duration}分`,

  start: {
  dateTime: start.toISOString(),
},

end: {
  dateTime: end.toISOString(),
},
    },
  });

  console.log("イベント作成成功！");
  console.log(result.data);

  if (reservation.email) {
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

  console.log("メール送信成功！");
}

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