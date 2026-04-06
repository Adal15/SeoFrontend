import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-transparent pt-4 min-h-[calc(100vh-160px)]">
            <Sidebar />
            <main className="flex-1 w-full p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
