import { getCurrentUser } from "../../lib/auth";

export default async function Rules() {
  const user = await getCurrentUser();

  return (
    <main className="rules-page">
      <div className="rules-container">
        <p className="eyebrow">VEHEMENCE</p>
        <h1>Rules</h1>
        <section className="rules-card">
          <p>• Do not impersonate other users, staff, or admins.</p>
          <p>• Do not abuse bugs, glitches, or vulnerabilities.</p>
          <p>• Do not damage, disrupt, or intentionally interfere with the site.</p>
          <p>• Follow the rules and respect staff decisions.</p>
          <p>• Do not do anything that could get Vehemence taken down or put the community at risk.</p>
          <p>• Do not leak private Vehemence information, documents, links, or internal information to unauthorized people.</p>
          <div className="rules-bottom">
            <p>{user ? "You are already signed in. You can continue to Vehemence." : "By continuing, you agree to follow the Vehemence rules."}</p>
            <a href={user ? "/" : "/signup"} className="primary-button">
              {user ? "Continue to Vehemence" : "I Agree"}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
