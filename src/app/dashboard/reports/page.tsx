"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';

export default function ReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/reports`, {
                    headers: {  
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setReports(data);
                } else if (res.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error("Failed to fetch reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in relative z-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>My Reports</h1>
                    <p className="text-slate-400">View and manage all your historical SEO audits.</p>
                </div>
            </div>

            <div className="glass-panel p-6 border-t-[3px] border-t-blue-500">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700/50">
                                <th className="py-4 px-4 text-slate-400 font-medium text-sm">Website</th>
                                <th className="py-4 px-4 text-slate-400 font-medium text-sm">Date</th>
                                <th className="py-4 px-4 text-slate-400 font-medium text-sm">SEO Score</th>
                                <th className="py-4 px-4 text-slate-400 font-medium text-sm">Technical Score</th>
                                <th className="py-4 px-4 text-slate-400 font-medium text-sm">Performance Score</th>
                                <th className="py-4 px-4 text-slate-400 font-medium text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-5 px-4 text-center text-slate-400">Loading reports...</td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-5 px-4 text-center text-slate-400">No scans found. Start your first audit!</td>
                                </tr>
                            ) : (
                                reports.map((report: any) => (
                                    <tr
                                        key={report._id}
                                        onClick={() => router.push(`/dashboard/reports/${report._id}`)}
                                        className="border-b border-slate-800/50 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                                    >
                                        <td className="py-5 px-4 text-white font-medium group-hover:text-blue-400 transition-colors">
                                            {report.website?.url || 'Unknown Website'}
                                        </td>
                                        <td className="py-5 px-4 text-slate-400 text-sm">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-5 px-4">
                                            {(!report.status || report.status === 'completed') ? (
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${report.seoScore >= 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    report.seoScore >= 50 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}>
                                                    {report.seoScore}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-5 px-4">
                                            {(!report.status || report.status === 'completed') ? (
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${report.technicalScore >= 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    report.technicalScore >= 50 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}>
                                                    {report.technicalScore}
                                                </span>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </td>
                                        <td className="py-5 px-4">
                                            {(!report.status || report.status === 'completed') ? (
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${report.performanceScore >= 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    report.performanceScore >= 50 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}>
                                                    {report.performanceScore}
                                                </span>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </td>
                                        <td className="py-5 px-4 text-slate-300 text-sm capitalize">{report.status || 'completed'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
