"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      const swUrl = `${basePath}/sw.js`;
      const scope = `${basePath}/`;

      window.addEventListener("load", () => {
        navigator.serviceWorker.register(swUrl, { scope }).catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
      });
    }
  }, []);

  return null;
}
