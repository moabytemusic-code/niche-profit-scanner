
"use client";
import { useState, useEffect } from 'react';
import { Search, Lock, Zap, TrendingUp, Users, CircleHelp, X, ChevronRight, CheckCircle, BarChart3, ShoppingBag, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './globals.css';

export default function Home() {
    const [step, setStep] = useState('input');
    const [showHelp, setShowHelp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scanMessage, setScanMessage] = useState('Initializing Scanner...');

    // Form Inputs
    const [niche, setNiche] = useState('');
    const [platform, setPlatform] = useState('YouTube');
    const [email, setEmail] = useState('');

    const [data, setData] = useState(null);

    // Simulate specialized scanning steps
    const runScanSimulation = async () => {
        const steps = [
            { msg: 'Analzying Market Trends...', time: 800 },
            { msg: 'Scouting Competitors...', time: 1000 },
            { msg: 'Calculating Profit Potential...', time: 800 },
            { msg: 'Generating Blueprint...', time: 600 }
        ];

        for (let i = 0; i < steps.length; i++) {
            setScanMessage(steps[i].msg);
            setProgress(((i + 1) / steps.length) * 100);
            await new Promise(r => setTimeout(r, steps[i].time));
        }
    };

    const analyze = async (withEmail = false) => {
        if (!niche && !withEmail) return;

        setLoading(true);
        if (!withEmail) {
            await runScanSimulation();
        }

        const res = await fetch('/api/analyze-niche', {
            method: 'POST',
            body: JSON.stringify({ niche, platform, email: withEmail ? email : null })
        });

        const result = await res.json();
        setData(result);

        setLoading(false);
        setStep(withEmail ? 'success' : 'teaser');
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-2xl relative z-10 font-sans">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-lg">
                            <Zap className="text-accent w-8 h-8" fill="currentColor" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
                        Niche Profit <span className="text-gradient">Scanner™</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Validate your next 7-figure online business idea in seconds.</p>
                </motion.div>

                <AnimatePresence mode='wait'>

                    {/* INPUT STEP */}
                    {step === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="card"
                        >
                            {loading ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 border-4 border-slate-700 border-t-accent rounded-full animate-spin mx-auto mb-6"></div>
                                    <h3 className="text-xl font-bold mb-2">{scanMessage}</h3>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden max-w-xs mx-auto mt-4">
                                        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="input-group">
                                        <label>What's your niche idea?</label>
                                        <input
                                            placeholder="e.g. Urban Gardening, AI Software, Crypto Trading"
                                            value={niche}
                                            onChange={e => setNiche(e.target.value)}
                                            autoFocus
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Target Platform</label>
                                        <select value={platform} onChange={e => setPlatform(e.target.value)}>
                                            <option>YouTube</option>
                                            <option>TikTok</option>
                                            <option>Blog / SEO</option>
                                            <option>Instagram</option>
                                            <option>Newsletter</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => analyze(false)}
                                        disabled={!niche}
                                        className="btn-primary flex items-center justify-center gap-2 group"
                                    >
                                        <Search size={20} className="group-hover:scale-110 transition-transform" />
                                        Scan Niche Profitability
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* TEASER STEP */}
                    {step === 'teaser' && data && (
                        <motion.div
                            key="teaser"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-white/5">
                                <div className="text-center md:text-left mb-6 md:mb-0">
                                    <h2 className="text-2xl font-bold mb-1">{niche}</h2>
                                    <div className="text-slate-400 text-sm flex items-center gap-2 justify-center md:justify-start">
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white">{platform}</span>
                                        <span>Market Analysis</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="score-badge mx-auto mb-2 text-3xl shadow-[0_0_30px_rgba(245,158,11,0.3)]">{data.score}</div>
                                    <div className="text-xs font-bold text-accent tracking-wider uppercase">Profit Score</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                    <TrendingUp className="mx-auto text-emerald-400 mb-2" size={24} />
                                    <div className="font-bold text-xl">{data.demand}/10</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Demand</div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                    <Users className="mx-auto text-blue-400 mb-2" size={24} />
                                    <div className="font-bold text-xl">{data.competition}/10</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Competition</div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                    <DollarSign className="mx-auto text-accent mb-2" size={24} />
                                    <div className="font-bold text-xl">{data.monetization}/10</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Monetization</div>
                                </div>
                            </div>

                            <div className="blur-overlay bg-slate-900/40 p-6 rounded-xl mb-6 border border-dashed border-slate-700 relative">
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-indigo-500/30 flex items-center gap-2 shadow-2xl">
                                        <Lock size={16} className="text-accent" />
                                        <span className="text-sm font-bold text-white">Enter Email to Reveal Blueprint</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold mb-4 opacity-30 blur-[2px]">Content & Product Strategy</h3>
                                <div className="space-y-3 opacity-30 blur-[2px]">
                                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                                    <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 p-6 rounded-xl text-center border border-indigo-500/30 shadow-lg">
                                <h3 className="font-bold mb-2 text-xl">Unlock Full Profit Blueprint</h3>
                                <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">Get your custom <strong>Zero to Hero</strong> plan, including 10 viral content ideas and the top affiliate programs for this niche.</p>

                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 min-w-0"
                                        placeholder="Send blueprint to..."
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    <button onClick={() => analyze(true)} className="btn-primary w-auto whitespace-nowrap px-6">
                                        {loading ? 'Sending...' : 'Unlock Now'}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-3">We respect your privacy. No spam, ever.</p>
                            </div>

                            <button onClick={() => setStep('input')} className="w-full text-slate-500 hover:text-white text-sm mt-4 py-2 transition-colors">
                                Scan a different niche
                            </button>
                        </motion.div>
                    )}

                    {/* SUCCESS STEP */}
                    {step === 'success' && data && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card max-w-3xl"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                    <CheckCircle size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Blueprint Unlocked!</h2>
                                <p className="text-slate-400">We've sent the detailed breakdown to <strong>{email}</strong>.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-slate-900/60 p-6 rounded-xl border border-white/5">
                                    <h3 className="text-lg font-bold mb-4 text-indigo-400 flex items-center gap-2">
                                        <Zap size={18} /> Viral Content Hooks
                                    </h3>
                                    <ul className="space-y-3">
                                        {data.content_ideas.map((idea, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-slate-300">
                                                <span className="text-white/20 font-bold">{i + 1}.</span>
                                                <span>{idea}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-slate-900/60 p-6 rounded-xl border border-white/5">
                                    <h3 className="text-lg font-bold mb-4 text-emerald-400 flex items-center gap-2">
                                        <ShoppingBag size={18} /> Products to Sell
                                    </h3>
                                    <ul className="space-y-3">
                                        {data.product_ideas.map((idea, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-slate-300">
                                                <span className="text-emerald-500/50">✦</span>
                                                <span>{idea}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-amber-500/10 p-6 rounded-xl border border-amber-500/20 mb-8">
                                <h3 className="text-lg font-bold mb-2 text-amber-500">Digital Product Opportunity</h3>
                                <p className="text-sm text-amber-200/80 mb-4">Based on this niche, here are high-value digital assets you could create and sell:</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30">Detailed SOPs & Checklists</span>
                                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30">Video Masterclass</span>
                                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30">Private Community Access</span>
                                </div>
                            </div>

                            {/* MONETIZATION */}
                            <div className="text-center pt-8 border-t border-white/10">
                                <h3 className="font-bold mb-6 text-xl">Top Affiliate Networks for {niche}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <a href="https://www.clickbank.com" target="_blank" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/50 transition duration-300 group">
                                        <div className="font-bold mb-1 group-hover:text-accent transition-colors">ClickBank</div>
                                        <div className="text-xs text-slate-500">Digital Products</div>
                                    </a>
                                    <a href="https://www.shareasale.com" target="_blank" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/50 transition duration-300 group">
                                        <div className="font-bold mb-1 group-hover:text-accent transition-colors">ShareASale</div>
                                        <div className="text-xs text-slate-500">Physical Goods</div>
                                    </a>
                                    <a href="https://impact.com" target="_blank" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/50 transition duration-300 group">
                                        <div className="font-bold mb-1 group-hover:text-accent transition-colors">Impact</div>
                                        <div className="text-xs text-slate-500">SaaS & Tech</div>
                                    </a>
                                </div>
                                <button className="text-slate-500 hover:text-white mt-10 text-sm transition-colors flex items-center justify-center gap-2 mx-auto" onClick={() => { setStep('input'); setData(null); setNiche(''); }}>
                                    <ChevronRight size={14} className="rotate-180" /> Scan Another Niche
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Help Button */}
            <button
                onClick={() => setShowHelp(true)}
                className="fixed bottom-4 right-4 text-slate-400 hover:text-white transition flex items-center gap-2 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 hover:border-primary/50"
            >
                <CircleHelp size={18} /> <span className="font-bold text-sm">How It Works</span>
            </button>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 p-8 rounded-2xl max-w-md w-full relative border border-slate-700 shadow-2xl"
                        >
                            <button
                                onClick={() => setShowHelp(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Zap className="text-accent" fill="currentColor" /> The Protocol
                            </h3>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold text-accent shrink-0 border border-white/5">1</div>
                                    <div><strong className="text-white block text-lg mb-1">Market Scan</strong><p className="text-slate-400 text-sm leading-relaxed">Our AI scans real-time market data to evaluate demand and competition levels.</p></div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold text-accent shrink-0 border border-white/5">2</div>
                                    <div><strong className="text-white block text-lg mb-1">Profit Calculation</strong><p className="text-slate-400 text-sm leading-relaxed">We algorithmically determine the monetization potential based on affiliate offers.</p></div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold text-accent shrink-0 border border-white/5">3</div>
                                    <div><strong className="text-white block text-lg mb-1">Blueprint Delivery</strong><p className="text-slate-400 text-sm leading-relaxed">You unlock a complete "Zero to Hero" strategy guide sent directly to your inbox.</p></div>
                                </div>
                            </div>

                            <button onClick={() => setShowHelp(false)} className="btn-primary mt-8 w-full py-3">Understood</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main >
    );
}
