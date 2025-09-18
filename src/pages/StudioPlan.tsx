import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useRoomContext } from "@/contexts/RoomContext";

const StudioPlan = () => {
  const { rooms } = useRoomContext();

  // Common style for all labels
  const baseLabelStyle: React.CSSProperties = {
    position: "absolute",
    background: "rgba(255,255,255,0.85)",
    padding: "1px 4px",
    borderRadius: "2px",
    fontWeight: 600,
    fontSize: "clamp(0.2rem, 1vw, 1rem)", // Responsive font size
    pointerEvents: "none",
    zIndex: 10,
    textAlign: "center",
    lineHeight: 1,
    minWidth: "max-content",
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>

        {/* Floor Plan Image */}
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4">Studio Plan Overview</h2>
          <div className="relative inline-block">
            <img
              src="/images/studio-plan.png"
              alt="Architecture Studio Plan"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
            {/* Render all room labels with position */}
            {rooms.map((room) => {
              // Skip rooms without position data
              if (!room.position) return null;
              // Use position data for 2D layout (assuming first two coordinates)
              const left = `${(room.position[0] + 10) * 5}%`; // Convert 3D position to percentage
              const top = `${(room.position[2] + 10) * 5}%`;
              return (
                <span
                  key={room.roomID}
                  style={{
                    ...baseLabelStyle,
                    left: left?.trim(),
                    top: top?.trim(),
                  }}
                >
                  <div>{room.room_name}</div>
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: "clamp(0.1rem, 1vw, 0.75rem)",
                      opacity: 0.7,
                    }}
                  >
                    {room.roomID}
                  </div>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudioPlan;
