'use client';

import React, { useState } from 'react';
import {
    CheckCircle,
    Upload,
    FileAudio,
    FileVideo,
    FileText,
    DollarSign,
    X,
    ChevronRight,
    AlertCircle,
    Check
} from 'lucide-react';

// --- Types ---

interface Song {
    id: string;
    title: string;
    artist: string;
    colors: string; // Gradient class for thumbnail
}

interface UploadStatus {
    audio: boolean;
    video: boolean;
    marketing: boolean;
    monetisation: boolean;
}

type SubmissionStatus = 'DRAFT' | 'UNDER_REVIEW' | 'FIX_REQUIRED' | 'MONETISED';

// --- Mock Data ---

const SONGS: Song[] = [
    {
        id: '1',
        title: 'Midnight Drive',
        artist: 'Alex Garcia',
        colors: 'from-violet-600 to-indigo-600'
    },
    {
        id: '2',
        title: 'Neon Dreams',
        artist: 'Sarah Lee',
        colors: 'from-fuchsia-600 to-pink-600'
    },
    {
        id: '3',
        title: 'Future Funk',
        artist: 'The Groove',
        colors: 'from-cyan-600 to-blue-600'
    },
];

// --- Main Component ---

export default function ProofOfWorkPage() {
    // State
    const [selectedSongId, setSelectedSongId] = useState<string>('1');

    // Simulation of backend state
    const [submissions, setSubmissions] = useState<Record<string, {
        uploads: UploadStatus;
        status: SubmissionStatus;
    }>>({
        '1': {
            uploads: { audio: false, video: false, marketing: false, monetisation: false },
            status: 'DRAFT',
        },
        '2': {
            uploads: { audio: true, video: true, marketing: true, monetisation: true },
            status: 'MONETISED',
        },
        '3': {
            uploads: { audio: true, video: false, marketing: true, monetisation: false },
            status: 'FIX_REQUIRED',
        }
    });

    const activeSong = SONGS.find(s => s.id === selectedSongId) || SONGS[0];
    const currentSubmission = submissions[selectedSongId] || {
        uploads: { audio: false, video: false, marketing: false, monetisation: false },
        status: 'DRAFT',
    };

    const { uploads, status } = currentSubmission;
    const isSubmissionComplete = uploads.audio && uploads.marketing && uploads.monetisation;

    // Handlers
    const handleSelectSong = (id: string) => {
        setSelectedSongId(id);
    };

    const handleUpload = (type: keyof UploadStatus) => {
        if (status === 'UNDER_REVIEW' || status === 'MONETISED') return;

        setSubmissions(prev => ({
            ...prev,
            [selectedSongId]: {
                ...prev[selectedSongId],
                uploads: {
                    ...prev[selectedSongId].uploads,
                    [type]: true
                }
            }
        }));
    };

    const handleSubmit = () => {
        if (!isSubmissionComplete) return;
        setSubmissions(prev => ({
            ...prev,
            [selectedSongId]: {
                ...prev[selectedSongId],
                status: 'UNDER_REVIEW'
            }
        }));
    };

    const handleResubmit = () => {
        setSubmissions(prev => ({
            ...prev,
            [selectedSongId]: {
                ...prev[selectedSongId],
                status: 'DRAFT'
            }
        }));
    }


    return (
        <div className="min-h-screen bg-[#050505]">
            <div className="p-8 max-w-[1400px] space-y-8 font-sans text-gray-200">

                {/* ------------------------------------------------ */}
                {/* SECTION 1 — SELECT SONG FROM ARTIST CATALOGUE     */}
                {/* ------------------------------------------------ */}
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-5 tracking-tight">
                        Select Song from Artist Catalogue
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {SONGS.map((song) => {
                            const isSelected = selectedSongId === song.id;

                            return (
                                <div
                                    key={song.id}
                                    onClick={() => handleSelectSong(song.id)}
                                    className={`
                    relative group cursor-pointer overflow-hidden rounded-xl border transition-all duration-300
                    ${isSelected
                                            ? 'bg-white/[0.08] border-purple-500/50 shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)]'
                                            : 'bg-[#0A0A0A] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
                                        }
                  `}
                                >
                                    <div className="p-4 flex items-center gap-4">
                                        {/* Artwork Thumbnail */}
                                        <div className={`
                                            h-[72px] w-[72px] shrink-0 rounded-lg bg-gradient-to-br ${song.colors} 
                                            shadow-lg relative overflow-hidden ring-1 ring-white/10
                                        `}>
                                            <div className="absolute inset-0 bg-black/20" />
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[17px] font-medium text-white truncate leading-snug">{song.title}</h3>
                                            <p className="text-sm text-gray-400 truncate mt-0.5">{song.artist}</p>
                                        </div>

                                        {/* Checkbox Select Button */}
                                        <div className={`
                                            flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-[13px] font-medium transition-colors
                                            ${isSelected
                                                ? 'bg-[#A855F7]/20 border-[#A855F7]/40 text-[#E9D5FF]'
                                                : 'bg-transparent border-white/[0.1] text-gray-400 group-hover:border-white/[0.2]'
                                            }
                                        `}>
                                            <div className={`
                                                w-4 h-4 rounded border flex items-center justify-center transition-all
                                                ${isSelected ? 'bg-transparent border-[#E9D5FF]' : 'border-gray-500'}
                                            `}>
                                                {isSelected && <Check size={10} strokeWidth={3} />}
                                            </div>
                                            Select
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ------------------------------------------------ */}
                {/* SECTION 2 — FILE REQUIREMENTS GRID                */}
                {/* ------------------------------------------------ */}
                <section>
                    {/* Upload Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                        {/* 1. AUDIO FILE */}
                        <UploadCard
                            title="AUDIO FILE"
                            label="Final Master (WAV)"
                            subtext="Upload WAV file."
                            required
                            isUploaded={uploads.audio}
                            isLocked={status === 'UNDER_REVIEW' || status === 'MONETISED'}
                            onUpload={() => handleUpload('audio')}
                            icon={Upload} // Changed icon to match generic upload
                        />

                        {/* 2. VIDEO FILE */}
                        <UploadCard
                            title="VIDEO FILE"
                            label="Music Video (MP4)"
                            subtext="Upload MP4 file."
                            subtext2="Optional (if applicable)"
                            required={false}
                            isUploaded={uploads.video}
                            isLocked={status === 'UNDER_REVIEW' || status === 'MONETISED'}
                            onUpload={() => handleUpload('video')}
                            icon={FileVideo} // Can use specific icons as per screenshot, using generic for now if needed? Screenshot shows play icon for video, others have upload icon.
                            customIcon={<div className="w-4 h-4 border border-current rounded flex items-center justify-center"><div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-current border-b-[3px] border-b-transparent ml-0.5" /></div>}
                        />

                        {/* 3. MARKETING PROOF */}
                        <UploadCard
                            title="MARKETING PROOF"
                            label="Release Setup Proof"
                            subtext="Upload distributor confirmation."
                            required
                            isUploaded={uploads.marketing}
                            isLocked={status === 'UNDER_REVIEW' || status === 'MONETISED'}
                            onUpload={() => handleUpload('marketing')}
                            icon={Upload}
                        />

                        {/* 4. MONETISATION PROOF */}
                        <UploadCard
                            title="MONETISATION PROOF"
                            label="Revenue Setup Proof"
                            subtext="Content ID / DSP monetisation."
                            required
                            isUploaded={uploads.monetisation}
                            isLocked={status === 'UNDER_REVIEW' || status === 'MONETISED'}
                            onUpload={() => handleUpload('monetisation')}
                            icon={Upload}
                        />

                    </div>
                </section>

                {/* ------------------------------------------------ */}
                {/* 📊 STATUS BAR                                   */}
                {/* ------------------------------------------------ */}
                <section className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#0F172A] mt-2">
                    {/* Darker blue background */}
                    <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />

                    <div className="relative flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2 text-[15px]">
                            <span className="text-gray-400">Status:</span>
                            <span className={`font-medium ${status === 'MONETISED' ? 'text-green-400' :
                                status === 'FIX_REQUIRED' ? 'text-red-400' :
                                    status === 'UNDER_REVIEW' ? 'text-yellow-400' :
                                        'text-amber-400'
                                }`}>
                                {status === 'DRAFT' && 'Waiting for submissions'}
                                {status === 'UNDER_REVIEW' && 'Under Review'}
                                {status === 'FIX_REQUIRED' && 'Action Required'}
                                {status === 'MONETISED' && 'Monetised'}
                            </span>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!isSubmissionComplete || status !== 'DRAFT'}
                            className={`
                        px-6 py-2 rounded-lg text-[13px] font-medium transition-all duration-300
                        ${isSubmissionComplete && status === 'DRAFT'
                                    ? 'bg-gradient-to-r from-[#DB2777] to-[#7C3AED] text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40' // Pink to Purple
                                    : 'bg-white/[0.05] text-gray-500 cursor-not-allowed border border-white/[0.05]'
                                }
                    `}
                        >
                            Submit for review
                        </button>
                    </div>
                </section>


                {/* ------------------------------------------------ */}
                {/* 💰 SECTION 3 — MONETISATION REVIEW PANEL         */}
                {/* ------------------------------------------------ */}
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-5 tracking-tight">
                        Monetisation Review
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-6">

                        {/* LEFT COLUMN: Status Cards */}
                        <div className="space-y-4">
                            {/* MONETISED (GREEN STATE) */}
                            <div className={`
                        rounded-xl border p-5 transition-all duration-300
                        ${status === 'MONETISED'
                                    ? 'bg-[#052e16]/60 border-green-500/20'
                                    : 'bg-[#0A0A0A] border-white/[0.06] opacity-30 grayscale'
                                }
                    `}>
                                <div className="flex items-start gap-4">
                                    <div className={`
                                w-11 h-11 rounded-full flex items-center justify-center shrink-0
                                ${status === 'MONETISED' ? 'bg-green-500 text-black' : 'bg-white/5 text-gray-600'}
                            `}>
                                        <Check size={22} strokeWidth={3} />
                                    </div>
                                    <div className="pt-0.5">
                                        <h3 className={`text-xl font-semibold mb-1 ${status === 'MONETISED' ? 'text-green-400' : 'text-gray-500'}`}>
                                            Monetised
                                        </h3>
                                        <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                                            Funds unlocked. Revenue tracking active.
                                            <br />
                                            Campaign moves forward.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* FIX REQUIRED (RED STATE) */}
                            <div className={`
                        rounded-xl border p-5 transition-all duration-300
                        ${status === 'FIX_REQUIRED'
                                    ? 'bg-[#450a0a]/60 border-red-500/20'
                                    : 'bg-[#0A0A0A] border-white/[0.06] opacity-30 grayscale'
                                }
                    `}>
                                <div className="flex items-start gap-4">
                                    <div className={`
                                w-11 h-11 rounded-full flex items-center justify-center shrink-0
                                ${status === 'FIX_REQUIRED' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-600'}
                            `}>
                                        <X size={22} strokeWidth={3} />
                                    </div>
                                    <div className="pt-0.5">
                                        <h3 className={`text-xl font-semibold mb-1 ${status === 'FIX_REQUIRED' ? 'text-red-400' : 'text-gray-500'}`}>
                                            Fix Required
                                        </h3>
                                        <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                                            Issues detected. Funds remain locked.
                                            <br />
                                            Action needed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Review Notes & Resubmit */}
                        <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0A] p-6 flex flex-col h-full min-h-[300px]">
                            <h3 className="text-lg font-medium text-white mb-6">Review Notes</h3>

                            <div className="flex-1">
                                {status === 'FIX_REQUIRED' || status === 'MONETISED' ? (
                                    <ul className="space-y-3.5 text-gray-300 text-[15px]">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
                                            Missing monetisation proof
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
                                            Distribution date mismatch
                                        </li>
                                    </ul>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 text-sm pb-10">
                                        <p>No review notes available.</p>
                                    </div>
                                )}
                            </div>

                            {/* Resubmit Button - visible if Fix Required */}
                            {status === 'FIX_REQUIRED' && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleResubmit}
                                        className="group w-full relative overflow-hidden rounded-xl bg-blue-900/20 border border-blue-500/20 p-4 hover:bg-blue-900/30 transition-all text-left"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative flex items-center justify-between">
                                            <div>
                                                <div className="text-blue-200 font-medium mb-0.5">Resubmit Files</div>
                                                <div className="text-blue-400/60 text-xs">Re-upload corrected files for review</div>
                                            </div>
                                            <ChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                </div>
                            )}

                            {/* Bottom info text for Draft/Review */}
                            {(status === 'DRAFT' || status === 'UNDER_REVIEW') && (
                                <div className="mt-auto pt-6 border-t border-white/[0.06]">
                                    <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                                        <AlertCircle size={14} />
                                        Reviews typically complete within 24–72 hours
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                </section>

            </div>
        </div>
    );
}


