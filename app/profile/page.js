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
    <main className="profile-page">
      <section className="profile-container">
        <header className="profile-header">
          <span className="settings-eyebrow">PROFILE</span>
          <h1>{user.username}</h1>
          <p>Your Vehemence profile</p>
        </header>

        <section className="profile-section">
          <div className="profile-section-header">
            <h2>Account</h2>
            <p>Your basic Vehemence account information.</p>
          </div>

          <div className="profile-card">
            <div className="profile-row">
              <div className="profile-row-copy">
                <h3>Username</h3>
                <p>Your public Vehemence username.</p>
              </div>
              <strong className="profile-value">{user.username}</strong>
            </div>

            <div className="profile-row">
              <div className="profile-row-copy">
                <h3>Joined</h3>
                <p>The date this account was created.</p>
              </div>
              <strong className="profile-value">{formatJoinedDate(user.created_at)}</strong>
            </div>

            <div className="profile-row">
              <div className="profile-row-copy">
                <h3>Status</h3>
                <p>Current availability on Vehemence.</p>
              </div>
              <span className="profile-status">
                <span className="profile-status-dot" />
                Online
              </span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
