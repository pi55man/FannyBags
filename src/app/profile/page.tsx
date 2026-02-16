'use client';

import React from 'react';
import {
    MapPin,
    Play,
    MoreVertical,
    Award,
    Plane,
    ChevronRight,
    Edit,
    ExternalLink
} from 'lucide-react';

export default function ProfilePage() {
    const [profile, setProfile] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/profile');
                const data = await res.json();
                if (data.error) {
                    console.error('Profile API Error:', data.error);
                } else {
                    setProfile(data);
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const getBadgeColor = (index: number) => {
        const colors = [
            "bg-[#d97706]/20 text-[#fbbf24] border-[#fbbf24]/20",
            "bg-[#0e7490]/20 text-[#22d3ee] border-[#22d3ee]/20",
            "bg-[#7c3aed]/20 text-[#a78bfa] border-[#a78bfa]/20"
        ];
        return colors[index % colors.length];
    };

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
    if (!profile) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Artist specific error</div>;

    const { artist, songs } = profile;

    return (
        <div className="min-h-screen bg-[#050505]">
            <div className="p-8 max-w-[1400px] font-sans text-gray-200 space-y-8">

                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Artist Profile</h1>
                    <p className="text-gray-400">Your professional identity on FANNYBAGS</p>
                </div>

                {/* ------------------------------------------------ */}
                {/* 🎨 SECTION 1 — PROFILE BANNER CARD               */}
                {/* ------------------------------------------------ */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2e1065] via-[#0f172a] to-[#050505] p-8 border border-white/10">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">

                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-40 h-40 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl shadow-purple-900/40">
                                <img
                                    src={artist.avatar}
                                    alt={artist.name}
                                    className="w-full h-full object-cover bg-gray-900"
                                />
                            </div>
                        </div>

                        {/* Info Container */}
                        <div className="flex-1 w-full pt-2">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-4xl font-bold text-white tracking-tight mb-2">{artist.name}</h2>
                                    <div className="flex items-center gap-2 text-gray-300 mb-6">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{artist.location}</span>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {artist.badges.map((badge: string, idx: number) => (
                                        <Badge key={idx} text={badge} color={getBadgeColor(idx)} />
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-12 mt-4 border-t border-white/10 pt-6">
                                <Stat label="Streams" value={formatNumber(artist.stats.streams)} />
                                <Stat label="Monthly Listeners" value={formatNumber(artist.stats.listeners)} />
                                <Stat label="Tracks" value={artist.stats.tracks.toString()} />
                            </div>
                        </div>
                    </div>
                </section>


                {/* ------------------------------------------------ */}
                {/* 📄 SECTION 2 — CONTENT GRID                      */}
                {/* ------------------------------------------------ */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">

                    {/* LEFT COLUMN */}
                    <div className="space-y-8">

                        {/* About You */}
                        <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
                            <h3 className="text-lg font-bold text-white mb-4">About You</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Chart-topping artist and rapper known for seamlessly blending hip-hop with electronic and Bollywood influences. Frequently dominating the charts, the artist is also recognized for high-energy, electrifying live performances that captivate audiences and create unforgettable experiences. Renowned for versatility, innovation, and a strong stage presence, their music resonates across diverse audiences and cultures.
                            </p>
                        </section>

                        {/* Popular Songs */}
                        <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Popular Songs</h3>
                                <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                                    View all songs <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="p-2">
                                {songs.slice(0, 3).map((song: any, idx: number) => (
                                    <SongRow
                                        key={song.id}
                                        title={song.title}
                                        year={new Date(song.createdAt).getFullYear().toString()}
                                        streams={formatNumber(song.streams) + ' Streams'}
                                        color={idx === 0 ? "from-blue-600 to-purple-600" : idx === 1 ? "from-purple-600 to-pink-600" : "from-pink-600 to-red-600"}
                                    />
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-8">

                        {/* Career Highlights */}
                        <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
                            <h3 className="text-lg font-bold text-white mb-6">CAREER HIGHLIGHTS</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <Award className="text-gray-400" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">3 Platinum Records</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <Plane className="text-gray-400" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">Toured 20+ Countries</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Recent Release */}
                        <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden">
                            <div className="p-6 border-b border-white/10">
                                <h3 className="text-lg font-bold text-white uppercase tracking-wide">RECENT RELEASE</h3>
                            </div>
                            <div className="p-2">
                                {songs.slice(0, 2).map((song: any) => (
                                    <ReleaseRow
                                        key={song.id}
                                        title={song.title}
                                        year={new Date(song.createdAt).getFullYear().toString()}
                                        stats={formatNumber(song.streams)}
                                        timeLabel="Last week"
                                    />
                                ))}

                                <div className="p-4 text-center">
                                    <button className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1 transition-colors w-full">
                                        View all Releases <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 font-medium transition-colors border border-white/10">
                                View Public Profile
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:-translate-y-0.5 transition-all">
                                Edit Profile
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

// --- Subcomponents ---

function Badge({ text, color }: { text: string, color: string }) {
    return (
        <span className={`
            px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border
            ${color} shadow-lg
        `}>
            {text}
        </span>
    );
}

function Stat({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <div className="text-3xl font-bold text-white mb-0.5">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
        </div>
    );
}

function SongRow({ title, year, streams, color }: { title: string, year: string, streams: string, color: string }) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-white/[0.04] rounded-xl group cursor-pointer transition-colors">
            <div className="flex items-center gap-4">
                {/* Artwork Placeholder */}
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${color} flex-shrink-0 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    {/* Placeholder lines to resemble generic abstract art */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white/10 backdrop-blur-sm" />
                </div>

                <div>
                    <div className="text-white font-medium text-lg">{title}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>{year}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {streams}
                        </span>
                    </div>
                </div>
            </div>

            <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-2">
                <MoreVertical size={20} />
            </button>
        </div>
    );
}

function ReleaseRow({ title, year, stats, timeLabel }: { title: string, year: string, stats: string, timeLabel: string }) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-white/[0.04] rounded-xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.08] flex items-center justify-center text-gray-400">
                    <Play size={18} fill="currentColor" />
                </div>
                <div>
                    <div className="text-white text-sm font-medium">{title}</div>
                    <div className="text-xs text-gray-500">{year}</div>
                </div>
            </div>

            <div className="text-right">
                <div className="text-white text-sm font-medium flex items-center justify-end gap-1">
                    {stats} <ChevronRight size={12} className="text-gray-500" />
                </div>
                <div className="text-xs text-gray-500">{timeLabel}</div>
            </div>
        </div>
    );
}
