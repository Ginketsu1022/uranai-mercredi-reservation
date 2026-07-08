"use client";

import { useMemo, useState } from "react";
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

  const availableTimes = useMemo(() => {
    return getAvailableTimes(reservation.duration);
  }, [reservation.duration]);

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
            placeholder="山田 太郎"
            value={reservation.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </label>

        <label>
          <div style={{ marginBottom: "8px" }}>メールアドレス</div>
          <input
            style={inputStyle}
            type="email"
            placeholder="example@email.com"
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