// --- Subcomponents ---

function UploadCard({
    title,
    label,
    subtext,
    subtext2,
    required,
    isUploaded,
    isLocked,
    onUpload,
    icon: Icon,
    customIcon
}: {
    title: string,
    label: string,
    subtext: string,
    subtext2?: string,
    required: boolean,
    isUploaded: boolean,
    isLocked: boolean
    onUpload: () => void,
    icon?: React.ElementType,
    customIcon?: React.ReactNode
}) {
    return (
        <div className={`
            flex flex-col rounded-xl border p-5 h-[180px] transition-all duration-300 relative overflow-hidden group
            ${isUploaded
                ? 'bg-[#050505] border-white/[0.08]'
                : 'bg-[#050505] border-white/[0.08] hover:border-white/[0.15]'
            }
        `}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                    {title}
                </span>
                {customIcon ? customIcon : Icon && <Icon size={14} className="text-gray-500" />}
            </div>

            {/* Content */}
            <div className="mb-4">
                <div className="text-[15px] font-medium text-white mb-1 leading-snug">
                    {label}
                </div>
                <div className="text-[13px] text-gray-500 leading-relaxed">
                    {subtext}
                </div>
                {subtext2 && (
                    <div className="text-[13px] text-gray-500 leading-relaxed">
                        {subtext2}
                    </div>
                )}
            </div>

            {/* Status Footer */}
            <div className="mt-auto">
                {isUploaded ? (
                    <div className="flex items-center gap-1.5 text-green-500 text-[13px] font-medium">
                        <Check size={14} strokeWidth={3} />
                        <span>Uploaded</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-1.5 text-[13px] font-medium ${required ? 'text-green-500' : 'text-gray-600'}`}>
                            {required && <Check size={14} strokeWidth={3} />}
                            <span>{required ? 'Required' : 'Optional'}</span>
                        </div>

                        {/* Upload Button overlay */}
                        {!isLocked && (
                            <button
                                onClick={onUpload}
                                className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 cursor-pointer"
                                aria-label={`Upload ${label}`}
                            />
                        )}

                        {/* If you prefer the visual button appearing on hover/bottom right, adjusting here: */}
                        {/* For now, keeping the design clean as per screenshot which shows clear text status */}

                        {!isLocked && (
                            <button
                                onClick={onUpload}
                                className="absolute inset-0 w-full h-full cursor-pointer z-10 focus:outline-none focus:ring-1 focus:ring-green-500/50 rounded-xl"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
