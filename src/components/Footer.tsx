export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-900/80 py-12 mt-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                <div className="text-2xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">JTS SEO</span>
                    <span className="text-white opacity-50">Analyzer</span>
                </div>
                <p className="text-slate-400">© 2026 JTS SEO Analyzer. All rights reserved.</p>
                <p className="text-sm text-slate-500 mt-2">Built for high-performance scale and aesthetic audits.</p>
            </div>
        </footer>
    );
}
