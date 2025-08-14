import React from 'react';
import HoverDetails from '@/components/HoverDetails';
import { useRoomContext } from '@/contexts/RoomContext';

interface DynamicHotspotsProps {
  floor?: string;
  targetRoomId?: string;
}

const DynamicHotspots: React.FC<DynamicHotspotsProps> = ({ floor, targetRoomId }) => {
  const { rooms, lecturers, roomIdToPosition } = useRoomContext();

  // Filter lecturers by floor if specified, as they contain room information
  const floorLecturers = floor 
    ? lecturers.filter(lecturer => lecturer.floor?.toLowerCase().includes(floor.toLowerCase()))
    : lecturers;

  // Filter rooms by floor if specified (for rooms without lecturers)
  const floorRooms = floor 
    ? rooms.filter(room => room.floor?.toLowerCase().includes(floor.toLowerCase()))
    : rooms;

  // Get all room IDs that have lecturers
  const roomsWithLecturers = new Set(floorLecturers.map(lecturer => lecturer.roomID).filter(Boolean));

  return (
    <>
      {/* Render lecturer hotspots first (priority) */}
      {floorLecturers.map((lecturer) => {
        if (!lecturer.roomID) return null;
        
        const position = roomIdToPosition[lecturer.roomID];
        if (!position) return null;

        return (
          <HoverDetails
            key={lecturer.roomID}
            title={lecturer.displayName}
            surname={lecturer.surname}
            description={Array.isArray(lecturer.expertise) && lecturer.expertise.length > 0 ? lecturer.expertise.join(", ") : (typeof lecturer.expertise === 'string' && lecturer.expertise ? lecturer.expertise : "Lecturer")}
            position="right"
            modelPosition={position}
            imageSrc={lecturer.photo}
            roomID={lecturer.roomID}
            isHighlighted={targetRoomId === lecturer.roomID}
            autoOpen={targetRoomId === lecturer.roomID}
          />
        );
      })}

      {/* Render room hotspots for rooms without lecturers */}
      {floorRooms.map((room) => {
        // Skip rooms that already have lecturers
        if (roomsWithLecturers.has(room.roomID)) return null;
        
        const position = roomIdToPosition[room.roomID];
        if (!position) return null;

        return (
          <HoverDetails
            key={room.roomID}
            title={room.room_name}
            description={room.description || ''}
            position="right"
            modelPosition={position}
            roomID={room.roomID}
            isHighlighted={targetRoomId === room.roomID}
            autoOpen={targetRoomId === room.roomID}
          />
        );
      })}
    </>
  );
};

export default DynamicHotspots;
