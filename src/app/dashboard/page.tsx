'use client';

import React, { useState } from 'react';
import {
    Users,
    ArrowUpRight,
    Search,
    CheckCircle2,
    Clock,
    Music,
    BarChart3,
    DollarSign,
    TrendingUp,
    ChevronRight,
    Plus
} from 'lucide-react';

// --- Types ---

type CampaignStatus = 'Draft' | 'Live' | 'Funded' | 'Released' | 'Self Funding';
type KhapeetarStatus = 'Pending' | 'Assigned' | 'Completed' | 'Self';

interface Song {
    id: string;
    title: string;
    status: CampaignStatus;
    khapeetarStatus: KhapeetarStatus;
    khapeetarName?: string;
    fundsRaised: number;
    releaseStatus?: 'Completed' | 'Pending';
    fundingSource: 'Fan' | 'Self';
    streams: number;
    revenue: number;
    paidOut: number;
}

interface DashboardMetrics {
    activeSongs: number;
    fundsRaised: number;
    totalPayouts: number;
}

export default function DashboardPage() {
    const [selectedSongId, setSelectedSongId] = useState<string>('');
    const [songs, setSongs] = useState<Song[]>([]);
    const [metrics, setMetrics] = useState<DashboardMetrics>({ activeSongs: 0, fundsRaised: 0, totalPayouts: 0 });
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Metrics
                const metricsRes = await fetch('/api/dashboard/metrics');
                const metricsData = await metricsRes.json();
                setMetrics(metricsData);

                // Fetch Songs (Campaigns)
                const campaignsRes = await fetch('/api/dashboard/campaigns');
                const campaignsData = await campaignsRes.json();
                setSongs(campaignsData);

                if (campaignsData.length > 0) {
                    setSelectedSongId(campaignsData[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Derived state
    const selectedSong = songs.find(s => s.id === selectedSongId) || songs[0];

    // Helper formatting
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    if (loading) {
        return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
    }

    // Derived data for lists
    const streamData = songs.map(s => ({ song: s.title, streams: s.streams })).sort((a, b) => b.streams - a.streams).slice(0, 5);
    const revenueData = songs.map(s => ({ song: s.title, revenue: s.revenue })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const payoutData = songs.filter(s => s.paidOut > 0).map(s => ({ song: s.title, paidOut: s.paidOut })).sort((a, b) => b.paidOut - a.paidOut).slice(0, 5);

    return (
        <div className="min-h-screen bg-[#050505]">
            <div className="p-8 max-w-[1400px] space-y-8 font-sans text-gray-200">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Artist Dashboard</h1>
                    <p className="text-gray-400">Subject overview of your songs, campaigns, and earnings</p>
                </div>

                {/* ------------------------------------------------ */}
                {/* 📊 SECTION 1 — TOP METRICS CARDS                 */}
                {/* ------------------------------------------------ */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Metric 1 */}
                    <MetricCard
                        title="ACTIVE SONGS"
                        value={metrics.activeSongs.toString().padStart(2, '0')}
                        color="text-white"
                        gradient="from-blue-500/20 to-purple-500/20"
                        borderColor="border-blue-500/30"
                    />

                    {/* Metric 2 */}
                    <MetricCard
                        title="FUNDS RAISED"
                        value={formatCurrency(metrics.fundsRaised)}
                        color="text-white"
                        gradient="from-purple-500/20 to-pink-500/20"
                        borderColor="border-purple-500/30"
                    />

                    {/* Metric 3 */}
                    <MetricCard
                        title="TOTAL PAYOUTS"
                        value={formatCurrency(metrics.totalPayouts)}
                        color="text-white"
                        gradient="from-pink-500/20 to-red-500/20"
                        borderColor="border-pink-500/30"
                    />

                </section>


                <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-6">

                    {/* ------------------------------------------------ */}
                    {/* 📋 SECTION 2 — CAMPAIGN STATUS TABLE             */}
                    {/* ------------------------------------------------ */}
                    <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10">
                            <h3 className="text-lg font-medium text-white">Campaign Status</h3>
                        </div>

                        <div className="divide-y divide-white/[0.06]">
                            {/* Header */}
                            <div className="grid grid-cols-[2fr_1fr_1.5fr] px-6 py-3 bg-white/[0.02] text-sm text-gray-400 font-medium">
                                <div>Song</div>
                                <div>Status</div>
                                <div className="text-right">Khapeetar Status</div>
                            </div>

                            {/* Rows */}
                            {songs.filter(s => s.status !== 'Self Funding').map((song) => (
                                <div
                                    key={song.id}
                                    onClick={() => setSelectedSongId(song.id)}
                                    className={`
                                    grid grid-cols-[2fr_1fr_1.5fr] px-6 py-4 cursor-pointer transition-colors
                                    ${selectedSongId === song.id ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}
                                `}
                                >
                                    <div className="text-gray-200 font-medium flex items-center">{song.title}</div>
                                    <div className="flex items-center">
                                        <StatusBadge status={song.status} />
                                    </div>
                                    <div className="text-right text-gray-400 text-sm flex items-center justify-end">
                                        {song.khapeetarStatus}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ------------------------------------------------ */}
                    {/* 📄 SECTION 3 — SONG DETAILS PANEL                */}
                    {/* ------------------------------------------------ */}
                    <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 flex flex-col h-full">
                        <h3 className="text-lg font-medium text-white mb-6">Song Details</h3>

                        {selectedSong ? (
                            <>
                                {/* Funding Raised */}
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-gray-400">Funding Raised</span>
                                    <span className="text-xl font-medium text-white">{formatCurrency(selectedSong.fundsRaised)}</span>
                                </div>

                                {/* Khapeetar Status */}
                                <div className="mb-8">
                                    <div className="bg-[#1A1A1A] rounded-lg p-3 text-gray-400 text-sm mb-3 border border-white/5">
                                        Khapeetar Status
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-gray-200 font-medium">{selectedSong.title}</div>
                                        {selectedSong.khapeetarStatus === 'Assigned' && selectedSong.khapeetarName ? (
                                            <div className="flex items-center gap-2">
                                                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${selectedSong.khapeetarName}`} className="w-6 h-6 rounded-full bg-gray-700" alt="avatar" />
                                                <span className="text-gray-300 text-sm">Assigned - {selectedSong.khapeetarName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-sm">{selectedSong.khapeetarStatus}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Release Status */}
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-gray-400">Release Status</span>
                                    <span className={`
                                    px-3 py-1 rounded text-xs font-medium border
                                    ${selectedSong.releaseStatus === 'Completed'
                                            ? 'bg-[#052e16] text-[#4ade80] border-green-500/20'
                                            : 'bg-[#172554] text-[#60a5fa] border-blue-500/20'
                                        }
                                `}>
                                        {selectedSong.releaseStatus || 'Pending'}
                                    </span>
                                </div>

                                {/* Self Funding Check / Display */}
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="text-gray-200 font-medium">{selectedSong.title}</div>
                                    <div className={`
                                    px-3 py-1.5 rounded-md text-xs font-medium 
                                    ${selectedSong.fundingSource === 'Self'
                                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                                            : 'bg-[#3b82f6]/20 text-blue-300'
                                        }
                                `}>
                                        {selectedSong.fundingSource === 'Self' ? 'Self Funding' : 'Fan Funded'}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-500 text-center py-10">Select a song to view details</div>
                        )}

                    </section>

                </div>


                {/* Bottom Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* ------------------------------------------------ */}
                    {/* 📈 SECTION 4 — STREAMS THIS MONTH                 */}
                    {/* ------------------------------------------------ */}
                    <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-white/10">
                            <h3 className="text-base font-medium text-white">Streams This Month</h3>
                        </div>
                        <div className="divide-y divide-white/[0.06] flex-1">
                            {/* Header */}
                            <div className="grid grid-cols-[1fr_auto] px-6 py-3 bg-white/[0.02] text-xs text-gray-500 font-medium uppercase tracking-wider">
                                <div>Song</div>
                                <div>Streams</div>
                            </div>
                            {/* Rows */}
                            {streamData.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-[1fr_auto] px-6 py-4 items-center">
                                    <div className="text-gray-300 text-sm font-medium">{item.song}</div>
                                    <div className="text-white font-medium">{formatNumber(item.streams)}</div>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ------------------------------------------------ */}
                    {/* 💵 SECTION 5 — REVENUE GENERATED                  */}
                    {/* ------------------------------------------------ */}
                    <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-white/10">
                            <h3 className="text-base font-medium text-white">Revenue Generated</h3>
                        </div>
                        <div className="divide-y divide-white/[0.06] flex-1">
                            {/* Header */}
                            <div className="grid grid-cols-[1fr_auto] px-6 py-3 bg-white/[0.02] text-xs text-gray-500 font-medium uppercase tracking-wider">
                                <div>Song</div>
                                <div>Revenue</div>
                            </div>
                            {/* Rows */}
                            {revenueData.map((item, idx) => (
                                <div key={idx} className={`grid grid-cols-[1fr_auto] px-6 py-4 items-center ${idx === revenueData.length - 1 ? 'bg-white/[0.02]' : ''}`}>
                                    <div className={`text-sm font-medium ${idx === revenueData.length - 1 ? 'text-gray-400' : 'text-gray-300'}`}>
                                        {item.song}
                                    </div>
                                    <div className="text-white font-medium">{formatCurrency(item.revenue)}</div>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ------------------------------------------------ */}
                    {/* 👥 SECTION 6 — FAN PAYOUTS                        */}
                    {/* ------------------------------------------------ */}
                    <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-white/10">
                            <h3 className="text-base font-medium text-white">Fan Payouts</h3>
                        </div>
                        <div className="divide-y divide-white/[0.06] flex-1">
                            {/* Header */}
                            <div className="grid grid-cols-[1fr_auto] px-6 py-3 bg-white/[0.02] text-xs text-gray-500 font-medium uppercase tracking-wider">
                                <div>Song</div>
                                <div>Paid Out</div>
                            </div>
                            {/* Rows */}
                            {payoutData.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-[1fr_auto] px-6 py-4 items-center">
                                    <div className="text-gray-300 text-sm font-medium">{item.song}</div>
                                    <div className="text-white font-medium">{formatCurrency(item.paidOut)}</div>
                                </div>
                            ))}
                        </div>

                        {/* List New Song CTA */}
                        <div className="p-4 mt-auto border-t border-white/10">
                            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all hover:-translate-y-0.5">
                                List a New Song
                            </button>
                        </div>
                    </section>

                </div>

            </div>
        </div>
    );
}


// --- Subcomponents ---

function MetricCard({ title, value, color, gradient, borderColor }: { title: string, value: string, color: string, gradient: string, borderColor: string }) {
    return (
        <div className={`
            relative overflow-hidden rounded-2xl border ${borderColor} bg-[#0A0A0A] p-6 group
        `}>
            {/* Background Glow */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${gradient} blur-[60px] opacity-50 group-hover:opacity-70 transition-opacity`} />

            <div className="relative z-10">
                <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">{title}</h3>
                <div className={`text-4xl font-bold ${color} tracking-tight`}>
                    {value}
                </div>
            </div>

            {/* Mock Chart Line */}
            <div className="absolute bottom-6 right-6 w-32 h-10 opacity-50">
                <svg viewBox="0 0 100 40" className="w-full h-full stroke-current text-white/30 fill-none" strokeWidth="2">
                    <path d="M0 35 Q 20 35, 30 25 T 60 20 T 100 5" />
                </svg>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: CampaignStatus }) {
    const styles = {
        'Draft': 'bg-gray-800 text-gray-400 border-gray-700',
        'Live': 'bg-purple-900/30 text-purple-400 border-purple-500/30',
        'Funded': 'bg-green-900/30 text-green-400 border-green-500/30',
        'Released': 'bg-blue-900/30 text-blue-400 border-blue-500/30',
        'Self Funding': 'bg-pink-900/30 text-pink-400 border-pink-500/30',
    };

    return (
        <span className={`
            px-3 py-1 rounded-md text-xs font-medium border ${styles[status]}
            inline-block text-center
        `}>
            {status}
        </span>
    );
}
