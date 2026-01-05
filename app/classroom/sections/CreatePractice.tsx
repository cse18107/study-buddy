import React, { useState, useEffect } from "react";
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
import { Plus, Image as ImageIcon, Target, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PracticeSession {
  id: string;
  name: string;
  description: string;
  image?: string;
}

const PracticeSessions: React.FC<{ classroomDetails: any }> = ({ classroomDetails }) => {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchPracticeSessions = async () => {
      const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWlrYXRAZ21haWwuY29tIiwiZXhwIjoxNzY3OTIzODg3fQ.MrcP0skIR3MSfg4N2UTYKp60BwXxQoqILme9oDGWguU";
      const classroomId = classroomDetails?.id || "7186c7de-0276-4c8c-a1b9-59b249019c29";

      try {
        const response = await fetch(`http://localhost:8000/api/practices/classroom/${classroomId}`, {
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
            image: item.file
          }));
          setSessions(mappedData);
        }
      } catch (error) {
        console.error("Error fetching practice sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeSessions();
  }, [classroomDetails]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    const newSession: PracticeSession = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name,
      description,
      image,
    };

    setSessions([newSession, ...sessions]);
    setName("");
    setDescription("");
    setImage(undefined);
    setOpen(false);
  };

  const inputClasses = "bg-white border-4 border-black text-black placeholder:text-black/30 h-14 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] outline-none px-4 w-full";

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 md:p-12">
      {/* Header */}
      <div className="border-8 border-black bg-white p-8 mb-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden rotate-[0.5deg]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary border-l-8 border-b-8 border-black"></div>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
                <span className="text-secondary font-black uppercase text-2xl tracking-widest">Training Ground</span>
                <h1 className="text-5xl md:text-8xl font-black text-black font-heading uppercase leading-none mt-2">
                    PRACTICE
                </h1>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button className="neo-button bg-info text-black h-20 md:w-64 flex items-center justify-center gap-4 text-2xl uppercase">
                        <Plus className="w-8 h-8" strokeWidth={4} />
                        NEW DRILL
                    </button>
                </DialogTrigger>

                <DialogContent className="rounded-none border-8 border-black max-w-2xl bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden">
                    <div className="p-8 bg-black text-white flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-4xl font-black uppercase mb-2">CREATE DRILL</DialogTitle>
                            <p className="text-info text-xs font-bold uppercase italic">Initialise training parameters</p>
                        </div>
                        <Target className="w-12 h-12 text-info" />
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase">DRILL CODENAME</label>
                            <input
                                placeholder="E.G. NEURAL REWIRING 101"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClasses}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase">OBJECTIVES</label>
                            <textarea
                                placeholder="Define drill objectives..."
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={inputClasses + " py-4 h-auto resize-none"}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase">COVER ASSET</label>
                            <label className="flex items-center gap-4 p-8 border-4 border-dashed border-black bg-slate-50 cursor-pointer hover:bg-info/10 transition-all group relative">
                                <ImageIcon className="w-8 h-8 text-black" strokeWidth={3} />
                                <span className="font-black uppercase text-sm">
                                    {image ? "ASSET DETECTED" : "UPLOAD IMAGE"}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                                />
                            </label>
                        </div>

                        <button
                            onClick={handleCreate}
                            disabled={!name || !description}
                            className="w-full neo-button bg-black text-white h-20 text-2xl uppercase mt-4 disabled:opacity-30 disabled:shadow-none"
                        >
                            COMMIT DRILL ⚡
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
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {sessions.map((session) => (
                <div
                    key={session.id}
                    className="group bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all relative overflow-hidden"
                >
                {session.image ? (
                    <div className="h-48 border-b-8 border-black">
                        <img
                        src={session.image}
                        alt={session.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                ) : (
                    <div className="h-48 bg-primary border-b-8 border-black flex items-center justify-center p-10">
                        <Target className="w-24 h-24 text-black opacity-10" />
                    </div>
                )}

                <div className="p-8">
                    <h3 className="text-3xl font-black text-black uppercase leading-none mb-4 group-hover:bg-info group-hover:inline-block">
                        {session.name}
                    </h3>
                    <p className="text-xs font-bold text-black opacity-70 uppercase mb-8 line-clamp-3 leading-tight min-h-[3rem]">
                        {session.description}
                    </p>

                    <button
                        onClick={() => router.push(`/classroom/${classroomDetails?.id || '1'}?set=practice&practiceid=${session.id}`)}
                        className="w-full neo-button bg-black text-white h-16 text-lg uppercase"
                    >
                        START DRILL ⚡
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="text-center py-40 border-8 border-dashed border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-info border-4 border-black w-32 h-32 flex items-center justify-center mx-auto mb-10 shadow-[8px_8px_0px_0px_black] rotate-[-5deg]">
              <Target className="w-16 h-16 text-black" strokeWidth={3} />
            </div>
            <h2 className="text-5xl font-black text-black uppercase mb-6 leading-none">ZER0 DRILLS</h2>
            <p className="text-black font-bold uppercase max-w-lg mx-auto mb-12 border-y-4 border-black py-4">
                No training modules detected in current sector. Initialise new protocol.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeSessions;
