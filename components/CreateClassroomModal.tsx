


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
import {Textarea} from "@/components/ui/textarea";

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
      {/* Label (using the accent color) */}
      <Label className="text-[#eeffab] flex items-center gap-2">
        {icon} {label}
      </Label>

      <div
        className={`
          relative w-full min-h-[100px] rounded-lg border-2 border-dashed p-4 cursor-pointer
          transition-colors duration-200
          ${
            isDragging
              ? "border-[#eeffab] bg-[#252525]"
              : "border-[#252525] hover:border-[#eeffab]/50 bg-black"
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
          <div className="flex items-center justify-between text-[#eeffab] bg-[#252525] p-3 rounded-md">
            <div className="flex items-center gap-3 truncate">
              <File className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{file.name}</span>
            </div>
            <Button
              type="button"
              onClick={handleRemoveFile}
              className="p-1 h-auto bg-transparent hover:bg-black/50 text-[#eeffab] border-none"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          // Default Drag/Click Prompt
          <div className="flex flex-col items-center justify-center text-center h-full">
            <Upload className="w-6 h-6 text-[#eeffab] mb-2" />
            <p className="text-sm text-[#eeffab] opacity-90 font-medium">
              Drag & drop file here, or{" "}
              <span className="underline">click to select</span>
            </p>
            <p className="text-xs text-[#eeffab] opacity-50 mt-1">
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting New Classroom:", formData);

    // Simulate API call success
    setTimeout(() => {
      alert(`Classroom "${formData.name}" successfully created!`);
      setIsOpen(false);
    }, 500);
  };

  // --- Utility Class Definitions ---
  const inputClasses =
    "bg-[#252525] border-2 border-black text-[#eeffab] placeholder-[#eeffab] placeholder-opacity-50 focus:border-[#eeffab] focus:ring-1 focus:ring-[#eeffab]";
  const iconClasses = "w-4 h-4 text-[#eeffab]";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Trigger Button */}
        <Button className="bg-[#eeffab] h-full hover:bg-[#eeffab] hover:opacity-90 text-black font-semibold flex items-center gap-2 rounded-lg shadow-lg transition-all duration-300">
          <Plus className="w-5 h-5 text-black" />
          Create New Classroom
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          sm:max-w-[500px] 
          bg-black border border-[#252525] text-[#eeffab] 
          shadow-[0_20px_50px_rgba(238,255,171,0.15)] 
          rounded-2xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#eeffab]">
            Create New Classroom
          </DialogTitle>
          <DialogDescription className="text-[#eeffab] opacity-70">
            Fill in the details below to initialize a new learning environment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* 1. Name of Classroom */}
          <div className="grid gap-2">
            <Label
              htmlFor="name"
              className="text-[#eeffab] flex items-center gap-2"
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
              className="text-[#eeffab] flex items-center gap-2"
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

          {/* 3. Description */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-[#eeffab]">
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
          </div>

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
              className="w-full bg-[#eeffab] hover:bg-[#eeffab] hover:opacity-90 text-black text-lg font-semibold h-12 transition-all duration-300"
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