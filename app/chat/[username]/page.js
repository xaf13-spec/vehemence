import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/auth";
import DirectChatClient from "./DirectChatClient";

export default async function DirectChatPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/rules");

  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  return <DirectChatClient username={decodedUsername} currentUserId={user.id} />;
}
