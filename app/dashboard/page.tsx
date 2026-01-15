'use client';
import React, { useState, useEffect } from "react";
import CreateClassroomModal from "@/components/CreateClassroomModal";
import ModernCard from "@/components/ModernCard";
import { Search, Loader2, Sparkles, LayoutGrid, BookOpen, GraduationCap, Clock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { getApiUrl } from '@/lib/api-config';

interface Classroom {
  name: string;
  description: string;
  id: string;
  subject?: string;
}

export default function Dashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchClassrooms = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(getApiUrl('/api/classrooms'), {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "accept": "application/json"
            }
        });

        if (response.ok) {
          const data = await response.json();
          const mappedData = Array.isArray(data) ? data.map((item: any) => ({
            name: item.classroomName || "Untitled Classroom",
            description: item.description || item.subject || "Explore this learning space.",
            id: item.classroom_id || item.id || "",
            subject: item.subject || "General" 
          })) : [];
          setClassrooms(mappedData);
          setFilteredClassrooms(mappedData);
        }
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
        fetchClassrooms();
    }
  }, [user]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = classrooms.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.description.toLowerCase().includes(lowerQuery)
    );
    setFilteredClassrooms(filtered);
  }, [searchQuery, classrooms]);

  const firstName = user?.fullName?.split(' ')[0] || "Scholar";
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 text-neutral-900 font-sans">
        <div className="max-w-[1920px] mx-auto">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-neutral-200/50 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-700 text-white p-2.5 rounded-xl shadow-lg">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-tight">Dashboard</h1>
                        <p className="text-xs text-neutral-500 font-medium">{currentDate}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-600 transition-colors" />
                        <input 
                            placeholder="Search classrooms..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 transition-all outline-none placeholder:text-neutral-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <CreateClassroomModal />
                    <div className="h-6 w-px bg-neutral-200" />
                    <button 
                        onClick={logout}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Log out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-6 md:p-8 lg:p-12 space-y-10">
                {/* Welcome Hero - Minimalist Design */}
                <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl p-8 md:p-12 text-white shadow-xl border border-neutral-700/50">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-semibold text-neutral-200">
                             <Sparkles className="w-3.5 h-3.5" />
                             <span>Academic Year 2024-2025</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Ready to learn, <span className="text-blue-400">{firstName}</span>?
                        </h2>
                        <p className="text-base text-neutral-300 max-w-xl leading-relaxed">
                            You have <span className="text-white font-bold">{classrooms.length}</span> active classrooms. Jump back in and continue your progress.
                        </p>
                    </div>
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LayoutGrid className="w-5 h-5 text-neutral-400" />
                        <h3 className="text-xl font-bold text-neutral-900">My Classrooms</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold border border-neutral-200">
                            {filteredClassrooms.length}
                        </span>
                    </div>
                </div>

                {/* Grid Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                        <Loader2 className="w-10 h-10 animate-spin text-neutral-400 mb-4" />
                        <p className="text-neutral-500 font-medium tracking-wide text-sm uppercase">Loading Spaces...</p>
                    </div>
                ) : filteredClassrooms.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {filteredClassrooms.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => router.push(`/classroom/${item.id}?set=learn`)}
                                className="transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                            >
                                <ModernCard
                                    name={item.name}
                                    description={item.description}
                                    subject={item.subject}
                                    onDelete={() => console.log("Delete not implemented for now")}
                                    menuItems={[
                                        {
                                            label: "View Classroom",
                                            icon: <BookOpen className="w-4 h-4" />,
                                            onClick: (e) => {
                                                e.stopPropagation();
                                                router.push(`/classroom/${item.id}?set=learn`);
                                            }
                                        }
                                    ]}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px] bg-white/50">
                        <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6 border border-neutral-200">
                            <BookOpen className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h4 className="text-xl font-bold text-neutral-900 mb-2">No classrooms found</h4>
                        <p className="text-neutral-500 max-w-sm mb-8">
                            {searchQuery ? `No results matching "${searchQuery}"` : "Get started by creating your first classroom space."}
                        </p>
                        {!searchQuery && <div className="scale-110"><CreateClassroomModal /></div>}
                    </div>
                )}
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
