import { getCurrentUser } from "@/lib/helpers";
import { redirect } from "next/navigation";

export default async function DashboardIndexPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const role = user?.roles?.[0]?.name;
  if (role === "Owner") {
    redirect("/dashboard/owner");
  } else {
    redirect("/dashboard/residency");
  }
}