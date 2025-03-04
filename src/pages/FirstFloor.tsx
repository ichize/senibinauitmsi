
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ModelViewer from '@/components/ModelViewer';
import * as THREE from 'three';

// Information for model parts specific to the first floor
const modelPartsInfo: Record<string, { title: string; description: string }> = {
  "ConferenceRoomA": {
    title: "Conference Room A",
    description: "Large conference room with seating for up to 20 people, featuring advanced presentation technology and video conferencing capabilities."
  },
  "ConferenceRoomB": {
    title: "Conference Room B",
    description: "Medium-sized conference room with modular furniture that can be reconfigured for different meeting styles."
  },
  "CollaborativeHub": {
    title: "Collaborative Hub",
    description: "Open space with flexible seating and writable walls for brainstorming and team collaboration."
  },
  "PhoneBooths": {
    title: "Phone Booths",
    description: "Private soundproof booths for calls and focused work requiring privacy."
  },
  "BreakoutArea": {
    title: "Breakout Area",
    description: "Casual meeting area with comfortable seating and coffee tables for impromptu discussions."
  },
  // Generic part information
  "Part_": {
    title: "Building Component",
    description: "Structural component of the building."
  },
  "Unknown": {
    title: "Building Element",
    description: "Part of the building structure."
  }
};

const FirstFloor = () => {
  const [hoveredPart, setHoveredPart] = useState<{
    name: string;
    screenPosition: { x: number; y: number };
    info: { title: string; description: string };
  } | null>(null);

  const handleModelPartHover = (info: {
    object: THREE.Object3D;
    position: THREE.Vector3;
    name: string;
  } | null) => {
    if (!info) {
      setHoveredPart(null);
      return;
    }

    // Try to find exact match for part info
    let partInfo = modelPartsInfo[info.name];
    
    // If no exact match, try to find a partial match
    if (!partInfo) {
      for (const key of Object.keys(modelPartsInfo)) {
        if (info.name.includes(key)) {
          partInfo = modelPartsInfo[key];
          break;
        }
      }
    }

    // If still no match, use generic info based on part naming pattern
    if (!partInfo) {
      if (info.name.startsWith('Part_')) {
        partInfo = modelPartsInfo['Part_'];
      } else {
        partInfo = modelPartsInfo['Unknown'];
      }
    }

    // Calculate screen position for tooltip
    const vector = new THREE.Vector3();
    vector.copy(info.position);
    
    const screenPosition = {
      x: 50 + (vector.x * 5),
      y: 50 + (vector.z * 5)
    };

    setHoveredPart({
      name: info.name,
      screenPosition,
      info: partInfo
    });
  };

  const handleModelPartClick = (info: {
    object: THREE.Object3D;
    position: THREE.Vector3;
    name: string;
  }) => {
    console.log('Clicked on model part:', info.name);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="inline-block px-3 py-1 mb-2 text-xs font-medium uppercase tracking-wider text-primary bg-primary/5 rounded-full">
              Floor Plan
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-4">First Floor</h1>
            <p className="text-lg text-muted-foreground">
              The first floor houses meeting rooms and collaborative workspaces.
              Hover over different areas of the model to learn more about each space.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 animate-scale-up">
            <ModelViewer 
              modelSrc="first-floor.skp" 
              onModelPartHover={handleModelPartHover}
              onModelPartClick={handleModelPartClick}
            >
              {hoveredPart && (
                <div 
                  className="absolute pointer-events-none info-card bg-white p-3 rounded-lg shadow-lg z-20 opacity-100 transition-all duration-300 ease-in-out"
                  style={{
                    left: `${hoveredPart.screenPosition.x}%`,
                    top: `${hoveredPart.screenPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    minWidth: '220px',
                    maxWidth: '300px',
                  }}
                >
                  <h4 className="text-base font-medium mb-1">{hoveredPart.info.title}</h4>
                  <p className="text-sm text-gray-600">{hoveredPart.info.description}</p>
                </div>
              )}
            </ModelViewer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-left">
              <h3 className="text-lg font-medium mb-2">First Floor Specifications</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Total area: 10,800 sq ft</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Ceiling height: 10 ft</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>6 conference rooms of varying sizes</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>8 private phone booths</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-right">
              <h3 className="text-lg font-medium mb-2">Key Features</h3>
              <p className="text-sm text-gray-600 mb-4">
                The first floor is optimized for meetings and collaborative work, with a focus on technology integration and flexibility.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Integrated room booking system</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Smart glass walls with privacy control</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Wireless charging stations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Adjustable lighting for different meeting types</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FirstFloor;
