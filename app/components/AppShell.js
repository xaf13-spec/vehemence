"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import MusicClient from "../music/MusicClient";
import EntertainmentClient from "../entertainment/EntertainmentClient";
import SoundboardClient from "../soundboard/SoundboardClient";
import FriendsClient from "../friends/FriendsClient";
import ProfileClient from "../profile/ProfileClient";
import Settings from "../settings/page";
import NotificationsPage from "../notifications/page";
import { touchPresence } from "../friends/actions";

const navOrder = ["/", "/rules", "/music", "/entertainment", "/soundboard", "/profile", "/friends", "/settings", "/notifications"];

const viewLabels = {
  "/": "Home",
  "/rules": "Rules",
  "/music": "Music",
  "/entertainment": "Entertainment",
  "/soundboard": "Soundboard",
  "/profile": "Profile",
  "/friends": "Friends",
  "/settings": "Settings",
  "/notifications": "Notifications",
};

function normalizePath(pathname) {
  if (!pathname) return "/";
  return pathname === "/" ? "/" : pathname.replace(/\/$/, "");
}

function routeIndex(pathname) {
  const index = navOrder.indexOf(normalizePath(pathname));
  return index === -1 ? 0 : index;
}

function AuthRequired({ onNavigate }) {
  return (
    <main className="auth-required-page">
      <section className="auth-required-card">
        <p className="eyebrow">VEHEMENCE</p>
        <h1>Sign in to use this</h1>
        <p>You need a Vehemence account to access this section.</p>
        <div className="hero-buttons">
          <button className="secondary-button" type="button" onClick={() => onNavigate("/rules")}>Back to Rules</button>
          <button className="primary-button" type="button" onClick={() => window.location.assign("/login")}>Log In</button>
        </div>
      </section>
    </main>
  );
}

function HomeView({ user, onNavigate }) {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">WELCOME TO VEHEMENCE</p>
          <h1>VEHEMENCE</h1>
          <p className="hero-description">Your new home for music, community, and more.</p>
          <div className="hero-buttons">
            <button
              className="primary-button"
              type="button"
              onClick={() => user ? onNavigate("/music") : window.location.assign("/rules")}
            >
              {user ? "Enter Vehemence" : "Sign Up / Log In"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function RulesView({ user, onNavigate }) {
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
            <button className="primary-button" type="button" onClick={() => user ? onNavigate("/music") : window.location.assign("/signup")}>
              {user ? "Continue to Vehemence" : "I Agree"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function renderView(pathname, user, onNavigate) {
  switch (pathname) {
    case "/":
      return <HomeView user={user} onNavigate={onNavigate} />;
    case "/rules":
      return <RulesView user={user} onNavigate={onNavigate} />;
    case "/music":
      return <MusicClient />;
    case "/entertainment":
      return <main className="games-page"><header className="games-header"><div><p className="eyebrow">VEHEMENCE</p><h1>Entertainment</h1></div></header><section className="game-section"><div className="section-title-row"><div><h2>Entertainment</h2></div></div><EntertainmentClient /></section></main>;
    case "/soundboard":
      return <main className="games-page"><header className="games-header"><div><p className="eyebrow">VEHEMENCE</p><h1>Soundboard</h1></div></header><section className="game-section"><div className="section-title-row"><div><h2>Sounds</h2></div></div><SoundboardClient /></section></main>;
    case "/profile":
      return user ? <ProfileClient user={user} /> : <AuthRequired onNavigate={onNavigate} />;
    case "/friends":
      return user ? <FriendsClient /> : <AuthRequired onNavigate={onNavigate} />;
    case "/settings":
      return user ? <Settings /> : <AuthRequired onNavigate={onNavigate} />;
    case "/notifications":
      return <NotificationsPage />;
    default:
      return null;
  }
}

export default function AppShell({ children, user }) {
  const pathname = normalizePath(usePathname());
  const isMainView = navOrder.includes(pathname);
  const initialPath = isMainView ? pathname : "/";
  const [activeView, setActiveView] = useState(initialPath);
  const [direction, setDirection] = useState("right");
  const initializedFromPath = useRef(false);

  useEffect(() => {
    if (initializedFromPath.current || !isMainView) return;
    initializedFromPath.current = true;
    setActiveView(initialPath);
  }, [initialPath, isMainView]);

  useEffect(() => {
    touchPresence().catch(() => {});
    const timer = setInterval(() => touchPresence().catch(() => {}), 30000);
    return () => clearInterval(timer);
  }, []);

  function navigate(nextPath) {
    const normalized = normalizePath(nextPath);
    if (!navOrder.includes(normalized) || normalized === activeView) return;
    setDirection(routeIndex(normalized) >= routeIndex(activeView) ? "right" : "left");
    setActiveView(normalized);
  }

  const pageLabel = useMemo(() => viewLabels[activeView] || "Vehemence", [activeView]);

  if (!isMainView) {
    return children;
  }

  return (
    <>
      <Navbar activePath={activeView} onNavigate={navigate} />
      <div className="page-stack">
        {navOrder.map((path) => (
          <div
            className={`page-layer ${path === activeView ? "page-layer-active" : "page-layer-hidden"} ${path === activeView ? `page-transition page-transition-${direction}` : ""}`}
            key={path}
            aria-hidden={path !== activeView}
          >
            {renderView(path, user, navigate)}
          </div>
        ))}
      </div>
      <div className="page-active-bubble" key={activeView} aria-live="polite">
        <span />
        {pageLabel}
      </div>
    </>
  );
}
