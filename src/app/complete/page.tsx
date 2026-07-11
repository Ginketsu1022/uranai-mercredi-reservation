"use client";

import { useEffect } from "react";
import { useReservationStore } from "@/store/reservationStore";

export default function CompletePage() {
  const { clearReservation } = useReservationStore();

  useEffect(() => {
    clearReservation();
  }, [clearReservation]);

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
      <div style={{ textAlign: "center" }}>
        <h2>ご予約ありがとうございました。</h2>

        <p>
          ご予約を受け付けました。
          <br />
          当日お会いできるのを楽しみにしております。
        </p>
      </div>
    </main>
  );
}