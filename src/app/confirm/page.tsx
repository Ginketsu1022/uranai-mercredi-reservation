"use client";

import { useReservationStore } from "@/store/reservationStore";
export default function ConfirmPage() {
  const { reservation } = useReservationStore();
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>予約内容の確認</h1>

        <div style={{ lineHeight: 2 }}>
  <div>お名前：{reservation.name}</div>
  <div>メール：{reservation.email}</div>
  <div>鑑定時間：{reservation.duration}分</div>
  <div>開始時間：{reservation.time}</div>
</div>

        <button
  onClick={async () => {
    const res = await fetch("/api/calendar", {
      method: "POST",
    });

    const data = await res.json();
    console.log(data);
  }}
  style={{
            padding: "16px",
            borderRadius: "12px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          予約を確定する
        </button>
      </div>
    </main>
  );
}