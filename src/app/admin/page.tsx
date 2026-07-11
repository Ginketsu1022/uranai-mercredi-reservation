import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminPage from "./AdminPage";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const admins = [
    "sob_gear_2@yahoo.co.jp",
    "chii.hono.official@gmail.com",
  ];

  if (!admins.includes(session.user.email ?? "")) {
    redirect("/");
  }

  return <AdminPage />;
}