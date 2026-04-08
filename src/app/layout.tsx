import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'JTS SEO Analyzer - Professional Audit Platform',
  description: 'Comprehensive SEO analysis report with detailed improvement recommendations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased text-slate-50 bg-slate-900">
        <Navbar />
        <main className="min-h-screen pt-20 print:pt-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
