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
        w-full max-w-sm mx-auto h-[400px]
        bg-white
        border-4 border-black
        rounded-xl
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        overflow-hidden
        transition-all duration-100
        hover:translate-x-[-4px] hover:translate-y-[-4px]
        hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
        group relative p-0
        cursor-pointer
      "
    >
      {/* Image Container with hard border */}
      <div className="w-full h-1/2 border-b-4 border-black overflow-hidden bg-primary">
        <img
          src={imageSrc}
          alt={name}
          className="
            w-full h-full object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col h-1/2 justify-between bg-white relative">
        <div className="absolute top-[-24px] right-4 z-20">
             {items.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="
                        p-3 rounded-full
                        border-4 border-black bg-secondary
                        text-black hover:bg-green-400
                        transition-all duration-100
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                        outline-none
                      "
                      aria-label="Menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-6 h-6" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none p-1 min-w-[160px]">
                    {items.map((item, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onClick();
                        }}
                        className={`
                          cursor-pointer flex items-center gap-3 px-3 py-3 rounded-none
                          border-b-2 border-black last:border-b-0
                          transition-colors duration-100
                          uppercase font-black
                          ${
                            item.isDestructive
                              ? "text-red-600 hover:bg-black hover:text-white"
                              : "text-black hover:bg-primary"
                          }
                        `}
                      >
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
        </div>

        <div>
          {/* Name */}
          <h3
            className="
              text-2xl font-black mb-3 leading-none
              text-black uppercase
              group-hover:bg-primary group-hover:inline-block transition-colors duration-100
            "
          >
            {name}
          </h3>

          {/* Description */}
          <p className="text-xs font-bold text-black/70 leading-tight line-clamp-4 uppercase">
            {description}
          </p>
        </div>

        {/* Bottom Bar for "Flex" style */}
        <div className="mt-4 pt-3 border-t-2 border-black flex justify-between items-center text-[10px] font-black uppercase">
            <span>Ready to Flex</span>
            <span className="bg-black text-white px-2 py-0.5 rounded-sm">Vibe Check</span>
        </div>
      </div>
    </Card>
  );
};

export default ModernCard;
