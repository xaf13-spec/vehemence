import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/rules");
  }

  return (
    <main className="page-shell">
      <section className="profile-page">
        <div className="profile-header-card">
          <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
          <div>
            <span className="profile-eyebrow">VEHEMENCE PROFILE</span>
            <h1>{user.username}</h1>
            <p>Your Vehemence profile.</p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-heading">
            <div>
              <span className="profile-eyebrow">ACCOUNT</span>
              <h2>{user.username}</h2>
            </div>
            <button type="button" className="profile-call-button" disabled>
              Start Call
            </button>
          </div>
          <p className="profile-muted">Voice calling will be connected here once the calling system is added.</p>
        </div>
      </section>
    </main>
  );
}
