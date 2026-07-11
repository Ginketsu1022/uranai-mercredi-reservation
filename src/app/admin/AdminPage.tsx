"use client";

import { useEffect, useState } from "react";

type CalendarEvent = {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
};

export default function AdminPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  async function fetchReservations() {
    const response = await fetch("/api/admin/reservations");

    if (!response.ok) {
      alert("予約の取得に失敗しました");
      return;
    }

    const data: CalendarEvent[] = await response.json();

    data.sort(
      (a, b) =>
        new Date(a.start.dateTime).getTime() -
        new Date(b.start.dateTime).getTime()
    );

    setEvents(data);
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  async function deleteReservation(eventId: string) {
    const ok = confirm("この予約をキャンセルしますか？");

    if (!ok) return;

    const response = await fetch("/api/admin/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId,
      }),
    });

    if (!response.ok) {
      alert("削除に失敗しました");
      return;
    }

    await fetchReservations();
  }

  const groupedEvents = events.reduce(
    (acc: Record<string, CalendarEvent[]>, event) => {
      const date = new Date(event.start.dateTime).toLocaleDateString("ja-JP");

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(event);

      return acc;
    },
    {}
  );

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1>予約一覧</h1>

      {events.length === 0 && (
        <p style={{ marginTop: 24 }}>現在予約はありません。</p>
      )}

      {Object.entries(groupedEvents).map(([date, dayEvents]) => {
        const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        });

        dayEvents.sort(
          (a, b) =>
            new Date(a.start.dateTime).getTime() -
            new Date(b.start.dateTime).getTime()
        );

        return (
          <div key={date} style={{ marginBottom: 40 }}>
            <h2>{formattedDate}</h2>

            {dayEvents.map((event) => {
              const start = new Date(
                event.start.dateTime
              ).toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const end = new Date(event.end.dateTime).toLocaleTimeString(
                "ja-JP",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              return (
                <div
                  key={event.id}
                  style={{
                    border: "1px solid #555",
                    borderRadius: 8,
                    padding: 16,
                    marginTop: 16,
                  }}
                >
                  <h3>{event.summary}</h3>

                  <div>
                    🕐 {start} ～ {end}
                  </div>

                  {event.description && (
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "inherit",
                        marginTop: 12,
                      }}
                    >
                      {event.description}
                    </pre>
                  )}

                  <button
                    onClick={() => deleteReservation(event.id)}
                    style={{
                      marginTop: 16,
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: 8,
                      background: "#3f3f46",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    🗑 キャンセル
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
    </main>
  );
}