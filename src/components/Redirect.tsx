"use client";

import { useEffect } from "react";

// Keeps old static-site URLs working after the move to Next.js routes.
export function Redirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to + window.location.hash);
  }, [to]);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <p style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
        This page has moved to <a href={to}>{to}</a>.
      </p>
    </>
  );
}
