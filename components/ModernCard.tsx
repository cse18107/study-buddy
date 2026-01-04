import React from "react";
import {Card} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {MoreHorizontal, Trash2} from "lucide-react";

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  isDestructive?: boolean;
}

interface ModernCardProps {
  imageSrc: string;
  name: string;
  description: string;
  onDelete?: () => void;
  menuItems?: MenuItem[];
}

const ModernCard: React.FC<ModernCardProps> = ({
  imageSrc,
  name,
  description,
  onDelete,
  menuItems = [],
}) => {
  const defaultMenuItems: MenuItem[] = [
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDelete || (() => console.log("Delete action not defined.")),
      isDestructive: true,
    },
  ];

  const items =
    menuItems.length > 0 ? menuItems : onDelete ? defaultMenuItems : [];

  return (
    <Card
      className="
        w-full max-w-sm mx-auto h-[320px] sm:h-[380px]
        bg-white
        border-2 border-slate-100
        rounded-2xl
        shadow-lg
        overflow-hidden
        transition-all duration-300
        hover:shadow-2xl hover:scale-[1.02] hover:border-purple-200
        group relative p-0
        cursor-pointer
      "
    >
      {/* Full-Bleed Image Background */}
      <img
        src={imageSrc}
        alt={name}
        className="
          w-full h-full object-cover
          transition-transform duration-700
          group-hover:scale-110 group-hover:brightness-105
        "
      />

      {/* Overlay Container */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between">
        {/* Top Section: Dropdown Menu */}
        <div className="p-4 flex justify-end">
          {items.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
                    p-2 rounded-full
                    bg-white/90 backdrop-blur-sm
                    text-slate-700 hover:text-purple-600
                    transition-all duration-300
                    hover:bg-white
                    outline-none focus:ring-2 focus:ring-purple-500
                    shadow-md hover:shadow-lg
                  "
                  aria-label="Menu"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-slate-200 shadow-xl rounded-xl p-1">
                {items.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={item.onClick}
                    className={`
                      cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-colors duration-200
                      ${
                        item.isDestructive
                          ? "text-red-600 hover:bg-red-50"
                          : "text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                      }
                    `}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Bottom Section: Text Content Overlay */}
        <div
          className="
            p-6 pt-20
            bg-gradient-to-t from-white via-white/95 to-transparent
            backdrop-blur-sm
          "
        >
          {/* Name */}
          <h3
            className="
              text-2xl font-bold mb-2 tracking-tight
              text-slate-900
              drop-shadow-sm
              group-hover:text-purple-600 transition-colors duration-300
              font-heading
            "
          >
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-snug line-clamp-3">
            {description}
          </p>
        </div>
      </div>

      {/* Decorative gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"></div>
    </Card>
  );
};

export default ModernCard;
