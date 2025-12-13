import React from "react";
import {Card} from "@/components/ui/card"; // Removed CardContent since we are using custom layout
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
        w-full max-w-sm mx-auto max-h-[284px] sm:h-[450px]
        bg-gray-900/80 backdrop-blur-lg
        border border-gray-700/50 rounded-lg
        shadow-2xl overflow-hidden
        transition-all duration-500
        hover:shadow-3xl hover:scale-[1.02]
        group relative p-0 /* p-0 removes any inherited padding */
      "
    >
      {/* 1. Full-Bleed Image Background */}
      <img
        src={imageSrc}
        alt={name}
        className="
          w-full h-full object-cover
          transition-transform duration-700
          group-hover:scale-110 group-hover:brightness-[1.1]
        "
      />

      {/* 2. Primary Absolute Overlay Container (for all UI elements) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between">
        {/* Top Section: Dropdown Menu */}
        <div className="p-4 flex justify-end">
          {items.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
                    p-2 rounded-full
                    bg-black/50 backdrop-blur-sm
                    text-gray-300 hover:text-[#eeffab]
                    transition-all duration-300
                    hover:bg-black/70
                    outline-none focus:ring-2 focus:ring-[#eeffab]
                  "
                  aria-label="Menu"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#252525] border-[#252525] text-white shadow-xl rounded-xl p-1">
                {items.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={item.onClick}
                    className={`
                      cursor-pointer flex items-center gap-3 px-3 py-2
                      ${
                        item.isDestructive
                          ? "text-red-400 hover:bg-red-900/40"
                          : "hover:bg-purple-600/20"
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
            p-6 pt-16 /* Use pt-16 to ensure gradient starts high */
            bg-gradient-to-t from-black/90 via-black/60 to-transparent
            text-white
          "
        >
          {/* Name */}
          <h3
            className="
              text-3xl font-extrabold mb-1 tracking-tight
              drop-shadow-lg /* Text shadow for contrast */
              group-hover:text-[#eeffab] transition-colors duration-500
            "
          >
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-300 leading-snug line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ModernCard;
