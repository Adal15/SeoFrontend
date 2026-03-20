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
          <Link href="/dashboard" className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:-translate-y-1">
            Start Free Audit
          </Link>
          <Link href="#features" className="w-full sm:w-auto text-center glass-panel px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all duration-300">
            Explore Features
          </Link>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="w-full max-w-7xl mx-auto px-4 py-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Technical Analysis"
            desc="Deep crawl checking sitemaps, robots.txt, canonicals, and broken links with precision."
            icon="⚙️"
          />
          <FeatureCard
            title="Performance Scoring"
            desc="Lighthouse-powered speed checks highlighting LCP, CLS, and actionable optimizations."
            icon="⚡"
          />
          <FeatureCard
            title="On-Page Checking"
            desc="Validates meta tags, H1-H6 structure, keyword density, and internal link routing."
            icon="📝"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="glass-panel p-8 hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer border-t hover:border-blue-500/30">
      <div className="text-4xl mb-5 group-hover:scale-110 transition-transform origin-left">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white" style={{ fontFamily: 'var(--font-outfit)' }}>{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
