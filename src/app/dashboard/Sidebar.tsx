"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export default function Sidebar() {
    const pathname = usePathname();
    const [account, setAccount] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                
                const res = await fetch(`${API_BASE_URL}/api/plans/current`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAccount(data);
                }
            } catch (error) {
                console.error("Failed to fetch account info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
        
        // Refresh when tab gains focus
        window.addEventListener('focus', fetchAccount);
        return () => window.removeEventListener('focus', fetchAccount);
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 border-r border-slate-800/50 glass-panel rounded-none border-y-0 border-l-0 hidden md:flex flex-col mt-0 pt-0 print:hidden">
            <div className="px-4 py-8 flex flex-col gap-2 flex-grow">
                <Link href="/dashboard" className={`px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                    Overview
                </Link>
                <Link href="/dashboard/reports" className={`px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard/reports') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                    My Reports
                </Link>
                {/* <Link href="/dashboard/settings" className={`px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard/settings') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                    Settings
                </Link> */}
                <Link href="/dashboard/account" className={`px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard/account') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                    My Account
                </Link>
                <Link href="/dashboard/help" className={`px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard/help') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                    Help & Manual
                </Link>

                {account && !loading && (
                    <div className="mt-8 pt-6 border-t border-slate-800/50 px-2 space-y-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-slate-400 block">Scans Remaining</span>
                                {account.scanLimitOverride !== null && account.scanLimitOverride !== undefined && (
                                    <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-bold uppercase tracking-wider">Custom</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className={`text-sm font-bold ${account.scansLeft === 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {account.scansLeft ?? 'N/A (Restart Server)'}
                                </span>
                                {(account.totalLimit && account.totalLimit !== 'Unlimited') && (
                                    <span className="text-[10px] text-slate-500">
                                        Usage: {account.websiteCount} / {account.totalLimit}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 block mb-1">Total Scans Performed</span>
                            <span className="text-sm font-medium text-slate-200">{account.websiteCount ?? 'N/A'}</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
