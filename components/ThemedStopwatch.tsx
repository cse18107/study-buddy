import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Play, Pause, RotateCcw} from "lucide-react";

// Define colors for strict adherence
const BG_MEDIUM = "bg-[#252525]";
const NEON_TEXT = "text-[#eeffab]";
const NEON_BORDER = "border-[#eeffab]";
const NEON_HOVER = "hover:bg-[#eeffab] hover:text-black";

// Helper function to format seconds into HH:MM:SS
const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
};

const ThemedStopwatch: React.FC = () => {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div
      className={`
        p-4 ${BG_MEDIUM} rounded-xl border-2 ${NEON_BORDER} 
        shadow-[0_0_10px_rgba(238,255,171,0.5)] 
        transition-all duration-300
      `}
    >
      <div className="flex flex-col items-center">
        {/* Digital Time Display */}
        <div
          className={`
            text-4xl sm:text-5xl font-mono font-bold tracking-wider 
            ${NEON_TEXT} mb-3 p-1 
            text-shadow-neon
          `}
          // Inline style for a subtle text glow effect
          style={{textShadow: `0 0 5px #eeffab, 0 0 10px #eeffab`}}
        >
          {formatTime(time)}
        </div>

        {/* Controls */}
        <div className="flex space-x-2">
          <Button
            onClick={handleStartStop}
            className={`
              ${isRunning ? "bg-black" : "bg-[#eeffab] text-black"} 
              border-2 ${isRunning ? NEON_BORDER : "border-black"} 
              transition-all duration-200 h-10 w-10 p-0
              ${isRunning ? NEON_HOVER : ""}
            `}
            aria-label={isRunning ? "Pause" : "Start"}
          >
            {isRunning ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 text-black" />
            )}
          </Button>

          <Button
            onClick={handleReset}
            className={`
              ${BG_MEDIUM} ${NEON_BORDER} border 
              ${NEON_TEXT} ${NEON_HOVER} 
              transition-all duration-200 h-10 w-10 p-0
            `}
            aria-label="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        <p className={`text-xs mt-2 ${NEON_TEXT} opacity-70`}>
          {isRunning ? "RUNNING" : "PAUSED"}
        </p>
      </div>
    </div>
  );
};

export default ThemedStopwatch;


// import React, {useState, useEffect} from "react";
// import {Button} from "@/components/ui/button";
// import {Play, Pause, RotateCcw} from "lucide-react";

// // Define colors for strict adherence
// const BG_MEDIUM = "bg-[#252525]";
// const BG_DARK = "bg-black";
// const SILVER = "#e0e0e0";
// const RED_ACCENT = "#cc0000";

// // Helper function to format seconds into HH:MM:SS
// const formatTime = (totalSeconds: number) => {
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;

//   return [hours, minutes, seconds]
//     .map((unit) => String(unit).padStart(2, "0"))
//     .join(":");
// };

// // --- Component ---

// const ThemedStopwatch: React.FC = () => {
//   const [time, setTime] = useState(0); // Time in seconds
//   const [isRunning, setIsRunning] = useState(false);

//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null;

//     if (isRunning) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 1);
//       }, 1000);
//     } else if (interval) {
//       clearInterval(interval);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isRunning]);

//   const handleStartStop = () => {
//     setIsRunning(!isRunning);
//   };

//   const handleReset = () => {
//     setIsRunning(false);
//     setTime(0);
//   };

//   // --- Analog Logic ---
//   const secondsRotation = time % 60;
//   const sweepHandDegree = secondsRotation * 6; // 6 degrees per second

//   const totalMinutes = Math.floor(time / 60);
//   const minuteHandDegree = (totalMinutes % 60) * 6; // 6 degrees per minute

//   // CSS classes for center positioning and rotation origin
//   const handBaseStyle = {
//     position: "absolute" as "absolute",
//     left: "50%",
//     top: "50%",
//     transformOrigin: "bottom center",
//     transition: "transform 0.1s linear", // Smooth transition for seconds hand
//   };

