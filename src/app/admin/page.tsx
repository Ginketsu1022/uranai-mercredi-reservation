import { auth } from "@/auth";
import AdminPage from "./AdminPage";

export default async function Page() {
  const session = await auth();

  console.log("===== ADMIN SESSION =====");
  console.log(session);

  return <AdminPage />;
}