import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/rules");
  return <ProfileClient user={user} />;
}
