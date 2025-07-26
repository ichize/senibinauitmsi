import React, { useState, useEffect } from 'react';
import { useRoomContext } from '@/contexts/RoomContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import ExpertiseFilter from "@/components/ExpertiseFilter";

const Lecturers: React.FC = () => {
  const navigate = useNavigate();
  const { lecturers: contextLecturers, lecturersLoading, lecturersError } = useRoomContext();

  const [search, setSearch] = useState('');
  const [results, setResults] = useState<{ "Student Name": string; "Academic Advisor": string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedExpertise, setSelectedExpertise] = useState<string>('');
  const [filteredLecturers, setFilteredLecturers] = useState<typeof contextLecturers>([]);

  const getFloorRoute = (floor: string) => {
    switch (floor.toLowerCase()) {
      case 'ground-floor': return '/ground-floor';
      case 'first-floor': return '/first-floor';
      case 'second-floor': return '/second-floor';
      case 'third-floor': return '/third-floor';
      case 'fourth-floor': return '/fourth-floor';
      default: return '/';
    }
  };

  // Fetch lecturers by expertise if selected, else use context data
  useEffect(() => {
    const fetch = async () => {
      if (!selectedExpertise) {
        setFilteredLecturers(contextLecturers);
      } else {
        const { data, error } = await supabase
          .from('lecturer_expertise')
          .select('lecturer_id, user_credentials(*)')
          .eq('expertise_id', Number(selectedExpertise));

        if (!error && data) {
          const mapped = data
            .map(e => e.user_credentials)
            .filter(Boolean);
          setFilteredLecturers(mapped);
        } else {
          setFilteredLecturers([]);
        }
      }
    };
    fetch();
  }, [selectedExpertise, contextLecturers]);

  // Existing academic advisor search logic
  useEffect(() => {
    if (search.trim() === '') {
      setResults([]);
      return;
    }
    setLoading(true);
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from('academic_advisor')
        .select('"Student Name", "Academic Advisor"')
        .ilike('Student Name', `%${search}%`);
      setResults(!error && data ? data : []);
      setLoading(false);
    };
    const timeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  if (lecturersLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* loading skeleton */}
      </div>
    );
  }

  if (lecturersError) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* error message */}
      </div>
    );
  }

  const lecturersToDisplay = filteredLecturers;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* → Insert your new filter dropdown here */}
        <ExpertiseFilter
          selectedExpertise={selectedExpertise}
          onChange={setSelectedExpertise}
        />

        {/* Academic Advisor Search */}
        {/* ... (no changes to your search UI) */}

        {/* lecturers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...lecturersToDisplay]
            .sort((a, b) => {
              const [titleA, ...nameA] = a.displayName.split(' ');
              const [titleB, ...nameB] = b.displayName.split(' ');
              const cmp = titleA.localeCompare(titleB);
              return cmp !== 0 ? cmp : nameA.join(' ').localeCompare(nameB.join(' '));
            })
            .map((lect, idx) => (
              <div key={lect.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                {/* … existing lecturer card */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Lecturers;
