
import React from 'react';

const ThirdFloorFeaturesCard: React.FC = () => (
  <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-right">
    <h3 className="text-lg font-medium mb-2">Key Features</h3>
    <p className="text-sm text-gray-600 mb-4">
      The transitional floor. where junior senior knowledge is being tested to see whether you are fit to go up the semester ladder.
    </p>
    <div className="space-y-2 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <span>Workstation studios</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <span>Come up meet your friendly 'seniors'</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <span>---</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <span>---</span>
      </div>
    </div>
  </div>
);

export default ThirdFloorFeaturesCard;
