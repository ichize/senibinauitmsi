import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from 'react-router-dom';

// Type definitions
interface RoomData {
  id: string;
  currentName: string;
  description: string;
  floor: string;
  position: [number, number, number];
}

interface LecturerData {
  id: string;
  displayName: string;
  surname: string;
  photo: string;
  floor: string;
  roomID: string;
  role?: string;
}

interface RoomContextType {
  studios: RoomData[];
  namedRooms: RoomData[];
  lecturers: LecturerData[];
  lecturersLoading: boolean;
  lecturersError: string | null;
  handleCardClick: (floor: string, roomId: string) => void;
}

// Create context
const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Context provider component
export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // Room data - unchanged from your original
  const [studios] = useState<RoomData[]>([
    { id: 'studio-08b', currentName: 'Studio 08B', description: 'Max Pax= 30. Fixed Workstation, 3 AC, Projector', floor: 'Ground Floor', position: [27, 2, 3] },
    // ... [keep all your other studio objects exactly as you had them] ...
  ]);

  const [namedRooms] = useState<RoomData[]>([
    { id: 'crit-main', currentName: 'Bilik Krit Utama', description: 'Main critique room with projector', floor: 'Second Floor', position: [0, 10, 0] },
    // ... [keep all your other named room objects] ...
  ]);

  // Lecturers state
  const [lecturers, setLecturers] = useState<LecturerData[]>([]);
  const [lecturersLoading, setLecturersLoading] = useState(true);
  const [lecturersError, setLecturersError] = useState<string | null>(null);

  // Fetch lecturers from Supabase
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const { data, error } = await supabase
          .from('user_credentials')
          .select('id, title, username, surname, photo_url, roomID, floor');

        if (error) throw error;

        setLecturers(data.map((row: any) => ({
          id: row.id,
          displayName: `${row.title || ''} ${row.username}`.trim(),
          surname: row.surname || '',
          photo: row.photo_url || '/default-avatar.jpg',
          floor: row.floor || 'Ground Floor',
          roomID: row.roomID || 'studio-08b'
        }));

      } catch (error) {
        setLecturersError(error.message);
        console.error('Failed to load lecturers:', error);
      } finally {
        setLecturersLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  // Navigation handler
  const handleCardClick = useCallback((floor: string, roomId: string) => {
    const floorPath = floor.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${floorPath}?highlight=${roomId}`);
  }, [navigate]);

  return (
    <RoomContext.Provider value={{
      studios,
      namedRooms,
      lecturers,
      lecturersLoading,
      lecturersError,
      handleCardClick
    }}>
      {children}
    </RoomContext.Provider>
  );
};

// Custom hook for using the context
export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};
