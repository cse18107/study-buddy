'use client';
import CreateClassroomModal from "@/components/CreateClassroomModal";
import ModernCard from "@/components/ModernCard";
import { EditIcon, Trash2, BookOpen, Sparkles } from "lucide-react";
import {useRouter} from "next/navigation";
import React from "react";

export default function Home() {

  const [classrooms, setClassrooms] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchClassrooms = async () => {
      // Use token from localStorage if available, otherwise use the one from the provided curl (as fallback/demo)
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
          console.log("Fetched Classrooms:", data);
          
          // Map API data to UI structure
          // Assuming API returns an array of objects with keys like 'classroomName', 'image_file', etc.
          // adapting based on previous creation logic
          const mappedData = Array.isArray(data) ? data.map((item: any) => ({
            imageSrc: item.image_file ? `http://localhost:8000${item.image_file}` : "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1080&q=80", // Fallback or direct URL
            name: item.classroomName || "Untitled Classroom",
            description: item.description || item.subject || "No description available.",
            // Store ID for navigation
            id: item.classroom_id || item.id 
          })) : [];

          setClassrooms(mappedData);
        } else {
          console.error("Failed to fetch classrooms:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };

    fetchClassrooms();
  }, []);
    const router = useRouter();

  return (
    <div className="min-h-screen bg-background px-4 pt-8 md:px-10 lg:px-20 pb-12">
      {/* Hero Banner with Gradient */}
      <div className="w-full h-48 md:h-64 lg:h-80 mb-12 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-3xl shadow-xl overflow-hidden relative animate-slide-up">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-white px-6 text-center">
          <div className="flex items-center gap-3 mb-4 animate-bounce-in">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading">
              Study Buddy
            </h1>
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-medium opacity-95 max-w-3xl">
            Learn Smarter, Together 🚀
          </p>
          <p className="text-sm md:text-base mt-2 opacity-80 max-w-2xl">
            AI-powered learning platform with interactive quizzes, progress tracking, and personalized feedback
          </p>
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-primary rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-heading">
            Your Classrooms
          </h2>
          <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
            {classrooms.length}
          </div>
        </div>
        <BookOpen className="w-6 h-6 text-purple-500 icon-interactive hidden md:block" />
      </div>

      {/* Grid */}
      <div
        className="
          grid 
          pb-5
          grid-cols-1
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          xl:grid-cols-5 
          2xl:grid-cols-6
          gap-6
          animate-slide-up
        "
      >
        {/* Add Classroom Button */}
        <CreateClassroomModal />

        {/* Classroom Cards */}
        {classrooms.map((item, id) => (
          <div
            key={id}
            onClick={() => {
              router.push(`/classroom/${item.id}?set=learn`);
            }}
            className="animate-bounce-in"
            style={{ animationDelay: `${id * 50}ms` }}
          >
            <ModernCard
              imageSrc={item.imageSrc}
              name={item.name}
              description={item.description}
              onDelete={() => console.log("Item deleted!")}
              menuItems={[
                {
                  label: "Edit",
                  icon: <EditIcon className="w-4 h-4" />,
                  onClick: () => alert("Edit classroom"),
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="w-4 h-4" />,
                  onClick: () => alert("Delete classroom"),
                  isDestructive: true,
                },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
