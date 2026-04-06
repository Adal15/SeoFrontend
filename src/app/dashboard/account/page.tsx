"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';

export default function AccountPage() {
    const [account, setAccount] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }
                const res = await fetch(`${API_BASE_URL}/api/plans/current`, {
                    headers: {  
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAccount(data);
                } else {
                    setError('Failed to load account details.');
                }
            } catch (err: any) {
                console.error("Failed to fetch account info:", err);
                setError(err.message || 'Error loading data.');
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
    }, [router]);

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto animate-fade-in relative z-10 flex justify-center py-20">
                <div className="text-slate-400">Loading account details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-4xl mx-auto animate-fade-in relative z-10">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    if (!account) return null;

    const getPlanFeatures = (planType: string) => {
        switch(planType) {
            case 'Basic Report':
                return ['Basic SEO Audit', 'Single Website Support', 'Weekly Reports', 'Community Support'];
            case 'Advanced Report':
                return ['Full SEO Audit', 'Technical SEO Checks', 'Up to 5 Websites', 'Priority Email Support', 'Keyword Tracking'];
            case 'Expert Report':
                return ['Advanced SEO Audit', 'SEO Fix Instructions', 'Performance Analysis', '25 Websites', 'Real-time Reports', '24/7 Dedicated Support', 'Competitor Analysis', 'API Access'];
            default:
                return [];
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in relative z-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>My Account</h1>
                <p className="text-slate-400">Manage your subscription and view your current plan details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Information */}
                <div className="glass-panel p-6 border-t-[3px] border-t-blue-500">
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Profile Information</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Full Name</p>
                            <p className="text-lg text-slate-200 font-medium">{account.user?.name || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Email Address</p>
                            <p className="text-lg text-slate-200 font-medium">{account.user?.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Member Since</p>
                            <p className="text-lg text-slate-200 font-medium">
                                {account.user?.joinDate ? new Date(account.user.joinDate).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subscription Details */}
                <div className="glass-panel p-6 border-t-[3px] border-t-indigo-500">
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Plan Details</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Current Plan</p>
                                <p className="text-lg text-blue-400 font-bold">{account.planType}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full border border-green-500/20">
                                Active
                            </span>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                            {getPlanFeatures(account.planType).map(feature => (
                                <div key={feature} className="flex items-center gap-3 text-slate-300 text-sm">
                                    <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        
                        <div className="pt-4 mt-4 border-t border-slate-800/50">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm text-slate-300">Scans Remaining</span>
                                        {account.scanLimitOverride !== null && account.scanLimitOverride !== undefined && (
                                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase tracking-wider transition-all hover:bg-blue-500/20">Custom Limit</span>
                                        )}
                                    </div>
                                    <p className={`text-2xl font-bold ${account.scansLeft === 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {account.scansLeft}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400 mb-1">Total Usage</p>
                                    <p className="text-lg text-slate-200 font-medium">
                                        {account.websiteCount} / {account.totalLimit}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Progress Bar for Usage */}
                            {typeof account.totalLimit === 'number' && (
                                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden shadow-inner">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                            (account.websiteCount / account.totalLimit) > 0.9 ? 'bg-red-500' : (account.websiteCount / account.totalLimit) > 0.7 ? 'bg-orange-500' : 'bg-blue-500'
                                        }`}
                                        style={{ width: `${Math.min(100, (account.websiteCount / account.totalLimit) * 100)}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button 
                                onClick={() => router.push('/plans')}
                                className="w-full bg-slate-800 hover:bg-slate-700 transition-colors text-white py-2.5 rounded-lg border border-slate-600 text-sm font-medium"
                            >
                                Upgrade Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
