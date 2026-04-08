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
    websiteCount?: number;
    scanLimitOverride?: number | null;
}

export default function AllUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch users');

            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: User) => {
        setEditingId(user._id);
        setEditValue(user.scanLimitOverride !== null && user.scanLimitOverride !== undefined ? String(user.scanLimitOverride) : '');
    };

    const handleSaveLimit = async (userId: string) => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const finalValue = editValue === '' ? null : Number(editValue);
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/limit`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ scanLimitOverride: finalValue })
            });
            if (!res.ok) throw new Error('Failed to update limit');

            // Re-fetch users to confirm persistence and update table
            await fetchUsers();
            setEditingId(null);
        } catch (err) {
            console.error(err);
            alert('Failed to update limit');
        } finally {
            setIsSaving(false);
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
            fetchUsers();
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
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert('Failed to reject plan');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div className="text-slate-400">Loading user database...</div>;
    if (error) return <div className="text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</div>;

    return (
        <div className="space-y-10 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>Registered Users</h1>
                <p className="text-slate-400">Complete list of accounts registered on the platform.</p>
            </header>

            <section className="glass-panel p-8 border-slate-800/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-4 font-medium">Name</th>
                                <th className="py-4 px-4 font-medium">Email</th>
                                <th className="py-4 px-4 font-medium">Mobile</th>
                                <th className="py-4 px-4 font-medium">Current Plan</th>
                                <th className="py-4 px-4 font-medium">Scans (Used / Limit)</th>
                                <th className="py-4 px-4 font-medium text-right">Joined On</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300">
                            {users.map(user => (
                                <tr key={user._id} className="border-b border-slate-900/50 hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-4 font-medium text-white">{user.name}</td>
                                    <td className="py-5 px-4 text-slate-400 font-mono text-xs">{user.email}</td>
                                    <td className="py-5 px-4 text-slate-500 font-mono text-xs">
                                        {user.countryCode} {user.mobile || "N/A"}
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase w-fit ${user.plan?.toLowerCase() === 'enterprise' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : user.plan?.toLowerCase() === 'basic report' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                                {user.plan}
                                            </span>
                                            {user.planStatus === 'pending' && (
                                                <div className="flex flex-col gap-1 mt-1 p-2 bg-amber-500/5 border border-amber-500/20 rounded">
                                                    <span className="text-[9px] text-amber-500 font-bold uppercase">Pending: {user.pendingPlanType}</span>
                                                    <div className="flex gap-2">
                                                        <a
                                                            href={`${API_BASE_URL}${user.receiptUrl}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[9px] text-blue-400 hover:underline font-bold"
                                                        >
                                                            View Receipt
                                                        </a>
                                                        <button onClick={() => handleApprovePlan(user._id)} className="text-[9px] text-green-500 hover:underline font-bold">Approve</button>
                                                        <button onClick={() => handleRejectPlan(user._id)} className="text-[9px] text-red-500 hover:underline font-bold">Reject</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-5 px-4">
                                        {editingId === user._id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    placeholder="Default"
                                                    className="w-20 bg-slate-800/50 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                                    min="0"
                                                />
                                                <button
                                                    onClick={() => handleSaveLimit(user._id)}
                                                    disabled={isSaving}
                                                    className={`text-green-400 text-[10px] hover:underline font-medium ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {isSaving ? 'Saving...' : 'Save'}
                                                </button>
                                                <button onClick={() => setEditingId(null)} disabled={isSaving} className="text-slate-400 text-[10px] hover:underline font-medium">Cancel</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-300 text-xs font-mono">
                                                    {user.websiteCount || 0} / {user.scanLimitOverride !== null && user.scanLimitOverride !== undefined ? (
                                                        <span className="text-blue-400 font-bold">{user.scanLimitOverride}</span>
                                                    ) : (
                                                        user.plan === 'Basic Report' ? 1 : user.plan === 'Advanced Report' ? 5 : '∞'
                                                    )}
                                                </span>
                                                <button onClick={() => handleEditClick(user)} className="text-blue-400 text-[10px] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-5 px-4 text-right text-slate-500 text-xs">
                                        {new Date(user.createdAt).toLocaleDateString()}
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
