import React from 'react';

export default function HelpAndManual() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="glass-panel p-8 rounded-2xl">
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">Help &amp; Manual</h1>
                
                <div className="space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">Welcome to SEO Analyzer</h2>
                        <p className="leading-relaxed">
                            This application is designed to help you analyze and improve the Search Engine Optimization (SEO) of your websites. It provides deep technical insights, tracks keyword rankings, and offers actionable recommendations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">How to Use the Application</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-blue-400 mb-1">1. Scanning a Website</h3>
                                <p className="text-sm leading-relaxed">
                                    Navigate to the <strong>Overview</strong> section and enter the URL of the website you wish to analyze. Click "Analyze" and our crawler will begin scanning your site for technical SEO issues, performance metrics, and content optimization.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-blue-400 mb-1">2. Viewing Reports</h3>
                                <p className="text-sm leading-relaxed">
                                    Once a scan is complete, you can find the detailed results in <strong>My Reports</strong>. Here you can see an itemized list of all discovered issues categorized by severity (Critical, Warning, Info). Depending on your subscription plan, you'll have access to basic, advanced, or expert-level insights.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-blue-400 mb-1">3. Managing Your Plan</h3>
                                <p className="text-sm leading-relaxed">
                                    Your <strong>My Account</strong> section displays your current plan, remaining allowed scans, and total scans performed. You can upgrade your plan at any time to unlock more features, higher scanning limits, and more in-depth technical reports.
                                </p>
                            </div>
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">Understanding the Report Sections</h2>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li><strong className="text-white">Basic SEO:</strong> Overall health score, meta descriptions, basic indexing status, and fundamental tag checks.</li>
                            <li><strong className="text-white">Performance:</strong> Core Web Vitals, page load speed, image optimization, and mobile-friendliness. <em>(Requires Advanced or Expert Plan)</em></li>
                            <li><strong className="text-white">Technical:</strong> Canonical tags, broken links, deep structural issues, and advanced crawler findings. <em>(Requires Expert Plan)</em></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">Frequently Asked Questions</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-white text-sm">What happens when I run out of scans?</h4>
                                <p className="text-sm mt-1">If your current plan's scan limit is reached, you will need to upgrade to a higher tier to continue analyzing new websites.</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-white text-sm">How accurate is the Google Keyword Ranking?</h4>
                                <p className="text-sm mt-1">We perform real-time localized searches to determine where your site ranks for targeted keywords. Rankings may fluctuate slightly based on geographic location and time of day.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
