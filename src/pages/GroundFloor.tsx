import React from 'react';
import Layout from '@/components/Layout';
import ModelViewer from '@/components/ModelViewer';
import HoverDetails from '@/components/HoverDetails';
import { useRoomContext } from '@/contexts/RoomContext';
import { useSearchParams } from "react-router-dom";

const roomIdToPosition: Record<string, [number, number, number]> = {
  "studio-08b": [27, 2, 3],
  "studio-master-01": [-4, 2, -3],
  "studio-master-03": [9, 2, -3],
  "studio-08a": [-22, 2, -3],
  "studio-master-04": [-2, 2, 20],
  "studio-master-02": [13, 2, 20],
  // add other rooms if necessary
};

const GroundFloor = () => {
  const [params] = useSearchParams();
  const targetRoomId = params.get("room")?.toLowerCase() ?? undefined;
  const targetRoomPosition = targetRoomId && roomIdToPosition[targetRoomId] ? roomIdToPosition[targetRoomId] : undefined;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="inline-block px-3 py-1 mb-2 text-xs font-medium uppercase tracking-wider text-primary bg-primary/5 rounded-full">
              Floor Plan
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-4">Ground Floor</h1>
            <p className="text-lg text-muted-foreground">
              The ground floor features the Studios, Toilets (Purple, pink), Archi. Lecturer's Office (yellow), Courtyard, and public spaces.
              Hover over the highlighted areas to learn more about each space.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 animate-scale-up">
            <ModelViewer modelSrc="Annex1GF.gltf" targetRoomPosition={targetRoomPosition}>
              <HoverDetails
                title="Studio 08B"
                roomId="studio-08b"
                description="Max Pax= 30. Fixed Workstation, 3 AC, Projector"
                position="right"
                modelPosition={[27, 2, 3]} 
                isHighlighted={targetRoomId === "studio-08b"}
                autoOpen={targetRoomId === "studio-08b"}
              />
              <HoverDetails
                title="Studio Master 01"
                roomId="studio-master-01"
                description="Max Pax= 25. 24 hours operational Studio, Fixed Workstation, Projector"
                position="right"
                modelPosition={[-4, 2, -3]}
                isHighlighted={targetRoomId === "studio-master-01"}
                autoOpen={targetRoomId === "studio-master-01"}
              />
              <HoverDetails
                title="Studio Master 03"
                roomId="studio-master-03"
                description="Max Pax= 25. 24 hours operational Studio, Fixed Workstation, Projector"
                position="right"
                modelPosition={[9, 2, -3]}
                isHighlighted={targetRoomId === "studio-master-03"}
                autoOpen={targetRoomId === "studio-master-03"}
              />
              <HoverDetails
                title="Studio 08A"
                roomId="studio-08a"
                description="Max Pax= 30. Fixed Workstation, 3 AC, Projector"
                position="right"
                modelPosition={[-22, 2, -3]}
                isHighlighted={targetRoomId === "studio-08a"}
                autoOpen={targetRoomId === "studio-08a"}
              />
              <HoverDetails
                title="Arc.Lab"
                roomId="arclab"
                description="Laser Cutter"
                position="top"
                modelPosition={[-22, 2, 10]}
                isHighlighted={targetRoomId === "arclab"}
                autoOpen={targetRoomId === "arclab"}
              />
              <HoverDetails
                title="Studio Master 04"
                roomId="studio-master-04"
                description="Max Pax= 25. 24 hours operational Studio, Fixed Workstation, Projector"
                position="right"
                modelPosition={[-2, 2, 20]}
                isHighlighted={targetRoomId === "studio-master-04"}
                autoOpen={targetRoomId === "studio-master-04"}
              />
              <HoverDetails
                title="Studio Master 02"
                roomId="studio-master-02"
                description="Max Pax= 25. 24 hours operational Studio, Fixed Workstation, Projector"
                position="right"
                modelPosition={[13, 2, 20]}
                isHighlighted={targetRoomId === "studio-master-02"}
                autoOpen={targetRoomId === "studio-master-02"}
               />
              <HoverDetails
                title="Classroom"
                description="Max Pax= 40. Projector, AP1 022"
                position="right"
                modelPosition={[30, 2, -15]}
                roomId="classroom-022"
                isHighlighted={targetRoomId === "classroom-022"}
                autoOpen={targetRoomId === "classroom-022"}
               />
              <HoverDetails
                title="Classroom"
                description="Max Pax= 40. Projector, AP1 002"
                position="right"
                modelPosition={[-25, 2, -15]}
                roomId="classroom-002"
                isHighlighted={targetRoomId === "classroom-002"}
                autoOpen={targetRoomId === "classroom-002"}
               />
               <HoverDetails
                title="Ts. MOHD NASURUDIN"
                surname="HASBULLAH"
                description="Senior Lecturer"
                position="right"
                modelPosition={[24, 2, -19]}
                imageSrc="Nas.jpg"
                roomId="nasurudin"
                isHighlighted={targetRoomId === "nasurudin"}
                autoOpen={targetRoomId === "nasurudin"}
               />
               <HoverDetails
                title="Dr AZHAN"
                surname="ABD AZIZ"
                description="Senior Lecturer"
                position="right"
                modelPosition={[-14, 2, 4.5]}
                imageSrc="Azhan.jpg"
                 roomId="azhan"
                isHighlighted={targetRoomId === "azhan"}
                autoOpen={targetRoomId === "azhan"}
               />
               <HoverDetails
                title="En AHMAD FAISOL"
                surname="YUSOF"
                description="Senior Lecturer"
                position="right"
                modelPosition={[17, 2, -7]}
                imageSrc="Faisol.jpg"
                roomId="faisol"
                isHighlighted={targetRoomId === "faisol"}
                autoOpen={targetRoomId === "faisol"}
                />
               <HoverDetails
                title="Ts. Dr. WAN NUR RUKIAH"
                surname="MOHD ARSHAD"
                description="Senior Lecturer"
                position="right"
                modelPosition={[32, 2, -7]}
                imageSrc="Wan.jpg"
                roomId="wan"
                isHighlighted={targetRoomId === "wan"}
                autoOpen={targetRoomId === "wan"}
                />
            </ModelViewer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-left">
              <h3 className="text-lg font-medium mb-2">Ground Floor Specifications</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lecturer Office: 4</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Studio: 6</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Other Amenities: Archi Lab, Classroom, Courtyard</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Toilet: 2</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-right">
              <h3 className="text-lg font-medium mb-2">Key Features</h3>
              <p className="text-sm text-gray-600 mb-4">
                The ground floor is designed to create an impressive first impression while facilitating efficient flow of students and lectures.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Double-height atrium with natural lighting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Open Courtyard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Refill your Water Bottle with a Water Dispencer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>5 entry to the building</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GroundFloor;
