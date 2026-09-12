import { notFound, redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../../lib/auth";
import StartCallButton from "../../components/StartCallButton";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

const ONTARIO_TIME_ZONE = "America/Toronto";

function formatJoinedDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ONTARIO_TIME_ZONE,
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

export default async function OtherProfilePage({ params }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/rules");
  }

  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, created_at")
    .eq("username", decodedUsername)
    .single();

  if (!profile) {
    notFound();
  }

  if (profile.id === user.id) {
    redirect("/profile");
  }

  return (
    <main className="profile-page">
      <section className="profile-container">
        <header className="profile-header">
          <span className="settings-eyebrow">PROFILE</span>
          <h1>{profile.username}</h1>
          <p>Vehemence community profile</p>
        </header>

        <section className="profile-section">
          <div className="profile-section-header">
            <h2>Account</h2>
            <p>Basic information about this Vehemence user.</p>
          </div>

          <div className="profile-card">
            <div className="profile-row">
              <div className="profile-row-copy">
                <h3>Username</h3>
                <p>This user's public Vehemence username.</p>
              </div>
              <strong className="profile-value">{profile.username}</strong>
            </div>

            <div className="profile-row">
              <div className="profile-row-copy">
                <h3>Joined</h3>
                <p>The date this account was created.</p>
              </div>
              <strong className="profile-value">{formatJoinedDate(profile.created_at)}</strong>
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

            <div className="profile-row">
              <div className="profile-row-copy">
                <h3>Voice Call</h3>
                <p>Start a private call with this user.</p>
              </div>
              <StartCallButton calleeId={profile.id} />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
