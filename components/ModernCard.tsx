import React from "react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Edit, Calendar, BookOpen } from "lucide-react";

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  isDestructive?: boolean;
}

interface ModernCardProps {
  imageSrc: string;
  name: string;
  description: string;
  onDelete?: () => void;
  menuItems?: MenuItem[];
  subject?: string;
}

const ModernCard: React.FC<ModernCardProps> = ({
  imageSrc,
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

  return (
    <Card
      className="
        group relative w-full h-[320px] 
        rounded-3xl overflow-hidden border-0 
        shadow-lg transition-all duration-500
        hover:shadow-2xl hover:-translate-y-2
        bg-white
      "
    >
      {/* Image Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
        
        {/* Top Header */}
        <div className="flex justify-between items-start">
          {subject && (
            <span className="
              px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
              bg-white/20 backdrop-blur-md text-white border border-white/10
            ">
              {subject}
            </span>
          )}
          
          <div className="ml-auto">
             {items.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="
                    p-2 rounded-full 
                    bg-black/20 hover:bg-white/20 \
                    backdrop-blur-md text-white 
                    transition-colors border border-white/10
                  ">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 bg-white/90 backdrop-blur-xl border-slate-200/50">
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

        {/* Bottom Content */}
        <div className="transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight font-heading shadow-sm">
            {name}
          </h3>
          <p className="text-slate-200 text-sm line-clamp-2 mb-4 opacity-90 font-medium">
            {description}
          </p>
          
          <div className="
            flex items-center gap-4 pt-4 border-t border-white/10
            opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100
          ">
            <button className="flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Open</span>
            </button>
            <button className="flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ModernCard;
