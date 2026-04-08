"use client";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { PolarArea, Doughnut } from 'react-chartjs-2';
import { use, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../../config';
import Link from 'next/link';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

// ─── Status helpers ───────────────────────────────────────────────────────────

type StatusType = 'pass' | 'warn' | 'fail' | 'info';

function StatusBadge({ status }: { status: StatusType }) {
    const cfg = {
        pass: { icon: '✅', label: 'Pass',    cls: 'bg-green-500/10  text-green-400  border-green-500/20'  },
        warn: { icon: '⚠️', label: 'Warning', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
        fail: { icon: '❌', label: 'Error',   cls: 'bg-red-500/10    text-red-400    border-red-500/20'    },
        info: { icon: 'ℹ️', label: 'Info',    cls: 'bg-blue-500/10   text-blue-400   border-blue-500/20'   },
    }[status];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls} whitespace-nowrap`}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

// ─── Audit row ────────────────────────────────────────────────────────────────

function AuditRow({
    label, status, summary, fix, children, canShowFix = true
}: {
    label: string; status: StatusType; summary: string;
    fix?: string; children?: React.ReactNode;
    canShowFix?: boolean;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-slate-800/60 last:border-0">
            <div className="flex items-start gap-4 py-4 px-1">
                <div className="w-40 shrink-0">
                    <span className="text-slate-300 text-sm font-medium">{label}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 flex-wrap">
                        <StatusBadge status={status} />
                        <p className="text-slate-400 text-sm leading-relaxed">{summary}</p>
                    </div>
                    {children && <div className="mt-3">{children}</div>}
                </div>
                {(status === 'fail' || status === 'warn') && fix && canShowFix && (
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="shrink-0 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 rounded px-2 py-1 transition-colors whitespace-nowrap"
                    >
                        How to fix {open ? '▲' : '▼'}
                    </button>
                )}
            </div>
            {open && fix && canShowFix && (
                <div className="mx-1 mb-4 px-4 py-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm text-blue-200">
                    {fix}
                </div>
            )}
        </div>
    );
}

function CodeSnippet({ code }: { code: string }) {
    return (
        <pre className="bg-slate-950 border border-slate-700/50 rounded-lg p-3 text-xs text-red-300 overflow-x-auto font-mono mt-2">
            {code}
        </pre>
    );
}

function KeywordPills({ keywords }: { keywords: { word: string; count: number }[] }) {
    if (!keywords || keywords.length === 0) return <span className="text-slate-500 text-sm">No keywords found.</span>;
    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((k, i) => (
                <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/60 border border-slate-600/40 text-slate-200"
                >
                    <span>{k.word}</span>
                    <span className="bg-slate-600 text-slate-300 px-1.5 py-0.5 rounded-full text-[10px]">{k.count}</span>
                </span>
            ))}
        </div>
    );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
    return (
        <div className="glass-panel overflow-hidden mb-6">
            <div className={`px-6 py-3 text-sm font-bold text-white tracking-widest uppercase border-b border-slate-700/50 ${color}`}>
                {title}
            </div>
            <div className="px-6 divide-y divide-slate-800/40">
                {children}
            </div>
        </div>
    );
}

function SearchPreview({ title, desc, url, mobile = false }: { title: string; desc: string; url: string; mobile?: boolean }) {
    return (
        <div className={`bg-white rounded-lg p-5 border border-slate-200 shadow-sm mb-4 ${mobile ? 'max-w-[360px]' : 'max-w-2xl'}`}>
            <div className="flex flex-col gap-1">
                <div className="text-[#1a0dab] hover:underline text-xl cursor-pointer leading-tight font-medium truncate">
                    {title || 'Missing Title'}
                </div>
                <div className="text-[#006621] text-sm truncate">
                    {url || 'https://example.com'}
                </div>
                <p className="text-[#4d5156] text-sm mt-1 line-clamp-2">
                    {desc || 'No description provided. Add a meta description to improve search appearance.'}
                </p>
            </div>
        </div>
    );
}

function MobileSnapshot({ url }: { url: string }) {
    if (!url) return null;
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    return (
        <div className="flex flex-col items-center bg-slate-900/40 rounded-xl p-6 border border-slate-700/30 w-full">
            <div className="relative w-[240px] h-[480px] bg-black rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-xl z-20"></div>
                 <img src={fullUrl} alt="Mobile Snapshot" className="w-full h-full object-cover" />
            </div>
            <p className="text-slate-500 text-[10px] mt-4 italic uppercase tracking-widest">Mobile Live Preview</p>
        </div>
    );
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
    const color = score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';
    const r = 28, c = 2 * Math.PI * r;
    const dash = (score / 100) * c;
    return (
        <div className="flex flex-col items-center gap-1">
            <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
                <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
                    strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
                    transform="rotate(-90 36 36)" />
                <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill={color}>{score}</text>
            </svg>
            <span className="text-xs text-slate-400">{label}</span>
        </div>
    );
}

export default function AdminReportDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userPlanType, setUserPlanType] = useState('Basic Report');
    const [showAllH2, setShowAllH2] = useState(false);
    const [showAllImages, setShowAllImages] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await fetch(`${API_BASE_URL}/api/reports/${resolvedParams.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.status === 401) { window.location.href = '/admin/login'; return; }
                if (!res.ok) throw new Error('Failed to fetch report');
                const data = await res.json();
                setReport(data);
                setUserPlanType((data.planType || 'Basic Report').trim());
            } catch (err: any) { setError(err.message); } finally { setLoading(false); }
        };
        if (resolvedParams.id) fetchReport();
    }, [resolvedParams.id]);

    if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">Loading detailed administrative audit…</div>;
    if (error || !report) return <div className="p-8 text-center text-red-400">Error: {error || 'Report not found'}</div>;

    const titleStatusToStatus = (s: string): StatusType => s === 'ok' ? 'pass' : s === 'missing' ? 'fail' : 'warn';
    const metaStatusToStatus = (s: string): StatusType => s === 'ok' ? 'pass' : s === 'missing' ? 'fail' : 'warn';

    const titleSummary = () => report.titleText ? `"${report.titleText}" — ${report.titleLength} chars.` : 'No <title> found.';
    const metaSummary = () => report.metaDescText ? `"${report.metaDescText.slice(0, 80)}..." — ${report.metaDescLength} chars.` : 'No meta description found.';
    const h1Summary = () => report.h1Count === 1 ? 'Exactly one H1 found. ✓' : report.h1Count === 0 ? 'No H1 found.' : `Too many H1 tags (${report.h1Count}).`;
    const h2Summary = () => report.h2Count ? `${report.h2Count} H2 tags found.` : 'No H2 tags found.';
    const imgSummary = () => (report.missingAltImages?.length || 0) === 0 ? `All ${report.totalImages || 0} images have alt text.` : `Missing alt for ${report.missingAltImages.length} images.`;
    const responsiveSummary = () => (report.hasViewportMeta && report.hasMediaQueries) ? 'Site is mobile-friendly (Viewport & Media Queries detected).' : 'Site may not be mobile-friendly.';
    
    // Admins see all fixes
    const isExpert = true; 

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in relative z-10">
            <div className="mb-8">
                <Link href="/admin/reports" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Logs
                </Link>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider">Internal Audit View</span>
                            <h1 className="text-3xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Full Diagnostic Report</h1>
                        </div>
                        <p className="text-slate-400">Website: <span className="text-blue-400 font-mono text-sm underline">{report.website?.url || 'Unknown'}</span></p>
                    </div>
                    <div className="flex gap-5 glass-panel px-5 py-3 rounded-xl border-slate-800/50">
                        <ScoreCircle score={report.technicalScore || 0} label="Technical" />
                        <ScoreCircle score={report.performanceScore || 0} label="Performance" />
                        <ScoreCircle score={report.seoScore || 0} label="Overall" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 flex flex-col items-center justify-center border-slate-800/50">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 w-full">Diagnostic Chart</h3>
                    <div className="w-full max-w-[220px]">
                        <PolarArea data={{
                            labels: ['Technical', 'Performance', 'Overall'],
                            datasets: [{
                                data: [report.technicalScore || 0, report.performanceScore || 0, report.seoScore || 0],
                                backgroundColor: ['rgba(59,130,246,0.3)', 'rgba(239, 68, 68, 0.3)', 'rgba(16, 185, 129, 0.3)'],
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderWidth: 1
                            }]
                        }} options={{ scales: { r: { angleLines: { display: false }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false } } }, plugins: { legend: { display: false } } } as any} />
                    </div>
                </div>
                <div className="glass-panel p-6 lg:col-span-2 border-slate-800/50">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Critical Observations</h3>
                    <div className="space-y-3">
                        {report.issues?.map((iss: any, i: number) => (
                            <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/40">
                                <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-black border ${iss.impact === 'High' ? 'text-red-400 border-red-500/20' : 'text-blue-400 border-blue-500/20'}`}>{iss.impact}</span>
                                <div><p className="text-white text-sm font-medium">{iss.issue}</p><p className="text-slate-500 text-xs mt-0.5">{iss.recommendation}</p></div>
                            </div>
                        )) || <div className="text-slate-500 italic p-4 text-sm">No significant issues logged.</div>}
                    </div>
                </div>
            </div>

            <Section title="Basic Audit" color="bg-slate-800/20">
                <AuditRow label="Target Keywords" status="info" summary="Automated identification:"><KeywordPills keywords={report.keywords || []} /></AuditRow>
                <AuditRow label="SEO Title" status={titleStatusToStatus(report.titleStatus)} summary={titleSummary()} />
                <AuditRow label="Meta Description" status={metaStatusToStatus(report.metaDescStatus)} summary={metaSummary()} />
                <AuditRow label="H1 Analysis" status={report.h1Count === 1 ? 'pass' : 'fail'} summary={h1Summary()} />
                <AuditRow label="H2 Structure" status={report.h2Count > 0 ? 'pass' : 'warn'} summary={h2Summary()} />
                <AuditRow label="Image ALT" status={(report.missingAltImages?.length || 0) === 0 ? 'pass' : 'fail'} summary={imgSummary()} />
            </Section>

            <Section title="Advanced SEO & Authority" color="bg-slate-800/20">
                <AuditRow label="Desktop Preview" status="info" summary="Rendered Search Result:"><SearchPreview title={report.titleText} desc={report.metaDescText} url={report.website?.url} /></AuditRow>
                <AuditRow label="Canonicalization" status={report.canonicalUrl ? 'pass' : 'warn'} summary={report.canonicalUrl || 'No canonical tag present.'} />
                <AuditRow label="Mobile Readiness" status="info" summary="Rendered Mobile Preview:"><SearchPreview title={report.titleText} desc={report.metaDescText} url={report.website?.url} mobile /></AuditRow>
                <AuditRow label="Live Screenshot" status="info" summary="Current state capture:"><MobileSnapshot url={report.mobileSnapshotUrl} /></AuditRow>
                <AuditRow label="OpenGraph Tags" status={report.ogTags?.title ? 'pass' : 'warn'} summary={report.ogTags?.title ? 'OG metadata found.' : 'Missing social metadata.'} />
                <AuditRow label="Schema.org" status={report.hasSchemaData ? 'pass' : 'warn'} summary={report.hasSchemaData ? 'JSON-LD detected.' : 'No structured data.'} />
                <AuditRow label="Sitemaps" status={report.hasSitemap ? 'pass' : 'fail'} summary={report.hasSitemap ? 'Sitemap discovered.' : 'No sitemap discovered.'} />
                <AuditRow label="Robots.txt" status={report.hasRobotsTxt ? 'pass' : 'fail'} summary={report.hasRobotsTxt ? 'Robots.txt found.' : 'Robots.txt missing.'} />
                <AuditRow label="Search Authority" status={report.googleRanking?.rank > 0 ? 'pass' : 'info'} summary={report.googleRanking?.rank > 0 ? `Detected at #${report.googleRanking.rank} on Google.` : "Not detected in top search results."} />
                <AuditRow label="Broken Links" status={report.brokenLinks?.length === 0 ? 'pass' : 'warn'} summary={report.brokenLinks?.length === 0 ? 'Clean link structure.' : `${report.brokenLinks.length} broken links.`} />
            </Section>

            <Section title="Performance & Technical" color="bg-red-500/10">
                <div className="flex items-center gap-6 p-6 glass-panel mb-4 mx-4 mt-4 border-slate-800/60">
                    <div className="w-24 h-24 rounded-full border-8 border-red-500/30 flex items-center justify-center text-4xl font-black text-white">{report.performanceScore >= 80 ? 'A' : 'F'}</div>
                    <div><h4 className="text-xl font-bold text-white mb-2">Technical Health: {report.performanceScore}%</h4><p className="text-slate-500 text-sm">Review of server overhead, script execution, and asset delivery speeds.</p></div>
                </div>
                <AuditRow label="Server Response" status="pass" summary={`${((report.performanceDetails?.serverResTime || 0) / 1000).toFixed(2)}s`} />
                <AuditRow label="Total Payload" status="pass" summary={`${((report.performanceDetails?.imgSize || 0) + (report.performanceDetails?.jsSize || 0)).toFixed(2)}MB Total weight.`} />
                <AuditRow label="JS Compatibility" status={report.jsErrors === 0 ? 'pass' : 'fail'} summary={report.jsErrors === 0 ? 'No script errors.' : `Reported ${report.jsErrors} errors.`} />
                <AuditRow label="Mobile Features" status={report.hasAMP ? 'pass' : 'warn'} summary={report.hasAMP ? 'AMP Enabled.' : 'Standard Mobile (Non-AMP).'} />
                <AuditRow label="Protocol Optimization" status={report.hasHttp2 ? 'pass' : 'fail'} summary={report.hasHttp2 ? 'HTTP/2 Active.' : 'Legacy HTTP Protocol.'} />
            </Section>
        </div>
    );
}
