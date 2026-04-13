"use client";
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../config';
import Link from 'next/link';

interface User {
    _id: string;
    name: string;
    email: string;
    plan: string;
    createdAt: string;
}

export default function DetailsSelectionPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="text-slate-400">Loading directory...</div>;

    return (
        <div className="space-y-10 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>User Directory</h1>
                <p className="text-slate-400">Select a user to view their complete activity history and details.</p>
            </header>

            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                />
            </div>

            <section className="glass-panel border-slate-800/50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="py-4 px-6 font-medium">User</th>
                            <th className="py-4 px-6 font-medium">Email</th>
                            <th className="py-4 px-6 font-medium">Status</th>
                            <th className="py-4 px-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300">
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="border-b border-slate-900/50 hover:bg-white/[0.02] transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-xs">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                        <span className="font-medium text-white">{user.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-slate-400">{user.email}</td>
                                <td className="py-4 px-6">
                                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                                        {user.plan}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <Link 
                                        href={`/admin/details/${user._id}`}
                                        className="text-red-500 hover:text-red-400 font-bold text-xs transition-colors"
                                    >
                                        View Full Details →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
