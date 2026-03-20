import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-transparent pt-4 min-h-[calc(100vh-160px)]">
            <aside className="w-64 border-r border-slate-800/50 glass-panel rounded-none border-y-0 border-l-0 hidden md:block mt-0 pt-0">
                <div className="h-full px-4 py-8 flex flex-col gap-2">
                    <Link href="/dashboard" className="px-4 py-3 rounded-lg bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20 transition-all hover:bg-blue-500/20">
                        Overview
                    </Link>
                    <Link href="/dashboard" className="px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                        My Reports
                    </Link>
                    <Link href="/dashboard/settings" className="px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                        Settings
                    </Link>
                </div>
            </aside>
            <main className="flex-1 w-full p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
