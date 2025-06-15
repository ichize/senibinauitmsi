
import React from 'react';

const SecondFloorFeaturesCard: React.FC = () => (
  <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-right">
    <h3 className="text-lg font-medium mb-2">Key Features</h3>
    <p className="text-sm text-gray-600 mb-4">
      Great view to the stage/open gallery area
    </p>
    <div className="space-y-2 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <span>Biophilic design elements</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <span>Optimum view into the courtyard that can see all the activities happening</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <span>---</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <span>----</span>
      </div>
    </div>
  </div>
);

export default SecondFloorFeaturesCard;
