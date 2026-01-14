


import React, {useState, useRef, useCallback} from "react";
import {Upload, FileText, BookOpen, Layers, Plus, File, X} from "lucide-react";
// Shadcn UI Imports (assuming they are correctly path-aliased)
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
// import {Textarea} from "@/components/ui/textarea";

// --- Type Definitions ---
interface ClassroomFormData {
  name: string;
  subject: string;
  description: string;
  coverImage: File | null;
  document: File | null;
}

interface DragDropFileInputProps {
  label: string;
  icon: React.ReactNode;
  accept: string;
  file: File | null;
  setFile: (file: File | null) => void;
}

// Custom Drag and Drop File Input Component
const DragDropFileInput: React.FC<DragDropFileInputProps> = ({
  label,
  icon,
  accept,
  file,
  setFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFile(e.dataTransfer.files[0]);
      }
    },
    [setFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <div className="grid gap-2">
      {/* Label */}
      <Label className="text-slate-700 font-medium flex items-center gap-2">
        <div className="text-purple-500">{icon}</div>
        {label}
      </Label>

      <div
        className={`
          relative w-full min-h-[100px] rounded-xl border-2 border-dashed p-4 cursor-pointer
          transition-all duration-300
          ${
            isDragging
              ? "border-purple-500 bg-purple-50 scale-105"
              : "border-slate-300 hover:border-purple-400 hover:bg-purple-50/50 bg-white"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {file ? (
          // File Selected View
          <div className="flex items-center justify-between text-slate-700 bg-slate-100 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3 truncate">
              <File className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{file.name}</span>
            </div>
            <Button
              type="button"
              onClick={handleRemoveFile}
              className="p-1 h-auto bg-transparent hover:bg-red-50 text-slate-500 hover:text-red-600 border-none rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          // Default Drag/Click Prompt
          <div className="flex flex-col items-center justify-center text-center h-full">
            <Upload className="w-6 h-6 text-purple-500 mb-2" />
            <p className="text-sm text-slate-700 font-medium">
              Drag & drop file here, or{" "}
              <span className="underline">click to select</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {accept.includes("image")
                ? "Accepted: Images (.jpg, .png, .gif)"
                : "Accepted: Documents (.pdf, .docx, etc.)"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Modal Component ---

const CreateClassroomModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ClassroomFormData>({
    name: "",
    subject: "",
    description: "",
    coverImage: null,
    document: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {id, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handlers for updating file state using the custom input
  const setCoverImage = (file: File | null) => {
    setFormData((prev) => ({...prev, coverImage: file}));
  };

  const setDocument = (file: File | null) => {
    setFormData((prev) => ({...prev, document: file}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting New Classroom:", formData);

    const apiFormData = new FormData();
    apiFormData.append("classroomName", formData.name);
    apiFormData.append("subject", formData.subject);
    
    // Note: description is currently not supported by the API
    // apiFormData.append("description", formData.description);

    if (formData.document) {
      apiFormData.append("pdf_file", formData.document);
    }
    if (formData.coverImage) {
      apiFormData.append("image_file", formData.coverImage);
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Authentication token not found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/classrooms/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "accept": "application/json",
        },
        body: apiFormData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      alert(`Classroom "${formData.name}" successfully created!`);
      setIsOpen(false);
      
      // Reset form
      setFormData({
        name: "",
        subject: "",
        description: "",
        coverImage: null,
        document: null,
      });

    } catch (error) {
      console.error("Error creating classroom:", error);
      alert("Failed to create classroom. Please try again.");
    }
  };

  // --- Utility Class Definitions ---
  const inputClasses =
    "bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl transition-all";
  const iconClasses = "w-4 h-4 text-purple-500";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-black text-white hover:bg-neutral-800 transition-colors h-11 px-6 rounded-xl font-medium flex items-center gap-2 group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>New Classroom</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          sm:max-w-[500px] 
          bg-white border border-slate-200
          text-slate-900
          shadow-2xl
          rounded-3xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 font-heading">
            Create New Classroom
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Fill in the details below to initialize a new learning environment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* 1. Name of Classroom */}
          <div className="grid gap-2">
            <Label
              htmlFor="name"
              className="text-black flex items-center gap-2"
            >
              <BookOpen className={iconClasses} /> Name of Classroom
            </Label>
            <Input
              id="name"
              placeholder="e.g., Advanced Quantum Physics 101"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          {/* 2. Subject */}
          <div className="grid gap-2">
            <Label
              htmlFor="subject"
              className="text-black flex items-center gap-2"
            >
              <Layers className={iconClasses} /> Subject
            </Label>
            <Input
              id="subject"
              placeholder="e.g., Science / Mathematics"
              value={formData.subject}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          {/* 3. Description (Commented out as per API requirements) */}
          {/* <div className="grid gap-2">
            <Label htmlFor="description" className="text-black">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed overview of the classroom content and goals."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className={inputClasses}
            />
          </div> */}

          {/* 4. Cover Image (Drag & Drop) */}
          <DragDropFileInput
            label="Cover Image"
            icon={<Upload className={iconClasses} />}
            accept="image/*"
            file={formData.coverImage}
            setFile={setCoverImage}
          />

          {/* 5. Document (Drag & Drop) */}
          <DragDropFileInput
            label="Initial Document (Syllabus, etc.)"
            icon={<FileText className={iconClasses} />}
            accept=".pdf,.doc,.docx,.txt"
            file={formData.document}
            setFile={setDocument}
          />

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:shadow-xl hover:scale-[1.02] text-white text-lg font-semibold font-heading h-12 rounded-xl transition-all duration-300"
            >
              Create Classroom
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassroomModal;