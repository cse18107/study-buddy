'use client';
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
    const { resetPassword } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || "";

    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError("Invalid or missing token.");
            return;
        }
        setLoading(true);
        setError("");
        
        try {
            await resetPassword(token, newPassword);
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
             setError(err.message || "Reset password failed.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="bg-green-100 text-green-700 p-4 rounded-xl">
                    Password updated successfully!
                </div>
                <p className="text-slate-500">Redirecting to login...</p>
                 <Button 
                    onClick={() => router.push('/login')}
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200"
                >
                    Go to Login Now
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleResetPassword} className="space-y-6">
             {!token && <div className="text-yellow-600 text-sm p-2 bg-yellow-50 rounded">No token found in URL. Please make sure you used the link from the forgot password page.</div>}
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
             <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
              <Input 
                type="password" 
                placeholder="New strong password" 
                className="h-12 rounded-xl"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <Button 
                type="submit" 
                disabled={loading || !token}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 group"
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
                {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
          <p className="text-slate-500">Create a new password for your account.</p>
        </div>

        <Suspense fallback={<div className="text-center py-10"><Loader2 className="animate-spin w-8 h-8 mx-auto text-purple-600"/></div>}>
            <ResetPasswordForm />
        </Suspense>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-purple-600 font-bold hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
