import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Image as ImageIcon, Target, Calendar, Clock, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExamSession {
  id: string;
  title: string;
  description: string;
  file: string;
  classroom_id: string;
  difficulty: string;
  date: string;
}

const ExamSessions: React.FC<{ classroomDetails: any }> = ({ classroomDetails }) => {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 19));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWlrYXRAZ21haWwuY29tIiwiZXhwIjoxNzY3OTIzODg3fQ.MrcP0skIR3MSfg4N2UTYKp60BwXxQoqILme9oDGWguU") : "";
  const classroomId = classroomDetails?.id || "7186c7de-0276-4c8c-a1b9-59b249019c29";

  const fetchExams = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/exams/classroom/${classroomId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Error fetching exam sessions:", error);
    } finally {
      setLoading(false);
    }
  }, [classroomId, token]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!title || !description || !selectedFile) return;

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("classroomId", classroomId);
      const documentId = classroomDetails?.sources?.[0]?.id || "default_document_id";
      formData.append("documentId", documentId);
      formData.append("difficulty", difficulty);
      formData.append("date", date);
      formData.append("file", selectedFile);

      const response = await fetch("http://127.0.0.1:8000/api/exams/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newExam = await response.json();
        setSessions([newExam, ...sessions]);
        setOpen(false);
        setTitle("");
        setDescription("");
        setDifficulty("Medium");
        setSelectedFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error creating exam session:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const inputClasses = "bg-white border-4 border-black text-black placeholder:text-black/30 h-14 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] outline-none px-4 w-full";

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 md:p-12">
      {/* Header */}
      <div className="border-8 border-black bg-white p-8 mb-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden rotate-[-0.5deg]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-info border-l-8 border-b-8 border-black"></div>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
                <span className="text-secondary font-black uppercase text-2xl tracking-widest">Exam Protocol</span>
                <h1 className="text-5xl md:text-8xl font-black text-black font-heading uppercase leading-none mt-2">
                    SESSIONS
                </h1>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="neo-button bg-primary text-black h-20 md:w-64 flex items-center justify-center gap-4 text-2xl uppercase">
                  <Plus className="w-8 h-8" strokeWidth={4} />
                  NEW EXAM
                </button>
              </DialogTrigger>

              <DialogContent className="rounded-none border-8 border-black max-w-2xl bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden">
                <div className="p-8 bg-black text-white flex items-center justify-between">
                    <div>
                        <DialogTitle className="text-4xl font-black uppercase mb-2">INITIATE EXAM</DialogTitle>
                        <p className="text-primary text-xs font-bold uppercase italic">Configure your assessment module</p>
                    </div>
                    <Target className="w-12 h-12 text-primary" />
                </div>

                <div className="p-8 space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase">EXAM TITLE</label>
                        <input
                            placeholder="E.G. MID-TERM BRAIN DUMP"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={inputClasses}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase">INTEL DEBRIEF</label>
                        <textarea
                            placeholder="Provide assessment parameters..."
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={inputClasses + " py-4 h-auto resize-none"}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase">DIFFICULTY</label>
                            <select 
                                value={difficulty} 
                                onChange={(e) => setDifficulty(e.target.value)}
                                className={inputClasses}
                            >
                                <option value="Easy">EASY (NOOB)</option>
                                <option value="Medium">MEDIUM (MID)</option>
                                <option value="Hard">HARD (BOSS)</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase">LAUNCH TIME</label>
                            <input
                                type="datetime-local"
                                value={date.slice(0, 16)}
                                onChange={(e) => setDate(e.target.value + ":00")}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase">ASSET BANNER</label>
                        <label className="flex flex-col items-center justify-center gap-4 p-10 border-4 border-dashed border-black bg-slate-50 cursor-pointer hover:bg-primary/10 transition-all relative overflow-hidden group min-h-[150px]">
                            {imagePreview ? (
                                <div className="z-10 text-center">
                                    <ImageIcon className="w-12 h-12 text-black mx-auto mb-2" />
                                    <span className="font-black uppercase text-sm block">ASSET LOCKED</span>
                                    <span className="text-[10px] font-bold opacity-60 uppercase">{selectedFile?.name}</span>
                                </div>
                            ) : (
                                <div className="text-center group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-12 h-12 text-black/20 mx-auto mb-4" />
                                    <span className="font-black uppercase text-sm">DROP ASSET HERE</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={!title || !description || !selectedFile || isCreating}
                        className="w-full neo-button bg-black text-white h-20 text-2xl uppercase mt-4 disabled:opacity-30 disabled:shadow-none"
                    >
                        {isCreating ? (
                            <Loader2 className="w-8 h-8 animate-spin mx-auto" strokeWidth={4} />
                        ) : (
                            "LAUNCH SESSION ⚡"
                        )}
                    </button>
                </div>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* Sessions List */}
      <div className="max-w-7xl mx-auto pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-20 h-20 animate-spin mb-6 text-black" strokeWidth={4} />
            <p className="font-black uppercase text-xl italic animate-pulse">Scanning frequencies...</p>
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="group bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 relative overflow-hidden"
              >
                  {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className={`px-4 py-2 border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_black] ${
                    session.difficulty === 'Hard' ? 'bg-red-500 text-white' :
                    session.difficulty === 'Medium' ? 'bg-primary text-black' :
                    'bg-secondary text-white'
                    }`}>
                    {session.difficulty}
                    </span>
                </div>

                <div className="h-56 border-b-8 border-black bg-slate-100 overflow-hidden relative">
                    {session.file ? (
                        <img
                            src={session.file}
                            alt={session.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-info p-10">
                            <Target className="w-24 h-24 text-black opacity-10" />
                        </div>
                    )}
                </div>

                <div className="p-8">
                  <h3 className="text-3xl font-black text-black uppercase leading-none mb-4 group-hover:bg-primary group-hover:inline-block">
                    {session.title}
                  </h3>
                  
                  <p className="text-xs font-bold text-black opacity-70 uppercase mb-8 line-clamp-3 leading-tight min-h-[3rem]">
                    {session.description}
                  </p>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 border-4 border-black p-4 bg-[#f8f8f8] shadow-[4px_4px_0px_0px_black]">
                      <Calendar className="w-6 h-6 text-black" strokeWidth={3} />
                      <span className="text-sm font-black uppercase">
                        {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 border-4 border-black p-4 bg-[#f8f8f8] shadow-[4px_4px_0px_0px_black]">
                      <Clock className="w-6 h-6 text-black" strokeWidth={3} />
                      <span className="text-sm font-black uppercase">
                        {new Date(session.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/classroom/${classroomId}?set=exam&examid=${session.id}`)}
                    className="w-full neo-button bg-black text-white h-16 text-lg uppercase"
                  >
                    ENTER ROOM 🚪
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-8 border-dashed border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-primary border-4 border-black w-32 h-32 flex items-center justify-center mx-auto mb-10 shadow-[8px_8px_0px_0px_black] rotate-[5deg]">
              <Target className="w-16 h-16 text-black" strokeWidth={3} />
            </div>
            <h2 className="text-5xl font-black text-black uppercase mb-6 leading-none">NO DATA FOUND</h2>
            <p className="text-black font-bold uppercase max-w-lg mx-auto mb-12 border-y-4 border-black py-4">
              System scan reveals zero scheduled assessment modules. Initialise a new session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSessions;
