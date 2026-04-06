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
        features: ['Full SEO Audit', 'Up to 5 Websites',  'Priority Email Support', 'Keyword Tracking'],
        gradient: 'from-indigo-500/20 to-purple-500/20',
        border: 'border-indigo-500/50',
        buttonClass: 'bg-indigo-600 hover:bg-indigo-500',
        popular: true
    },
    {
        name: 'Expert Report',
        price: '$99/mo',
        description: 'Comprehensive analysis for agencies and large enterprises.',
        features: ['Advanced SEO Audit', '25 Websites', 'Real-time Reports', '24/7 Dedicated Support', 'Competitor Analysis', 'API Access'],
        gradient: 'from-amber-600/20 to-orange-600/20',
        border: 'border-amber-500/30',
        buttonClass: 'bg-amber-600 hover:bg-amber-500'
    }
];

export default function PlansPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [selectedPremiumPlan, setSelectedPremiumPlan] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [receipt, setReceipt] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    const initiatePlanSelection = (planName: string) => {
        if (planName === 'Basic Report') {
            handleSelectPlan(planName);
        } else {
            setSelectedPremiumPlan(planName);
            setShowPayment(true);
            setError('');
        }
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethod) {
            setError('Please select a payment method');
            return;
        }
        if (paymentMethod === 'bank' && !receipt) {
            setError('Please upload your payment receipt');
            return;
        }
        handleSelectPlan(selectedPremiumPlan, receipt);
    };

    // No longer forced to login to view plans

    const handleSelectPlan = async (planName: string, receiptFile: File | null = null) => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.setItem('selected_plan', planName);
            router.push('/login');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('planType', planName);
            if (receiptFile) {
                formData.append('receipt', receiptFile);
            }

            const res = await fetch(`${API_BASE_URL}/api/plans/select`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Note: Browser will automatically set multipart/form-data boundary
                },
                body: formData,
            });

            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Failed to select plan');
                }
                
                if (receiptFile) {
                    setIsSubmitted(true);
                    setShowPayment(false);
                } else {
                    router.push('/dashboard');
                }
            } else {
                const text = await res.text();
                console.error('[PlansPage] Non-JSON response received:', text.substring(0, 200));
                throw new Error('Server returned an invalid response. Please check your connection or contact support.');
            }
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
                    {showPayment ? 'Complete Your Payment' : <>Choose Your <span className="text-blue-400">SEO Service Plan</span></>}
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    {showPayment ? `You have selected the ${selectedPremiumPlan}. Securely pay to activate your new limits.` : 'Select a plan that fits your business needs. You can change your plan at any time from your account settings.'}
                </p>
                {error && <div className="mt-8 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm max-w-md mx-auto">{error}</div>}
                {isSubmitted && <div className="mt-8 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-sm max-w-md mx-auto font-medium">Your request has been submitted! Your upgradation will be approved by admin soon.</div>}
            </div>

            {showPayment ? (
                <div className="max-w-md w-full glass-panel p-8 relative overflow-hidden animate-slide-up">
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                    
                    <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-4">Payment Details</h3>
                    <form onSubmit={handlePayment} className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-300">Select Payment Method</label>
                            
                            <div className={`p-4 rounded-lg border opacity-50 cursor-not-allowed transition-all border-slate-700 bg-slate-800/50`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border border-slate-500`}>
                                        </div>
                                        <span className="text-slate-400 font-medium">Credit / Debit Card</span>
                                    </div>
                                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-bold uppercase tracking-wider">Currently not working</span>
                                </div>
                            </div>
                            

                            
                            <div className={`p-4 rounded-lg border opacity-50 cursor-not-allowed transition-all border-slate-700 bg-slate-800/50`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border border-slate-500`}>
                                        </div>
                                        <span className="text-slate-400 font-medium">UPI (GPay, PhonePe, Paytm)</span>
                                    </div>
                                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-bold uppercase tracking-wider">Currently not working</span>
                                </div>
                            </div>



                            <div className={`p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'}`} onClick={() => setPaymentMethod('bank')}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'bank' ? 'border-indigo-500' : 'border-slate-500'}`}>
                                        {paymentMethod === 'bank' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
                                    </div>
                                    <span className="text-white font-medium">Direct Bank Transfer (UAE)</span>
                                </div>
                            </div>

                            {paymentMethod === 'bank' && (
                                <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl animate-fade-in mt-2 space-y-4">
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-2">Account Details</p>
                                    
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="block text-[10px] text-slate-500 uppercase font-medium">Account Holder Name</label>
                                            <p className="text-sm text-white font-semibold">JTS Middle East FZE</p>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-slate-500 uppercase font-medium">Account Currency</label>
                                            <p className="text-sm text-white font-semibold">AED</p>
                                        </div>
                                        <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/50">
                                            <label className="block text-[10px] text-slate-500 uppercase font-medium mb-1 text-slate-500">IBAN</label>
                                            <p className="text-[11px] text-indigo-300 font-mono break-all leading-relaxed tracking-wider">AE130860000009914301354</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-slate-500 uppercase font-medium">BIC/SWIFT</label>
                                                <p className="text-xs text-white font-mono uppercase">WIOBAEADXXX</p>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-slate-500 uppercase font-medium">Account Number</label>
                                                <p className="text-xs text-white font-mono">9914301354</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-2 border-t border-slate-800/50 mt-2">
                                        <p className="text-[10px] text-slate-400 italic">Please include your name or email in the transfer notes for faster verification.</p>
                                    </div>

                                    <div className="pt-4 space-y-3">
                                        <label className="block text-xs font-medium text-slate-300">Upload Receipt (PDF or Image)</label>
                                        <div className="relative group">
                                            <input 
                                                type="file" 
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => setReceipt(e.target.files ? e.target.files[0] : null)}
                                                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer bg-slate-900/50 rounded-lg p-2 border border-slate-700/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowPayment(false)}
                                className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                            >
                                Back
                            </button>
                             <button
                                type="submit"
                                disabled={loading}
                                className={`w-2/3 py-3 rounded-xl font-bold text-white transition-all duration-300 bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center`}
                            >
                                {loading ? 'Processing...' : (paymentMethod === 'bank' ? 'Submit for Approval' : 'Pay & Upgrade')}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
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
                            onClick={() => initiatePlanSelection(plan.name)}
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
            )}

            <p className="mt-12 text-slate-500 text-sm animate-fade-in" style={{ animationDelay: '600ms' }}>
                All plans include a 14-day money back guarantee. No credit card required for Basic Report.
            </p>
        </div>
    );
}
