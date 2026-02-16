'use client';

import React, { useState } from 'react';
import { ChevronDown, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const KHAPEETARS = [
  {
    id: 1,
    name: 'Aarav Mehta',
    role: 'Music Video Director',
    location: 'Mumbai, India',
    rating: 4.7,
    price: '₹40,000',
    details: 'Music Video Director',
    image: '/app/avatars/aarav.png',
    bgColor: 'bg-[#bfdbfe]', // Light Blue
    progress: 75,
    metric: 'From ₹40,000',
  },
  {
    id: 2,
    name: 'Riya Kapoor',
    role: 'Release Marketing Specialist',
    location: 'Delhi NCR, India',
    rating: 4.5,
    price: '₹25,000',
    details: 'Release Marketing Specialist',
    image: '/app/avatars/riya.png',
    bgColor: 'bg-[#fbcfe8]', // Pink
    progress: 60,
    metric: 'From ₹25,000',
  },
  {
    id: 3,
    name: 'Nikhil Rao',
    role: 'Mixing and Mastering Engineer',
    location: 'Bengaluru, India',
    rating: 4.9,
    price: '₹15,000',
    details: 'Mixing Engineer',
    image: '/app/avatars/nikhil.png',
    bgColor: 'bg-[#fde68a]', // Yellow
    progress: 90,
    metric: 'From ₹15,000',
  },
  {
    id: 4,
    name: 'Sahil Verma',
    role: 'Playlist and Promo Manager',
    location: 'Chandigarh, India',
    rating: 4.4,
    price: '₹20,000',
    details: 'Playlist Manager',
    image: '/app/avatars/sahil.png',
    bgColor: 'bg-[#bfdbfe]', // Light Blue
    progress: 45,
    metric: 'From ₹20,000',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    ease: [0.25, 0.1, 0.25, 1.0] as const,
  }),
};

