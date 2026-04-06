"use client";
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../config';

interface User {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    countryCode?: string;
    plan: string;
    pendingPlanType?: string | null;
    receiptUrl?: string | null;
    planStatus?: string;
    createdAt: string;
}

export default function UpgradeRequestsPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch upgrade requests');

            const data: User[] = await res.json();
            // Filter for only pending requests
            const pendingRequests = data.filter(user => user.planStatus === 'pending');
            setUsers(pendingRequests);
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePlan = async (userId: string) => {
        if (!confirm('Are you sure you want to approve this plan upgrade?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/approve-plan`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to approve plan');
            alert('Plan approved successfully');
            fetchRequests();
        } catch (err) {
            console.error(err);
            alert('Failed to approve plan');
        }
    };

    const handleRejectPlan = async (userId: string) => {
        if (!confirm('Are you sure you want to reject this plan upgrade?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/reject-plan`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to reject plan');
            alert('Plan request rejected');
            fetchRequests();
        } catch (err) {
            console.error(err);
            alert('Failed to reject plan');
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (loading) return <div className="text-slate-400">Loading upgrade requests...</div>;
    if (error) return <div className="text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</div>;

    return (
        <div className="space-y-10 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>Upgrade Requests & PDF Verification</h1>
                <p className="text-slate-400">Manage all pending plan upgrade requests and verify payment proofs.</p>
            </header>

            {users.length === 0 ? (
                <div className="glass-panel p-12 text-center border-slate-800/50">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">Inbox Clean!</h3>
                    <p className="text-slate-500 text-sm">No pending upgrade requests at the moment.</p>
                </div>
            ) : (
                <section className="glass-panel p-8 border-slate-800/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="py-4 px-4 font-medium">User</th>
                                    <th className="py-4 px-4 font-medium">Current Plan</th>
                                    <th className="py-4 px-4 font-medium">Requested Plan</th>
                                    <th className="py-4 px-4 font-medium">Payment Proof</th>
                                    <th className="py-4 px-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-300">
                                {users.map(user => (
                                    <tr key={user._id} className="border-b border-slate-900/50 hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-5 px-4 font-medium text-white">
                                            <div className="flex flex-col">
                                                <span>{user.name}</span>
                                                <span className="text-[10px] text-slate-500 font-mono">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                {user.pendingPlanType}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4">
                                            <a 
                                                href={`${API_BASE_URL}${user.receiptUrl}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 transition-all font-bold text-[10px]"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                VIEW PDF/IMG
                                            </a>
                                        </td>
                                        <td className="py-5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => handleApprovePlan(user._id)} 
                                                    className="px-3 py-1.5 rounded bg-green-600 text-white font-bold text-[10px] hover:bg-green-500 transition-all shadow-lg shadow-green-900/20"
                                                >
                                                    APPROVE
                                                </button>
                                                <button 
                                                    onClick={() => handleRejectPlan(user._id)} 
                                                    className="px-3 py-1.5 rounded bg-slate-800 text-slate-400 font-bold text-[10px] hover:bg-red-600 hover:text-white transition-all"
                                                >
                                                    REJECT
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}
