'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate login
        setTimeout(() => {
            localStorage.setItem("token", "DEMO_TOKEN");
            router.push('/dashboard');
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 md:p-12 relative overflow-hidden font-body">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-primary border-8 border-black rotate-12 -z-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-secondary border-8 border-black -rotate-6 -z-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]"></div>

            <div className="w-full max-w-lg bg-white border-8 border-black p-8 md:p-12 shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] relative">
                {/* Logo/Icon */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border-8 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <LogIn className="w-12 h-12 text-black" strokeWidth={3} />
                </div>

                <div className="mt-8 text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-black uppercase leading-none mb-2">LOGIN</h1>
                    <p className="text-black font-bold uppercase text-xs tracking-widest bg-primary inline-block px-3 py-1 border-2 border-black">Access your classroom</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-sm font-black uppercase flex items-center gap-2">
                            <Mail className="w-4 h-4" /> EMAIL ADDRESS
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border-4 border-black h-16 px-6 text-xl font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[3px] focus:translate-y-[3px] outline-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-black uppercase flex items-center gap-2">
                                <Lock className="w-4 h-4" /> PASSWORD
                            </label>
                            <span className="text-[10px] font-black uppercase text-secondary cursor-pointer hover:underline">Forgot?</span>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border-4 border-black h-16 px-6 text-xl font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[3px] focus:translate-y-[3px] outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full neo-button bg-black text-white h-20 text-2xl uppercase flex items-center justify-center gap-4 group disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="w-10 h-10 animate-spin" strokeWidth={4} />
                        ) : (
                            <>
                                LOG IN
                                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" strokeWidth={4} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t-4 border-dashed border-black">
                    <p className="text-center font-black uppercase text-sm">
                        DON&apos;T HAVE AN ACCOUNT?{' '}
                        <Link href="/signup" className="text-secondary hover:underline underline-offset-4 decoration-4">
                            SIGN UP
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
