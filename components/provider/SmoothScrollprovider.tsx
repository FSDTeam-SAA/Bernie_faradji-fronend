"use client";

import { ReactNode, useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

interface Props {
  children: ReactNode;
}

const HASH_SCROLL_OFFSET = -110;
const HASH_SCROLL_DURATION = 1.1;
const HASH_SCROLL_RETRY_DELAY = 60;
const HASH_SCROLL_RETRY_LIMIT = 20;

export default function SmoothScrollProvider({ children }: Props) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const hashRetryTimeoutRef = useRef<number | null>(null);

  const clearHashRetryTimeout = useCallback(() => {
    if (hashRetryTimeoutRef.current !== null) {
      window.clearTimeout(hashRetryTimeoutRef.current);
      hashRetryTimeoutRef.current = null;
    }
  }, []);

  const scrollToCurrentHash = useCallback(() => {
    const tryScrollToHash = (attempt = 0) => {
      const hash = window.location.hash;
      if (!hash || hash === "#") return;

      const lenis = lenisRef.current;
      if (!lenis) return;

      const decodedId = decodeURIComponent(hash.slice(1));
      const targetElement =
        document.getElementById(decodedId) || document.querySelector(hash);

      if (!targetElement) {
        if (attempt >= HASH_SCROLL_RETRY_LIMIT) return;

        clearHashRetryTimeout();
        hashRetryTimeoutRef.current = window.setTimeout(
          () => tryScrollToHash(attempt + 1),
          HASH_SCROLL_RETRY_DELAY
        );
        return;
      }

      lenis.scrollTo(targetElement, {
        offset: HASH_SCROLL_OFFSET,
        duration: HASH_SCROLL_DURATION,
        force: true,
      });
    };

    tryScrollToHash();
  }, [clearHashRetryTimeout]);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    const handleHashChange = () => {
      clearHashRetryTimeout();
      scrollToCurrentHash();
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      clearHashRetryTimeout();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [clearHashRetryTimeout, scrollToCurrentHash]);

  useEffect(() => {
    clearHashRetryTimeout();
    scrollToCurrentHash();
  }, [pathname, clearHashRetryTimeout, scrollToCurrentHash]);

  return <>{children}</>;
}
