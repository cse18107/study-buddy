'use client';
import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setResetToken("");

    try {
      const data = await forgotPassword(email);
      setSuccessMessage(data.message);
      if (data.reset_token) {
        setResetToken(data.reset_token);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h1>
          <p className="text-slate-500">Enter your email to receive a reset token.</p>
        </div>

        {!successMessage ? (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
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

            <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 group"
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
                {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>
        ) : (
            <div className="text-center space-y-4">
                <div className="text-green-600 font-medium">{successMessage}</div>
                {resetToken && (
                    <div className="bg-slate-100 p-4 rounded-xl break-all text-sm font-mono text-slate-600">
                        <span className="font-bold block mb-1">Testing Token:</span>
                        {resetToken}
                    </div>
                )}
                {resetToken && (
                    <Button 
                        onClick={() => router.push(`/reset-password?token=${resetToken}`)}
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200"
                    >
                        Proceed to Reset Password
                    </Button>
                )}
            </div>
        )}

        <div className="mt-8 text-center text-slate-500 text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-purple-600 font-bold hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
