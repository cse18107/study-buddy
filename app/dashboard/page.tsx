'use client';
import CreateClassroomModal from "@/components/CreateClassroomModal";
import ModernCard from "@/components/ModernCard";
import { TrendingUp } from "lucide-react";
import {useRouter} from "next/navigation";
import React from "react";

export default function Dashboard() {

  const [classrooms, setClassrooms] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchClassrooms = async () => {
      const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWlrYXRAZ21haWwuY29tIiwiZXhwIjoxNzY4NDA2MzIxfQ.OouPKm2Af39HiYdUF0LOz0GtKw_XT-tLAqSWMcN2Li8";
      
      try {
        const response = await fetch("http://127.0.0.1:8000/api/classrooms", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          const mappedData = Array.isArray(data) ? data.map((item: any) => ({
            imageSrc: item.image_file ? `http://localhost:8000${item.image_file}` : "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1080&q=80",
            name: item.classroomName || "Untitled Classroom",
            description: item.description || item.subject || "No description available.",
            id: item.classroom_id || item.id 
          })) : [];

          setClassrooms(mappedData);
        }
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };

    fetchClassrooms();
  }, []);
    const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FDFDFD] px-4 pt-10 md:px-10 lg:px-20 pb-20 relative overflow-hidden font-body">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] z-0"></div>

      {/* Header Banner */}
      <div className="w-full mb-16 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] bg-primary p-8 md:p-12 relative rotate-[-1deg] hover:rotate-0 transition-transform duration-300 z-10">
        <div className="absolute top-4 right-4 animate-shake">
            <TrendingUp className="w-12 h-12 md:w-20 md:h-20 text-black fill-white" />
        </div>
        
        <div className="flex flex-col items-start justify-center text-black">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black font-heading leading-none drop-shadow-[-2px_2px_0px_white]">
              DASHBOARD
            </h1>
          </div>
          <div className="bg-black text-white px-6 py-2 text-xl md:text-3xl font-black uppercase mb-4 translate-x-4">
            WELCOME BACK 👋
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10 relative">
        <div className="flex flex-col gap-2">
          <span className="text-secondary font-black text-xl md:text-2xl uppercase tracking-[0.2em]">Study Progress</span>
          <div className="flex items-center gap-4">
            <h2 className="text-4xl md:text-6xl font-black text-black font-heading uppercase">
              CLASSROOMS
            </h2>
            <div className="w-16 h-16 border-4 border-black bg-white flex items-center justify-center text-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {classrooms.length}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Classrooms */}
      <div className="grid pb-20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 relative z-10">
        <CreateClassroomModal />
        {classrooms.map((item, id) => (
          <div
            key={id}
            onClick={() => {
              router.push(`/classroom/${item.id}?set=learn`);
            }}
            className="hover:scale-105 transition-transform"
          >
            <ModernCard
              imageSrc={item.imageSrc}
              name={item.name}
              description={item.description}
            />
          </div>
        ))}
      </div>

      {/* Bottom Ticker */}
      <div className="fixed bottom-0 left-0 w-full h-8 bg-black z-50 flex items-center overflow-hidden whitespace-nowrap text-white font-black text-xs uppercase">
          <div className="animate-[shimmer_20s_linear_infinite] px-4 flex gap-10">
              <p>STUDY BUDDY AI IS ACTIVE // MASTER YOUR SUBJECTS // TRACK YOUR PROGRESS // LEARN FASTER</p>
              <p>STUDY BUDDY AI IS ACTIVE // MASTER YOUR SUBJECTS // TRACK YOUR PROGRESS // LEARN FASTER</p>
          </div>
      </div>
    </div>
  );
}
