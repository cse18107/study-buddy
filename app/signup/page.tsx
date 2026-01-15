'use client';
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(email, password, fullName);
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-heading">Study Buddy</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join the Future</h1>
          <p className="text-slate-500">Create your free account and start learning.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <Input 
              placeholder="John Doe" 
              className="h-12 rounded-xl"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <Input 
              type="email"
              placeholder="name@example.com" 
              className="h-12 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              className="h-12 rounded-xl" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 group"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
            {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 font-bold hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
