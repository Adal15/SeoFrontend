"use client";
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../config';
import Pagination from '../../../components/Pagination';
import Link from 'next/link';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Handle debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchReports = async (page = 1, search = '') => {
        try {
            console.log(`[Admin Feed] Fetching Page: ${page}, Search: "${search}"`);
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/api/admin/reports?page=${page}&limit=10&search=${search}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch platform interaction history');

            const data = await res.json();
            
            // Handle both new paginated object and old array response
            if (data && data.reports && Array.isArray(data.reports)) {
                setReports(data.reports);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 1);
            } else if (Array.isArray(data)) {
                setReports(data);
                setTotalPages(1);
                setCurrentPage(1);
            } else {
                setReports([]);
            }
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(1, debouncedSearch);
    }, [debouncedSearch]);

    if (loading) return <div className="text-slate-400">Loading systemic interaction history...</div>;
    if (error) return <div className="text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</div>;

    return (
        <div className="space-y-10 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>System Logs</h1>
                <p className="text-slate-400">A comprehensive history of every SEO audit performed within the platform.</p>
            </header>

            <div className="relative max-w-md w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    type="text" 
                    placeholder="Search by URL, Name or Email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 transition-all"
                />
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            <section className={`glass-panel p-8 border-slate-800/50 transition-opacity ${loading && debouncedSearch === searchTerm ? 'opacity-50' : 'opacity-100'}`}>
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
                                    <td className="py-5 px-4">
                                        <Link 
                                            href={`/admin/reports/${report._id}`}
                                            className="text-blue-400 font-mono text-xs opacity-80 decoration-slate-600 underline-offset-4 hover:underline hover:opacity-100 transition-all"
                                        >
                                            {report.website?.url || "N/A"}
                                        </Link>
                                    </td>
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

                    {reports.length === 0 && !loading && (
                        <div className="py-20 text-center">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-white font-bold mb-2">No Reports Found</h3>
                            <p className="text-slate-500 text-sm">We couldn't find any activities matching "{debouncedSearch}"</p>
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="mt-6 text-red-400 hover:text-red-300 text-sm font-bold underline underline-offset-4"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>

                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => fetchReports(page, debouncedSearch)}
                />
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
