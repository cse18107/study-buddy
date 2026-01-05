'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    Zap, 
    BookOpen, 
    MessageSquare, 
    ChevronRight, 
    Target,
    Rocket,
    Brain,
    Sparkles
} from 'lucide-react';

const LandingPage = () => {
    const router = useRouter();

    const features = [
        {
            icon: BookOpen,
            title: "Smart Study Notes",
            desc: "Upload your PDFs and let AI summarize the most important points for you.",
            color: "bg-primary"
        },
        {
            icon: MessageSquare,
            title: "AI Tutor Chat",
            desc: "Ask questions and get instant help with your studies anytime, 24/7.",
            color: "bg-secondary"
        },
        {
            icon: Target,
            title: "Interactive Quizzes",
            desc: "Test your knowledge with practice exams and track your progress.",
            color: "bg-info"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-black overflow-x-hidden font-body">
            {/* Top Bar Navigation */}
            <nav className="border-b-8 border-black bg-white sticky top-0 z-50 px-6 py-4 flex justify-between items-center group">
                <div className="flex items-center gap-2">
                    <div className="bg-primary border-4 border-black p-1 shadow-[4px_4px_0px_0px_black]">
                        <Zap className="w-8 h-8 fill-white" strokeWidth={3} />
                    </div>
                    <span className="text-3xl font-black uppercase tracking-tighter hidden md:inline">STUDY BUDDY</span>
                </div>
                
                <div className="flex gap-4">
                    <Link href="/login" className="hidden md:flex items-center justify-center px-6 py-2 font-black uppercase border-4 border-black hover:bg-primary transition-all shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">
                        LOG IN
                    </Link>
                    <Link href="/signup" className="flex items-center justify-center px-6 py-2 font-black uppercase bg-secondary border-4 border-black transition-all shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">
                        SIGN UP
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative py-20 px-6 md:py-32 flex flex-col items-center text-center overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-10 left-[-5%] w-64 h-64 bg-secondary/20 rounded-full border-8 border-black -z-10 animate-pulse"></div>
                <div className="absolute bottom-10 right-[-5%] w-80 h-80 bg-info/20 rounded-full border-8 border-black -z-10 animate-bounce"></div>

                <div className="inline-block bg-black text-white px-6 py-2 font-black uppercase text-sm mb-6 rotate-[-2deg] shadow-[4px_4px_0px_0px_#FF9F00]">
                    YOUR SMARTER STUDY PARTNER 💡
                </div>
                
                <h1 className="text-6xl md:text-9xl font-black leading-none uppercase mb-10 tracking-tightest">
                    STUDY <span className="bg-primary border-8 border-black px-4 shadow-[12px_12px_0px_0px_black] inline-block mt-4 rotate-2">SMARTER</span><br/>
                    NOT <span className="text-secondary drop-shadow-[4px_4px_0px_black]">HARDER.</span>
                </h1>

                <p className="max-w-2xl text-xl md:text-3xl font-black uppercase mb-12 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_black]">
                    The AI-powered platform that helps you master your subjects faster than ever.
                </p>

                <div className="flex flex-col sm:flex-row gap-8">
                    <button 
                        onClick={() => router.push('/signup')}
                        className="neo-button bg-black text-white h-24 px-12 text-3xl flex items-center gap-4 group"
                    >
                        GET STARTED
                        <Rocket className="w-10 h-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" strokeWidth={3} />
                    </button>
                    <button 
                         onClick={() => router.push('/login')}
                        className="neo-button bg-white text-black h-24 px-12 text-3xl border-8 flex items-center gap-4"
                    >
                        BROWSE COURSES
                    </button>
                </div>
            </header>

            {/* Features Ticker */}
            <div className="bg-black py-4 border-y-8 border-black relative z-10">
                <div className="flex gap-20 animate-[shimmer_20s_linear_infinite] whitespace-nowrap text-white font-black uppercase text-xl md:text-2xl italic">
                    <p>✨ SUMMARIZE NOTES ✨ CHAT WITH AI ✨ PRACTICE TESTS ✨ TRACK PROGRESS ✨ LEARN FAST ✨</p>
                    <p>✨ SUMMARIZE NOTES ✨ CHAT WITH AI ✨ PRACTICE TESTS ✨ TRACK PROGRESS ✨ LEARN FAST ✨</p>
                </div>
            </div>

            {/* What we offer */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-none border-b-8 border-black inline-block pb-4">HOW IT WORKS</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((f, i) => (
                        <div key={i} className={`border-8 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-8px] hover:translate-y-[-8px] hover:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] transition-all bg-white`}>
                            <div className={`${f.color} border-4 border-black p-4 w-20 h-20 mb-8 flex items-center justify-center shadow-[6px_6px_0px_0px_black]`}>
                                <f.icon className="w-12 h-12 text-black" strokeWidth={3} />
                            </div>
                            <h3 className="text-3xl font-black uppercase mb-4">{f.title}</h3>
                            <p className="text-xl font-bold uppercase opacity-80 leading-snug">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Clarity Section */}
            <section className="bg-info/10 py-24 border-y-8 border-black relative px-6">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
                    <h2 className="text-5xl md:text-7xl font-black uppercase mb-8">WHY CHOOSE US?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 w-full">
                        <div className="bg-white border-8 border-black p-10 shadow-[12px_12px_0px_0px_black] text-left">
                           <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-3">
                               <Sparkles className="text-primary w-8 h-8" /> Instant Help
                           </h3>
                           <p className="font-bold opacity-70 uppercase tracking-tight">No more waiting for teachers or classmates. Our AI answers your questions instantly with accurate information from your own study materials.</p>
                        </div>
                        <div className="bg-white border-8 border-black p-10 shadow-[12px_12px_0px_0px_black] text-left">
                           <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-3">
                               <Target className="text-secondary w-8 h-8" /> Better Retention
                           </h3>
                           <p className="font-bold opacity-70 uppercase tracking-tight">Testing yourself is the best way to learn. Our automated practice sessions help you identify gaps in your knowledge and remember more.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-4xl mx-auto border-8 border-black bg-primary p-12 md:p-20 shadow-[20px_20px_0px_0px_black] rotate-1">
                    <h2 className="text-5xl md:text-8xl font-black uppercase leading-none mb-10">ACED YOUR<br/>EXAMS YET?</h2>
                    <button 
                        onClick={() => router.push('/signup')}
                        className="neo-button bg-black text-white h-24 px-16 text-3xl uppercase animate-bounce"
                    >
                        START FOR FREE
                    </button>
                    <p className="mt-8 font-black uppercase text-xs opacity-60">Join thousands of students who are studying smarter today.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="bg-primary border-4 border-white p-1">
                                <Zap className="w-8 h-8 fill-black text-black" />
                            </div>
                            <span className="text-3xl font-black uppercase tracking-tighter">STUDY BUDDY</span>
                        </div>
                        <p className="text-xs font-black uppercase opacity-40 max-w-xs">
                            THE NEW STANDARD FOR ACADEMIC SUCCESS. BUILT TO HELP YOU LEARN FASTER AND ACHIEVE BETTER RESULTS.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-black uppercase mb-6 text-primary">LEARN</h4>
                        <ul className="space-y-3 text-sm font-black uppercase opacity-60">
                            <li className="hover:text-white cursor-pointer transition-colors">SUMMARIES</li>
                            <li className="hover:text-white cursor-pointer transition-colors">QUIZZES</li>
                            <li className="hover:text-white cursor-pointer transition-colors">AI CHAT</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black uppercase mb-6 text-secondary">INFO</h4>
                        <ul className="space-y-3 text-sm font-black uppercase opacity-60">
                            <li className="hover:text-white cursor-pointer transition-colors">ABOUT US</li>
                            <li className="hover:text-white cursor-pointer transition-colors">CONTACT</li>
                            <li className="hover:text-white cursor-pointer transition-colors">SUPPORT</li>
                        </ul>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto border-t-2 border-white/20 mt-20 pt-10 text-center">
                    <p className="text-[10px] font-black uppercase opacity-20">© 2026 STUDY BUDDY. ALL RIGHTS RESERVED. ACED IT.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
