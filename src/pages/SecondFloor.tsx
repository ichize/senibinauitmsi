
import React, { useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import ModelViewer from '@/components/ModelViewer';
import SecondFloorHotspots from './SecondFloorHotspots';
import SecondFloorSpecsCard from './SecondFloorSpecsCard';
import SecondFloorFeaturesCard from './SecondFloorFeaturesCard';
import { useSearchParams } from "react-router-dom";

// RoomId to position mapping for Second Floor
const roomIdToPosition: Record<string, [number, number, number]> = {
  "studio-02a": [24, 8, 2],
  "studio-02b": [24, 8, -10],
  "staff-lounge": [-17, 8, 15],
  "studio-02c": [11, 8, 15],
  "studio-02d": [-8, 8, 15],
  "crit-main": [-24, 8, 0],
  "hanim": [10, 8, -8],
  "yen": [10, 8, -15],
  "maya": [5, 8, -20],
  "iznny": [16, 8, -8],
  "anwar": [-8, 8, -15],
  "mimi": [-18, 8, -8],
  "fariz": [-15, 8, -8],
  "amin": [-8, 8, -8],
  "amran": [-11, 8, -8],
  "adeeb": [-18, 8, -15],
  "iryani": [-15, 8, -15],
  "unoccupied": [-11, 8, -15],
};

const SecondFloor = () => {
  const [params] = useSearchParams();
  const targetRoomId = params.get("room")?.toLowerCase() ?? undefined;
  const targetRoomPosition = targetRoomId && roomIdToPosition[targetRoomId] ? roomIdToPosition[targetRoomId] : undefined;

  // --- ModelViewer auto-scroll-to-view logic ---
  const modelViewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetRoomId && modelViewerRef.current) {
      setTimeout(() => {
        modelViewerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, [targetRoomId]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="inline-block px-3 py-1 mb-2 text-xs font-medium uppercase tracking-wider text-primary bg-primary/5 rounded-full">
              Floor Plan
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-4">Second Floor</h1>
            <p className="text-lg text-muted-foreground">
              This floor have Studios, Crit Rooms, Toilets (Purple, pink), Archi. Lecturer's Office (yellow), and Staff Lounge.
              Hover over the highlighted areas to learn more about each space.
            </p>
          </div>
          
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 animate-scale-up"
            ref={modelViewerRef}
          >
            <ModelViewer modelSrc="Annex12F.gltf" targetRoomPosition={targetRoomPosition}>
              <SecondFloorHotspots
                roomIdToPosition={roomIdToPosition}
                targetRoomId={targetRoomId}
              />
            </ModelViewer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <SecondFloorSpecsCard />
            <SecondFloorFeaturesCard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SecondFloor;
