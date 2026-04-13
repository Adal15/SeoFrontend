"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);

            if (token && !userName) {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/plans/current`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUserName(data.user?.name || 'Account');
                    }
                } catch (error) {
                    console.error("Failed to fetch user name:", error);
                }
            } else if (!token) {
                setUserName(null);
            }
        };

        checkAuth();
        // Listen for storage changes (for logout from other tabs or components)
        window.addEventListener('storage', checkAuth);
        
        // Custom event for same-window updates if needed
        const interval = setInterval(checkAuth, 2000);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
            clearInterval(interval);
        };
    }, [userName]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserName(null);
        router.push('/login');
    };

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-x-0 rounded-none bg-slate-900/50 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">JTS SEO</span>
                            <span className="text-white">Analyzer</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">Features</Link>
                        <Link href="/plans" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">Plans</Link>
                        
                        {isLoggedIn ? (
                            <>
                                <Link 
                                    href="/dashboard/account"
                                    className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400">
                                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    {userName || 'Account'}
                                </Link>
                                <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]">
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">Login</Link>
                                <Link href="/plans" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
