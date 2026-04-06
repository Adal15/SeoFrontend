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

export default function AllReportsPage() {
    const [reports, setReports] = useState<Interaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await fetch(`${API_BASE_URL}/api/admin/reports`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error('Failed to fetch platform interaction history');

                const data = await res.json();
                setReports(data);
            } catch (err: any) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div className="text-slate-400">Loading systemic interaction history...</div>;
    if (error) return <div className="text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</div>;

    return (
        <div className="space-y-10 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>System Logs</h1>
                <p className="text-slate-400">A comprehensive history of every SEO audit performed within the platform.</p>
            </header>

            <section className="glass-panel p-8 border-slate-800/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-4 font-medium">User Account</th>
                                <th className="py-4 px-4 font-medium">Website Target</th>
                                <th className="py-4 px-4 font-medium">Scores (S/T/P)</th>
                                <th className="py-4 px-4 font-medium">Audit Timestamp</th>
                                <th className="py-4 px-4 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300">
                            {reports.map(report => (
                                <tr key={report._id} className="border-b border-slate-900/50 hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-4 font-medium text-white">{report.user?.name || "Anonymous User"} <span className="text-xs font-normal text-slate-500 block">{report.user?.email}</span></td>
                                    <td className="py-5 px-4 text-blue-400 font-mono text-xs opacity-80 decoration-slate-600 underline-offset-4 hover:underline cursor-pointer">{report.website?.url || "N/A"}</td>
                                    <td className="py-5 px-4">
                                        <div className="flex gap-2">
                                            <ScoreBadge score={report.seoScore} />
                                            <ScoreBadge score={report.technicalScore} />
                                            <ScoreBadge score={report.performanceScore} />
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 text-slate-500 text-xs">
                                        {new Date(report.createdAt).toLocaleString()}
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${report.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
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

function ScoreBadge({ score }: { score: number }) {
    const color = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
    return (
        <span className={`w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold ${color}`}>
            {score}
        </span>
    );
}
