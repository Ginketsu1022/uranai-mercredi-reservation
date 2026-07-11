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
        const res = await fetch("/api/calendar/events");
        const data = await res.json();

        console.log(data);

        setReservations(data.events ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, []);

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 24,
        color: "white",
      }}
    >
      <h1>予約状況</h1>

      {loading ? (
        <p style={{ marginTop: 24 }}>読み込み中...</p>
      ) : reservations.length === 0 ? (
        <p style={{ marginTop: 24 }}>予約はありません。</p>
      ) : (
        <div style={{ marginTop: 24 }}>
          {reservations.map((r) => (
            <div
              key={r.id}
              style={{
                border: "1px solid #444",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <h3>{r.title}</h3>
              <p>{r.start}</p>
              <p>{r.end}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}