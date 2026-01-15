import React, { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Zap, Trophy, Award, Loader2, Calendar } from "lucide-react";
import { getApiUrl } from '@/lib/api-config';

// Our beautiful chart color palette
const CHART_COLORS = {
  purple: "#8B5CF6",   // Learning Progress
  orange: "#FB923C",   // Engagement
  blue: "#0EA5E9",     // Performance
  green: "#22C55E",    // Success Rate
  pink: "#EC4899",     // Participation
  amber: "#FBBF24",    // Time Spent
};

interface HeatmapValue {
  date: string;
  count: number;
}

interface PerformanceEntry {
  name: string;
  score: number;
}


interface ProgressProps {
  classroomDetails?: {
    id?: string;
    classroomName?: string;
  };
}

const Progress = ({ classroomDetails }: ProgressProps) => {
  const [practiceYear, setPracticeYear] = useState(new Date().getFullYear().toString());
  const [examYear, setExamYear] = useState(new Date().getFullYear().toString());
  const [curveYear, setCurveYear] = useState(new Date().getFullYear().toString());
  
  const [practiceData, setPracticeData] = useState<HeatmapValue[]>([]);
  const [examData, setExamData] = useState<HeatmapValue[]>([]);
  const [performanceScoreData, setPerformanceScoreData] = useState<PerformanceEntry[]>([]);
  
  const [loadingPractice, setLoadingPractice] = useState(false);
  const [loadingExam, setLoadingExam] = useState(false);
  const [loadingPerformance, setLoadingPerformance] = useState(false);

  const token = typeof window !== 'undefined' ? (localStorage.getItem("access_token") || "") : "";
  const classroomId = classroomDetails?.id || "";

  const fetchStats = useCallback(async (type: 'practice' | 'exam', year: string) => {
    const isPractice = type === 'practice';
    const setLoader = isPractice ? setLoadingPractice : setLoadingExam;
    const setData = isPractice ? setPracticeData : setExamData;
    const endpoint = isPractice ? 'practices' : 'exams';
    
    setLoader(true);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    try {
      const response = await fetch(getApiUrl(`/api/${endpoint}/stats/daily?start_date=${startDate}&end_date=${endDate}&classroom_id=${classroomId}`), {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error(`Failed to fetch ${type} stats`);
      }
    } catch (error) {
      console.error(`Error fetching ${type} stats:`, error);
    } finally {
      setLoader(false);
    }
  }, [token, classroomId]);

  const fetchPerformanceCurve = useCallback(async (year: string) => {
    setLoadingPerformance(true);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    try {
      const response = await fetch(getApiUrl(`/api/exams/stats/performance?start_date=${startDate}&end_date=${endDate}&classroom_id=${classroomId}`), {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPerformanceScoreData(data);
      } else {
        console.error(`Failed to fetch performance stats`);
      }
    } catch (error) {
      console.error(`Error fetching performance stats:`, error);
    } finally {
      setLoadingPerformance(false);
    }
  }, [token, classroomId]);

  useEffect(() => {
    fetchStats('practice', practiceYear);
  }, [practiceYear, fetchStats]);

  useEffect(() => {
    fetchStats('exam', examYear);
  }, [examYear, fetchStats]);

  useEffect(() => {
    fetchPerformanceCurve(curveYear);
  }, [curveYear, fetchPerformanceCurve]);

  // Derived Statistics
  const bestPerformance = React.useMemo(() => {
    if (!performanceScoreData.length) return null;
    return performanceScoreData.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  }, [performanceScoreData]);

  const studyStreak = React.useMemo(() => {
    if (!practiceData.length) return 0;
    
    const sortedDates = [...practiceData]
      .filter(d => d.count > 0)
      .map(d => new Date(d.date).getTime())
      .sort((a, b) => b - a); // Descending

    if (sortedDates.length === 0) return 0;

    const today = new Date().setHours(0,0,0,0);
    const yesterday = today - 86400000;
    
    // Check if the most recent practice was today or yesterday to keep streak alive
    const lastPractice = new Date(sortedDates[0]).setHours(0,0,0,0);
    if (lastPractice < yesterday) return 0;

    let streak = 1;
    let currentDate = lastPractice;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i]).setHours(0,0,0,0);
      const diff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
      
      if (diff === 1) {
        streak++;
        currentDate = prevDate;
      } else if (diff === 0) {
        continue; // Same day, ignore
      } else {
        break; // Gap found
      }
    }
    return streak;
  }, [practiceData]);

  const totalPractice = React.useMemo(() => {
    return practiceData.reduce((acc, curr) => acc + curr.count, 0);
  }, [practiceData]);

  const yearOptions = ["2023", "2024", "2025", "2026"];

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-200">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-slate-700">
              <span className="font-medium">{entry.name}:</span> {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Stat Card Component
  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
    children,
    extraHeader,
  }: {
    icon: any;
    title: string;
    value?: string;
    color: string;
    children?: React.ReactNode;
    extraHeader?: React.ReactNode;
  }) => (
    <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-slate-900">
            <div className={`p-2 rounded-lg bg-${color}-100`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">{title}</div>
              {value && <div className="text-2xl font-bold text-slate-900">{value}</div>}
            </div>
          </CardTitle>
          {extraHeader}
        </div>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Colorful Top Bar */}
      <div className="w-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-2 rounded-full mb-8"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3 font-heading">
            <Trophy className="w-10 h-10 text-green-500" />
            Performance Analytics
          </h1>
          <p className="text-slate-600 mt-2">Track your learning progress and achievements</p>
        </div>
      </div>

      {/* Practice Heatmap */}
      <Card className="bg-white border-slate-200 shadow-lg mb-8 bg-gradient-to-br from-green-50/30 to-emerald-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-900">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-lg font-bold">Practice Activity Hub</span>
                <p className="text-sm font-medium text-emerald-600 opacity-75 italic">Frequency of practice sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-emerald-100">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <select
                value={practiceYear}
                onChange={(e) => setPracticeYear(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-black text-emerald-900 cursor-pointer"
              >
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingPractice ? (
            <div className="h-32 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-2" />
              <p className="text-emerald-700 font-bold animate-pulse">Syncing practice data...</p>
            </div>
          ) : (
            <div className="heatmap-container practice-heatmap w-full mx-auto">
              <CalendarHeatmap
                startDate={new Date(`${practiceYear}-01-01`)}
                endDate={new Date(`${practiceYear}-12-31`)}
                values={practiceData}
                classForValue={(value: any) => {
                  if (!value || value.count === 0) return 'color-practice-0';
                  return `color-practice-${Math.min(value.count, 4)}`;
                }}
                tooltipDataAttrs={(value: any) => {
                  return {
                    'data-tip': value && value.date ? `${value.date}: ${value.count} sessions` : 'No sessions',
                  } as any;
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exam Heatmap */}
      <Card className="bg-white border-slate-200 mb-8 shadow-lg bg-gradient-to-br from-purple-50/30 to-pink-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-purple-900">
              <div className="p-2 rounded-lg bg-purple-100">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <span className="text-lg font-bold">Exam Commitment Tracker</span>
                <p className="text-sm font-medium text-purple-600 opacity-75 italic">Official exam sessions attended</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-purple-100">
              <Calendar className="w-4 h-4 text-purple-500" />
              <select
                value={examYear}
                onChange={(e) => setExamYear(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-black text-purple-900 cursor-pointer"
              >
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingExam ? (
            <div className="h-32 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-2" />
              <p className="text-purple-700 font-bold animate-pulse">Syncing exam records...</p>
            </div>
          ) : (
            <div className="heatmap-container exam-heatmap w-full mx-auto">
              <CalendarHeatmap
                startDate={new Date(`${examYear}-01-01`)}
                endDate={new Date(`${examYear}-12-31`)}
                values={examData}
                classForValue={(value: any) => {
                  if (!value || value.count === 0) return 'color-exam-0';
                  return 'color-exam-3';
                }}
                tooltipDataAttrs={(value: any) => {
                  return {
                    'data-tip': value && value.date ? `${value.date}: Exam taken` : 'No exam',
                  } as any;
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatCard 
          icon={TrendingUp} 
          title="Knowledge Growth Curve" 
          color="green"
          extraHeader={
            <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={curveYear}
                onChange={(e) => setCurveYear(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 cursor-pointer p-0"
              >
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          }
        >
          <div className="h-[250px] relative">
            {loadingPerformance ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-10">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin mb-2" />
                <p className="text-xs font-bold text-green-700">Analyzing growth...</p>
              </div>
            ) : performanceScoreData.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Activity className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm font-medium">No performance data for {curveYear}</p>
              </div>
            ) : null}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceScoreData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  stroke="#CBD5E1"
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  stroke="#CBD5E1"
                  ticks={[0, 25, 50, 75, 100]}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={CHART_COLORS.green}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </StatCard>

        {/* Achievements Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <Trophy className="w-6 h-6 text-purple-600" />
              Latest Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Best Performance Card */}
              <div className="bg-white p-3 rounded-xl border border-green-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Top Performer</h4>
                  <p className="text-xs text-slate-600">
                    {bestPerformance 
                      ? `Achieved ${bestPerformance.score}% in ${bestPerformance.name.split('-').slice(1).join('/')} Exam`
                      : "No exam data yet"
                    }
                  </p>
                </div>
              </div>

              {/* Practice Volume Card */}
              <div className="bg-white p-3 rounded-xl border border-orange-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">On a Roll</h4>
                  <p className="text-xs text-slate-600">
                    {totalPractice > 0 
                      ? `Completed ${totalPractice} practice sessions this year`
                      : "Start practicing to build stats"
                    }
                  </p>
                </div>
              </div>

              {/* Streak Card */}
              <div className="bg-white p-3 rounded-xl border border-purple-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Consistency Champion</h4>
                  <p className="text-xs text-slate-600">
                    {studyStreak > 0
                      ? `You've studied for ${studyStreak} day${studyStreak === 1 ? '' : 's'} straight!`
                      : "Start a study streak today!"
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
