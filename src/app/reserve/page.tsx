"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PRICE_LIST } from "@/lib/price";
import { getAvailableTimes } from "@/lib/schedule";
import type { Reservation } from "@/types/reservation";
import { useReservationStore } from "@/store/reservationStore";

const pageStyle = {
  minHeight: "100vh",
  background: "#0f172a",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle = {
  width: "420px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "18px",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontSize: "18px",
  fontWeight: "bold" as const,
  cursor: "pointer",
};

export default function ReservePage() {
    const router = useRouter();
    const { setReservation } = useReservationStore();
  const [reservation, setLocalReservation] = useState<Reservation>({
    name: "",
    email: "",
    duration: 10,
    date: "",
    time: "",
  });

const [reservedTimes, setReservedTimes] = useState<string[]>([]);

useEffect(() => {
  if (!reservation.date) return;

  async function fetchReservedTimes() {
    const response = await fetch(
      `/api/calendar/events?date=${reservation.date}`
    );

    const data = await response.json();

    if (!response.ok) {
     console.error(data);
     return;
    }

    const reserved = data.reservedTimes.flatMap((event: any) => {
  console.log(event.start.dateTime, event.end.dateTime);

  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);

  end.setMinutes(end.getMinutes() + 10);

  const times: string[] = [];

  const current = new Date(start);

  while (current < end) {
    times.push(
      current.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tokyo",
      })
    );

    current.setMinutes(current.getMinutes() + 10);
  }

  return times;
});

setReservedTimes(reserved);

console.log("予約済み", reserved);

console.log("予約済み", reserved);
  }

  fetchReservedTimes();
}, [reservation.date]);

function isOverlapping(
  startTime: string,
  duration: number,
  reservedTimes: string[]
) {
  const [hour, minute] = startTime.split(":").map(Number);

  const start = hour * 60 + minute;
  const end = start + duration;

  for (const reserved of reservedTimes) {
    const [h, m] = reserved.split(":").map(Number);
    const reservedMinute = h * 60 + m;

    if (reservedMinute >= start && reservedMinute < end) {
      return true;
    }
  }

  return false;
}

  const availableTimes = useMemo(() => {
  return getAvailableTimes(reservation.duration).filter(
    (time) =>
      !isOverlapping(
        time,
        reservation.duration,
        reservedTimes
      )
  );
}, [reservation.duration, reservedTimes]);

  const handleChange = (
  key: keyof Reservation,
  value: string | number
) => {
  setLocalReservation((prev) => ({
    ...prev,
    [key]: value,
  }));
};

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ textAlign: "center" }}>ご予約</h1>

        <p style={{ textAlign: "center", color: "#cbd5e1" }}>
          必要事項をご入力ください。
        </p>        <label>
          <div style={{ marginBottom: "8px" }}>お名前</div>
          <input
            style={inputStyle}
            type="text"
            placeholder="氏名 または ニックネーム"
            value={reservation.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </label>

        <label>
          <div style={{ marginBottom: "8px" }}>メールアドレス</div>
          <input
            style={inputStyle}
            type="email"
            placeholder="予約確認メールをご希望の場合のみ入力"
            value={reservation.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </label>

        <label>
          <div style={{ marginBottom: "8px" }}>鑑定時間</div>

 <select
  style={inputStyle}
  value={reservation.duration}
  onChange={(e) => {
    const duration = Number(e.target.value);
    handleChange("duration", duration);
  }}
>
  {PRICE_LIST.map((item) => (
    <option
      key={item.minutes}
      value={item.minutes}
    >
      {item.minutes}分（{item.price.toLocaleString()}円）
    </option>
  ))}
</select>
        </label>
       
        <label>
          <div style={{ marginBottom: "8px" }}>予約日</div>

          <input
            style={inputStyle}
            type="date"
            value={reservation.date}
            onChange={(e) => handleChange("date", e.target.value)}
              />
        </label>
       
        <label>
          <div style={{ marginBottom: "8px" }}>開始時間</div>

          <select
            style={inputStyle}
            value={reservation.time}
            onChange={(e) => handleChange("time", e.target.value)}
          >
            <option value="">選択してください</option>

            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label><button
  style={buttonStyle}
  onClick={() => {
  if (!reservation.name.trim()) {
    alert("お名前を入力してください");
    return;
  }

if (!reservation.date) {
  alert("予約日を選択してください");
  return;
}

if (!reservation.time) {
  alert("開始時間を選択してください");
  return;
}

  setReservation(reservation);
  router.push("/confirm");
}}
>
  予約内容を確認する
</button>

</div>
</main>
);
}