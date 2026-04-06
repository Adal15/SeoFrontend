"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Invalid admin credentials');
            }

            localStorage.setItem('adminToken', data.token);
            router.push('/admin/dashboard');
        } catch (err: any) {
            console.error("Admin login error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-slate-950">
            <div className="glass-panel w-full max-w-md p-10 animate-fade-in relative overflow-hidden border-red-500/20">
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-red-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                
                <div className="text-center mb-10 relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>Admin Access</h2>
                    <p className="text-slate-400 text-sm">Restricted Area. Authorized Personnel Only.</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm relative z-10">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-inner"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-inner"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold py-3 px-4 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all duration-300 disabled:opacity-50">
                        {loading ? 'Authenticating...' : 'Enter System'}
                    </button>
                </form>
            </div>
        </div>
    );
}
