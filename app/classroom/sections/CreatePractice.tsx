import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Image as ImageIcon, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { getApiUrl } from '@/lib/api-config';

interface PracticeSession {
  id: string;
  name: string;
  description: string;
  image?: string;
  status: string;
  userMarks?: number;
  totalMarks?: number;
}

const PracticeSessions: React.FC<{ classroomDetails: any }> = ({ classroomDetails }) => {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state kept for potential future "Create" implementation, 
  // but heavily prioritizing fetching existing list
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const fetchPracticeSessions = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    const classroomId = classroomDetails?.id || "7186c7de-0276-4c8c-a1b9-59b249019c29";

    try {
      const response = await fetch(getApiUrl(`/api/practices/classroom/${classroomId}`), {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.title,
          description: item.description,
          image: item.file,
          status: item.status,
          userMarks: item.userMarks,
          totalMarks: item.totalMarks
        }));
        setSessions(mappedData);
      } else {
        console.error("Failed to fetch practice sessions");
      }
    } catch (error) {
      console.error("Error fetching practice sessions:", error);
    } finally {
      setLoading(false);
    }
  }, [classroomDetails]);

  useEffect(() => {
    fetchPracticeSessions();
  }, [fetchPracticeSessions]);

  const handleImageUpload = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    const token = localStorage.getItem("access_token");
    const classroomId = classroomDetails?.id || "7186c7de-0276-4c8c-a1b9-59b249019c29";

    const formData = new FormData();
    formData.append("title", name);
    formData.append("description", description);
    formData.append("classroomId", classroomId);
    
    // Using the first document ID from classroomDetails if available, else a placeholder
    const documentId = classroomDetails?.sources?.[0]?.document || "";
    formData.append("documentId", documentId);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const response = await fetch(getApiUrl("/api/practices/create"), {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        await fetchPracticeSessions();
        setName("");
        setDescription("");
        setImage(undefined);
        setSelectedFile(null);
        setOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to create practice session:", errorData);
      }
    } catch (error) {
      console.error("Error creating practice session:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Gradient Bar */}
      <div className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2" />

      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-500" />
            Practice Sessions
          </h1>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl h-12 px-6 font-semibold shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Practice Session
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl max-w-lg bg-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Create Practice Session
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Practice session name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Textarea
                  placeholder="Practice session description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <label className="flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer hover:border-purple-400 transition">
                  <ImageIcon className="w-5 h-5 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    {image ? "Image selected" : "Upload cover image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                  />
                </label>

                <Button
                  onClick={handleCreate}
                  disabled={!name || !description || isCreating}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl h-11 font-semibold"
                >
                  {isCreating ? "Creating..." : "Create Session"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sessions List */}
      <div className="p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition"
            >
              {session.image ? (
                <img
                  src={session.image}
                  alt={session.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="h-40 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                  <Target className="w-10 h-10 text-purple-500" />
                </div>
              )}

              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {session.name}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                  {session.description}
                </p>

                <div className="mb-4">
                  {session.status === "Submitted" && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse" />
                      Submitted & Pending Review
                    </div>
                  )}
                  
                  {session.status === "Evaluated" && (
                     <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                      <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Score Achieved</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-emerald-700">
                          {session.userMarks}
                        </span>
                        <span className="text-sm font-medium text-emerald-500">
                          / {session.totalMarks}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                    onClick={() => router.push(`/classroom/${classroomDetails?.id || '1'}?set=practice&practiceid=${session.id}`)}
                  className="mt-4 w-full bg-white border-2 border-slate-300 text-slate-700 hover:border-purple-500 hover:text-purple-700 rounded-xl font-semibold"
                >
                  Open Practice
                </Button>
              </div>
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center text-slate-500 mt-16">
            No practice sessions created yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeSessions;
