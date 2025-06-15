
import React from 'react';

const GroundFloorFeaturesCard: React.FC = () => (
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
);

export default GroundFloorFeaturesCard;
