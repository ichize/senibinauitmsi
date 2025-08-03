import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/lib/supabaseClient";

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
  expertise?: string | string[];
}

interface RoomContextType {
rooms: RoomData[];
  lecturers: LecturerData[];
  updateLecturer: (id: string, updates: Partial<LecturerData>) => void;
  lecturersLoading: boolean;
  lecturersError: string | null;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};

export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<RoomData[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*');
      if (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);
      } else if (data) {
        setRooms(data);
      }
    };
    fetchRooms();
  }, []);

  // --- Lecturers from Supabase ---
  const [lecturers, setLecturers] = useState<LecturerData[]>([]);
  const [lecturersLoading, setLecturersLoading] = useState(true);
  const [lecturersError, setLecturersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecturers = async () => {
      console.log('[RoomContext] Fetching lecturers from Supabase...');
      setLecturersLoading(true);
      setLecturersError(null);
      // Fetch lecturers and their expertise mapping
      const { data, error } = await supabase
        .from('user_credentials')
        .select('id, title, username, surname, photo_url, roomID, floor, lecturer_expertise:lecturer_expertise(expertise_id)');
      console.log('[RoomContext] Supabase response:', { data, error });
      if (error) {
        setLecturersError(error.message);
        setLecturers([]);
        console.error('[RoomContext] Error fetching lecturers:', error);
      } else if (data) {
        setLecturers(
          data.map((row: any) => ({
            id: row.id,
            displayName: `${row.title ? row.title + ' ' : ''}${row.username}`.trim(),
            surname: row.surname,
            photo: row.photo_url,
            floor: row.floor,
            roomID: row.roomID,
            expertise: Array.isArray(row.lecturer_expertise)
              ? row.lecturer_expertise.map((ex: any) => ex.expertise_id)
              : [],
          }))
        );
        setLecturersError(null);
        console.log('[RoomContext] Lecturers loaded:', data);
      }
      setLecturersLoading(false);
      console.log('[RoomContext] Fetch complete.');
    };
    fetchLecturers();
  }, []);



  const updateLecturer = (id: string, updates: Partial<LecturerData>) => {
    setLecturers((prev) =>
      prev.map((lect) => (lect.id === id ? { ...lect, ...updates } : lect))
    );
  };

  // Add this function to fetch today's visitor count
  const getTodayVisitorCount = async () => {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const { data, error } = await supabase
      .from('visitors')
      .select('id')
      .eq('visit_date', today);

    if (error) {
      console.error('Error fetching today\'s visitors:', error);
      return 0;
    }
    return data ? data.length : 0;
  };

  return (
    <RoomContext.Provider value={{ rooms, lecturers, updateLecturer, lecturersLoading, lecturersError }}>
      {children}
    </RoomContext.Provider>
  );
};
export default RoomContext;
