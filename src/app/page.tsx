import { redirect } from "next/navigation";
import { getSession, homeForRole } from "@/lib/auth/dal";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect(homeForRole(session.role));
  }

  redirect("/login");
}
