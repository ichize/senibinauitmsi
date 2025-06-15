
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRoomContext } from "@/contexts/RoomContext";
import { toast } from "sonner";

const LecturerAdminPanel: React.FC = () => {
  const { lecturers, updateLecturer } = useRoomContext();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<(typeof lecturers)[0]>>({});

  // For future: Room/floor dropdown could be dynamic
  const startEdit = (lect) => {
    setEditId(lect.id);
    setForm({ ...lect });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editId && form.displayName?.trim() && form.surname?.trim()) {
      updateLecturer(editId, {
        displayName: form.displayName!.trim(),
        surname: form.surname!.trim(),
        role: form.role ?? "",
        photo: form.photo ?? "",
        floor: form.floor ?? "",
        roomId: form.roomId ?? "",
      });
      toast.success("Lecturer info updated!");
      setEditId(null);
      setForm({});
    } else {
      toast.error("Full name and surname are required");
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Lecturers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lecturers.map((lect) =>
            editId === lect.id ? (
              <div key={lect.id} className="p-4 border rounded-lg bg-muted/20 flex flex-col gap-2">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[180px]">
                    <Label htmlFor={`displayName-${lect.id}`}>Name</Label>
                    <Input
                      id={`displayName-${lect.id}`}
                      name="displayName"
                      value={form.displayName ?? ""}
                      onChange={handleChange}
                      className="mb-1"
                    />
                  </div>
                  <div className="flex-1 min-w-[160px]">
                    <Label htmlFor={`surname-${lect.id}`}>Surname</Label>
                    <Input
                      id={`surname-${lect.id}`}
                      name="surname"
                      value={form.surname ?? ""}
                      onChange={handleChange}
                      className="mb-1"
                    />
                  </div>
                  <div className="flex-1 min-w-[160px]">
                    <Label htmlFor={`role-${lect.id}`}>Role</Label>
                    <Input
                      id={`role-${lect.id}`}
                      name="role"
                      value={form.role ?? ""}
                      onChange={handleChange}
                      className="mb-1"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <Label htmlFor={`floor-${lect.id}`}>Floor</Label>
                    <Input
                      id={`floor-${lect.id}`}
                      name="floor"
                      value={form.floor ?? ""}
                      onChange={handleChange}
                      className="mb-1"
                    />
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <Label htmlFor={`roomId-${lect.id}`}>Room ID</Label>
                    <Input
                      id={`roomId-${lect.id}`}
                      name="roomId"
                      value={form.roomId ?? ""}
                      onChange={handleChange}
                      className="mb-1"
                    />
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <Label htmlFor={`photo-${lect.id}`}>Photo (filename)</Label>
                    <Input
                      id={`photo-${lect.id}`}
                      name="photo"
                      value={form.photo ?? ""}
                      onChange={handleChange}
                      className="mb-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button onClick={handleSave} size="sm">Save</Button>
                  <Button variant="outline" onClick={handleCancel} size="sm">Cancel</Button>
                </div>
              </div>
            ) : (
              <div key={lect.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex flex-col sm:flex-row flex-1 gap-3 sm:items-center">
                  <div className="flex items-center gap-3">
                    <img src={lect.photo} alt={lect.displayName} className="w-12 h-12 rounded-full object-cover border" />
                    <div>
                      <div className="font-semibold">{lect.displayName} <span className="text-gray-400 font-normal">{lect.surname}</span></div>
                      <div className="text-sm">{lect.role}</div>
                      <div className="text-xs text-gray-500">Floor: {lect.floor} | Room: {lect.roomId}</div>
                    </div>
                  </div>
                </div>
                <Button className="ml-3" variant="outline" size="sm" onClick={() => startEdit(lect)}>Edit</Button>
              </div>
            )
          )}
        </div>
        <div className="text-xs text-gray-400 mt-6">
          To change photo, provide image filename (must be uploaded to public).
        </div>
      </CardContent>
    </Card>
  );
};

export default LecturerAdminPanel;