function KhapeetarCard({ khapeetar, index, onShowProfile }: { khapeetar: typeof KHAPEETARS[0]; index: number; onShowProfile: () => void }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row items-stretch gap-5 rounded-[20px] border border-white/10 bg-[#0A0A0A] p-5 transition-all hover:border-white/20"
    >
      {/* Avatar */}
      <div className="shrink-0 w-full sm:w-[140px] h-[140px] overflow-hidden rounded-2xl">
        <img
          src={khapeetar.image}
          alt={khapeetar.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between py-1 min-h-[140px]">
        <div>
          <h3 className="text-xl font-bold text-white">{khapeetar.name}</h3>
          <p className="text-[13px] font-normal text-gray-400 mt-1">{khapeetar.role}</p>

          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex items-center gap-1.5 text-gray-500 text-[13px]">
              <MapPin size={14} className="opacity-80" />
              {khapeetar.location}
            </div>
            <div className="flex items-center gap-1 text-yellow-500 text-[13px] font-medium">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < Math.floor(khapeetar.rating) ? "currentColor" : "none"} strokeWidth={2} />
              ))}
              <span className="ml-1 text-white">{khapeetar.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Starting Price</p>
            <p className="text-lg font-bold text-white">{khapeetar.metric}</p>
          </div>

          <button
            onClick={onShowProfile}
            className="rounded-lg bg-gradient-to-r from-[#4c1d95] to-[#be185d] px-6 py-2 text-[13px] font-medium text-white shadow-lg shadow-purple-900/20 transition-all hover:brightness-110 active:scale-95"
          >
            View Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Types ---
type ViewState = 'grid' | 'profile';
type FilterTab = 'Music Video' | 'Marketing' | 'Audio' | 'Promo';

// --- Profile View Component ---
function ProfileView({ khapeetar, onBack }: { khapeetar: typeof KHAPEETARS[0]; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group mb-6"
      >
        <div className="p-1 rounded-full border border-white/10 bg-white/5 group-hover:bg-white/10 transition-colors">
          <ChevronDown className="rotate-90" size={14} />
        </div>
        Back to Dashboard
      </button>

      {/* Main Layout - 2 Columns */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Left Column (Main Profile Info & Content) */}
        <div className="flex-1 space-y-8 min-w-0">

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Large Avatar */}
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
              <img src={khapeetar.image} alt={khapeetar.name} className="h-full w-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl font-bold text-white tracking-tight">{khapeetar.name}</h1>
                  <div className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-green-400 uppercase tracking-wide">Available for new projects</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-lg">{khapeetar.role}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-600" />
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span className="text-sm">{khapeetar.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(khapeetar.rating) ? "currentColor" : "none"} strokeWidth={2} />
                  ))}
                </div>
                <span className="text-white font-bold">{khapeetar.rating}</span>
                <span className="text-gray-500">(38 reviews)</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">120+ releases supported</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Base Pricing', value: khapeetar.price },
              { label: 'Response Time', value: '< 24 Hours' },
              { label: 'Success Rate', value: '92%' },
              { label: 'Open Slots', value: '2' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Capacity Bar */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-medium text-gray-400">Capacity / Monthly Workload</span>
              <span className="text-sm font-bold text-white">70%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div className="absolute left-0 top-0 h-full w-[70%] rounded-full bg-gradient-to-r from-red-500 to-blue-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
            </div>
          </div>

          {/* About */}
          <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
            <h3 className="text-xl font-bold text-white mb-4">About {khapeetar.name.split(' ')[0]}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Focused on release marketing for independent artists, with an emphasis on planning releases, audience reach, and platform performance. I work across key platforms to support consistent visibility, informed decision-making, and steady growth around each release.
            </p>
          </section>

          {/* Services */}
          <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Marketing Services</h3>
            <ul className="space-y-3">
              {[
                "Instagram and Meta ads setup",
                "Creator seeding & influencer outreach",
                "Playlist Pitching (editorial & indie)",
                "Release calendar planning",
                "Performance tracking and reporting",
                "Audience research and targeting strategy",
                "Content direction and release positioning",
                "Post-release analysis and optimization"
              ].map((service, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                  {service}
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* Right Column (Actions & Work) - Fixed Width */}
        <div className="w-full lg:w-[360px] flex-shrink-0 space-y-6 h-fit">

          {/* Hire Card */}
          <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-5 shadow-2xl shadow-black/50">
            <h3 className="text-xl font-bold text-white mb-5">Hire Strategist</h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Campaign Type</label>
                <div className="mt-1.5 relative">
                  <select className="w-full appearance-none rounded-xl border border-white/10 bg-[#161616] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20">
                    <option>Single Release Campaign</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                </div>
              </div>

              <div>
                <div className="relative border-b border-white/10 pb-4 mb-2">
                  <input
                    type="text"
                    value="₹25,000"
                    readOnly
                    className="w-full bg-transparent text-2xl font-bold text-white text-center outline-none"
                  />
                  <p className="text-[10px] text-gray-500 text-center mt-1">Starting Price</p>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 text-center px-2 leading-relaxed">
                You will define scopes, timelines, and budget before confirmation
              </p>

              <button className="w-full rounded-xl bg-[#E91E63] hover:bg-pink-600 py-3 text-sm font-bold text-white shadow-lg shadow-pink-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Send Work Request
              </button>
            </div>
          </div>

          {/* Selected Work */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
            <h3 className="text-sm font-bold text-white mb-4">Selected Work</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: "Indie Hip-Hop", color: "from-blue-900 to-blue-600" },
                { title: "Pop EP", color: "from-pink-900 to-pink-600" },
                { title: "Punjabi Track", color: "from-orange-900 to-orange-600" }
              ].map((work, i) => (
                <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${work.color} opacity-80 hover:opacity-100 transition-opacity cursor-pointer flex items-end p-2`}>
                  <span className="text-[10px] font-medium text-white/90 leading-tight">{work.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Send Offer Form */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
            <h3 className="text-sm font-bold text-white mb-3">Send Custom Offer</h3>
            <textarea
              placeholder="Describe work scope..."
              className="w-full h-20 rounded-xl border border-white/10 bg-[#161616] p-3 text-xs text-white placeholder-gray-600 outline-none focus:border-white/20 resize-none mb-3"
            />
            <div className="flex items-center justify-between">
              <button className="rounded-lg bg-[#E91E63] hover:bg-pink-600 px-4 py-1.5 text-xs font-bold text-white transition-colors">
                Send Offer
              </button>
              <a href="#" className="text-[10px] text-gray-500 hover:text-white underline decoration-gray-700">View Sample</a>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [view, setView] = useState<ViewState>('grid');
  const [selectedProfile, setSelectedProfile] = useState<typeof KHAPEETARS[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Music Video');

  const handleShowProfile = (profile: typeof KHAPEETARS[0]) => {
    setSelectedProfile(profile);
    setView('profile');
  };

  const handleBack = () => {
    setView('grid');
    setSelectedProfile(null);
  };

  return (
    <div className="min-h-screen bg-[#000000] px-8 py-8 text-white">

      {view === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-[26px] font-bold tracking-tight text-white mb-1.5">Discover Khapeetars</h1>
            <p className="text-gray-400 text-[15px]">
              Browse verified professionals to execute audio, video, marketing, and promotional work for your release.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col gap-6">
            <div className="flex gap-3">
              {(['Music Video', 'Marketing', 'Audio', 'Promo'] as FilterTab[]).map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveFilter(tab)}
                  className={`rounded-[10px] px-5 py-2 text-[13px] font-medium transition-all ${
                    activeFilter === tab 
                      ? 'bg-[#1e293b] border border-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : 'border border-white/10 bg-transparent text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {['Location', 'Price', 'Rating'].map((filter) => (
                <button
                  key={filter}
                  className="flex items-center gap-2 rounded-[10px] border border-white/10 bg-[#0A0A0A] px-4 py-2 text-[13px] text-gray-400 hover:border-white/20"
                >
                  <MapPin size={14} className={filter === 'Location' ? 'opacity-100' : 'hidden'} />
                  {filter}
                  <ChevronDown size={14} className="opacity-50" />
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {KHAPEETARS.map((khapeetar, i) => (
              <KhapeetarCard
                key={khapeetar.id}
                khapeetar={khapeetar}
                index={i}
                onShowProfile={() => handleShowProfile(khapeetar)}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center lg:text-left">
            <p className="text-[11px] text-gray-600">
              *Khapeetars listed here are verified by FANNYBAGS. Assigning a khapeetar is required to proceed with campaign execution.
            </p>
          </div>
        </motion.div>
      ) : (
        selectedProfile && <ProfileView khapeetar={selectedProfile} onBack={handleBack} />
      )}

    </div>
  );
}
