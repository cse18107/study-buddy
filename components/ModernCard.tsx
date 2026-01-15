import React from "react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Calendar, BookOpen } from "lucide-react";

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  isDestructive?: boolean;
}

interface ModernCardProps {
  imageSrc?: string; // Optional now, won't be used
  name: string;
  description: string;
  onDelete?: () => void;
  menuItems?: MenuItem[];
  subject?: string;
}

const ModernCard: React.FC<ModernCardProps> = ({
  name,
  description,
  onDelete,
  menuItems = [],
  subject,
}) => {
  const defaultMenuItems: MenuItem[] = [
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onDelete?.();
      },
      isDestructive: true,
    },
  ];

  const items =
    menuItems.length > 0 ? menuItems : onDelete ? defaultMenuItems : [];

  // Get minimalist accent color based on subject
  const getAccentColor = () => {
    const subjectLower = subject?.toLowerCase() || '';
    
    if (subjectLower.includes('math') || subjectLower.includes('calculus') || subjectLower.includes('algebra')) {
      return { main: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
    } else if (subjectLower.includes('science') || subjectLower.includes('physics') || subjectLower.includes('chemistry')) {
      return { main: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
    } else if (subjectLower.includes('english') || subjectLower.includes('literature') || subjectLower.includes('language')) {
      return { main: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' };
    } else if (subjectLower.includes('history') || subjectLower.includes('social')) {
      return { main: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' };
    } else if (subjectLower.includes('art') || subjectLower.includes('music')) {
      return { main: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' };
    } else if (subjectLower.includes('computer') || subjectLower.includes('tech') || subjectLower.includes('coding')) {
      return { main: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' };
    } else {
      return { main: 'bg-slate-500', light: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
    }
  };

  const accentColor = getAccentColor();

  return (
    <Card
      className="
        group relative w-full h-[280px] 
        rounded-2xl overflow-hidden 
        border border-neutral-200/60
        bg-white
        shadow-sm hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-1
      "
    >
      {/* Minimalist Top Accent Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentColor.main}`} />

      {/* Content Container */}
      <div className="relative h-full flex flex-col p-6">
        
        {/* Top Header */}
        <div className="flex justify-between items-start mb-6">
          {subject && (
            <span className={`
              px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide
              ${accentColor.light} ${accentColor.text}
            `}>
              {subject}
            </span>
          )}
          
          <div className={`ml-auto ${!subject ? '' : ''}`}>
             {items.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="
                    p-2 rounded-lg
                    text-neutral-400 hover:text-neutral-600
                    hover:bg-neutral-100
                    transition-all
                  ">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 bg-white border-neutral-200">
                  {items.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={item.onClick}
                      className={`
                        cursor-pointer gap-2.5 p-2.5 rounded-lg
                        ${item.isDestructive ? 'text-red-600 focus:bg-red-50' : 'text-slate-700 focus:bg-slate-100'}
                      `}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col justify-center space-y-3">
          <h3 className="text-xl font-bold text-neutral-900 leading-tight tracking-tight">
            {name}
          </h3>
          <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="
          flex items-center gap-3 pt-4 border-t border-neutral-100
          opacity-60 group-hover:opacity-100 transition-opacity duration-300
        ">
          <button className={`flex items-center gap-1.5 text-xs font-medium ${accentColor.text} hover:underline transition-all`}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open</span>
          </button>
          <div className="w-px h-3 bg-neutral-200" />
          <button className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-all">
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ModernCard;
