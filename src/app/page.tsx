import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 flex flex-col items-center text-center animate-slide-up">

        <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wide">
          <span className="relative flex h-2 w-2 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Next-Generation Web Analysis Engine
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
          Unlock Your Website's <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-500">True Potential</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mb-12 leading-relaxed">
          Comprehensive, automated SEO audits revealing hidden technical flaws,
          performance bottlenecks, and on-page optimization opportunities in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link href="/plans" className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:-translate-y-1">
            Start Free Audit
          </Link>
          <Link href="#features" className="w-full sm:w-auto text-center glass-panel px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all duration-300">
            Explore Features
          </Link>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="w-full max-w-7xl mx-auto px-4 py-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>Everything You Need for SEO Success</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Our comprehensive engine analyzes over 50 variables to give you the most accurate SEO audit in the market.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Technical Analysis"
            desc="Deep crawl checking sitemaps, robots.txt, canonicals, and broken links with precision."
            icon="⚙️"
            gradient="from-blue-500/20 to-cyan-500/20"
          />
          <FeatureCard
            title="Performance Scoring"
            desc="Lighthouse-powered speed checks highlighting LCP, CLS, and actionable optimizations."
            icon="⚡"
            gradient="from-amber-500/20 to-orange-500/20"
          />
          <FeatureCard
            title="On-Page Checking"
            desc="Validates meta tags, H1-H6 structure, keyword density, and internal link routing."
            icon="📝"
            gradient="from-emerald-500/20 to-teal-500/20"
          />
          <FeatureCard
            title="Social Presence Audit"
            desc="Verification of Open Graph tags, Facebook Pixel integration, and social profile connectivity."
            icon="🌐"
            gradient="from-indigo-500/20 to-blue-500/20"
          />
          <FeatureCard
            title="Keyword Rank Tracking"
            desc="Identify your top-performing keywords and monitor your exact position on Google Search results."
            icon="🎯"
            gradient="from-fuchsia-500/20 to-pink-500/20"
          />
          <FeatureCard
            title="AI-Powered Insights"
            desc="Intelligent recommendations tailored to your niche, helping you prioritize high-impact SEO fixes."
            icon="🧠"
            gradient="from-violet-500/20 to-purple-500/20"
          />
        </div>
      </section>

      {/* Advanced Analytics Section */}
      <section className="w-full bg-slate-800/20 py-24 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>Deep Analytics for <span className="text-blue-400">Serious Growth</span></h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                We go beyond surface-level checks. Our engine explores the deep technical architecture of your site to ensure search engine crawlers love your content as much as your users do.
              </p>
              <ul className="space-y-4">
                {[
                  { title: 'Schema.org Markup', desc: 'Detailed validation of LD+JSON structured data.' },
                  { title: 'Content Freshness', desc: 'Track when your pages were last updated and crawled.' },
                  { title: 'Broken Link Detection', desc: 'Automatic scanning for 404s and redirect chains.' },
                  { title: 'Mobile-First Analysis', desc: 'Comprehensive audits optimized for mobile indexing.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    </div>
                    <div>
                      <span className="text-white font-semibold block">{item.title}</span>
                      <span className="text-slate-400 text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="glass-panel p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="space-y-6 relative z-10">
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-400 uppercase tracking-widest">Global Scan Score</span>
                      <span className="text-blue-400">92/100</span>
                   </div>
                   <div className="h-3 w-full bg-slate-900/50 rounded-full overflow-hidden border border-slate-800/50">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 w-[92%]"></div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500 block mb-1">Indexability</span>
                        <span className="text-xl font-bold text-green-400">Good</span>
                      </div>
                      <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500 block mb-1">Response Time</span>
                        <span className="text-xl font-bold text-blue-400">1.2s</span>
                      </div>
                   </div>
                   <div className="pt-4 border-t border-slate-800/50">
                      <p className="text-xs text-slate-500 italic">"Our automated engine detected 12 critical technical issues that were blocking Google from indexing your primary services."</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: 'Audits Completed', value: '25,000+' },
             { label: 'Websites Monitored', value: '1,200+' },
             { label: 'Uptime Reliability', value: '99.9%' },
             { label: 'Accuracy Rate', value: '98%' },
           ].map((stat, i) => (
             <div key={i} className="text-center group">
               <div className="text-3xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: 'var(--font-outfit)' }}>{stat.value}</div>
               <div className="text-blue-400 text-sm font-semibold tracking-wider uppercase">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-5xl mx-auto px-4 py-32 text-center">
        <div className="glass-panel p-12 md:p-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-violet-600/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-outfit)' }}>Ready to Conquer <br/> Search Results?</h2>
            <p className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto">Join thousands of website owners who use our premium audit engine to drive more organic traffic with zero guesswork.</p>
            <Link href="/plans" className="inline-block bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transform hover:-translate-y-1">
              Analyze My Website Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, icon, gradient }: { title: string, desc: string, icon: string, gradient?: string }) {
  return (
    <div className={`glass-panel p-8 hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer border-t hover:border-white/20 relative overflow-hidden`}>
      {gradient && <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity`}></div>}
      <div className="text-4xl mb-5 group-hover:scale-120 transition-transform origin-left inline-block">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white relative z-10" style={{ fontFamily: 'var(--font-outfit)' }}>{title}</h3>
      <p className="text-slate-400 leading-relaxed relative z-10">{desc}</p>
    </div>
  );
}
