
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRoomContext } from '@/contexts/RoomContext';

const NamedRoomAdminPanel: React.FC = () => {
  const { rooms } = useRoomContext();
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [newRoomName, setNewRoomName] = useState('');

  // Only show named rooms (not studios)
  const namedRooms = rooms.filter(room => !room.roomID.startsWith('studio'));

  const handleRoomRename = async (roomId: string) => {
    if (!newRoomName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }
    // Update room name in Supabase
    const { error } = await import('@/lib/supabaseClient').then(({ supabase }) =>
      supabase.from('rooms').update({ room_name: newRoomName.trim() }).eq('roomID', roomId)
    );
    if (error) {
      toast.error('Failed to rename room');
    } else {
      toast.success('Room renamed successfully');
    }
    setEditingRoom(null);
    setNewRoomName('');
  };

  const startEditingRoom = (room: any) => {
    setEditingRoom(room.roomID);
    setNewRoomName(room.room_name);
  };

  const cancelEdit = () => {
    setEditingRoom(null);
    setNewRoomName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Named Rooms Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {namedRooms.map((room) => (
            <div key={room.roomID} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  {editingRoom === room.roomID ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Label htmlFor={`room-${room.roomID}`} className="sr-only">
                        Room Name
                      </Label>
                      <Input
                        id={`room-${room.roomID}`}
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        className="flex-1"
                        placeholder="Enter new room name"
                      />
                      <Button 
                        onClick={() => handleRoomRename(room.roomID)}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button 
                        onClick={cancelEdit}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <h3 className="font-medium">{room.room_name}</h3>
                        <p className="text-sm text-gray-600">{room.room_type} {room.capacity ? `(${room.capacity} pax)` : ''}</p>
                        <p className="text-xs text-gray-500">{room.floor}</p>
                      </div>
                      <Button 
                        onClick={() => startEditingRoom(room)}
                        variant="outline"
                        size="sm"
                      >
                        Rename
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NamedRoomAdminPanel;
