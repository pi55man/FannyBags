'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Music, Check, Info, ArrowRight, Play, Pause, X, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './SongDetailsForm.module.css';

type Genre = 'Hip-Hop' | 'Rap' | 'Pop' | 'Indie' | 'Rock' | 'Electronic' | 'Other';
const GENRES: Genre[] = ['Hip-Hop', 'Rap', 'Pop', 'Indie', 'Rock', 'Electronic', 'Other'];

const DISTRIBUTORS = ['Distrokid', 'Rewave', 'CDBaby', 'Tunecore', 'UnitedMasters', 'Amuse', 'ONErpm', 'Other'];

export default function SongDetailsForm() {
    const router = useRouter();

    // --- State ---
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState<Genre | ''>('');
    const [status, setStatus] = useState<'released' | 'unreleased' | null>(null);

    // Released Fields
    const [upc, setUpc] = useState('');
    const [songLink, setSongLink] = useState('');
    const [migrationConfirmed, setMigrationConfirmed] = useState(false);

    // Unreleased Fields
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [distributorType, setDistributorType] = useState<'fannybags' | 'own' | null>(null);
    const [ownDistributor, setOwnDistributor] = useState('');

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Shared Fields
    const [closeDate, setCloseDate] = useState('');
    const [releaseDate, setReleaseDate] = useState('');

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Derived State for Validation
    const [isValid, setIsValid] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // --- Helpers ---
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // --- Handlers ---
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val.length <= 120) setTitle(val);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validate size (e.g., 50MB limit mock)
            if (file.size > 50 * 1024 * 1024) {
                showToast('File size exceeds 50MB limit.', 'error');
                return;
            }

            setAudioFile(file);
            setUploadProgress(0);

            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);
        }
    };

    const toggleAudio = () => {
        if (!audioFile) return;
        if (!audioRef.current) {
            const url = URL.createObjectURL(audioFile);
            audioRef.current = new Audio(url);
            audioRef.current.onended = () => setIsPlaying(false);
        }

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const removeFile = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setAudioFile(null);
        setUploadProgress(0);
        setIsPlaying(false);
    };

    // --- Validation Logic ---
    const errors: Record<string, string> = {};

    // Check validation
    const isTitleValid = title.trim().length > 0;
    if (!isTitleValid) errors.title = "Song title is required";

    const isGenreValid = genre !== '';
    if (!isGenreValid) errors.genre = "Genre is required";

    const isStatusSelected = status !== null;
    if (!isStatusSelected) errors.status = "Release status is required";

    let isSectionValid = false;

    if (status === 'released') {
        const isUpcValid = /^[a-zA-Z0-9]{6,}$/.test(upc);
        if (!isUpcValid && upc.length > 0) errors.upc = "UPC must be alphanumeric and at least 6 characters";
        if (upc.length === 0) errors.upc = "UPC is required";

        const isLinkValid = /^(https?:\/\/)?(www\.)?(spotify\.com|music\.youtube\.com|youtube\.com|youtu\.be)\/.+$/.test(songLink);
        if (!isLinkValid && songLink.length > 0) errors.songLink = "Must be a valid Spotify or YouTube URL";
        if (songLink.length === 0) errors.songLink = "Song link is required";

        if (!migrationConfirmed) errors.migration = "You must agree to the migration terms";

        isSectionValid = isUpcValid && isLinkValid && migrationConfirmed;
    } else if (status === 'unreleased') {
        const isFileUploaded = !!audioFile && uploadProgress === 100;
        if (!audioFile) errors.audio = "Audio file is required";

        const isDistributorValid = distributorType === 'fannybags' || (distributorType === 'own' && ownDistributor !== '');
        if (!distributorType) errors.distributor = "Distributor selection is required";
        if (distributorType === 'own' && !ownDistributor) errors.distributor = "Please select your distributor";

        isSectionValid = isFileUploaded && isDistributorValid;
    }

    // Date Logic
    const now = new Date();
    // Reset time for date-only comparison
    now.setHours(0, 0, 0, 0);

    const close = new Date(closeDate + 'T00:00:00'); // Force local time parsing
    const release = new Date(releaseDate + 'T00:00:00');

    const isCloseDateValid = !isNaN(close.getTime()) && close >= now;
    if (!closeDate) errors.closeDate = "Campaign close date is required";
    else if (close < now) errors.closeDate = "Date cannot be in the past";

    const isReleaseDateValid = !isNaN(release.getTime()) && release > close;
    if (!releaseDate) errors.releaseDate = "Planned release date is required";
    else if (release <= close) errors.releaseDate = "Release date must be after campaign close date";

    // Check gap hint
    const dayGap = (release.getTime() - close.getTime()) / (1000 * 3600 * 24);
    const showDateHint = isCloseDateValid && isReleaseDateValid && (dayGap < 7 || dayGap > 14);

    const formIsValid = isTitleValid && isGenreValid && isStatusSelected && isSectionValid && isCloseDateValid && isReleaseDateValid;

    useEffect(() => {
        setIsValid(formIsValid);
    }, [formIsValid]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowErrors(true);

        if (!isValid) {
            showToast('Please fix the errors below.', 'error');
            return;
        }

        setIsLoading(true);

        // 1. Submit Draft Metadata
        const payload = {
            title: title.trim(),
            genre,
            status,
            closeDate,
            releaseDate,
            ...(status === 'released' ? {
                upc,
                songLink,
                migrationConfirmed
            } : {
                distributorType,
                distributor: distributorType === 'own' ? ownDistributor : 'fannybags'
            }),
        };

        try {
            // Save Draft
            const draftRes = await fetch('/api/campaigns/draft/song-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!draftRes.ok) {
                throw new Error('Failed to save draft');
            }

            const draftData = await draftRes.json();
            const { campaignId } = draftData;

            // 2. Upload Audio if unreleased
            if (status === 'unreleased' && audioFile) {
                const formData = new FormData();
                formData.append('file', audioFile);

                const uploadRes = await fetch(`/api/campaigns/${campaignId}/upload-audio`, {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    throw new Error('Failed to upload audio');
                }
            }

            showToast('Draft Saved! Redirecting...', 'success');

            // Navigate to next page (Funding Ask)
            setTimeout(() => {
                router.push(`/campaign/${campaignId}/funding`);
            }, 1500);

        } catch (err) {
            console.error(err);
            showToast('Something went wrong. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                        <span className="font-medium text-sm">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <form className={styles.card} onSubmit={handleSubmit} noValidate>
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Song Details</h1>
                    <p className="text-gray-400">Provide the core metadata for your campaign.</p>
                </header>

                {/* Title */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Song Title *</label>
                    <input
                        className={clsx(styles.input, showErrors && errors.title && styles.errorInput)}
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Ex. Supernova"
                    />
                    <div className="flex justify-between mt-1.5">
                        <span className="text-xs text-red-500 min-h-[1.25rem]">{showErrors && errors.title}</span>
                        <span className="text-xs text-gray-500">{title.length}/120</span>
                    </div>
                </div>

                {/* Genre */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Genre *</label>
                    <div className="relative">
                        <select
                            className={clsx(styles.select, showErrors && errors.genre && styles.errorInput)}
                            value={genre}
                            onChange={(e) => setGenre(e.target.value as Genre)}
                        >
                            <option value="" disabled>Select Genre</option>
                            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.genre}</span>
                </div>

                {/* Status */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Release Status *</label>
                    <div className={styles.radioGroup}>
                        <label className={clsx(styles.radioLabelOption, status === 'released' && styles.active)}>
                            <input
                                type="radio"
                                name="status"
                                className="hidden"
                                checked={status === 'released'}
                                onChange={() => setStatus('released')}
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-white">Released</span>
                                <span className="text-[11px] text-gray-400">Already on Spotify/Apple Music</span>
                            </div>
                        </label>
                        <label className={clsx(styles.radioLabelOption, status === 'unreleased' && styles.active)}>
                            <input
                                type="radio"
                                name="status"
                                className="hidden"
                                checked={status === 'unreleased'}
                                onChange={() => setStatus('unreleased')}
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-white">Unreleased</span>
                                <span className="text-[11px] text-gray-400">Demo or master ready for distribution</span>
                            </div>
                        </label>
                    </div>
                    <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.status}</span>
                </div>

                {/* Conditional: Released */}
                {status === 'released' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 border-l-2 border-white/10 pl-6 ml-1 my-6"
                    >
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                UPC Code *
                                <a
                                    href="https://www.barcodelookup.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ml-2 text-gray-500 hover:text-white transition-colors cursor-pointer inline-flex items-center"
                                    title="Lookup UPC"
                                >
                                    <Info size={14} />
                                </a>
                            </label>
                            <input
                                className={clsx(styles.input, showErrors && errors.upc && styles.errorInput)}
                                value={upc}
                                onChange={(e) => setUpc(e.target.value)}
                                placeholder="Ex. 123456789012"
                            />
                            <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.upc}</span>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Existing Song Link *</label>
                            <input
                                className={clsx(styles.input, showErrors && errors.songLink && styles.errorInput)}
                                value={songLink}
                                onChange={(e) => setSongLink(e.target.value)}
                                placeholder="https://open.spotify.com/track/..."
                            />
                            <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.songLink}</span>
                        </div>
                        <div className={styles.formGroup}>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={migrationConfirmed}
                                        onChange={(e) => setMigrationConfirmed(e.target.checked)}
                                    />
                                </div>
                                <span className="text-sm text-gray-300 leading-snug group-hover:text-white transition-colors">
                                    I agree to migrate this song to FANNYBAGS campaign terms.
                                    <br />
                                    <a href="/generic-legal-page" target="_blank" className="text-purple-400 hover:text-purple-300 text-xs underline mt-1 inline-block">View Migration Conditions</a>
                                </span>
                            </label>
                            <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.migration}</span>
                        </div>
                    </motion.div>
                )}

                {/* Conditional: Unreleased */}
                {status === 'unreleased' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 border-l-2 border-white/10 pl-6 ml-1 my-6"
                    >
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Upload Sound File *
                                <span className="ml-2 text-[10px] text-yellow-500 uppercase font-bold tracking-wider rounded bg-yellow-500/10 px-1.5 py-0.5">Preview Only</span>
                            </label>

                            {!audioFile ? (
                                <div
                                    className={clsx(styles.fileUpload, showErrors && errors.audio && styles.errorUpload)}
                                    onClick={() => document.getElementById('audio-upload')?.click()}
                                >
                                    <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors mx-auto">
                                        <Music size={24} className="text-gray-400 group-hover:text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-300">Click to upload audio</p>
                                    <p className="text-xs text-gray-500 mt-1">WAV or MP3 (Max 50MB)</p>
                                    <input
                                        id="audio-upload"
                                        type="file"
                                        accept="audio/wav,audio/mp3"
                                        style={{ display: 'none' }}
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            ) : (
                                <div className="rounded-xl border border-white/10 bg-[#171717] p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-10 w-10 shrink-0 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                                <Music size={18} className="text-purple-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm text-white truncate">{audioFile.name}</p>
                                                <p className="text-xs text-gray-500">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors"
                                            title="Replace File"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={toggleAudio}
                                            disabled={uploadProgress < 100}
                                            className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                                        </button>
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-purple-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-mono text-gray-500 w-8 text-right">{uploadProgress}%</span>
                                    </div>
                                </div>
                            )}
                            <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.audio}</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Select Distributor *</label>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <label className={clsx(styles.radioLabelOption, distributorType === 'fannybags' && styles.active)}>
                                    <input
                                        type="radio"
                                        name="distType"
                                        className="hidden"
                                        checked={distributorType === 'fannybags'}
                                        onChange={() => setDistributorType('fannybags')}
                                    />
                                    <span className="text-sm font-medium text-white text-center">Use FANNYBAGS</span>
                                </label>
                                <label className={clsx(styles.radioLabelOption, distributorType === 'own' && styles.active)}>
                                    <input
                                        type="radio"
                                        name="distType"
                                        className="hidden"
                                        checked={distributorType === 'own'}
                                        onChange={() => setDistributorType('own')}
                                    />
                                    <span className="text-sm font-medium text-white text-center">Use Own Distributor</span>
                                </label>
                            </div>

                            {distributorType === 'own' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <select
                                        className={clsx(styles.select, showErrors && errors.distributor && styles.errorInput)}
                                        value={ownDistributor}
                                        onChange={(e) => setOwnDistributor(e.target.value)}
                                    >
                                        <option value="" disabled>Select your distributor</option>
                                        {DISTRIBUTORS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </motion.div>
                            )}
                            <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.distributor}</span>
                        </div>
                    </motion.div>
                )}

                <hr className="border-white/5 my-8" />

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Campaign Close Date *</label>
                        <input
                            type="date"
                            className={clsx(styles.input, showErrors && errors.closeDate && styles.errorInput)}
                            value={closeDate}
                            onChange={(e) => setCloseDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.closeDate}</span>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Planned Release Date *</label>
                        <input
                            type="date"
                            className={clsx(styles.input, showErrors && errors.releaseDate && styles.errorInput)}
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                            min={closeDate || new Date().toISOString().split('T')[0]}
                        />
                        <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.releaseDate}</span>
                    </div>
                </div>

                {/* Date Hint */}
                {showDateHint && (
                    <div className="flex items-start gap-2 text-yellow-500/80 bg-yellow-500/5 p-3 rounded-lg text-xs mt-2 mb-6">
                        <Info size={14} className="mt-0.5 shrink-0" />
                        <p>We recommend scheduling your release 7-14 days after the campaign closes to allow time for distribution and playlisting.</p>
                    </div>
                )}

                {!showDateHint && <div className="mb-6" />}

                <button
                    type="submit"
                    className={styles.button}
                    disabled={(!isValid && showErrors) || isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>Next Step</span>
                            <ArrowRight size={16} />
                        </div>
                    )}
                </button>

            </form>
        </div>
    );
}
