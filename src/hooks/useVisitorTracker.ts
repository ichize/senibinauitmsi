import { useEffect } from "react";

export const useVisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get user's public IP address
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        const ip = data.ip;
        const ua = navigator.userAgent;

        // Send to Google Apps Script
        await fetch("https://script.google.com/macros/s/AKfycbwVOVFDDjd1S4eCuxGKyXt3sZ5pJMkgHOPBN8C0-g7SzMV3sWx-a3gG5MRrJQAYlwYM/exec", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ ip, ua }),
        });
      } catch (err) {
        console.error("Failed to track visitor:", err);
      }
    };

    trackVisitor();
  }, []);
};
