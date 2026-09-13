"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";
import PersistentSpotifyEmbed from "./PersistentSpotifyEmbed";
import { touchPresence } from "../friends/actions";

const navOrder = ["/", "/rules", "/music", "/entertainment", "/soundboard", "/profile", "/friends", "/settings", "/notifications"];

function routeIndex(pathname) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const index = navOrder.indexOf(normalized);
  return index === -1 ? 0 : index;
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const previousPath = useRef(pathname);
  const [direction, setDirection] = useState("right");
  const [pages, setPages] = useState(() => [{ pathname, children }]);

  useEffect(() => {
    const previousIndex = routeIndex(previousPath.current);
    const currentIndex = routeIndex(pathname);
    setDirection(currentIndex >= previousIndex ? "right" : "left");
    previousPath.current = pathname;

    setPages((currentPages) => {
      if (currentPages.some((page) => page.pathname === pathname)) return currentPages;
      return [...currentPages, { pathname, children }];
    });
  }, [pathname, children]);

  useEffect(() => {
    touchPresence().catch(() => {});
    const timer = setInterval(() => touchPresence().catch(() => {}), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a[href]");
      if (!link) return;
      const url = new URL(link.href, window.location.origin);
      if (url.origin !== window.location.origin || url.pathname === pathname) return;
      if (!navOrder.includes(url.pathname)) return;

      event.preventDefault();
      setDirection(routeIndex(url.pathname) >= routeIndex(pathname) ? "right" : "left");
      router.push(url.pathname);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname, router]);

  const pageLabel = useMemo(() => {
    if (pathname === "/") return "Home";
    return pathname.slice(1).replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }, [pathname]);

  return (
    <>
      <Navbar />
      <div className="page-stack">
        {pages.map((page) => {
          const active = page.pathname === pathname;
          return (
            <div
              className={`page-layer ${active ? "page-layer-active" : "page-layer-hidden"} ${active ? `page-transition page-transition-${direction}` : ""}`}
              key={page.pathname}
              aria-hidden={!active}
            >
              {page.children}
            </div>
          );
        })}
      </div>
      <PersistentSpotifyEmbed />
      <div className="page-active-bubble" key={pathname} aria-live="polite">
        <span />
        {pageLabel}
      </div>
    </>
  );
}
