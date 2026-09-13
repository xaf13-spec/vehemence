import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import FriendsClient from "./FriendsClient";

export default async function FriendsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/rules");
  return <FriendsClient />;
}
