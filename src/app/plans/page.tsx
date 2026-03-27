"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';

const plans = [
    {
        name: 'Basic Report',
        price: 'Free',
        description: 'Perfect for small websites looking to get started with SEO.',
        features: ['Basic SEO Audit', 'Single Website Support', 'Weekly Reports', 'Community Support'],
        gradient: 'from-blue-500/20 to-cyan-500/20',
        border: 'border-blue-500/30',
        buttonClass: 'bg-blue-600 hover:bg-blue-500'
    },
    {
        name: 'Advanced Report',
        price: '$29/mo',
        description: 'Best for growing businesses needing deeper insights.',
        features: ['Full SEO Audit', 'Up to 5 Websites', 'Daily Reports', 'Priority Email Support', 'Keyword Tracking'],
        gradient: 'from-indigo-500/20 to-purple-500/20',
        border: 'border-indigo-500/50',
        buttonClass: 'bg-indigo-600 hover:bg-indigo-500',
        popular: true
    },
    {
        name: 'Expert Report',
        price: '$99/mo',
        description: 'Comprehensive analysis for agencies and large enterprises.',
        features: ['Advanced SEO Audit', 'Unlimited Websites', 'Real-time Reports', '24/7 Dedicated Support', 'Competitor Analysis', 'API Access'],
        gradient: 'from-amber-600/20 to-orange-600/20',
        border: 'border-amber-500/30',
        buttonClass: 'bg-amber-600 hover:bg-amber-500'
    }
];

export default function PlansPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleSelectPlan = async (planName: string) => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_BASE_URL}/api/plans/select`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ planType: planName }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to select plan');
            }

            router.push('/dashboard');
        } catch (err: any) {
            console.error("Plan selection error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center">
            <div className="max-w-6xl w-full text-center mb-16 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
                    Choose Your <span className="text-blue-400">SEO Service Plan</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Select a plan that fits your business needs. You can change your plan at any time from your account settings.
                </p>
                {error && <div className="mt-8 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm max-w-md mx-auto">{error}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                {plans.map((plan, index) => (
                    <div 
                        key={plan.name}
                        className={`glass-panel relative p-8 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-slide-up`}
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>
                        )}
                        
                        <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-20 pointer-events-none rounded-[1rem]`}></div>
                        
                        <div className="relative z-10 mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                                {plan.price !== 'Free' && <span className="text-slate-400">/month</span>}
                            </div>
                            <p className="text-slate-400 text-sm">{plan.description}</p>
                        </div>

                        <div className="relative z-10 space-y-4 mb-10 flex-grow">
                            {plan.features.map(feature => (
                                <div key={feature} className="flex items-center gap-3 text-slate-300 text-sm">
                                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <button
                            disabled={loading}
                            onClick={() => handleSelectPlan(plan.name)}
                            className={`relative z-10 w-full py-4 rounded-xl font-bold text-white transition-all duration-300 transform active:scale-95 shadow-lg ${plan.buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                `Select ${plan.name}`
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <p className="mt-12 text-slate-500 text-sm animate-fade-in" style={{ animationDelay: '600ms' }}>
                All plans include a 14-day money back guarantee. No credit card required for Basic Report.
            </p>
        </div>
    );
}
