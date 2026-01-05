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

const CHART_COLORS = {
  orange: "#FF9F00",
  green: "#00C853", 
  blue: "#00A0FF",
  black: "#000000",
};

interface HeatmapValue {
  date: string;
  count: number;
}

interface PerformanceEntry {
  name: string;
  score: number;
}

const Progress = () => {
  const [practiceYear, setPracticeYear] = useState("2025");
  const [examYear, setExamYear] = useState("2025");
  const [curveYear, setCurveYear] = useState("2025");
  
  const [practiceData, setPracticeData] = useState<HeatmapValue[]>([]);
  const [examData, setExamData] = useState<HeatmapValue[]>([]);
  const [performanceScoreData, setPerformanceScoreData] = useState<PerformanceEntry[]>([]);
  
  const [loadingPractice, setLoadingPractice] = useState(false);
  const [loadingExam, setLoadingExam] = useState(false);
  const [loadingPerformance, setLoadingPerformance] = useState(false);

  const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWlrYXRAZ21haWwuY29tIiwiZXhwIjoxNzY3OTIzODg3fQ.MrcP0skIR3MSfg4N2UTYKp60BwXxQoqILme9oDGWguU") : "";

  const fetchStats = useCallback(async (type: 'practice' | 'exam', year: string) => {
    const isPractice = type === 'practice';
    const setLoader = isPractice ? setLoadingPractice : setLoadingExam;
    const setData = isPractice ? setPracticeData : setExamData;
    const endpoint = isPractice ? 'practices' : 'exams';
    
    setLoader(true);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    try {
      const response = await fetch(`http://localhost:8000/api/${endpoint}/stats/daily?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    } catch (error) {
      console.error(`Error fetching stats:`, error);
    } finally {
      setLoader(false);
    }
  }, [token]);

  const fetchPerformanceCurve = useCallback(async (year: string) => {
    setLoadingPerformance(true);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    try {
      const response = await fetch(`http://localhost:8000/api/exams/stats/performance?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPerformanceScoreData(data);
      }
    } catch (error) {
      console.error(`Error fetching performance stats:`, error);
    } finally {
      setLoadingPerformance(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats('practice', practiceYear);
  }, [practiceYear, fetchStats]);

  useEffect(() => {
    fetchStats('exam', examYear);
  }, [examYear, fetchStats]);

  useEffect(() => {
    fetchPerformanceCurve(curveYear);
  }, [curveYear, fetchPerformanceCurve]);

  const yearOptions = ["2023", "2024", "2025", "2026"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-xs">
          <p className="mb-2 bg-black text-white px-2 py-0.5 inline-block">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-black">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 md:p-12 bg-[#FDFDFD] min-h-screen">
      {/* Header */}
      <div className="border-8 border-black bg-white p-10 mb-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden rotate-[-0.5deg]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary border-l-8 border-b-8 border-black"></div>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
                <span className="text-secondary font-black uppercase text-2xl tracking-widest">Analytics Core</span>
                <h1 className="text-5xl md:text-8xl font-black text-black font-heading uppercase leading-none mt-2">
                    PROGRESS
                </h1>
            </div>
            <div className="bg-black text-white px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_white] flex items-center gap-4">
                <Trophy className="w-10 h-10" strokeWidth={3} />
                <span className="text-3xl font-black uppercase">ALPHA STATUS</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Practice Heatmap */}
          <div className="border-8 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
                <div className="flex items-center gap-4 text-black">
                  <div className="p-3 bg-secondary border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Activity className="w-8 h-8 text-black" strokeWidth={3} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black uppercase leading-none">PRACTICE HUB</h2>
                </div>
                <div className="flex items-center gap-2 border-4 border-black p-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <select
                    value={practiceYear}
                    onChange={(e) => setPracticeYear(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs font-black uppercase cursor-pointer outline-none"
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="heatmap-container practice-heatmap w-full bg-[#f8f8f8] p-4 border-4 border-black">
                  <CalendarHeatmap
                    startDate={new Date(`${practiceYear}-01-01`)}
                    endDate={new Date(`${practiceYear}-12-31`)}
                    values={practiceData}
                    classForValue={(value: HeatmapValue) => {
                      if (!value || value.count === 0) return 'color-practice-0';
                      return `color-practice-${Math.min(value.count, 4)}`;
                    }}
                  />
              </div>
          </div>

          {/* Exam Heatmap */}
          <div className="border-8 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
                <div className="flex items-center gap-4 text-black">
                  <div className="p-3 bg-info border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Trophy className="w-8 h-8 text-black" strokeWidth={3} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black uppercase leading-none">EXAM COMMITMENT</h2>
                </div>
                <div className="flex items-center gap-2 border-4 border-black p-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <select
                    value={examYear}
                    onChange={(e) => setExamYear(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs font-black uppercase cursor-pointer outline-none"
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="heatmap-container exam-heatmap w-full bg-[#f8f8f8] p-4 border-4 border-black">
                  <CalendarHeatmap
                    startDate={new Date(`${examYear}-01-01`)}
                    endDate={new Date(`${examYear}-12-31`)}
                    values={examData}
                    classForValue={(value: HeatmapValue) => {
                      if (!value || value.count === 0) return 'color-exam-0';
                      return 'color-exam-3';
                    }}
                  />
              </div>
          </div>
      </div>

      {/* Grid for Chart and Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Knowledge Growth */}
        <div className="border-8 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
               <h3 className="text-3xl font-black uppercase leading-none flex items-center gap-4">
                   <TrendingUp className="w-8 h-8" strokeWidth={3} />
                   GROWTH CURVE
               </h3>
               <div className="border-4 border-black px-2 py-1 bg-white flex items-center gap-2 text-xs font-black">
                    <select
                        value={curveYear}
                        onChange={(e) => setCurveYear(e.target.value)}
                        className="bg-transparent outline-none"
                    >
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
               </div>
            </div>

            <div className="h-[300px] border-4 border-black p-4 bg-[#fcfcfc]">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceScoreData}>
                    <CartesianGrid strokeDasharray="0" stroke="#000" strokeOpacity={0.1} />
                    <XAxis
                    dataKey="name"
                    tick={{ fill: '#000', fontSize: 10, fontWeight: 900 }}
                    stroke="#000"
                    strokeWidth={2}
                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                    />
                    <YAxis
                    tick={{ fill: '#000', fontSize: 12, fontWeight: 900 }}
                    stroke="#000"
                    strokeWidth={2}
                    ticks={[0, 50, 100]}
                    domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                    type="stepAfter"
                    dataKey="score"
                    stroke="#000"
                    strokeWidth={6}
                    fill={CHART_COLORS.green}
                    fillOpacity={1}
                    />
                </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Milestones */}
        <div className="border-8 border-black bg-secondary p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-[0.5deg]">
            <h3 className="text-3xl font-black uppercase leading-none mb-10 text-white drop-shadow-[2px_2px_0px_black]">
                MILESTONES
            </h3>
            <div className="space-y-6">
              {[
                { icon: Trophy, title: "PERFECT SCORE", desc: "ACED THE MISSION", color: "bg-primary" },
                { icon: Zap, title: "SPEED DEMON", desc: "RECORD TIME SYNC", color: "bg-info" },
                { icon: Award, title: "7-DAY STREAK", desc: "CONSISTENT BRAIN ROT", color: "bg-white" }
              ].map((m, i) => (
                <div key={i} className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center gap-4">
                  <div className={`w-14 h-14 border-4 border-black ${m.color} flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <m.icon className="w-8 h-8 text-black" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="font-black text-black text-xl leading-none uppercase">{m.title}</h4>
                    <p className="text-[10px] font-bold text-black/60 uppercase mt-1">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
