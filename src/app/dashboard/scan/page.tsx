"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';

export default function ScanPage() {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');
    const [needsUpgrade, setNeedsUpgrade] = useState(false);
    const [limitMessage, setLimitMessage] = useState('');

    const router = useRouter();

    // Re-fetch account details on mount to ensure limits are up-to-date
    useEffect(() => {
        const fetchCurrentLimits = async () => {
            try {
                const token = localStorage.getItem('token');
                await fetch(`${API_BASE_URL}/api/plans/current`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // We don't necessarily need the data here as the Sidebar 
                // and other components will also be fetching it, 
                // but this ensures the backend 'PlanController' logs are triggered.
            } catch (err) {
                console.error("Failed to sync limits:", err);
            }
        };
        fetchCurrentLimits();
    }, []);

    const handleScan = async (e: any) => {
        e.preventDefault();
        setIsScanning(true);
        setError('');
        setNeedsUpgrade(false);

        try {
            const token = localStorage.getItem('token');
            const submitUrl = url.startsWith('http') ? url : `https://${url}`;

            const res = await fetch(`${API_BASE_URL}/api/reports/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ url: submitUrl })
            });

            const data = await res.json();

            if (res.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }

            if (!res.ok) {
                if (res.status === 403 && data.message === 'PLAN_LIMIT_REACHED') {
                    setNeedsUpgrade(true);
                    setLimitMessage(data.error);
                    return;
                }
                throw new Error(data.message || 'Failed to start scan');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in relative z-10 pt-10">
            {needsUpgrade ? (
                <div className="glass-panel p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="text-5xl mb-6">🚀</div>
                    <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>Plan Limit Reached</h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg hover:text-white transition-colors">
                        {limitMessage || "Your Basic Report plan allows scanning 1 website. Upgrade your plan to Advanced Report or Expert Report to analyze more websites."}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => setNeedsUpgrade(false)} className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer font-medium">
                            <span className="relative z-10">Go Back</span>
                        </button>
                        <button onClick={() => router.push('/plans')} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2">
                            <span>Upgrade Plan</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                    <div className="text-center mb-10 relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>Start New SEO Audit</h1>
                        <p className="text-slate-400">Enter your website URL below to begin a comprehensive technical and on-page analysis.</p>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm relative z-10 text-center">{error}</div>}

                    <form onSubmit={handleScan} className="relative z-10">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
                            <div className="flex bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-transparent transition-all shadow-inner">
                                <span className="flex items-center justify-center px-4 bg-slate-800/50 text-slate-500 font-medium">https://</span>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="flex-1 bg-transparent px-4 py-4 text-white placeholder-slate-500 focus:outline-none"
                                    placeholder="example.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isScanning}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-4 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center cursor-pointer"
                        >
                            {isScanning ? (
                                <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Running crawler...</>
                            ) : "Run Full Scan"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