//   // Calculate top of hand so that its pivot point is centered (50% from top, 50% from bottom)
//   const sweepHandCalculatedStyle = {
//     ...handBaseStyle,
//     width: "3px",
//     height: "45%",
//     backgroundColor: RED_ACCENT,
//     // Move the hand up by its height (45%) so the bottom edge lands at the center (50%)
//     transform: `translate(-50%, -100%) rotate(${sweepHandDegree}deg)`,
//     zIndex: 10,
//   };

//   const minuteHandCalculatedStyle = {
//     ...handBaseStyle,
//     width: "4px",
//     height: "40%",
//     backgroundColor: SILVER,
//     transform: `translate(-50%, -100%) rotate(${minuteHandDegree}deg)`,
//     zIndex: 9,
//   };

//   return (
//     <div
//       className={`
//         p-6 ${BG_MEDIUM} rounded-xl border-2 border-black 
//         shadow-lg transition-all duration-300
//       `}
//     >
//       <div className="flex flex-col items-center">
//         {/* --- Analog Clock Face --- */}
//         <div
//           className={`
//             relative w-48 h-48 sm:w-60 sm:h-60 rounded-full mb-6 
//             ${BG_DARK} border-4 border-[#252525] 
//             shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]
//           `}
//         >
//           {/* Hand Elements */}
//           <div style={sweepHandCalculatedStyle} />
//           <div style={minuteHandCalculatedStyle} />

//           {/* Center Pin (Must be Z-indexed above hands) */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div
//               className={`w-3 h-3 rounded-full ${BG_MEDIUM} border border-white/50 z-20`}
//             ></div>
//           </div>

//           {/* Clock Markings (using Tailwind utilities) */}
//           <div
//             className={`absolute top-0 left-1/2 -ml-1 w-2 h-4 rounded-b-sm`}
//             style={{backgroundColor: SILVER}}
//           ></div>
//           <div
//             className={`absolute right-0 top-1/2 -mt-1 h-2 w-4 rounded-l-sm`}
//             style={{backgroundColor: SILVER}}
//           ></div>
//           <div
//             className={`absolute bottom-0 left-1/2 -ml-1 w-2 h-4 rounded-t-sm`}
//             style={{backgroundColor: SILVER}}
//           ></div>
//           <div
//             className={`absolute left-0 top-1/2 -mt-1 h-2 w-4 rounded-r-sm`}
//             style={{backgroundColor: SILVER}}
//           ></div>
//         </div>

//         {/* --- Digital Readout --- */}
//         <p
//           className={`text-2xl font-mono font-bold ${BG_DARK} p-2 rounded-md border border-[#252525]`}
//           style={{color: SILVER}}
//         >
//           {formatTime(time)}
//         </p>

//         {/* --- Controls --- */}
//         <div className="flex space-x-2 mt-4">
//           <Button
//             onClick={handleStartStop}
//             className={`
//               ${isRunning ? BG_DARK : BG_MEDIUM} 
//               border-2 border-white/40 text-white/80
//               transition-all duration-200 h-10 w-20 p-0
//               hover:bg-white/10 hover:border-white
//             `}
//             aria-label={isRunning ? "Pause" : "Start"}
//           >
//             {isRunning ? (
//               <>
//                 <Pause className="w-5 h-5 mr-1" /> PAUSE
//               </>
//             ) : (
//               <>
//                 <Play className="w-5 h-5 mr-1" /> START
//               </>
//             )}
//           </Button>

//           <Button
//             onClick={handleReset}
//             className={`
//               ${BG_MEDIUM} border border-white/40 text-white/80
//               transition-all duration-200 h-10 w-10 p-0
//               hover:bg-white/10 hover:border-white
//             `}
//             aria-label="Reset"
//           >
//             <RotateCcw className="w-5 h-5" />
//           </Button>
//         </div>

//         <p className={`text-xs mt-2 text-white opacity-70`}>
//           {isRunning ? "TIMER ACTIVE" : "STOPPED"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ThemedStopwatch;