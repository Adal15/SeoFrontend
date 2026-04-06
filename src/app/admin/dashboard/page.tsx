"use client";
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../config';

interface Interaction {
    _id: string;
    website: { url: string };
    user: { name: string; email: string };
    seoScore: number;
    technicalScore: number;
    performanceScore: number;
    status: string;
    createdAt: string;
}

interface Stats {
    totalUsers: number;
    totalWebsites: number;
    totalReports: number;
    recentReports: Interaction[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error('Failed to fetch admin statistics');

                const data = await res.json();
                setStats(data);
            } catch (err: any) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-slate-400">Loading comprehensive analytics...</div>;
    if (error) return <div className="text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</div>;

    return (
        <div className="space-y-10 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>System Overview</h1>
                <p className="text-slate-400">Real-time platform metrics and global user interactions.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminStatCard title="Global Users" value={stats?.totalUsers || 0} icon="👥" color="blue" />
                <AdminStatCard title="Analyzed Sites" value={stats?.totalWebsites || 0} icon="🌐" color="emerald" />
                <AdminStatCard title="Total Audits" value={stats?.totalReports || 0} icon="📊" color="amber" />
            </div>

            {/* Interaction Feed */}
            <section className="glass-panel p-8 border-slate-800/50">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>Global Interaction Feed</h2>
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded">Last 10 Activities</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-4 font-medium">User / Account</th>
                                <th className="py-4 px-4 font-medium">Website Target</th>
                                <th className="py-4 px-4 font-medium">Scores (S/T/P)</th>
                                <th className="py-4 px-4 font-medium">Timestamp</th>
                                <th className="py-4 px-4 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {stats?.recentReports.map(report => (
                                <tr key={report._id} className="border-b border-slate-900/50 hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-4">
                                        <div className="text-white font-medium">{report.user?.name || 'Deleted User'}</div>
                                        <div className="text-slate-500 text-xs">{report.user?.email || 'Unknown'}</div>
                                    </td>
                                    <td className="py-5 px-4 text-blue-400 font-mono text-xs opacity-80 decoration-slate-600 underline-offset-4 hover:underline cursor-pointer">
                                        {report.website?.url || 'URL Removed'}
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex gap-2">
                                            <ScoreBadge score={report.seoScore} />
                                            <ScoreBadge score={report.technicalScore} />
                                            <ScoreBadge score={report.performanceScore} />
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 text-slate-400">
                                        {new Date(report.createdAt).toLocaleString()}
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${report.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function AdminStatCard({ title, value, icon, color }: any) {
    return (
        <div className="glass-panel p-6 border-slate-800/50 hover:border-red-500/30 transition-all border-b-2 border-b-red-500/20">
            <div className="flex justify-between items-start mb-4">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</span>
                <span className="text-2xl">{icon}</span>
            </div>
            <div className="text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>{value.toLocaleString()}</div>
        </div>
    );
}

function ScoreBadge({ score }: { score: number }) {
    const color = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
    return (
        <span className={`w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold ${color}`}>
            {score}
        </span>
    );
}
