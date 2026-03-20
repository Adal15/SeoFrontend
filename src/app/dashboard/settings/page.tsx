export default function SettingsPage() {
    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in relative z-10 pt-10">
            <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>Settings</h1>
                    <p className="text-slate-400">Manage your account and preferences.</p>
                </div>

                <div className="relative z-10 text-slate-300">
                    <p>Settings coming soon!</p>
                </div>
            </div>
        </div>
    );
}
