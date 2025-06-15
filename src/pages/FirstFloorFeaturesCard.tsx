
import React from 'react';

const FirstFloorFeaturesCard: React.FC = () => (
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
);

export default FirstFloorFeaturesCard;
