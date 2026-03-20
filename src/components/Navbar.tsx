import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-x-0 rounded-none bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">JTS SEO</span>
                            <span className="text-white">Analyzer</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">Features</Link>
                        <Link href="/pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">Pricing</Link>
                        <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">Login</Link>
                        <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
