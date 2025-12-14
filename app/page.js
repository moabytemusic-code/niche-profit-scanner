
"use client";
import { useState } from 'react';
import { Search, Lock, Zap, Gauge, DollarSign, TrendingUp, Users } from 'lucide-react';
import './globals.css';

export default function Home() {
    const [step, setStep] = useState('input');
    const [loading, setLoading] = useState(false);
    const [niche, setNiche] = useState('');
    const [platform, setPlatform] = useState('YouTube');
    const [email, setEmail] = useState('');
    const [data, setData] = useState(null);

    const analyze = async (withEmail = false) => {
        setLoading(true);
        const res = await fetch('/api/analyze-niche', {
            method: 'POST',
            body: JSON.stringify({ niche, platform, email: withEmail ? email : null })
        });
        const result = await res.json();
        setData(result);
        setStep(withEmail ? 'success' : 'teaser');
        setLoading(false);
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <Zap className="text-accent w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Affiliate Niche <span className="text-gradient">Profit Scanner™</span></h1>
                    <p className="text-slate-400">Validate your niche idea in seconds with AI.</p>
                </div>

                {/* INPUT STEP */}
                {step === 'input' && (
                    <div className="card">
                        <div className="input-group">
                            <label>Enter Niche / Topic</label>
                            <input
                                placeholder="e.g. Urban Gardening, AI Software, Crypto Trading"
                                value={niche}
                                onChange={e => setNiche(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Select Platform</label>
                            <select value={platform} onChange={e => setPlatform(e.target.value)}>
                                <option>YouTube</option>
                                <option>TikTok</option>
                                <option>Blog / SEO</option>
                                <option>Instagram</option>
                            </select>
                        </div>

                        <button onClick={() => analyze(false)} disabled={loading} className="btn-primary flex items-center justify-center gap-2">
                            {loading ? 'Scanning Market...' : <><Search size={20} /> Scan Niche Profitability</>}
                        </button>
                    </div>
                )}

                {/* TEASER STEP */}
                {step === 'teaser' && data && (
                    <div className="card animate-fade-in">
                        <div className="flex justify-center mb-6">
                            <div className="text-center">
                                <div className="score-badge text-accent mx-auto mb-2">{data.score}</div>
                                <div className="text-sm text-slate-400">Profit Potential</div>
                            </div>
                        </div>

                        <div className="grid-3 mb-8 text-center">
                            <div className="bg-slate-900 p-3 rounded">
                                <TrendingUp className="mx-auto text-primary mb-1" size={20} />
                                <div className="font-bold">{data.demand}/10</div>
                                <div className="text-xs text-slate-500">Demand</div>
                            </div>
                            <div className="bg-slate-900 p-3 rounded">
                                <Users className="mx-auto text-primary mb-1" size={20} />
                                <div className="font-bold">{data.competition}/10</div>
                                <div className="text-xs text-slate-500">Competition</div>
                            </div>
                            <div className="bg-slate-900 p-3 rounded">
                                <DollarSign className="mx-auto text-primary mb-1" size={20} />
                                <div className="font-bold">{data.monetization}/10</div>
                                <div className="text-xs text-slate-500">Monetization</div>
                            </div>
                        </div>

                        <div className="blur-overlay bg-slate-900 p-6 rounded mb-6 border border-dashed border-slate-700">
                            <h3 className="text-lg font-bold mb-4 opacity-50">Content & Product Strategy</h3>
                            <p className="mb-2">1. {data.preview_content}</p>
                            <p className="mb-2">2. [HIDDEN CONTENT IDEA]</p>
                            <p className="mb-2">3. [HIDDEN CONTENT IDEA]</p>
                        </div>

                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded text-center border border-indigo-500/30">
                            <Lock className="mx-auto text-accent mb-2" />
                            <h3 className="font-bold mb-2">Unlock Full Report</h3>
                            <p className="text-sm text-slate-400 mb-4">Get 20+ viral ideas and full market breakdown.</p>
                            <input
                                className="mb-4 text-center"
                                placeholder="Enter your best email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <button onClick={() => analyze(true)} className="btn-primary">Unlock Results</button>
                        </div>
                    </div>
                )}

                {/* SUCCESS STEP */}
                {step === 'success' && data && (
                    <div className="card">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-accent mb-2">Report Unlocked!</h2>
                            <p className="text-slate-400">Your niche blueprint has been sent to {email}</p>
                        </div>

                        <div className="bg-slate-900 p-6 rounded mb-8">
                            <h3 className="text-xl font-bold mb-4 text-primary">Content Strategy ({platform})</h3>
                            <ul className="space-y-2">
                                {data.content_ideas.map((idea, i) => (
                                    <li key={i} className="flex gap-2 text-sm">
                                        <span className="text-accent font-bold">{i + 1}.</span> {idea}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 p-6 rounded mb-8">
                            <h3 className="text-xl font-bold mb-4 text-primary">Products to Sell</h3>
                            <ul className="space-y-2">
                                {data.product_ideas.map((idea, i) => (
                                    <li key={i} className="flex gap-2 text-sm">
                                        <span className="text-accent font-bold">🛒</span> {idea}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* MONETIZATION */}
                        <div className="text-center pt-8 border-t border-slate-700">
                            <h3 className="text-xl font-bold mb-4">Start Earning Today</h3>
                            <div className="grid-3 gap-4">
                                <a href="https://www.clickbank.com" target="_blank" className="bg-slate-900 p-4 rounded hover:border-accent border border-transparent transition">ClickBank</a>
                                <a href="https://www.shareasale.com" target="_blank" className="bg-slate-900 p-4 rounded hover:border-accent border border-transparent transition">ShareASale</a>
                                <a href="https://impact.com" target="_blank" className="bg-slate-900 p-4 rounded hover:border-accent border border-transparent transition">Impact</a>
                            </div>
                            <button className="text-slate-500 underline mt-8 text-sm" onClick={() => setStep('input')}>Scan Another Niche</button>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
