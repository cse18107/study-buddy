import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {TrendingUp, Target, Activity, Zap} from "lucide-react";

// --- Color Definitions ---
// Define colors for strict adherence
const BG_DARK = "bg-black";
const BG_MEDIUM = "bg-[#252525]";
const NEON_ACCENT = "#eeffab"; // Used for chart elements and primary text
const NEON_TEXT = "text-[#eeffab]";
const NEON_BORDER = "border-[#eeffab]";
const GRAY_GRID = "#252525"; // Used for grids and axis text

// --- Mock Data ---
const performanceData = [
  {name: "Week 1", score: 65, time: 25},
  {name: "Week 2", score: 78, time: 22},
  {name: "Week 3", score: 85, time: 18},
  {name: "Week 4", score: 92, time: 15},
];

const subjectData = [
  {subject: "MCQ", A: 120, fullMark: 150},
  {subject: "SAQ", A: 98, fullMark: 150},
  {subject: "LAQ", A: 86, fullMark: 150},
  {subject: "Sync", A: 99, fullMark: 150},
  {subject: "Models", A: 85, fullMark: 150},
];

const topicDistribution = [
  {name: "Definitions", value: 400},
  {name: "Models", value: 300},
  {name: "Benefits", value: 300},
  {name: "Sync", value: 200},
];

// --- Custom Tooltip Component (Themed) ---
const CustomTooltip = ({active, payload, label}: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-3 rounded-lg border ${NEON_BORDER} ${BG_DARK} ${NEON_TEXT} shadow-xl`}
      >
        <p className="font-bold text-sm mb-1">{label}</p>
        {payload.map((item: any, index: number) => (
          <p
            key={index}
            className="text-xs opacity-80"
            style={{color: item.color}}
          >
            {`${item.name}: ${item.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Chart Component Wrappers ---

const ChartCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({title, icon, children}) => (
  <Card
    className={`
    ${BG_MEDIUM} border border-[#252525] ${NEON_TEXT} 
    rounded-xl shadow-[0_0_10px_rgba(238,255,171,0.2)] 
    h-full
  `}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-lg font-bold flex items-center gap-2">
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="h-[250px] p-4">{children}</CardContent>
  </Card>
);

const Progress = () => {
  const chartStyles = {
    fontSize: "12px",
    color: NEON_ACCENT,
    fill: NEON_ACCENT,
  };

  return (
    <div className={`p-8 ${BG_DARK} min-h-screen`}>
      <h1
        className={`text-4xl font-extrabold mb-10 ${NEON_TEXT} border-b border-[#252525] pb-4`}
      >
        Performance Analytics Console
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* 1. Area Chart (Progress Over Time) */}
        <ChartCard
          title="Cumulative Score Trend"
          icon={<TrendingUp className="w-5 h-5" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={NEON_ACCENT} stopOpacity={0.8} />
                  <stop
                    offset="95%"
                    stopColor={NEON_ACCENT}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRAY_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="name" style={chartStyles} stroke={GRAY_GRID} />
              <YAxis style={chartStyles} stroke={GRAY_GRID} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke={NEON_ACCENT}
                fill="url(#colorScore)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Bar Chart (Time Efficiency) */}
        <ChartCard
          title="Time Spent Per Week (min)"
          icon={<Activity className="w-5 h-5" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid stroke={GRAY_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="name" style={chartStyles} stroke={GRAY_GRID} />
              <YAxis style={chartStyles} stroke={GRAY_GRID} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="time" fill={NEON_ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Pie Chart (Topic Distribution) */}
        <ChartCard
          title="Quiz Question Distribution"
          icon={<Zap className="w-5 h-5" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topicDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill={NEON_ACCENT}
                labelLine={false}
                label={({name, percent}) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              ></Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{...chartStyles, color: NEON_ACCENT}}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Line Chart (Score per Session) */}
        <ChartCard
          title="Session Score Fluctuations"
          icon={<TrendingUp className="w-5 h-5" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid stroke={GRAY_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="name" style={chartStyles} stroke={GRAY_GRID} />
              <YAxis
                style={chartStyles}
                stroke={GRAY_GRID}
                domain={[50, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke={NEON_ACCENT}
                strokeWidth={3}
                dot={{fill: NEON_ACCENT, r: 4}}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Radar Chart (Skill Assessment) */}
        <ChartCard
          title="Skill Competency Map"
          icon={<Target className="w-5 h-5" />}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={subjectData}>
              <PolarGrid stroke={GRAY_GRID} />
              <PolarAngleAxis dataKey="subject" style={chartStyles} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 150]}
                style={chartStyles}
                stroke={GRAY_GRID}
              />
              <Radar
                name="Score"
                dataKey="A"
                stroke={NEON_ACCENT}
                fill={NEON_ACCENT}
                fillOpacity={0.6}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{...chartStyles, color: NEON_ACCENT}} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Placeholder for Radar/Radial Chart (using Bar for structure) */}
        <ChartCard
          title="Overall Mastery Score"
          icon={<Target className="w-5 h-5" />}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-6xl font-extrabold" style={{color: NEON_ACCENT}}>
              92%
            </p>
            <p className="text-sm opacity-60 mt-2">
              Achieved Mastery in Core Concepts
            </p>
            <div className="w-full h-2 rounded-full mt-4 bg-black">
              <div
                className="h-full rounded-full"
                style={{width: "92%", backgroundColor: NEON_ACCENT}}
              ></div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Progress;
