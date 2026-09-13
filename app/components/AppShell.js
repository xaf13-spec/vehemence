"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";

const navOrder = ["/", "/rules", "/games", "/browser", "/music", "/entertainment", "/profile", "/settings", "/notifications"];

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
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    const previousIndex = routeIndex(previousPath.current);
    const currentIndex = routeIndex(pathname);
    setDirection(currentIndex >= previousIndex ? "right" : "left");
    setTransitionKey((value) => value + 1);
    previousPath.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a[href]");
      if (!link) return;
      const url = new URL(link.href, window.location.origin);
      if (url.origin !== window.location.origin || url.pathname === pathname) return;
      if (!navOrder.includes(url.pathname)) return;

      event.preventDefault();
      const nextDirection = routeIndex(url.pathname) >= routeIndex(pathname) ? "right" : "left";
      setDirection(nextDirection);
      router.push(url.pathname);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname, router]);

  return (
    <>
      <Navbar />
      <div className={`page-transition page-transition-${direction}`} key={transitionKey}>
        {children}
      </div>
      <div className="page-active-bubble" key={pathname} aria-live="polite">
        <span />
        {pathname === "/" ? "Home" : pathname.slice(1).replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
      </div>
    </>
  );
}
