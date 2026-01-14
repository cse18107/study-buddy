'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  BookOpen, 
  BrainCircuit, 
  Target, 
  TrendingUp, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Github,
  Zap,
  Globe,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-heading">
              Study Buddy
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
            <Link href="#features" className="hover:text-purple-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-purple-600 transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-purple-600 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 font-semibold shadow-lg hover:shadow-purple-200 transition-all active:scale-95">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-semibold text-slate-600 hover:text-purple-600">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 font-semibold shadow-lg hover:shadow-purple-200 transition-all active:scale-95">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm mb-6 border border-purple-200">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Learning Revolution</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 font-heading">
              Master Any Subject with Your <span className="text-gradient-primary">AI Buddy</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl font-body">
              Stop struggling with endless notes. Upload your documents and let our AI generate personalized exams, 
              interactive practices, and unique learning insights in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button className="h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl shadow-xl hover:shadow-purple-200 transition-all font-bold group">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" className="h-14 px-8 text-lg border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700">
                Explore Features
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center gap-8 text-slate-500 font-medium border-t border-slate-100 pt-8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span>Accessible Anywhere</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span>Collaborative Learning</span>
              </div>
            </div>
          </div>

          <div className="relative animate-bounce-in">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl rounded-full" />
            <div className="relative bg-white/40 backdrop-blur-sm p-4 rounded-[2.5rem] shadow-2xl border border-white/60 group overflow-hidden">
              <Image 
                src="/hero.png" 
                alt="AI Learning Illustration" 
                width={800}
                height={600}
                className="w-full rounded-[2rem] object-cover shadow-lg group-hover:scale-[1.02] transition-transform duration-700"
              />
              
              {/* Floating Dashboard Elements */}
              <div className="absolute -left-6 top-1/4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Action Required</p>
                    <p className="text-sm font-bold text-slate-900">Retake SQL JOIN Quiz</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 bottom-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Growth Curve</p>
                    <p className="text-sm font-bold text-slate-900">+88% Score Improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-32 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 font-heading">
                Why Choose <span className="text-gradient-primary">Study Buddy</span>?
            </h2>
            <p className="text-xl text-slate-600 font-body">
                We combine the latest AI technology with proven pedagogical methods to help you achieve academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BrainCircuit className="w-8 h-8 text-white" />}
              title="Smart Exam Generation"
              description="Upload your study materials and get realistic exam questions based on the content. Our AI understands context and complexity."
              color="bg-purple-500"
              delay="0"
            />
            <FeatureCard 
              icon={<Target className="w-8 h-8 text-white" />}
              title="Interactive Practice"
              description="Don&apos;t just read—practice. Get instant feedback on your answers and learn why you missed a question with AI explanations."
              color="bg-blue-500"
              delay="100"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8 text-white" />}
              title="Progress Tracking"
              description="Visualize your learning progress with intuitive charts. See which topics you've mastered and where you need more focus."
              color="bg-pink-500"
              delay="200"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-white" />}
              title="Classroom Organization"
              description="Keep your subjects organized. Create separate classrooms for each course and manage all related materials seamlessly."
              color="bg-teal-500"
              delay="300"
            />
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8 text-white" />}
              title="Document Management"
              description="A central hub for all your PDFs, slides, and notes. Power your AI practice sessions with your own curated library."
              color="bg-orange-500"
              delay="400"
            />
            <FeatureCard 
              icon={<Sparkles className="w-8 h-8 text-white" />}
              title="Personalized AI Tutor"
              description="Have a question about a concept? Ask your built-in AI tutor anytime for quick clarifications and in-depth explanations."
              color="bg-indigo-500"
              delay="500"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
            
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 font-heading">
                  How Study Buddy <br />
                  <span className="text-purple-400">Transforms</span> Your Learning
                </h2>
                <div className="space-y-12 mt-12">
                  <Step num="01" title="Upload Materials" desc="Add your course PDFs, notes, or even images of your textbook." />
                  <Step num="02" title="AI Processing" desc="Our system analyzes your content to extract key concepts and facts." />
                  <Step num="03" title="Generate & Study" desc="Choose between Exams or Practice sessions to test your knowledge." />
                  <Step num="04" title="Analyze Growth" desc="View your performance analytics and identify areas for improvement." />
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[2rem] border border-white/10 hidden lg:block">
                <div className="space-y-6">
                   <div className="h-4 w-3/4 bg-white/20 rounded-full animate-pulse" />
                   <div className="h-4 w-1/2 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                   <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="h-32 bg-purple-500/20 rounded-2xl border border-purple-500/30 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="h-32 bg-blue-500/20 rounded-2xl border border-blue-500/30 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-blue-400" />
                      </div>
                   </div>
                   <div className="h-20 bg-white/5 rounded-2xl border border-white/10" />
                   <div className="h-20 bg-white/5 rounded-2xl border border-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 font-heading">
            Ready to <span className="text-gradient-primary">Accelerate</span> Your Learning?
          </h2>
          <p className="text-xl text-slate-600 font-body max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who are already using AI to stay ahead of the curve. Your first classroom is on us.
          </p>
          <Link href="/signup">
            <Button className="h-16 px-12 text-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-[1.5rem] shadow-2xl hover:shadow-purple-300 transition-all font-bold group">
                Sign Up for Free
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div className="flex justify-center gap-12 text-slate-400 font-medium pt-8">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> No credit card required</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Free forever basic plan</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-slate-800 pb-16 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-xl scale-110">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold font-heading tracking-tight">Study Buddy</span>
            </Link>
            <p className="text-slate-400 text-lg max-w-sm leading-relaxed font-body">
              Revolutionizing education through intelligent AI integration. Focus on learning, we&apos;ll handle the logistics.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 hover:text-purple-400 transition-all">
                <Github className="w-6 h-6" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-8 font-heading">Product</h4>
            <ul className="space-y-5 text-slate-400 font-medium">
              <li><Link href="#features" className="hover:text-purple-400 transition">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-purple-400 transition">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-purple-400 transition">Pricing</Link></li>
              <li><Link href="/docs" className="hover:text-purple-400 transition">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-8 font-heading">Company</h4>
            <ul className="space-y-5 text-slate-400 font-medium">
              <li><Link href="/about" className="hover:text-purple-400 transition">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-purple-400 transition">Blog</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-purple-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 font-medium">
          <p>© 2026 Study Buddy AI Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <span>Built with ❤️ for learners</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay }: { icon: React.ReactNode, title: string, description: string, color: string, delay: string }) {
  return (
    <div 
      className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 animate-bounce-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`${color} w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4 font-heading">{title}</h3>
      <p className="text-slate-600 leading-relaxed font-body text-lg">
        {description}
      </p>
    </div>
  );
}

function Step({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 flex items-center justify-center text-purple-400 font-bold font-heading text-lg group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
          {num}
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-purple-500/30 to-transparent mt-4" />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{title}</h3>
        <p className="text-slate-400 text-lg leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
