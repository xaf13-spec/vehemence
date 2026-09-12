import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";

function formatJoinedDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/rules");
  }

  return (
    <main className="page-shell">
      <section className="profile-page">
        <div className="profile-heading">
          <span className="settings-eyebrow">PROFILE</span>
          <h1>{user.username}</h1>
          <p>Your Vehemence profile</p>
        </div>

        <div className="profile-card">
          <div className="profile-card-top">
            <div>
              <span className="profile-label">USERNAME</span>
              <h2>{user.username}</h2>
            </div>
            <span className="profile-online">
              <span className="profile-online-dot" /> Online
            </span>
          </div>

          <div className="profile-details">
            <div className="profile-detail">
              <span>Joined</span>
              <strong>{formatJoinedDate(user.created_at)}</strong>
            </div>
            <div className="profile-detail">
              <span>Online time</span>
              <strong>Online now</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
