"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string;
  title: string;
  start: string;
  end: string;
};

export default function StatusPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReservations() {
      try {
        const today = "2026-07-22";

        const res = await fetch(
          `/api/calendar/events?date=${today}`
        );

        const data = await res.json();

        const reservations = (data.events ?? []).map((event: any) => ({
          id: event.id,
          title: event.summary,
          start: event.start?.dateTime ?? "",
          end: event.end?.dateTime ?? "",
        }));

        setReservations(reservations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, []);

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 24,
        color: "white",
      }}
    >
      <h1 style={{ marginBottom: 24 }}>予約状況</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : reservations.length === 0 ? (
        <p>予約はありません。</p>
      ) : (
        <div>
          {reservations.map((r) => (
            <div
              key={r.id}
              style={{
                border: "1px solid #444",
                borderRadius: 12,
                padding: 20,
                marginBottom: 20,
                background: "#1a1a1a",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  marginBottom: 12,
                  fontSize: 24,
                }}
              >
                {r.title.replace(/[\s　]*【?タロット鑑定】?/g, "").trim()}
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: 20,
                }}
              >
                🕒 {formatTime(r.start)} ～ {formatTime(r.end)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}