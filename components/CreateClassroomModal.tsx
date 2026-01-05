import React, {useState, useRef, useCallback} from "react";
import {Upload, FileText, BookOpen, Layers, Plus, File, X} from "lucide-react";
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
      fileInputRef.current.value = ""; 
    }
  };

  return (
    <div className="grid gap-2">
      <Label className="text-black font-black uppercase flex items-center gap-2 text-xs">
        {icon}
        {label}
      </Label>

      <div
        className={`
          relative w-full min-h-[120px] rounded-none border-4 border-black p-4 cursor-pointer
          transition-all duration-100
          ${
            isDragging
              ? "bg-secondary scale-[1.02]"
              : "bg-white hover:bg-primary/10"
          }
           shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
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
          <div className="flex items-center justify-between text-black bg-primary/20 p-3 border-2 border-black">
            <div className="flex items-center gap-3 truncate">
              <File className="w-5 h-5 flex-shrink-0" />
              <span className="truncate font-black text-xs uppercase">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1 bg-black text-white hover:bg-red-600 border-none transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <Upload className="w-8 h-8 text-black mb-2" />
            <p className="text-xs text-black font-black uppercase">
              DROP IT HERE OR <span className="underline">CLICK</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

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

  const setCoverImage = (file: File | null) => {
    setFormData((prev) => ({...prev, coverImage: file}));
  };

  const setDocument = (file: File | null) => {
    setFormData((prev) => ({...prev, document: file}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiFormData = new FormData();
    apiFormData.append("classroomName", formData.name);
    apiFormData.append("subject", formData.subject);
    
    if (formData.document) {
      apiFormData.append("pdf_file", formData.document);
    }
    if (formData.coverImage) {
      apiFormData.append("image_file", formData.coverImage);
    }

    const token = localStorage.getItem("token");
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

      setIsOpen(false);
      setFormData({
        name: "",
        subject: "",
        description: "",
        coverImage: null,
        document: null,
      });

    } catch (error) {
      console.error("Error creating classroom:", error);
      alert("Failed to create classroom.");
    }
  };

  const inputClasses =
    "bg-white border-4 border-black text-black placeholder:text-black/30 focus:bg-primary/10 rounded-none h-14 font-black uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="
          bg-secondary
          h-[400px]
          border-4 border-black
          text-black 
          flex flex-col items-center justify-center gap-6
          rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px]
          transition-all duration-100
          cursor-pointer
          group
          relative
          overflow-hidden
        ">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-20 h-20 border-4 border-black bg-white flex items-center justify-center group-hover:rotate-12 transition-transform duration-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Plus className="w-10 h-10 text-black" strokeWidth={4} />
            </div>
            <div className="text-center">
                <span className="text-3xl font-black font-heading uppercase block leading-none">NEW<br/>DECK</span>
                <span className="text-[10px] font-black uppercase mt-2 bg-black text-white px-2 py-0.5 inline-block">Tap to drop</span>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent
        className="
          sm:max-w-[550px] 
          bg-white border-8 border-black
          text-black
          shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]
          rounded-none
          p-8
        "
      >
        <DialogHeader>
          <DialogTitle className="text-4xl font-black text-black font-heading uppercase leading-none">
            INITIALIZE DECK
          </DialogTitle>
          <DialogDescription className="text-black font-bold uppercase text-xs mt-2 border-l-4 border-primary pl-3">
             Configure your learning module. All systems operational.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-8 py-6">
          <div className="grid gap-3">
            <Label htmlFor="name" className="text-black font-black uppercase text-xs flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> DECK NAME
            </Label>
            <Input
              id="name"
              placeholder="E.G. QUANTUM VIBES 101"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="subject" className="text-black font-black uppercase text-xs flex items-center gap-2">
              <Layers className="w-4 h-4" /> SUBJECT TAG
            </Label>
            <Input
              id="subject"
              placeholder="E.G. BRAIN ROT / SCIENCE"
              value={formData.subject}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          <DragDropFileInput
            label="COVER ASSET"
            icon={<Upload className="w-4 h-4" />}
            accept="image/*"
            file={formData.coverImage}
            setFile={setCoverImage}
          />

          <DragDropFileInput
            label="KNOWLEDGE SOURCE (PDF)"
            icon={<FileText className="w-4 h-4" />}
            accept=".pdf,.doc,.docx"
            file={formData.document}
            setFile={setDocument}
          />

          <DialogFooter className="mt-6">
            <button
              type="submit"
              className="w-full neo-button bg-primary hover:bg-orange-500 text-black h-16 uppercase"
            >
              LAUNCH DECK 🚀
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassroomModal;