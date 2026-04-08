"use client";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { PolarArea, Doughnut } from 'react-chartjs-2';
import { use, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../../config';

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

// ─── Code snippet ─────────────────────────────────────────────────────────────

function CodeSnippet({ code }: { code: string }) {
    return (
        <pre className="bg-slate-950 border border-slate-700/50 rounded-lg p-3 text-xs text-red-300 overflow-x-auto font-mono mt-2">
            {code}
        </pre>
    );
}

// ─── Keyword pills ────────────────────────────────────────────────────────────

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

// ─── Section wrapper ──────────────────────────────────────────────────────────

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

// ─── Score circle ─────────────────────────────────────────────────────────────

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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReportDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showOnlyBasicSEO, setShowOnlyBasicSEO] = useState(false);
    const [userPlanType, setUserPlanType] = useState('Basic Report');
    const [showAllH2, setShowAllH2] = useState(false);
    const [showAllImages, setShowAllImages] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
                const res = await fetch(`${API_BASE_URL}/api/reports/${resolvedParams.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                
                if (!res.ok) throw new Error('Failed to fetch report');
                const data = await res.json();
                console.log('[DEBUG] Report Data:', data);
                setReport(data);
                
                // Also fetch current user plan as a more reliable source
                let currentPlan = 'Basic Report';
                try {
                    const planRes = await fetch(`${API_BASE_URL}/api/plans/current`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (planRes.ok) {
                        const planData = await planRes.json();
                        currentPlan = planData.planType || 'Basic Report';
                        console.log('[DEBUG] Fetched User Plan:', currentPlan);
                    } else if (data.planType) {
                        currentPlan = data.planType;
                    }
                } catch (planErr) {
                    console.error('[DEBUG] Plan fetch failed, using fallback:', planErr);
                    if (data.planType) currentPlan = data.planType;
                }

                setUserPlanType(currentPlan.trim());
                console.log('[DEBUG] Final Plan Type:', currentPlan.trim());

                if (currentPlan.trim() === 'Basic Report') {
                    console.log('[DEBUG] Forcing Basic SEO View');
                    setShowOnlyBasicSEO(true);
                } else {
                    console.log('[DEBUG] Allowing Full Report View');
                    setShowOnlyBasicSEO(false);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (resolvedParams.id) fetchReport();
    }, [resolvedParams.id]);

    if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">Loading your comprehensive SEO audit…</div>;
    if (error || !report) return <div className="p-8 text-center text-red-400">Error: {error || 'Report not found'}</div>;

    // ── Derived helpers ──────────────────────────────────────────────────────
    const titleStatusToStatus = (s: string): StatusType =>
        s === 'ok' ? 'pass' : s === 'missing' ? 'fail' : 'warn';

    const metaStatusToStatus = (s: string): StatusType =>
        s === 'ok' ? 'pass' : s === 'missing' ? 'fail' : 'warn';

    const titleSummary = () => {
        if (!report.titleText) return 'No <title> tag found on this page.';
        return `"${report.titleText}" — ${report.titleLength} characters (recommended: 50–60).`;
    };

    const metaSummary = () => {
        if (!report.metaDescText) return 'No meta description was found on this page.';
        return `"${report.metaDescText.slice(0, 80)}${report.metaDescText.length > 80 ? '…' : ''}" — ${report.metaDescLength} characters (recommended: 150–160).`;
    };

    const h1Summary = () => {
        if (report.h1Count === 0) return 'No H1 tag found. Every page should have exactly one H1.';
        if (report.h1Count === 1) return 'Exactly one H1 tag found. ✓';
        return `Too many H1 tags found on the page (${report.h1Count}). For best SEO results there should be exactly one H1 on each page.`;
    };

    const h2Summary = () => {
        if (!report.h2Count) return 'No H2 tags found. H2 tags help structure your content.';
        return `One or more H2 tags were found on the page. (${report.h2Count} total)`;
    };

    const imgSummary = () => {
        const missing = report.missingAltImages?.length || 0;
        if (missing === 0) return `All ${report.totalImages || 0} images have descriptive alt attributes.`;
        return `Some images on the page have no alt attribute. (${missing} missing)`;
    };

    const kwTitleSummary = () => {
        const kw = report.keywords?.[0]?.word;
        if (!kw) return 'No primary keyword detected.';
        if (report.keywordsInTitle) return `Primary keyword "${kw}" is present in the page title.`;
        return `Primary keyword "${kw}" was not found in the page title.`;
    };

    const kwDescSummary = () => {
        const kw = report.keywords?.[0]?.word;
        if (!kw) return 'No primary keyword detected.';
        if (report.keywordsInDesc) return `Primary keyword "${kw}" is present in the meta description.`;
        return report.metaDescText ? `Primary keyword "${kw}" was not found in the meta description.` : 'No page description found on the page.';
    };

    const linkSummary = () => {
        const parts = [];
        if (report.linkRatioWarning) parts.push(`Too few internal links (${report.internalLinks}).`);
        return parts.length
            ? `There are one or more issues with the number of links on this page: ${parts.join(' ')}`
            : `Good link structure. ${report.internalLinks} internal, ${report.externalLinks} external links.`;
    };

    const responsiveSummary = () => {
        const vp = report.hasViewportMeta;
        const mq = report.hasMediaQueries;
        if (vp && mq) return 'The page has a viewport meta tag and CSS media queries.';
        if (vp && !mq) return 'Viewport meta tag found, but no CSS media queries detected.';
        if (!vp && mq) return 'CSS media queries found, but missing viewport meta tag.';
        return 'Neither viewport meta tag nor CSS media queries detected. Site may not be mobile-friendly.';
    };

    const responsiveStatus = (): StatusType => {
        if (report.hasViewportMeta && report.hasMediaQueries) return 'pass';
        if (!report.hasViewportMeta && !report.hasMediaQueries) return 'fail';
        return 'warn';
    };

    // Chart
    const isExpert = userPlanType === 'Expert Report';
    const chartData = {
        labels: isExpert ? ['Technical', 'Performance', 'SEO Overall'] : ['Technical', 'SEO Overall'],
        datasets: [{
            label: 'Score',
            data: isExpert 
                ? [report.technicalScore || 0, report.performanceScore || 0, report.seoScore || 0] 
                : [report.technicalScore || 0, report.seoScore || 0],
            backgroundColor: isExpert 
                ? ['rgba(59,130,246,0.5)', 'rgba(245,158,11,0.5)', 'rgba(16,185,129,0.5)']
                : ['rgba(59,130,246,0.5)', 'rgba(16,185,129,0.5)'],
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
        }],
    };
    const chartOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.1)' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: '#94a3b8', font: { size: 11 } },
                ticks: { display: false },
                min: 0, max: 100
            }
        },
        plugins: { legend: { display: false } }
    };

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in relative z-10 print:max-w-full">
            {/* Print-Only Header Branding */}
            <div className="hidden print:flex items-center justify-between mb-10 border-b border-slate-700 pb-6">
                <div className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">JTS SEO</span>
                    <span className="text-white ml-2 text-2xl uppercase tracking-widest">Analyzer</span>
                </div>
                <div className="text-right">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Comprehensive SEO Audit Report</p>
                    <p className="text-blue-400 text-sm font-bold mt-1">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>SEO Audit Report</h1>
                    <p className="text-slate-400">Target: <span className="text-blue-400 font-medium">{report.website?.url || 'Unknown'}</span></p>
                    {(userPlanType !== 'Basic Report') && (
                        <div className="mt-4 flex items-center gap-3">
                            <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">Report Filter:</label>
                            <button 
                                onClick={() => setShowOnlyBasicSEO(!showOnlyBasicSEO)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${showOnlyBasicSEO ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
                            >
                                {showOnlyBasicSEO ? 'Basic SEO Only' : 'Full Detailed Report'}
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex gap-4 items-center flex-wrap">
                    <button onClick={() => window.print()} className="glass-panel px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
                        Download PDF
                    </button>
                    <div className="flex gap-5 glass-panel px-5 py-3 rounded-xl">
                        <ScoreCircle score={report.technicalScore || 0} label="Technical" />
                        {isExpert && <ScoreCircle score={report.performanceScore || 0} label="Performance" />}
                        <ScoreCircle score={report.seoScore || 0} label="Overall" />
                    </div>
                </div>
            </div>

            {/* Print Header (Target Info Only) */}
            <div className="hidden print:block mb-8">
                <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>SEO Audit Report</h1>
                <div className="flex items-center gap-4 text-slate-400">
                    <span>Target: <span className="text-blue-400 font-bold underline">{report.website?.url || 'Unknown'}</span></span>
                    <span className="h-4 w-[1px] bg-slate-700"></span>
                    <span className="text-xs uppercase tracking-widest font-bold">Health Score: {(report.seoScore || 0)}%</span>
                </div>
            </div>

            {/* Score + Issues overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 print:gap-4">
                <div className="glass-panel p-6 flex flex-col items-center justify-center">
                    <h3 className="text-base font-bold text-white mb-4 w-full text-left">Category Breakdown</h3>
                    <div className="w-full max-w-[220px]">
                        <PolarArea data={chartData} options={chartOptions as any} />
                    </div>
                </div>
                <div className="glass-panel p-6 lg:col-span-2">
                    <h3 className="text-base font-bold text-white mb-4">
                        {showOnlyBasicSEO ? 'Critical Issues Detected Basic SEO' : 'Critical Issues Detected'}
                    </h3>
                    <div className="space-y-3">
                        {report.issues && report.issues.length > 0 ? (() => {
                            const filteredIssues = showOnlyBasicSEO 
                                ? report.issues.filter((iss: any) => iss.impact === 'High')
                                : report.issues;
                            
                            return (filteredIssues.length > 0 ? filteredIssues : []).slice(0, 8).map((iss: any, i: number) => (
                                <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/40 hover:bg-slate-800/50 transition-colors">
                                    <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold border ${iss.impact === 'High' ? 'text-red-400 bg-red-500/10 border-red-500/20' : iss.impact === 'Medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'}`}>
                                        {iss.impact}
                                    </span>
                                    <div>
                                        <p className="text-white text-sm font-medium">{iss.issue}</p>
                                        <p className="text-slate-400 text-xs mt-0.5">{iss.recommendation}</p>
                                    </div>
                                </div>
                            ));
                        })() : (
                            <div className="text-green-400 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                Excellent! No critical SEO issues were detected.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── BASIC SEO Section ─────────────────────────────────────────────── */}
            <Section title="Basic SEO" color="bg-slate-800/60">

                <AuditRow
                    label="Common Keywords"
                    status="info"
                    summary="Here are the most common keywords we found on the page:"
                    canShowFix={isExpert}
                >
                    <KeywordPills keywords={report.keywords || []} />
                </AuditRow>

                <AuditRow
                    label="SEO Description"
                    status={metaStatusToStatus(report.metaDescStatus || 'missing')}
                    summary={metaSummary()}
                    fix='Add <meta name="description" content="Your 150–160 character description here."> inside the <head> tag. Include your primary keyword naturally.'
                    canShowFix={isExpert}
                />

                <AuditRow
                    label="H1 Heading"
                    status={report.h1Count === 1 ? 'pass' : report.h1Count === 0 ? 'fail' : 'warn'}
                    summary={h1Summary()}
                    fix="Ensure your page has exactly one <h1> tag containing your primary keyword. All other headings should use <h2> through <h6>."
                    canShowFix={isExpert}
                >
                    {report.h1Texts && report.h1Texts.length > 0 && (
                        <div className="bg-slate-950/70 border border-slate-700/40 rounded-lg p-3 mt-2 font-mono text-xs text-slate-300 space-y-1">
                            {report.h1Texts.map((t: string, i: number) => <div key={i}>{t}</div>)}
                        </div>
                    )}
                </AuditRow>

                <AuditRow
                    label="H2 Headings"
                    status={report.h2Count > 0 ? 'pass' : 'warn'}
                    summary={h2Summary()}
                    fix="Add <h2> tags to break your content into logical sections. Include relevant secondary keywords in your H2 headings."
                    canShowFix={isExpert}
                >
                    {report.h2Texts && report.h2Texts.length > 0 && (
                        <div className="bg-slate-950/70 border border-slate-700/40 rounded-lg p-3 mt-2 font-mono text-xs text-slate-300 space-y-1">
                            {(showAllH2 ? report.h2Texts : report.h2Texts.slice(0, 6)).map((t: string, i: number) => <div key={i}>{t}</div>)}
                            {report.h2Texts.length > 6 && (
                                <button 
                                    onClick={() => setShowAllH2(!showAllH2)}
                                    className="text-blue-400 hover:text-blue-300 transition-colors mt-2 font-bold flex items-center gap-1 cursor-pointer"
                                >
                                    {showAllH2 ? "Show less ▲" : `…and ${report.h2Texts.length - 6} more ▼`}
                                </button>
                            )}
                        </div>
                    )}
                </AuditRow>

                <AuditRow
                    label="Image ALT Attributes"
                    status={(report.missingAltImages?.length || 0) === 0 ? 'pass' : 'fail'}
                    summary={imgSummary()}
                    fix='Add descriptive alt text to every image: <img src="photo.jpg" alt="Description of what the image shows">. Be specific and include keywords where natural.'
                    canShowFix={isExpert}
                >
                    {(showAllImages ? report.missingAltImages : report.missingAltImages?.slice(0, 3))?.map((img: any, i: number) => (
                        <CodeSnippet key={i} code={img.snippet} />
                    ))}
                    {(report.missingAltImages?.length || 0) > 3 && (
                        <button 
                            onClick={() => setShowAllImages(!showAllImages)}
                            className="text-blue-400 hover:text-blue-300 transition-colors mt-2 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                            {showAllImages ? "Show fewer images ▲" : `…and ${report.missingAltImages.length - 3} more images ▼`}
                        </button>
                    )}
                </AuditRow>

                <AuditRow
                    label="Keywords in Title"
                    status={!report.keywords?.length ? 'info' : report.keywordsInTitle ? 'pass' : 'warn'}
                    summary={kwTitleSummary()}
                    fix={`Include your primary keyword "${report.keywords?.[0]?.word || ''}" in the <title> tag: <title>Primary Keyword — Brand Name</title>`}
                    canShowFix={isExpert}
                />

                <AuditRow
                    label="Keywords in Description"
                    status={!report.keywords?.length ? 'info' : !report.metaDescText ? 'fail' : report.keywordsInDesc ? 'pass' : 'warn'}
                    summary={kwDescSummary()}
                    fix={`Include your primary keyword "${report.keywords?.[0]?.word || ''}" naturally within your meta description.`}
                    canShowFix={isExpert}
                />

                <AuditRow
                    label="Links Ratio"
                    status={report.linkRatioWarning ? 'warn' : 'pass'}
                    summary={linkSummary()}
                    fix="Add more internal links to other pages on your site. A good rule of thumb is at least 5–10 relevant internal links per page."
                    canShowFix={isExpert}
                >
                    <div className="grid grid-cols-2 gap-3 mt-3 max-w-xs">
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30 text-center">
                            <div className="text-2xl font-bold text-blue-400">{report.internalLinks || 0}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Internal Links</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30 text-center">
                            <div className="text-2xl font-bold text-purple-400">{report.externalLinks || 0}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">External Links</div>
                        </div>
                    </div>
                </AuditRow>

                <AuditRow
                    label="SEO Title"
                    status={titleStatusToStatus(report.titleStatus || 'missing')}
                    summary={titleSummary()}
                    fix="Keep your title between 50–60 characters. Include your primary keyword near the beginning: <title>Primary Keyword | Brand Name</title>"
                    canShowFix={isExpert}
                />

                <AuditRow
                    label="Responsive Design"
                    status={responsiveStatus()}
                    summary={responsiveSummary()}
                    fix='Add <meta name="viewport" content="width=device-width, initial-scale=1"> and ensure your CSS includes @media queries for different screen sizes.'
                    canShowFix={isExpert}
                />

                <AuditRow
                    label="Homepage Reachable"
                    status={report.homepageReachable ? 'pass' : 'fail'}
                    summary={report.homepageReachable ? 'Homepage is reachable and returned a 200 OK response.' : 'Homepage could not be reached. Check your server configuration.'}
                    fix="Ensure your server is running and the URL is correct. Check for 5xx server errors or DNS configuration issues."
                    canShowFix={isExpert}
                />
            </Section>

            {/* ── ADVANCED SEO Section ─────────────────────────────────────────────── */}
            {!showOnlyBasicSEO && (
                <>
                    <Section title="Advanced SEO" color="bg-slate-800/60">
                        <AuditRow
                            label="Search Preview"
                            status="info"
                            summary="Here is how the site may appear in search results:"
                            canShowFix={isExpert}
                        >
                            <SearchPreview title={report.titleText} desc={report.metaDescText} url={report.website?.url} />
                        </AuditRow>

                        <AuditRow
                            label="Canonical Tag"
                            status={report.canonicalUrl ? 'pass' : 'warn'}
                            summary={report.canonicalUrl ? `Canonical link found: ${report.canonicalUrl}` : 'No canonical link tag found on the page.'}
                            fix="Add <link rel='canonical' href='https://yourdomain.com/page-url'> to prevent duplicate content issues."
                            canShowFix={isExpert}
                        />

                        <AuditRow
                            label="Noindex Meta"
                            status={report.hasNoindex ? 'fail' : 'pass'}
                            summary={report.hasNoindex ? 'The page contains the noindex meta tag or header.' : 'The page is indexable (no noindex tag found).'}
                            fix="Remove the <meta name='robots' content='noindex'> tag if you want this page to be indexed by search engines."
                            canShowFix={isExpert}
                        />

                        <AuditRow
                            label="Mobile Search Preview"
                            status="info"
                            summary="Here is how the site may appear in search results on a mobile device:"
                            canShowFix={isExpert}
                        >
                            <SearchPreview title={report.titleText} desc={report.metaDescText} url={report.website?.url} mobile />
                        </AuditRow>

                        <AuditRow
                            label="Mobile Snapshot"
                            status="info"
                            summary="Live mobile preview of your website:"
                            canShowFix={isExpert}
                        >
                            <MobileSnapshot url={report.mobileSnapshotUrl} />
                        </AuditRow>

                        <AuditRow
                            label="OpenGraph Meta"
                            status={report.ogTags?.title ? 'pass' : 'warn'}
                            summary={report.ogTags?.title ? 'Opengraph meta tags are properly configured.' : 'Some Opengraph meta tags are missing.'}
                            fix="Add <meta property='og:title' content='...'> and other OG tags to optimize social media sharing."
                            canShowFix={isExpert}
                        />

                        <AuditRow
                            label="Schema Meta Data"
                            status={report.hasSchemaData ? 'pass' : 'warn'}
                            summary={report.hasSchemaData ? 'Schema.org data found on the page.' : 'No Schema.org data found on the page.'}
                            fix="Use JSON-LD to add Schema documentation (like Article, Product, etc.) to your page."
                            canShowFix={isExpert}
                        />

                        <AuditRow
                            label="Sitemaps"
                            status={report.hasSitemap ? 'pass' : 'fail'}
                            summary={report.hasSitemap ? 'Sitemap found successfully.' : 'No sitemaps found.'}
                            fix="Create a sitemap.xml file and list it in your robots.txt."
                            canShowFix={isExpert}
                        />

                        <AuditRow
                            label="Robots.txt"
                            status={report.hasRobotsTxt ? 'pass' : 'fail'}
                            summary={report.hasRobotsTxt ? 'Robots.txt file found.' : 'Robots.txt file is missing or unavailable.'}
                            fix="Create a robots.txt file at the root of your website."
                            canShowFix={isExpert}
                        />

                        <AuditRow
                            label="Keep your content fresh"
                            status={report.contentFreshness?.lastModified || report.contentFreshness?.ogUpdatedTime ? 'pass' : 'warn'}
                            summary={report.contentFreshness?.lastModified ? `Content refreshed on: ${new Date(report.contentFreshness.lastModified).toLocaleDateString()}` : 'No content freshness information found.'}
                            fix="Update your content regularly and ensure your server sends a Last-Modified header."
                            canShowFix={isExpert}
                        />

                        <AuditRow
                            label="Broken Links"
                            status={report.brokenLinks?.length === 0 ? 'pass' : 'warn'}
                            summary={report.brokenLinks?.length === 0 ? 'No broken internal links detected.' : `Found ${report.brokenLinks.length} broken link(s).`}
                            fix="Fix broken links to improve crawl efficiency and user experience."
                            canShowFix={isExpert}
                        >
                            {report.brokenLinks && report.brokenLinks.length > 0 && (
                                <div className="space-y-1 mt-2">
                                    {report.brokenLinks.map((link: any, i: number) => (
                                        <p key={i} className="text-xs text-red-400 font-mono">[{link.status}] {link.url}</p>
                                    ))}
                                </div>
                            )}
                        </AuditRow>

                        <AuditRow
                            label="Google Ranking"
                            status={report.googleRanking?.rank > 0 ? (report.googleRanking.rank <= 10 ? 'pass' : 'warn') : (report.googleRanking?.rank === -1 ? 'pass' : 'info')}
                            summary={
                                report.googleRanking?.rank > 0 
                                ? `Your website is currently ranked #${report.googleRanking.rank} on Google for the primary keyword "${report.googleRanking.keyword}".`
                                : (report.googleRanking?.rank === -1
                                    ? `Your website was found in the top search results for "${report.googleRanking.keyword}", but its exact position is currently obscured.`
                                    : (report.googleRanking?.keyword 
                                        ? `Your website was not found in the top 30 search results for "${report.googleRanking.keyword}".`
                                        : "Could not determine Google ranking. No primary keyword was identified on your page."))
                            }
                            fix="To improve your rank, focus on high-quality content, improving page speed, and building authoritative backlinks for your target keywords."
                            canShowFix={isExpert}
                        />
                    </Section>

                    {/* ── TECHNICAL Section ─────────────────────────────────────────────── */}
                    <Section title="Technical" color="bg-slate-800/60">
                        {[
                            { label: 'Robots.txt',       passed: report.hasRobotsTxt,   fix: 'Create /robots.txt. Minimum: User-agent: *\\nAllow: /' },
                            { label: 'XML Sitemap',      passed: report.hasSitemap,     fix: 'Generate sitemap.xml and submit it in Google Search Console.' },
                            { label: 'Custom 404 Page',  passed: report.hasCustom404,   fix: 'Build a custom 404.html that matches your site design and links back to your homepage.' },
                            { label: 'Favicon',          passed: report.hasFavicon,     fix: 'Add <link rel="icon" href="/favicon.ico"> inside your <head> tag.' },
                            { label: 'WWW Canonical',    passed: report.isWwwOptimized, fix: 'Set up a 301 redirect so both www and non-www resolve to your canonical URL.' },
                            { label: 'Viewport Meta',    passed: report.hasViewportMeta,fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' },
                        ].map(({ label, passed, fix }) => (
                            <AuditRow
                                key={label}
                                label={label}
                                status={passed ? 'pass' : 'fail'}
                                summary={passed ? `${label} is properly configured.` : `${label} is missing or misconfigured.`}
                                fix={fix}
                                canShowFix={isExpert}
                            />
                        ))}
                    </Section>

                    {/* ── PERFORMANCE RESULTS Section ─────────────────────────────────────────────── */}
                    {isExpert && (
                        <Section title="Performance Results" color="bg-red-600/60">
                            <div className="flex items-center gap-6 p-6 border-b border-slate-700/50 glass-panel mb-4 mx-4 mt-4">
                                <div className="w-24 h-24 rounded-full border-8 border-blue-500 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                                    {report.performanceScore >= 80 ? 'A' : report.performanceScore >= 60 ? 'B' : report.performanceScore >= 40 ? 'C' : 'F'}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Your performance is {report.performanceScore >= 80 ? 'good' : 'fair'}</h4>
                                    <p className="text-slate-400 text-sm max-w-2xl">Your page has performed well in our testing meaning it should be reasonably responsive for your users, but there is still room for improvement. Performance is important to ensure a good user experience, and reduced bounce rates.</p>
                                </div>
                            </div>

                            <AuditRow
                                label="Website Load Speed"
                                status="pass"
                                summary="Your page loads in a reasonable amount of time."
                                canShowFix={isExpert}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 text-center">
                                    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700/30">
                                        <h5 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Server Response</h5>
                                        <div className="text-3xl font-black text-white">{((report.performanceDetails?.serverResTime || 0) / 1000).toFixed(2)}s</div>
                                    </div>
                                    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700/30">
                                        <h5 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">All Page Content Loaded</h5>
                                        <div className="text-3xl font-black text-white">{((report.performanceDetails?.contentLoadTime || 0) / 1000).toFixed(2)}s</div>
                                    </div>
                                    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700/30">
                                        <h5 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">All Page Scripts Complete</h5>
                                        <div className="text-3xl font-black text-white">{((report.performanceDetails?.scriptsCompleteTime || 0) / 1000).toFixed(2)}s</div>
                                    </div>
                                </div>
                            </AuditRow>

                            <AuditRow label="Website Download Size" status="pass" summary="Your page's file size is reasonably low which is good for Page Load Speed." canShowFix={isExpert}>
                                <div className="flex flex-col md:flex-row gap-8 items-center justify-center my-6">
                                    <div className="w-48 h-48 relative">
                                        <Doughnut 
                                            data={{
                                                labels: ['HTML', 'CSS', 'JS', 'Images', 'Other'],
                                                datasets: [{
                                                    data: [
                                                        report.performanceDetails?.htmlSize || 0.1, 
                                                        report.performanceDetails?.cssSize || 0.1, 
                                                        report.performanceDetails?.jsSize || 0.5, 
                                                        report.performanceDetails?.imgSize || 1.5, 
                                                        report.performanceDetails?.otherSize || 0.1
                                                    ],
                                                    backgroundColor: ['#ef4444', '#0ea5e9', '#22c55e', '#3b82f6', '#94a3b8'],
                                                    borderWidth: 0
                                                }]
                                            }}
                                            options={{ cutout: '75%', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <div className="text-xl font-bold text-white">
                                                {((report.performanceDetails?.htmlSize || 0) + (report.performanceDetails?.cssSize || 0) + (report.performanceDetails?.jsSize || 0) + (report.performanceDetails?.imgSize || 0)).toFixed(2)}MB
                                            </div>
                                            <div className="text-xs text-slate-500">Total</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between w-48"><span className="text-red-400">● HTML</span> <span className="text-slate-300 font-mono">{(report.performanceDetails?.htmlSize || 0).toFixed(2)}MB</span></div>
                                        <div className="flex justify-between w-48"><span className="text-sky-400">● CSS</span> <span className="text-slate-300 font-mono">{(report.performanceDetails?.cssSize || 0).toFixed(2)}MB</span></div>
                                        <div className="flex justify-between w-48"><span className="text-green-400">● JS</span> <span className="text-slate-300 font-mono">{(report.performanceDetails?.jsSize || 0).toFixed(2)}MB</span></div>
                                        <div className="flex justify-between w-48"><span className="text-blue-500">● Images</span> <span className="text-slate-300 font-mono">{(report.performanceDetails?.imgSize || 0).toFixed(2)}MB</span></div>
                                        <div className="flex justify-between w-48"><span className="text-slate-400">● Other</span> <span className="text-slate-300 font-mono">{(report.performanceDetails?.otherSize || 0).toFixed(2)}MB</span></div>
                                    </div>
                                </div>
                            </AuditRow>

                            <AuditRow label="Compression Usage" status="pass" summary={`Your website appears to be using a reasonable level of compression (${report.performanceDetails?.compressionRate || '60'}%).`} canShowFix={isExpert} />
                            
                            <div className="p-6 bg-slate-900/50">
                                <h4 className="text-white font-bold mb-6 pt-2">Resources Breakdown</h4>
                                <div className="grid grid-cols-2 lg:grid-cols-6 text-center gap-4">
                                    <div className="p-4 bg-slate-800/40 rounded-xl">
                                        <div className="text-3xl font-black text-white">{report.resourcesBreakdown?.htmlNodes || 0}</div>
                                        <div className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest leading-tight">Total<br/>Objects</div>
                                    </div>
                                    <div className="p-4 bg-slate-800/40 rounded-xl">
                                        <div className="text-3xl font-black text-red-500">1</div>
                                        <div className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest leading-tight">HTML<br/>Pages</div>
                                    </div>
                                    <div className="p-4 bg-slate-800/40 rounded-xl">
                                        <div className="text-3xl font-black text-yellow-500">{report.resourcesBreakdown?.jsFiles || 0}</div>
                                        <div className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest leading-tight">JS<br/>Resources</div>
                                    </div>
                                    <div className="p-4 bg-slate-800/40 rounded-xl">
                                        <div className="text-3xl font-black text-blue-500">{report.resourcesBreakdown?.cssFiles || 0}</div>
                                        <div className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest leading-tight">CSS<br/>Resources</div>
                                    </div>
                                    <div className="p-4 bg-slate-800/40 rounded-xl">
                                        <div className="text-3xl font-black text-purple-500">{report.resourcesBreakdown?.imgFiles || 0}</div>
                                        <div className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest leading-tight">Number of<br/>Images</div>
                                    </div>
                                    <div className="p-4 bg-slate-800/40 rounded-xl">
                                        <div className="text-3xl font-black text-slate-400">{report.resourcesBreakdown?.otherFiles || 0}</div>
                                        <div className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest leading-tight">Other<br/>Resources</div>
                                    </div>
                                </div>
                            </div>

                            <AuditRow label="Google Accelerate Mobile Pages (AMP)" status={report.hasAMP ? 'pass' : 'fail'} summary={report.hasAMP ? 'This page appears to have AMP Enabled.' : 'This page does not appear to have AMP Enabled.'} canShowFix={isExpert} />
                            <AuditRow label="JavaScript Errors" status={report.jsErrors === 0 ? 'pass' : 'fail'} summary={report.jsErrors === 0 ? 'Your page is not reporting any JavaScript errors.' : `Your page is reporting ${report.jsErrors} JavaScript errors.`} canShowFix={isExpert} />
                            <AuditRow label="HTTP2 Usage" status={report.hasHttp2 ? 'pass' : 'fail'} summary={report.hasHttp2 ? 'Your website is using the recommended HTTP/2+ Protocol.' : 'Your website is not utilizing HTTP2.'} canShowFix={isExpert} />
                            <AuditRow label="Optimize Images" status={report.optimizedImages ? 'pass' : 'warn'} summary={report.optimizedImages ? 'All of the images on your page appear to be optimized.' : 'Consider optimizing images further.'} canShowFix={isExpert} />
                            <AuditRow label="Minification" status={report.minifiedAssets ? 'pass' : 'fail'} summary={report.minifiedAssets ? 'All your JavaScript and CSS files appear to be minified.' : 'Consider minifying assets to save bandwidth.'} canShowFix={isExpert} />
                            
                            <AuditRow label="Deprecated HTML" status={!report.deprecatedHtml?.length ? 'pass' : 'fail'} summary={!report.deprecatedHtml?.length ? 'No deprecated HTML tags found.' : 'Deprecated HTML tags have been found within your page.'} canShowFix={isExpert}>
                                {report.deprecatedHtml?.length > 0 && (
                                    <div className="overflow-x-auto mt-4 rounded-lg border border-slate-700/50">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-slate-800/80"><tr className="text-slate-400"><th className="px-4 py-3 font-semibold text-xs tracking-wider">DEPRECATED TAGS</th><th className="px-4 py-3 font-semibold text-xs tracking-wider">OCCURRENCES</th></tr></thead>
                                            <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-slate-300">
                                                {report.deprecatedHtml.map((d: any, i: number) => <tr key={i} className="hover:bg-slate-800/30 transition-colors"><td className="px-4 py-3 font-mono text-red-400">{d.tag}</td><td className="px-4 py-3 text-white">{d.occurrences}</td></tr>)}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </AuditRow>

                            <AuditRow label="Inline Styles" status={!report.inlineStyles?.length ? 'pass' : 'fail'} summary={!report.inlineStyles?.length ? 'No inline styles found.' : 'Your page appears to be using Inline Styles.'} canShowFix={isExpert}>
                                {report.inlineStyles?.length > 0 && (
                                    <div className="overflow-x-auto mt-4 rounded-lg border border-slate-700/50">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-800/80"><tr className="text-slate-400"><th className="px-4 py-3 font-semibold text-xs tracking-wider">STYLE ATTRIBUTE</th></tr></thead>
                                            <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-slate-300">
                                                {report.inlineStyles.map((s: any, i: number) => <tr key={i} className="hover:bg-slate-800/30 transition-colors"><td className="px-4 py-3 font-mono text-xs text-red-400 whitespace-pre-wrap leading-relaxed max-w-2xl">{s.style}</td></tr>)}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </AuditRow>
                        </Section>
                    )}
                 </>
            )}

        </div>
    );
}
