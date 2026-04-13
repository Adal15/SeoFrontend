"use client";
import { useEffect, useState, use } from 'react';
import { API_BASE_URL } from '../../../../config';
import Link from 'next/link';

interface UserDetails {
    user: {
        _id: string;
        name: string;
        email: string;
        mobile?: string;
        countryCode?: string;
        createdAt: string;
    };
    plan: {
        planType: string;
        selectedAt: string;
        status: string;
    } | null;
    history: Array<{
        _id: string;
        previousPlan: string;
        requestedPlan: string;
        status: string;
        createdAt: string;
        receiptUrl?: string;
    }>;
    websites: Array<{
        _id: string;
        url: string;
        lastScanDate: string;
        createdAt: string;
    }>;
    reports: Array<{
        _id: string;
        website: { url: string };
        scanDate: string;
        seoScore: number;
        status: string;
    }>;
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = use(params);
    const [data, setData] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/details`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch user details');
                const result = await res.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [userId]);

    if (loading) return <div className="text-slate-400">Loading comprehensive profile...</div>;
    if (error) return <div className="text-red-400 p-8">Error: {error}</div>;
    if (!data) return <div className="text-slate-400 p-8">User not found.</div>;

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Header & Back Link */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link href="/admin/details" className="text-red-500 text-xs font-bold hover:underline mb-2 block">← Back to Directory</Link>
                    <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>{data.user.name}</h1>
                    <p className="text-slate-400 font-mono text-sm">{data.user.email}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Account Created</span>
                    <span className="text-white font-medium">{new Date(data.user.createdAt).toLocaleString()}</span>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 border-slate-800/50">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-4">Current Plan</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white tracking-tight">{data.plan?.planType || 'Free'}</span>
                        <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px] font-bold uppercase border border-green-500/20">
                            {data.plan?.status || 'Active'}
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-3">Selected: {data.plan ? new Date(data.plan.selectedAt).toLocaleDateString() : 'N/A'}</p>
                </div>

                <div className="glass-panel p-6 border-slate-800/50">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-4">Websites Audited</p>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-white">{data.websites.length}</span>
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-slate-400 text-xs mt-3">Total domains associated with account</p>
                </div>

                <div className="glass-panel p-6 border-slate-800/50">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-4">Total Reports</p>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-white">{data.reports.length}</span>
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-slate-400 text-xs mt-3">Total scan events performed</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plan & Upgrade History */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white">Plan & Upgrade History</h2>
                        <div className="h-px flex-1 bg-slate-800"></div>
                    </div>

                    <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-800">
                        {data.history.length > 0 ? data.history.map((record, idx) => (
                            <div key={record._id} className="relative">
                                <div className={`absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 border-slate-950 ${record.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <div className="bg-white/[0.03] rounded-xl p-4 border border-slate-800/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${record.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {record.status}
                                        </span>
                                        <span className="text-slate-500 text-xs">{new Date(record.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-white text-sm font-medium">
                                        {record.previousPlan} ➔ {record.requestedPlan}
                                    </p>
                                    {record.receiptUrl && (
                                        <a href={`${API_BASE_URL}${record.receiptUrl}`} target="_blank" className="text-blue-500 text-[10px] hover:underline mt-2 block">View Payment Receipt</a>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-sm">No recorded upgrade actions for this user.</p>
                        )}
                    </div>
                </section>

                {/* Search & Audit Activity */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white">Search & Audit Activity</h2>
                        <div className="h-px flex-1 bg-slate-800"></div>
                    </div>

                    <div className="glass-panel overflow-hidden border-slate-800/50">
                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                            {data.reports.length > 0 ? data.reports.map(report => (
                                <div key={report._id} className="p-4 border-b border-slate-900/50 hover:bg-white/[0.02] transition-colors flex justify-between items-center group">
                                    <div>
                                        <p className="text-white text-sm font-medium truncate max-w-[200px]">{report.website.url}</p>
                                        <p className="text-slate-500 text-[10px] flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {new Date(report.scanDate).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-slate-500 text-[9px] uppercase font-bold mb-1">Score</p>
                                            <span className={`text-sm font-mono font-bold ${report.seoScore > 80 ? 'text-green-500' : report.seoScore > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                                                {report.seoScore}%
                                            </span>
                                        </div>
                                        <Link 
                                            href={`/admin/reports/${report._id}`}
                                            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-500 text-sm">No report history found.</div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Websites Managed</p>
                        <div className="flex flex-wrap gap-2">
                            {data.websites.map(site => (
                                <span key={site._id} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                                    {site.url}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
