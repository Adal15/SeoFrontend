"use client";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
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
    label, status, summary, fix, children
}: {
    label: string; status: StatusType; summary: string;
    fix?: string; children?: React.ReactNode;
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
                {(status === 'fail' || status === 'warn') && fix && (
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="shrink-0 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 rounded px-2 py-1 transition-colors whitespace-nowrap"
                    >
                        How to fix {open ? '▲' : '▼'}
                    </button>
                )}
            </div>
            {open && fix && (
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

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/reports/${resolvedParams.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                
                if (!res.ok) throw new Error('Failed to fetch report');
                setReport(await res.json());
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
    const chartData = {
        labels: ['Technical', 'Performance', 'SEO Overall'],
        datasets: [{
            label: 'Score',
            data: [report.technicalScore || 0, report.performanceScore || 0, report.seoScore || 0],
            backgroundColor: ['rgba(59,130,246,0.5)', 'rgba(245,158,11,0.5)', 'rgba(16,185,129,0.5)'],
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
        <div className="w-full max-w-6xl mx-auto animate-fade-in relative z-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>SEO Audit Report</h1>
                    <p className="text-slate-400">Target: <span className="text-blue-400 font-medium">{report.website?.url || 'Unknown'}</span></p>
                </div>
                <div className="flex gap-4 items-center flex-wrap">
                    <button onClick={() => window.print()} className="glass-panel px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
                        Download PDF
                    </button>
                    <div className="flex gap-5 glass-panel px-5 py-3 rounded-xl">
                        <ScoreCircle score={report.technicalScore || 0} label="Technical" />
                        <ScoreCircle score={report.performanceScore || 0} label="Performance" />
                        <ScoreCircle score={report.seoScore || 0} label="Overall" />
                    </div>
                </div>
            </div>

            {/* Score + Issues overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 flex flex-col items-center justify-center">
                    <h3 className="text-base font-bold text-white mb-4 w-full text-left">Category Breakdown</h3>
                    <div className="w-full max-w-[220px]">
                        <PolarArea data={chartData} options={chartOptions as any} />
                    </div>
                </div>
                <div className="glass-panel p-6 lg:col-span-2">
                    <h3 className="text-base font-bold text-white mb-4">Critical Issues Detected</h3>
                    <div className="space-y-3">
                        {report.issues && report.issues.length > 0 ? (
                            report.issues.slice(0, 8).map((iss: any, i: number) => (
                                <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/40 hover:bg-slate-800/50 transition-colors">
                                    <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold border ${iss.impact === 'High' ? 'text-red-400 bg-red-500/10 border-red-500/20' : iss.impact === 'Medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'}`}>
                                        {iss.impact}
                                    </span>
                                    <div>
                                        <p className="text-white text-sm font-medium">{iss.issue}</p>
                                        <p className="text-slate-400 text-xs mt-0.5">{iss.recommendation}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
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
                >
                    <KeywordPills keywords={report.keywords || []} />
                </AuditRow>

                <AuditRow
                    label="SEO Description"
                    status={metaStatusToStatus(report.metaDescStatus || 'missing')}
                    summary={metaSummary()}
                    fix='Add <meta name="description" content="Your 150–160 character description here."> inside the <head> tag. Include your primary keyword naturally.'
                />

                <AuditRow
                    label="H1 Heading"
                    status={report.h1Count === 1 ? 'pass' : report.h1Count === 0 ? 'fail' : 'warn'}
                    summary={h1Summary()}
                    fix="Ensure your page has exactly one <h1> tag containing your primary keyword. All other headings should use <h2> through <h6>."
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
                >
                    {report.h2Texts && report.h2Texts.length > 0 && (
                        <div className="bg-slate-950/70 border border-slate-700/40 rounded-lg p-3 mt-2 font-mono text-xs text-slate-300 space-y-1">
                            {report.h2Texts.slice(0, 6).map((t: string, i: number) => <div key={i}>{t}</div>)}
                            {report.h2Texts.length > 6 && <div className="text-slate-500">…and {report.h2Texts.length - 6} more</div>}
                        </div>
                    )}
                </AuditRow>

                <AuditRow
                    label="Image ALT Attributes"
                    status={(report.missingAltImages?.length || 0) === 0 ? 'pass' : 'fail'}
                    summary={imgSummary()}
                    fix='Add descriptive alt text to every image: <img src="photo.jpg" alt="Description of what the image shows">. Be specific and include keywords where natural.'
                >
                    {report.missingAltImages && report.missingAltImages.slice(0, 3).map((img: any, i: number) => (
                        <CodeSnippet key={i} code={img.snippet} />
                    ))}
                    {(report.missingAltImages?.length || 0) > 3 && (
                        <p className="text-slate-500 text-xs mt-1">…and {report.missingAltImages.length - 3} more images</p>
                    )}
                </AuditRow>

                <AuditRow
                    label="Keywords in Title"
                    status={!report.keywords?.length ? 'info' : report.keywordsInTitle ? 'pass' : 'warn'}
                    summary={kwTitleSummary()}
                    fix={`Include your primary keyword "${report.keywords?.[0]?.word || ''}" in the <title> tag: <title>Primary Keyword — Brand Name</title>`}
                />

                <AuditRow
                    label="Keywords in Description"
                    status={!report.keywords?.length ? 'info' : !report.metaDescText ? 'fail' : report.keywordsInDesc ? 'pass' : 'warn'}
                    summary={kwDescSummary()}
                    fix={`Include your primary keyword "${report.keywords?.[0]?.word || ''}" naturally within your meta description.`}
                />

                <AuditRow
                    label="Links Ratio"
                    status={report.linkRatioWarning ? 'warn' : 'pass'}
                    summary={linkSummary()}
                    fix="Add more internal links to other pages on your site. A good rule of thumb is at least 5–10 relevant internal links per page."
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
                />

                <AuditRow
                    label="Responsive Design"
                    status={responsiveStatus()}
                    summary={responsiveSummary()}
                    fix='Add <meta name="viewport" content="width=device-width, initial-scale=1"> and ensure your CSS includes @media queries for different screen sizes.'
                />

                <AuditRow
                    label="Homepage Reachable"
                    status={report.homepageReachable ? 'pass' : 'fail'}
                    summary={report.homepageReachable ? 'Homepage is reachable and returned a 200 OK response.' : 'Homepage could not be reached. Check your server configuration.'}
                    fix="Ensure your server is running and the URL is correct. Check for 5xx server errors or DNS configuration issues."
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
                    />
                ))}
            </Section>

        </div>
    );
}
