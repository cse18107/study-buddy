'use client';
import CreateClassroomModal from "@/components/CreateClassroomModal";
import ModernCard from "@/components/ModernCard";
import { EditIcon, Trash2 } from "lucide-react";
import {useRouter} from "next/navigation";
import React from "react";

export default function Home() {

  const [classrooms, setClassrooms] = React.useState<any[]>([
    // 1. The original example card (Product focus)
    {
      imageSrc: "./demo-classroom.jpg",
      name: "Quantum Catalyst",
      description:
        "This enhanced card features modern typography, deep gradients, and full-bleed image integration for a top-tier UI experience.",
    },
    {
      imageSrc: "./demo-classroom.jpg",
      name: "Quantum Catalyst",
      description:
        "This enhanced card features modern typography, deep gradients, and full-bleed image integration for a top-tier UI experience.",
    },

    // 2. A card demonstrating the use of default 'onDelete' handler
    {
      imageSrc: "./demo-2-classroom.jpg",
      name: "Code Repository v3",
      description:
        "A comprehensive backend solution providing seamless data integration and robust API endpoints. Optimized for modern cloud architecture.",
    },

    // 3. A card focused on conceptual art/design (minimalist menu)
    {
      imageSrc: "./demo-classroom.jpg",
      name: "Aesthetic Study 001",
      description:
        "Exploring the interaction between color theory and digital medium density. A deep dive into modern visual communication.",
    },

    // 4. A card with a long description to test line clamping
    {
      imageSrc:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTMzMzV8MHwxfGFsbHw1fHx8fHx8fHwxNzE4OTgyMTY1&ixlib=rb-4.0.3&q=80&w=1080",
      name: "Advanced AI Model",
      description:
        "This model utilizes cutting-edge transformer architecture trained on billions of parameters, specializing in natural language generation and contextual understanding. The complexity of its neural network allows for truly human-like conversation and creative output generation across various domains and languages. This is a crucial element for future interactions. The description is intentionally long to ensure line clamping functions correctly in the UI.",
    },

    // 5. A futuristic project card
    {
      imageSrc:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTMzMzV8MHwxfGFsbHw1fHx8fHx8fHwxNzE4OTgyMTY1&ixlib=rb-4.0.3&q=80&w=1080",
      name: "Nebula Protocol",
      description:
        "A decentralized communication protocol built on blockchain technology, ensuring privacy and end-to-end encryption for all users globally.",
    },
  ]);
    const router = useRouter();

  return (
    <div className="min-h-screen bg-black px-4 pt-20 md:px-10 lg:px-20">
      {/* Top Banner */}
      <div className="w-full h-40 md:h-60 lg:h-72 mb-10 bg-[#252525] rounded-sm"></div>

      {/* Heading */}
      <div className="mb-5 text-white font-inter text-xl md:text-2xl">
        Classrooms
      </div>

      {/* Grid */}
      <div
        className="
          grid 
          pb-5
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5 
          xl:grid-cols-6 
          gap-4
        "
      >
        {/* Add Classroom Button */}

        <CreateClassroomModal />

        {/* Sample Cards (repeatable) */}
        {classrooms.map((item, id) => (
          <div
            key={id}
            onClick={() => {
              router.push(`/classroom/${id}?set=learn`);
            }}
          >
            <ModernCard
              imageSrc={item.imageSrc} // Replace with real image
              name={item.name}
              description={item.description}
              onDelete={() => console.log("Item deleted!")} // Handle delete
              // Optional: Add more menu items
              menuItems={[
                {
                  label: "Edit",
                  icon: <EditIcon />,
                  onClick: () => alert("Edit!"),
                },
                {
                  label: "Delete",
                  icon: <Trash2 />,
                  onClick: () => alert("Delete!"),
                },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
