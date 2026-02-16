'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronDown,
    Check,
    Info,
    Plus,
    X,
    Music2,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// --- Types ---
type Song = {
    id: string; // Campaign ID
    title: string;
    artist: string;
    status: 'Campaign Live' | 'Funding Complete' | 'Draft' | string;
    statusColor: string;
    image: string; // gradient placeholder color or image URL
};

type Offer = {
    id: string;
    khapeetarName: string;
    service: string;
    location: string;
    budget: string;
    timeline: string;
    notes?: string;
    avatar: string;
    isFeatured?: boolean;
    status?: string;
};

type ActiveDeal = {
    id: string;
    song: string;
    khapeetar: string;
    service: string;
    budget: string;
    status: string;
};

export default function WorkDealPage() {
    // --- State ---
    const [songs, setSongs] = useState<Song[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [activeDeals, setActiveDeals] = useState<ActiveDeal[]>([]);

    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    const [isSongDropdownOpen, setIsSongDropdownOpen] = useState(false);
    const [finalBudget, setFinalBudget] = useState('');
    const [isCustomOfferModalOpen, setIsCustomOfferModalOpen] = useState(false);

    // Loading & Error States
    const [isLoadingSongs, setIsLoadingSongs] = useState(true);
    const [isLoadingOffers, setIsLoadingOffers] = useState(false);
    const [isLoadingDeals, setIsLoadingDeals] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isSendingOffer, setIsSendingOffer] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Helpers ---
    const getStatusColor = (status: string) => {
        if (status === 'Campaign Live') return 'text-green-400';
        if (status === 'Funding Complete') return 'text-green-400';
        return 'text-gray-400';
    };

    // --- API Calls ---

    // 1. Fetch Campaigns (Songs)
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                // In a real app the base URL would be env variable
                const res = await fetch('/api/artist/campaigns?khapeetar_type=fannybags');
                // Using relative path for Next.js API routes or proxy, assuming standard setup

                // Fallback for demo if API fails/doesn't exist yet
                if (!res.ok) throw new Error('Failed to fetch campaigns');

                const data = await res.json();
                // Map API data to UI model
                const mappedSongs: Song[] = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    artist: item.artist_name || 'Unknown Artist',
                    status: item.status,
                    statusColor: getStatusColor(item.status),
                    image: item.cover_image || 'bg-gradient-to-br from-blue-600 to-purple-600' // rudimentary fallback
                }));
                setSongs(mappedSongs);
            } catch (err) {
                console.error("API Error fetching songs:", err);
                // Fallback Mock Data for Demo purposes if API is not actually running
                // Fallback Mock Data - COMMENTED OUT to enforce Real API Structure
                /* setSongs([
                    { id: '1', title: 'Midnight Drive', artist: 'Midnight Drive', status: 'Campaign Live', statusColor: 'text-green-400', image: 'bg-gradient-to-br from-blue-600 to-purple-600' },
                    { id: '2', title: 'No Signal', artist: 'Abstract Sound', status: 'Funding Complete', statusColor: 'text-green-400', image: 'bg-gradient-to-br from-indigo-500 to-pink-500' },
                ]); */
                setSongs([]); // Clear songs on error to reflect "Real API" failure
            } finally {
                setIsLoadingSongs(false);
            }
        };

        fetchCampaigns();
    }, []);

    // 2. Fetch Offers & Active Deals when Song Selected
    useEffect(() => {
        if (!selectedSong) return;

        const fetchOffersAndDeals = async () => {
            setIsLoadingOffers(true);
            setIsLoadingDeals(true);
            // Removed clearing state here to prevent UI "pop/vanish"
            // setOffers([]); 
            // setActiveDeals([]);

            try {
                // Fetch Offers
                const offersRes = await fetch(`/api/campaigns/${selectedSong.id}/khapeetar-offers`);
                if (offersRes.ok) {
                    const offersData = await offersRes.json();
                    setOffers(offersData);
                } else {
                    // Mock Fallback
                    // Mock Fallback - COMMENTED OUT
                    /* setOffers([
                        {
                            id: 'o1', khapeetarName: 'Rohit Malhotra', service: 'Release Marketing', location: 'Pune, India', budget: '₹30,000', timeline: '14 days', notes: 'Includes ad setup...', avatar: '/avatars/aarav.png', isFeatured: true
                        },
                        {
                            id: 'o2', khapeetarName: 'Shreya Singh', service: 'Release Marketing', location: 'Chandigarh, India', budget: '₹25,000', timeline: '20 days', avatar: '/avatars/riya.png', isFeatured: false
                        }
                    ]); */
                }

                // Fetch Active Deals
                const dealsRes = await fetch(`/api/campaigns/${selectedSong.id}/active-deals`);
                if (dealsRes.ok) {
                    const dealsData = await dealsRes.json();
                    setActiveDeals(dealsData);
                } else {
                    // Mock Fallback
                    // Mock Fallback - COMMENTED OUT
                    /* setActiveDeals([
                        { id: 'ad1', song: selectedSong.title, khapeetar: 'Riya Kapoor', service: 'Music Video', budget: '₹25,000', status: 'Work in Progress' }
                    ]); */
                }

            } catch (err) {
                console.error(err);
                setError('Failed to load details for this campaign.');
            } finally {
                setIsLoadingOffers(false);
                setIsLoadingDeals(false);
            }
        };

        fetchOffersAndDeals();
    }, [selectedSong]);


    // --- Handlers ---

    const handleSongSelect = (song: Song) => {
        setSelectedSong(song);
        setIsSongDropdownOpen(false);
        setSelectedOffer(null);
        setFinalBudget('');
        setError(null);
    };

    const handleOfferSelect = (offer: Offer) => {
        if (selectedOffer?.id === offer.id) {
            setSelectedOffer(null);
            setFinalBudget('');
        } else {
            setSelectedOffer(offer);
            // remove non-numeric chars logic mostly for stripping currency symbol if present
            const numericBudget = offer.budget.replace(/[^0-9]/g, '');
            setFinalBudget(numericBudget);
        }
    };

    const handleActivateDeal = async () => {
        if (!selectedSong || !selectedOffer || !finalBudget) return;

        setIsActivating(true);
        try {
            const res = await fetch(`/api/campaigns/${selectedSong.id}/confirm-deal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    offer_id: selectedOffer.id,
                    final_budget: finalBudget
                })
            });

            if (!res.ok) throw new Error('Failed to activate deal');

            // Success: refresh active deals, maybe remove the offer from list? 
            // For now, let's just refresh the active deals list
            const dealsRes = await fetch(`/api/campaigns/${selectedSong.id}/active-deals`);
            if (dealsRes.ok) {
                const dealsData = await dealsRes.json();
                setActiveDeals(dealsData);
            }

            // Clear selection
            setSelectedOffer(null);
            setFinalBudget('');
            alert("Deal Activated Successfully!");

        } catch (err) {
            console.error(err);
            alert("Failed to activate deal. Please try again.");
        } finally {
            setIsActivating(false);
        }
    };

    const handleSendCustomOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSong) {
            alert("Please select a song first.");
            return;
        }

        setIsSendingOffer(true);
        // Extract form data here in a real implementation
        // const formData = new FormData(e.currentTarget as HTMLFormElement);

        try {
            const res = await fetch(`/api/campaigns/${selectedSong.id}/send-offer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // mock payload
                    khapeetar_id: 'sample_id',
                    service: 'Custom Service',
                    budget: '50000',
                    timeline: '30 days',
                    message: 'Custom offer message'
                })
            });

            if (!res.ok) throw new Error("Failed to send offer");

            alert("Offer Sent Successfully!");
            setIsCustomOfferModalOpen(false);
        } catch (err) {
            console.error(err);
            // Simulate success for demo even if API fails
            setIsCustomOfferModalOpen(false);
            alert("Offer Sent (Simulation)!");
        } finally {
            setIsSendingOffer(false);
        }
    }


    const isDealReady = selectedSong && selectedOffer && finalBudget;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-8 font-sans">

            {/* --- Header --- */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-1">Work Requests & Deals</h1>
                <p className="text-gray-400 text-sm">
                    Select a song, assign a khapeetar, and confirm work for your campaign.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* --- Left Column (Sections 1 & 3) --- */}
                <div className="lg:col-span-5 flex flex-col gap-6">

                    {/* SECTION 1: SELECT SONG */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold tracking-wide text-gray-200 uppercase">
                            SECTION 1: SELECT SONG
                        </h2>

                        <div className="relative">
                            <button
                                onClick={() => setIsSongDropdownOpen(!isSongDropdownOpen)}
                                disabled={isLoadingSongs}
                                className={`
                                    w-full flex items-center justify-between bg-[#0A0A0A] border rounded-xl px-4 py-3.5 text-left transition-all
                                    ${isSongDropdownOpen ? 'border-[#E91E63] shadow-[0_0_15px_rgba(233,30,99,0.15)]' : 'border-[#2A2A2A] hover:border-gray-700'}
                                `}
                            >
                                <span className={selectedSong ? 'text-white font-medium' : 'text-gray-500'}>
                                    {isLoadingSongs ? 'Loading campaigns...' : (selectedSong ? `${selectedSong.title} - ${selectedSong.status}` : 'Choose song from your catalogue')}
                                </span>
                                <ChevronDown size={18} className={`text-gray-500 transition-transform ${isSongDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isSongDropdownOpen && !isLoadingSongs && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-[#121212] border border-[#2A2A2A] rounded-xl shadow-2xl z-20 overflow-hidden max-h-80 overflow-y-auto"
                                    >
                                        {songs.length > 0 ? songs.map((song) => (
                                            <div
                                                key={song.id}
                                                onClick={() => handleSongSelect(song)}
                                                className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
                                            >
                                                <div className={`w-10 h-10 rounded-lg ${song.image.startsWith('http') ? '' : song.image} flex-shrink-0 overflow-hidden`}>
                                                    {song.image.startsWith('http') && <img src={song.image} alt="" className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {song.title} <span className="text-gray-500 text-xs"> - {song.status === 'Draft' ? 'Draft' : song.artist}</span>
                                                    </div>
                                                    <div className={`text-xs ${song.statusColor}`}>
                                                        {song.status}
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-4 text-center text-gray-500 text-sm">No campaigns found.</div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Selected Song Preview Card */}
                        {selectedSong && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-3 flex items-center gap-3"
                            >
                                <div className={`w-12 h-12 rounded-lg ${selectedSong.image.startsWith('http') ? '' : selectedSong.image} overflow-hidden`}>
                                    {selectedSong.image.startsWith('http') && <img src={selectedSong.image} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                    <div className="font-medium text-white">{selectedSong.title}</div>
                                    <div className={`text-xs ${selectedSong.statusColor}`}>{selectedSong.status}</div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* SECTION 3: DEAL CONFIRMATION */}
                    <div className="space-y-3 mt-4">
                        <h2 className="text-sm font-bold tracking-wide text-gray-200 uppercase">
                            SECTION 3: DEAL CONFIRMATION
                        </h2>

                        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-5 space-y-4">

                            {/* Selected Song Field */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Selected Song:</label>
                                <div className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-gray-300 flex items-center justify-between">
                                    <span>{selectedSong?.title || '- must be selected -'}</span>
                                    <ChevronDown size={14} className="text-gray-600" />
                                </div>
                            </div>

                            {/* Selected Khapeetar Field */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Selected Khapeetar:</label>
                                <div className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-gray-300 flex items-center justify-between">
                                    <span>{selectedOffer?.khapeetarName || '- must be selected -'}</span>
                                    <ChevronDown size={14} className="text-gray-600" />
                                </div>
                            </div>

                            {/* Final Budget Input */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Final Budget (₹):</label>
                                <input
                                    type="text"
                                    value={finalBudget}
                                    onChange={(e) => setFinalBudget(e.target.value)}
                                    placeholder="Enter amount..."
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
                                />
                            </div>

                            <p className="text-xs text-gray-500 leading-relaxed">
                                Helper assignment to khapeetar, and confirm work for your campaign.
                            </p>

                            <button
                                onClick={handleActivateDeal}
                                disabled={!isDealReady || isActivating}
                                className={`
                                    w-full py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2
                                    ${isDealReady
                                        ? 'bg-[#E91E63] hover:bg-pink-600 text-white shadow-[0_0_20px_rgba(233,30,99,0.3)]'
                                        : 'bg-[#2A2A2A] text-gray-500 cursor-not-allowed'
                                    }
                                `}
                            >
                                {isActivating && <Loader2 size={16} className="animate-spin" />}
                                Activate Deal
                            </button>
                        </div>
                    </div>

                </div>

                {/* --- Right Column (Sections 2, 4, Info) --- */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    {/* SECTION 2: INCOMING OFFERS */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold tracking-wide text-gray-200 uppercase">
                                SECTION 2: AVAILABLE/INCOMING KHAPEETAR OFFERS
                            </h2>
                            <div className="flex items-center gap-4">
                                {/* Make New Offer Button (Requirement 5) */}
                                <button
                                    onClick={() => setIsCustomOfferModalOpen(true)}
                                    className="px-3 py-1.5 rounded-lg border border-[#E91E63]/50 text-xs text-[#E91E63] hover:bg-[#E91E63]/10 font-medium flex items-center gap-1.5 transition-all"
                                >
                                    <Plus size={14} /> Make New Offer
                                </button>
                                {/* View All Link */}
                                {selectedSong && (
                                    <Link href={`/work-deals/${selectedSong.id}/offers`} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
                                        View All <ArrowRight size={12} />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div className={`
                            flex gap-4 overflow-x-auto pb-8 pt-2 scrollbar-hide -mx-1 px-1 min-h-[300px] items-stretch transition-opacity duration-300
                            ${isLoadingOffers ? 'opacity-50 pointer-events-none' : 'opacity-100'}
                        `}>
                            {selectedSong ? (
                                offers.length > 0 ? (
                                    <AnimatePresence mode='wait'>
                                        <motion.div
                                            key={selectedSong.id} // Re-render animation when song changes
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex gap-4"
                                        >
                                            {offers.map((offer) => {
                                                const isSelected = selectedOffer?.id === offer.id;

                                                return (
                                                    <div
                                                        key={offer.id}
                                                        className={`
                                                        relative flex-shrink-0 w-[400px] rounded-2xl border p-5 transition-all duration-300 bg-[#0A0A0A] group overflow-hidden
                                                        ${isSelected
                                                                ? 'border-gray-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                                                : 'border-[#2A2A2A] hover:border-gray-700'
                                                            }
                                                    `}
                                                    >
                                                        {/* Selected Glow */}
                                                        {isSelected && (
                                                            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 pointer-events-none z-20" />
                                                        )}

                                                        <div className="flex justify-between gap-4 h-full relative z-10">

                                                            {/* LEFT COLUMN: Details & Action */}
                                                            <div className="flex-1 flex flex-col justify-between">
                                                                <div className="space-y-3">
                                                                    <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                                                                        <span className="text-gray-500 text-xs font-medium">Khapeetar Name:</span>
                                                                        <span className="text-white text-sm font-semibold tracking-wide">{offer.khapeetarName}</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                                                                        <span className="text-gray-500 text-xs font-medium">Service:</span>
                                                                        <span className="text-gray-300 text-sm leading-tight">{offer.service}</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                                                                        <span className="text-gray-500 text-xs font-medium">Location:</span>
                                                                        <span className="text-gray-300 text-sm leading-tight">{offer.location}</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                                                                        <span className="text-gray-500 text-xs font-medium">Proposed Budget:</span>
                                                                        <span className="text-white text-sm font-semibold">{offer.budget}</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                                                                        <span className="text-gray-500 text-xs font-medium">Timeline:</span>
                                                                        <span className="text-gray-300 text-sm">{offer.timeline}</span>
                                                                    </div>

                                                                    {offer.notes && (
                                                                        <div className="pt-1">
                                                                            <span className="text-gray-500 text-xs font-medium block mb-1">Notes:</span>
                                                                            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 pr-2">{offer.notes}</p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Select Checkbox at Bottom */}
                                                                <div
                                                                    className="mt-4 pt-3 flex items-center gap-3 cursor-pointer"
                                                                    onClick={() => handleOfferSelect(offer)}
                                                                >
                                                                    <div className={`
                                                                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                                    ${isSelected ? 'bg-transparent border-gray-400' : 'border-gray-700 group-hover:border-gray-500'}
                                                                `}>
                                                                        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-[1px]" />}
                                                                    </div>
                                                                    <span className="text-sm text-gray-400 font-medium">Select Offer</span>
                                                                </div>
                                                            </div>

                                                            {/* RIGHT COLUMN: Big Avatar Image */}
                                                            <div className="w-[130px] flex-shrink-0 flex flex-col justify-end">
                                                                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-white/5">
                                                                    {/* Gradient Overlay for "Cyberpunk" feel if image has bg */}
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

                                                                    <img
                                                                        src={offer.avatar}
                                                                        alt={offer.khapeetarName}
                                                                        className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-500"
                                                                    />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    </AnimatePresence>
                                ) : (
                                    <div className="w-full text-center text-gray-500">No offers found for this campaign.</div>
                                )
                            ) : (
                                <div className="w-full py-12 text-center text-gray-500 border border-[#2A2A2A] border-dashed rounded-xl bg-[#121212]/50">
                                    <Music2 size={32} className="mx-auto mb-3 opacity-20" />
                                    Please select a song to view offers.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* SECTION 4: ACTIVE DEALS */}
                        <div className="space-y-3">
                            <h2 className="text-sm font-bold tracking-wide text-gray-200 uppercase">
                                SECTION 4: ACTIVE DEALS
                            </h2>
                            {isLoadingDeals ? (
                                <div className="py-4 text-center"><Loader2 className="animate-spin text-[#E91E63] mx-auto" size={24} /></div>
                            ) : activeDeals.length > 0 ? (
                                activeDeals.map((deal) => (
                                    <div key={deal.id} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-5 space-y-3 hover:border-gray-700 transition-all">
                                        <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                                            <span className="text-gray-400">Song:</span>
                                            <span className="text-gray-200 truncate">{deal.song}</span>

                                            <span className="text-gray-400">Khapeetar:</span>
                                            <span className="text-gray-200">{deal.khapeetar}</span>

                                            <span className="text-gray-400">Service:</span>
                                            <span className="text-gray-200">{deal.service}</span>

                                            <span className="text-gray-400">Budget:</span>
                                            <span className="text-gray-200">{deal.budget}</span>

                                            <span className="text-gray-400">Status:</span>
                                            <span className="text-gray-200">{deal.status}</span>
                                        </div>

                                        <Link
                                            href={`/work-deals/${deal.id}`}
                                            className="block w-full text-center bg-[#E91E63] hover:bg-pink-600 text-white rounded-lg py-2.5 text-sm font-medium mt-2 shadow-[0_0_15px_rgba(233,30,99,0.2)] transition-all"
                                        >
                                            View Project
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-sm italic">No active deals yet.</div>
                            )}
                        </div>

                        {/* INFO ALERT BOX */}
                        <div className="space-y-3 flex flex-col justify-end">
                            <div className="bg-[#3b82f6]/20 border border-[#3b82f6]/30 rounded-xl p-5 flex gap-4">
                                <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-100">
                                        Assignment is mandatory for your campaign.
                                    </h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        The artist must assign the Khapeetar to the campaign within the program.
                                        If no assignment is made, the Khapeetar will not affect the artist's assignment
                                        or the performance of your campaign.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* --- CUSTOM OFFER MODAL --- */}
            <AnimatePresence>
                {isCustomOfferModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCustomOfferModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white">Send Custom Offer</h3>
                                <button
                                    onClick={() => setIsCustomOfferModalOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <form className="space-y-4" onSubmit={handleSendCustomOffer}>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Select Khapeetar</label>
                                    <select className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none appearance-none">
                                        <option>Select...</option>
                                        <option value="1">Rohit Malhotra</option>
                                        <option value="2">Shreya Singh</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Budget</label>
                                        <input name="budget" type="text" placeholder="₹" className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Timeline</label>
                                        <input name="timeline" type="text" placeholder="Days" className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                                    <textarea name="message" rows={3} placeholder="Describe your offer..." className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none resize-none" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSendingOffer}
                                    className="w-full bg-[#E91E63] hover:bg-pink-600 text-white rounded-xl py-3.5 font-medium mt-2 transition-all shadow-[0_0_20px_rgba(233,30,99,0.2)] flex justify-center gap-2 items-center"
                                >
                                    {isSendingOffer && <Loader2 size={18} className="animate-spin" />}
                                    Send Offer
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
