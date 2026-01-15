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
import { Plus, Image as ImageIcon, Target, Calendar, Clock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getApiUrl } from '@/lib/api-config';

interface Question {
  assignedMarks: number;
  givenMarks: number;
}

interface ExamSession {
  id: string;
  title: string;
  description: string;
  file: string;
  classroom_id: string;
  difficulty: string;
  date: string;
  status: string;
  userMarks: number;
  totalMarks: number;
}

const ExamSessions: React.FC<{ classroomDetails: any }> = ({ classroomDetails }) => {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [open, setOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 19));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  const token = typeof window !== 'undefined' ? (localStorage.getItem("access_token") || "") : "";
  const classroomId = classroomDetails?.id || "7186c7de-0276-4c8c-a1b9-59b249019c29";

  const fetchExams = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(`/api/exams/classroom/${classroomId}`), {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        console.error("Failed to fetch exam sessions");
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
      // Using the first document ID from classroomDetails if available, else a placeholder
      const documentId = classroomDetails?.sources?.[0]?.document || "";
      formData.append("documentId", documentId);
      formData.append("difficulty", difficulty);
      formData.append("date", date);
      formData.append("file", selectedFile);

      const response = await fetch(getApiUrl("/api/exams/create"), {
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
        // Reset form
        setTitle("");
        setDescription("");
        setDifficulty("Medium");
        setSelectedFile(null);
        setImagePreview(null);
      } else {
        console.error("Failed to create exam session");
      }
    } catch (error) {
      console.error("Error creating exam session:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Gradient Bar */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 h-1.5 shadow-sm" />

      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-200/60 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              Exam Sessions
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and monitor your classroom examinations</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl h-12 px-8 font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="w-5 h-5 mr-2 stroke-[3]" />
                Create Exam
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-3xl max-w-xl bg-white border-0 shadow-2xl p-0 overflow-hidden">
              <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-400" />
                  New Exam Session
                </DialogTitle>
                <p className="text-slate-400 text-sm mt-1">Configure the details for your upcoming exam</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Exam Title</label>
                  <Input
                    placeholder="Enter exam title (e.g., Mid-Term Physics)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl border-slate-200 h-11 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
                  <Textarea
                    placeholder="Provide a brief overview of the exam content..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Difficulty</label>
                    <select 
                      value={difficulty} 
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 h-11 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Scheduled Date</label>
                    <Input
                      type="datetime-local"
                      value={date.slice(0, 16)}
                      onChange={(e) => setDate(e.target.value + ":00")}
                      className="rounded-xl border-slate-200 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Banner Image</label>
                  <label className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group overflow-hidden relative min-h-[120px]">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                        <div className="relative z-10 flex flex-col items-center">
                          <ImageIcon className="w-8 h-8 text-blue-600 mb-1" />
                          <span className="text-sm font-semibold text-blue-700">Image selected</span>
                          <span className="text-xs text-slate-500">{selectedFile?.name}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-slate-50 rounded-full group-hover:bg-blue-100 transition-colors">
                          <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-semibold text-slate-700">Upload Banner Image</span>
                          <p className="text-xs text-slate-500 mt-0.5">Recommended: 1200x600px (JPG, PNG)</p>
                        </div>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={!title || !description || !selectedFile || isCreating}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl h-12 font-bold shadow-lg shadow-blue-100 transition-all mt-4"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Session...
                    </>
                  ) : (
                    "Initialize Exam Session"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sessions List */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-500" />
              <p className="font-medium">Fetching exam schedules...</p>
            </div>
          ) : sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="group bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        session.difficulty === 'Hard' ? 'bg-red-500/10 text-red-600 border-red-200' :
                        session.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-200' :
                        'bg-emerald-500/10 text-emerald-600 border-emerald-200'
                      }`}>
                        {session.difficulty}
                      </span>
                    </div>
                    {session.file ? (
                      <img
                        src={session.file}
                        alt={session.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                        <Target className="w-12 h-12 text-blue-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-7">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {session.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed h-10">
                      {session.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-semibold">
                          {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                    <div className="mb-6">
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
                              {session?.userMarks}
                            </span>
                            <span className="text-sm font-medium text-emerald-500">
                              / {session?.totalMarks}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                      <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-semibold">
                          {new Date(session.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => router.push(`/classroom/${classroomId}?set=exam&examid=${session.id}`)}
                      className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl h-12 font-bold transition-all shadow-lg active:scale-95"
                    >
                      Enter Examination Room
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No Exam Sessions Found</h2>
              <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
                There are no exams scheduled for this classroom yet. Click the button above to create one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamSessions;
