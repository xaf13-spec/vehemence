import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import GamesClient from "./GamesClient";

export default async function Games() {
  const user = await getCurrentUser();
  if (!user) redirect("/rules");
  return <GamesClient />;
}
