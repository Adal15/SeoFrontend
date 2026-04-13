"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token && pathname !== '/admin/login') {
            router.push('/admin/login');
        } else if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    if (isAuthenticated === null) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Admin Console...</div>;

    if (pathname === '/admin/login') return <>{children}</>;

    return (
        <div className="flex bg-slate-950 min-h-screen">
            <aside className="w-64 border-r border-slate-800/50 bg-slate-900/50 fixed h-full z-40 hidden md:block">
                <div className="h-full px-6 py-10 flex flex-col gap-8">
                    <div className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                        <span className="text-red-500">JTS</span> <span className="text-white">Admin</span>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <Link href="/admin/dashboard" className={`px-4 py-3 rounded-lg transition-all ${pathname === '/admin/dashboard' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            Dashboard
                        </Link>
                        <Link href="/admin/users" className={`px-4 py-3 rounded-lg transition-all ${pathname === '/admin/users' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            All Users
                        </Link>
                        <Link href="/admin/details" className={`px-4 py-3 rounded-lg transition-all ${pathname === '/admin/details' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            All Details
                        </Link>
                        <Link href="/admin/requests" className={`px-4 py-3 rounded-lg transition-all ${pathname === '/admin/requests' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            Upgrade Requests
                        </Link>
                        <Link href="/admin/reports" className={`px-4 py-3 rounded-lg transition-all ${pathname === '/admin/reports' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            System Logs
                        </Link>
                    </nav>

                    <div className="mt-auto">
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Log Out
                        </button>
                    </div>
                </div>
            </aside>
            <main className="flex-1 md:ml-64 p-4 md:p-10">
                {children}
            </main>
        </div>
    );
}
