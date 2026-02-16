'use client';

import React, { useState } from 'react';
import { 
    Clock, 
    Shield, 
    CheckCircle2, 
    Circle, 
    Download, 
    FileText, 
    MoreVertical, 
    Plus, 
    MessageSquare, 
    Paperclip, 
    Send,
    UploadCloud,
    AlertCircle,
    ChevronDown,
    X,
    Users,
    CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// --- Types ---

type Khapeetar = {
    id: string;
    name: string;
    avatar: string;
    role: string;
    assignedBudget: string;
    permissions: string[];
    isRemoval?: boolean; // logic for removal flow
};

type FileItem = {
    id: string;
    name: string;
    type: 'audio' | 'video' | 'pdf' | 'doc';
    size: string;
    uploadedBy: string;
    date: string;
};

type Message = {
    id: string;
    sender: 'Artist' | 'Khapeetar' | 'System';
    name: string;
    avatar?: string;
    text: string;
    timestamp: string;
    isMe: boolean; // simplistic check for UI
};

// --- Mock Data ---

const PROJECT_DATA = {
    songTitle: 'Highway Night',
    artistName: 'Turning Point',
    tierBadge: 'Local Legends',
    serviceType: 'Music Video',
    dealStatus: 'Active',
    agreedBudget: '₹ 85,000',
    escrowStatus: 'Locked',
    deadline: '15 May 2026',
    timeLeft: '12 Days',
};

const INITIAL_TEAM: Khapeetar[] = [
    { 
        id: 'k1', 
        name: 'Rohit M.', 
        avatar: '/avatars/aarav.png', 
        role: 'Director / Editor', 
        assignedBudget: '₹ 50,000', 
        permissions: ['Files', 'Comm', 'Deliverables'] 
    }
];

const FILES: FileItem[] = [
    { id: 'f1', name: 'Highway_night_master.wav', type: 'audio', size: '45 MB', uploadedBy: 'Turning Point', date: '01 May' },
    { id: 'f2', name: 'ref_video_01.mp4', type: 'video', size: '120 MB', uploadedBy: 'Turning Point', date: '01 May' },
    { id: 'f3', name: 'Artist_brand_kit.pdf', type: 'pdf', size: '15 MB', uploadedBy: 'System', date: '01 May' },
    { id: 'f4', name: 'highway_night.docx', type: 'doc', size: '2 MB', uploadedBy: 'Turning Point', date: '01 May' },
];

const MESSAGES: Message[] = [
    { id: 'm1', sender: 'Artist', name: 'Turning Point', avatar: '/avatars/artist.png', text: 'Hi, just uploaded the final track, please check.', timestamp: '10:00 AM', isMe: true },
    { id: 'm2', sender: 'Khapeetar', name: 'Rohit M.', avatar: '/avatars/aarav.png', text: 'Got it, thanks. We\'ll start production tomorrow.', timestamp: '10:05 AM', isMe: false },
];

export default function DealDetailsPage() {
    // --- State ---
    const [team, setTeam] = useState<Khapeetar[]>(INITIAL_TEAM);
    const [isAddKhapeetarOpen, setIsAddKhapeetarOpen] = useState(false);
    
    // Modal State
    const [selectedNewKhapeetar, setSelectedNewKhapeetar] = useState<string>('');
    const [newBudget, setNewBudget] = useState('');
    const [messages, setMessages] = useState(MESSAGES);
    const [newMessage, setNewMessage] = useState('');

    // --- Handlers ---

    const handleAddKhapeetar = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Add
        const newMember: Khapeetar = {
            id: `k${Date.now()}`,
            name: 'Shreya Singh', // Mock selected
            avatar: '/avatars/riya.png',
            role: 'Colorist',
            assignedBudget: `₹ ${newBudget}`,
            permissions: ['Files', 'Comm']
        };
        setTeam([...team, newMember]);
        setIsAddKhapeetarOpen(false);
        setSelectedNewKhapeetar('');
        setNewBudget('');
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setMessages([...messages, {
            id: `m${Date.now()}`,
            sender: 'Artist',
            name: 'Turning Point',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        }]);
        setNewMessage('');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-10 font-sans pb-32">
            
            {/* --- Header / Title --- */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold mb-2">Project Details</h1>
                <p className="text-gray-400">All execution details, deliverables, files and approvals for this song.</p>
            </div>

            {/* --- SECTION 1: OVERVIEW BANNER (Gradient Border) --- */}
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-8">
                <div className="bg-[#0A0A0A] rounded-2xl p-6 lg:p-8 flex flex-wrap gap-y-6 justify-between items-center relative overflow-hidden">
                    {/* Glow effect inside */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 blur-sm" />
                    
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Song Title</span>
                        <div className="text-xl font-bold text-white max-w-[200px] truncate">{PROJECT_DATA.songTitle}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Artist Name</span>
                        <div className="text-lg font-medium text-gray-200">{PROJECT_DATA.artistName}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tier Badge</span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 w-fit">
                            <span className="text-yellow-500 text-xs font-bold">★ {PROJECT_DATA.tierBadge}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Service Type</span>
                        <div className="text-lg font-medium text-gray-200">{PROJECT_DATA.serviceType}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Deal Status</span>
                        <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-sm font-medium border border-yellow-500/30 w-fit">
                            {PROJECT_DATA.dealStatus}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Agreed Budget</span>
                        <div className="text-xl font-bold text-white">{PROJECT_DATA.agreedBudget}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Escrow Status</span>
                        <div className="px-3 py-1 rounded-full bg-yellow-600/20 text-yellow-500 text-sm font-medium border border-yellow-600/30 w-fit">
                            {PROJECT_DATA.escrowStatus}
                        </div>
                    </div>
                    <div className="space-y-1 text-right">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block">Deadline</span>
                        <div className="text-lg font-medium text-white">{PROJECT_DATA.deadline}</div>
                        <div className="text-xs text-yellow-500 font-bold">{PROJECT_DATA.timeLeft}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* --- LEFT COLUMN (Brief, Files, Timeline) --- */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* SECTION 2: PROJECT BRIEF */}
                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-100">Project Brief</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">What needs to be done</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Create a cinematic music video focused on performance and mood. Visual tone should be dark, raw, and intimate. Final output optimised for YouTube + Reels. The final output should be optimised for YouTube and short-form platforms such as Reels, with strong opening moments.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: FILES & ASSETS */}
                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-100">Files & Assets</h2>
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Assets Provided by Artist / Platform</h3>
                        
                        <div className="space-y-3">
                            {FILES.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-[#121212] hover:bg-[#1A1A1A] transition-colors border border-transparent hover:border-[#333] group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded-lg bg-[#222] flex items-center justify-center flex-shrink-0 text-gray-400">
                                            {file.type === 'audio' && <span className="text-xl">▶</span>}
                                            {file.type === 'video' && <span className="text-xl">►</span>}
                                            {file.type === 'pdf' && <FileText size={20} />}
                                            {file.type === 'doc' && <FileText size={20} />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm text-gray-200 font-medium truncate">{file.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{file.type.toUpperCase()} • {file.uploadedBy}</div>
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-white p-2">
                                        <Download size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <button className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-[#333] text-gray-400 text-sm hover:border-gray-500 hover:text-gray-200 transition-all flex items-center justify-center gap-2">
                            <UploadCloud size={16} /> Upload New File
                        </button>
                    </div>

                    {/* SECTION 5: TIMELINE */}
                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-100">Project Timeline</h2>
                            <span className="text-gray-400 text-sm">80%</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden mb-8">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-pink-500 w-[80%]" />
                        </div>

                        <div className="space-y-6 relative pl-2">
                            {/* Vertical Line */}
                            <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-[#222]" />

                            <div className="flex gap-4 relative">
                                <CheckCircle2 className="text-blue-500 bg-[#0A0A0A] z-10" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-white">Deal Accepted</div>
                                    <div className="text-xs text-gray-500">01 May</div>
                                </div>
                            </div>
                            <div className="flex gap-4 relative">
                                <CheckCircle2 className="text-blue-500 bg-[#0A0A0A] z-10" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-white">First Draft Due</div>
                                    <div className="text-xs text-gray-500">08 May</div>
                                </div>
                            </div>
                            <div className="flex gap-4 relative">
                                <CheckCircle2 className="text-blue-500 bg-[#0A0A0A] z-10" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-white">Review Window</div>
                                    <div className="text-xs text-gray-500">3 days</div>
                                </div>
                            </div>
                            <div className="flex gap-4 relative">
                                <Circle className="text-gray-600 bg-[#0A0A0A] z-10" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-gray-400">Final Submission</div>
                                    <div className="text-xs text-gray-600">15 May</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- RIGHT COLUMN (Deliverables, Team, Chat, PoW) --- */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    {/* SECTION 3: DELIVERABLES & TEAM (Updated) */}
                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Static Deliverables */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-100">Deliverables</h2>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase">Required Outputs</h3>
                                    
                                    <div className="flex items-center justify-between text-sm py-1">
                                        <span className="text-gray-300">Music Video (MP4 - 4K/1080p)</span>
                                        <UploadCloud className="text-yellow-500" size={16} />
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-1">
                                        <span className="text-gray-300">Reel Cuts (3-5 clips, 15-30sec)</span>
                                        <CheckCircle2 className="text-green-500" size={16} />
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-1">
                                        <span className="text-gray-300">Thumbnail (JPG)</span>
                                        <UploadCloud className="text-yellow-500" size={16} />
                                    </div>
                                </div>
                                
                                <div className="pt-2 space-y-2">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase">Delivery Format</h3>
                                    <div className="text-xs text-gray-400 grid grid-cols-2 gap-2">
                                        <span>File type: MP4, MOV, JPG</span>
                                        <span>Resolution: 4K, 1080p</span>
                                        <span className="col-span-2">Duration: 3-5 mins (Video), 15-30s (Reels)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Team / Multi-Khapeetar System */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                                        <Users size={18} className="text-[#E91E63]" /> Team
                                    </h2>
                                    <button 
                                        onClick={() => setIsAddKhapeetarOpen(true)}
                                        className="text-xs bg-[#E91E63]/10 text-[#E91E63] border border-[#E91E63]/50 px-2.5 py-1 rounded-lg hover:bg-[#E91E63]/20 transition-all flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Khapeetar
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {team.map((member) => (
                                        <div key={member.id} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-3 flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                                                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">{member.name}</div>
                                                    <div className="text-xs text-gray-500">{member.role}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-gray-200">{member.assignedBudget}</div>
                                                <div className="text-[10px] text-gray-600 uppercase tracking-wide">Assigned</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-[#111] rounded-lg p-3 text-xs text-gray-500 leading-relaxed border border-[#222]">
                                    <span className="text-[#E91E63]">Note:</span> You can add multiple Khapeetars to a project. Budget is split from the main pot.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* SECTION 6: COMMUNICATION */}
                        <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col h-[400px]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-100">Communication</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide mb-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 overflow-hidden">
                                            {msg.avatar && <img src={msg.avatar} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${msg.isMe ? 'bg-[#222] text-gray-200 rounded-tr-none' : 'bg-[#E91E63]/10 text-white border border-[#E91E63]/20 rounded-tl-none'}`}>
                                            <div className={`text-[10px] font-bold mb-1 ${msg.isMe ? 'text-gray-500' : 'text-[#E91E63]'}`}>{msg.name}</div>
                                            {msg.text}
                                            <div className="text-[9px] text-gray-500 mt-1 text-right">{msg.timestamp}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="relative mt-auto">
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Write an update or ask a question..." 
                                    className="w-full bg-[#121212] border border-[#333] rounded-xl pl-4 pr-10 py-3 text-sm text-gray-200 focus:outline-none focus:border-[#E91E63]"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E91E63]">
                                    <Paperclip size={18} />
                                </button>
                            </form>
                        </div>

                        {/* SECTION 7: PROOF OF WORK */}
                        <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col h-[400px]">
                            <h2 className="text-lg font-semibold text-gray-100 mb-2">Proof of Work (PoW) Solutions</h2>
                            <p className="text-xs text-gray-400 mb-6">Upload Deliverables for Review</p>

                            <div className="border-2 border-dashed border-[#333] rounded-xl flex-1 flex flex-col items-center justify-center bg-[#121212] hover:bg-[#1A1A1A] transition-colors cursor-pointer group mb-6">
                                <UploadCloud className="text-gray-500 group-hover:text-[#E91E63] transition-colors mb-2" size={32} />
                                <span className="text-xs text-gray-400 group-hover:text-gray-200">Drag & drop files or Browse</span>
                                <span className="text-[10px] text-gray-600 mt-1">Supports MP4, JPG, PNG, MOV, ZIP</span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">PoW Checklist</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <CheckCircle2 size={14} className="text-green-500" />
                                    <span>Final deliverables uploaded</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <CheckCircle2 size={14} className="text-green-500" />
                                    <span>Matches agreed scope</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <CheckCircle2 size={14} className="text-green-500" />
                                    <span>Ready for monetisation / release</span>
                                    <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded ml-auto">Under Review</span>
                                </div>
                            </div>
                            
                            <button className="w-full bg-[#00C853] hover:bg-green-600 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(0,200,83,0.3)] transition-all">
                                Submit
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- SECTION 8: PAYMENT & RELEASE --- */}
            <div className="mt-8 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-100 mb-1">Payment & Release</h2>
                    <p className="text-xs text-gray-500">All payments are handled via escrow. Funds are released only after Proof of Work approval</p>
                </div>

                <div className="flex gap-8 text-sm">
                    <div>
                        <div className="text-gray-500 text-xs">Agreed Budget</div>
                        <div className="font-bold text-white text-lg">₹ 85,000</div>
                    </div>
                    <div>
                        <div className="text-gray-500 text-xs">Platform Fee</div>
                        <div className="font-bold text-gray-300 text-lg">₹ 8,500</div>
                    </div>
                    <div>
                        <div className="text-gray-500 text-xs text-[#00C853]">Net Payout</div>
                        <div className="font-bold text-[#00C853] text-lg">₹ 76,500</div>
                    </div>
                    <div>
                        <div className="text-gray-500 text-xs text-yellow-500">Payment Status</div>
                        <div className="px-3 py-1 bg-yellow-900/20 text-yellow-500 border border-yellow-900/30 rounded text-xs font-semibold mt-1 inline-block">Pending</div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="bg-[#00C853] hover:bg-green-600 text-black font-bold py-2.5 px-6 rounded-lg shadow-[0_0_15px_rgba(0,200,83,0.3)] transition-all">
                        Approve Work
                    </button>
                    <button className="bg-[#2A2A2A] hover:bg-[#333] text-gray-200 font-medium py-2.5 px-6 rounded-lg border border-[#333] transition-all">
                        Request Revision
                    </button>
                    <button className="bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] font-medium py-2.5 px-6 rounded-lg border border-[#EF4444]/30 transition-all">
                        Report Issue
                    </button>
                </div>
            </div>


            {/* --- "ADD KHAPEETAR" MODAL --- */}
            <AnimatePresence>
                {isAddKhapeetarOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddKhapeetarOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white">Add Khapeetar to Team</h3>
                                <button onClick={() => setIsAddKhapeetarOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleAddKhapeetar} className="space-y-5">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1.5">Select Khapeetar</label>
                                    <div className="relative">
                                        <select 
                                            value={selectedNewKhapeetar} 
                                            onChange={(e) => setSelectedNewKhapeetar(e.target.value)}
                                            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:border-[#E91E63] appearance-none outline-none"
                                        >
                                            <option value="">Select a freelancer...</option>
                                            <option value="k2">Shreya Singh (Colorist)</option>
                                            <option value="k3">Vikram Patel (Sound Engineer)</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1.5">Only available khapeetars shown.</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1.5">Assign Budget From Main Pot</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input 
                                            type="text" 
                                            value={newBudget}
                                            onChange={(e) => setNewBudget(e.target.value)}
                                            placeholder="Amount (e.g. 25000)" 
                                            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-8 pr-4 py-3 text-white focus:border-[#E91E63] outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Permissions</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-[#0A0A0A] px-3 py-2 rounded-lg border border-[#333]">
                                            <Checkbox checked size={16} className="text-green-500" /> 
                                            <span className="text-xs text-gray-300">Files</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-[#0A0A0A] px-3 py-2 rounded-lg border border-[#333]">
                                            <Checkbox checked size={16} className="text-green-500" /> 
                                            <span className="text-xs text-gray-300">Chat</span>
                                        </div>
                                        {/* Simplified permissions for UI demo */}
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-[#E91E63] hover:bg-pink-600 text-white rounded-xl py-3 font-medium mt-2 transition-all shadow-[0_0_20px_rgba(233,30,99,0.3)]"
                                >
                                    Confirm & Add to Team
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}

// Simple internal icon component for checklist to avoid extra imports if needed, 
// using Lucide's CheckSquare inside the modal instead for strict types? 
// No, let's just use a div styled as checkbox.
function Checkbox({ checked, className, size = 16 }: { checked?: boolean, className?: string, size?: number }) {
    return (
        <div className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? 'bg-[#E91E63] border-[#E91E63]' : 'border-gray-500'} ${className}`}>
             {checked && <CheckCircle2 size={size-2} className="text-white" />}
        </div>
    )
}
