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

const existingEvents = await calendar.events.list({
  calendarId: "primary",
  singleEvents: true,
  timeMin: start.toISOString(),
  timeMax: end.toISOString(),
});

if ((existingEvents.data.items?.length ?? 0) > 0) {
  return NextResponse.json(
    {
      error: "この時間はすでに予約されています",
    },
    {
      status: 409,
    }
  );
}

const price = getPrice(reservation.duration);

const mapUrl =
  "https://www.google.com/maps/place/Ikarumin/@34.6050018,135.7265829,15z/data=!4m6!3m5!1s0x60012f3b18fdce35:0xd2d4c6668dfaacb7!8m2!3d34.6027137!4d135.7245585!16s%2Fg%2F11l37hqvpf?authuser=0&entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D";

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

const formattedDate = `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日（${weekdays[start.getDay()]}）`;

const formattedTime =
  `${start.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  })}～${end.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

const subject = "【予約確認】占いメルクルディ";
const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

const body = `${reservation.name} 様

この度はご予約いただき、
ありがとうございます。

────────────────

【ご予約内容】

日時
${formattedDate}
${formattedTime}

鑑定時間
${reservation.duration}分

料金
${price.toLocaleString()}円

場所
Ikarumin 2F

〒636-0142
奈良県生駒郡斑鳩町小吉田1-10-24

Googleマップはこちら
${mapUrl}

※タップすると地図が開きます。

────────────────

当日は開始5分前を目安に
お越しください。

ご予約の変更・キャンセルは
このメールへの返信、
またはInstagramのDMより
ご連絡ください。

お話しできるのを楽しみにしております。
どうぞお氣をつけてお越しくださいませ。
────────────────

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
  summary: `${reservation.name}様　【タロット鑑定】`,

  description:
    `お名前：${reservation.name}
${reservation.email ? `メール：${reservation.email}` : ""}
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