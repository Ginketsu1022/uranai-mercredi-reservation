import Link from "next/link";
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          🔮 占いメルクルディ
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "2.5rem",
          }}
        >
          あなたの中の「ちいさなほのお」と向き合う時間
        </p>

<Link
  href="/reserve"
  style={{
    display: "block",
    width: "100%",
    padding: "16px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    marginBottom: "16px",
  }}
>
  予約する
</Link>

        <Link
  href="/status"
  style={{
    display: "block",
    width: "100%",
    padding: "16px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "1px solid #475569",
    background: "transparent",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
  }}
>
  予約状況を見る
</Link>
      </div>
    </main>
  );
}