"use client";
import { useState, useEffect } from 'react';
import { Users, Mail, DollarSign, RefreshCw, Lock } from 'lucide-react';
import '../globals.css';

export default function AdminDashboard() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [password, setPassword] = useState('');

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leads');
            const data = await res.json();
            setLeads(data.leads || []);
        } catch (e) {
            console.error("Failed to fetch", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (authorized) {
            fetchLeads();
        }
    }, [authorized]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') { // Simple hardcoded auth for now
            setAuthorized(true);
        } else {
            alert('Invalid Password');
        }
    };

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
                <form onSubmit={handleLogin} className="card max-w-sm w-full text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-accent">
                            <Lock size={24} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-6">Admin Access</h1>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        className="mb-4 text-center"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">Login</button>
                    <p className="text-xs text-slate-600 mt-4">Hint: admin123</p>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Misson Control</h1>
                        <p className="text-slate-500">Track your captured leads and revenue potential.</p>
                    </div>
                    <button
                        onClick={fetchLeads}
                        className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition flex items-center gap-2 border border-slate-700"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">{leads.length}</div>
                                <div className="text-sm text-slate-500 uppercase font-semibold tracking-wider">Total Leads</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <Mail size={24} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">{leads.length * 100}</div>
                                <div className="text-sm text-slate-500 uppercase font-semibold tracking-wider">Emails Sent</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-accent flex items-center justify-center">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">${(leads.length * 1.5).toFixed(2)}</div>
                                <div className="text-sm text-slate-500 uppercase font-semibold tracking-wider">Est. Value</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-xl font-bold text-white">Recent Captures</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950/50 text-slate-400 text-sm">
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Date Caught</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500">Loading data...</td>
                                    </tr>
                                ) : leads.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500">No leads found yet. Scan some niches!</td>
                                    </tr>
                                ) : (
                                    leads.map(lead => (
                                        <tr key={lead.id} className="hover:bg-slate-800/50 transition">
                                            <td className="p-4 font-medium text-white">{lead.email}</td>
                                            <td className="p-4 text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                {lead.attributes?.LEAD_SOURCE || 'Niche_Scanner'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
