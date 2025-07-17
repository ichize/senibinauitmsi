import { useEffect, useState } from "react";

export const useVisitorTracker = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const trackAndFetchVisitor = async () => {
      try {
        // Get IP and User Agent
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

        // Now fetch the updated count (via GET)
        const countRes = await fetch("https://script.google.com/macros/s/AKfycbwVOVFDDjd1S4eCuxGKyXt3sZ5pJMkgHOPBN8C0-g7SzMV3sWx-a3gG5MRrJQAYlwYM/exec");
        const countData = await countRes.json();

        if (typeof countData.count === "number") {
          setVisitorCount(countData.count);
        } else {
          console.warn("Unexpected count response:", countData);
        }
      } catch (err) {
        console.error("Failed to track or fetch visitor count:", err);
      }
    };

    trackAndFetchVisitor();
  }, []);

  return { visitorCount }; // 🔥 THIS IS REQUIRED!
};
