'use client';

import React, { useState, useEffect, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Info, Check, AlertCircle, DollarSign, Percent, Calculator, Lock } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FundingAskForm.module.css';

type FundingProps = {
    campaignId: string;
};

type Budget = {
    video: number;
    marketing: number;
    audio: number;
    fees: number;
    expenses: number;
};

const DEFAULT_REVENUE_PER_STREAM = 0.05;

export default function FundingAskForm({ campaignId }: FundingProps) {
    const router = useRouter();

    // --- State ---
    const [fundingAsk, setFundingAsk] = useState<string>(''); // treating as string for input handling
    const [revShareEnabled, setRevShareEnabled] = useState(true);
    const [fanSharePct, setFanSharePct] = useState<string>(''); // string for input

    const [budget, setBudget] = useState<Budget>({
        video: 40,
        marketing: 30,
        audio: 10,
        fees: 10,
        expenses: 10
    });

    const [khapeetarType, setKhapeetarType] = useState<'fannybags' | 'own' | null>(null);
    const [activeTab, setActiveTab] = useState<'story' | 'vision'>('story');
    const [story, setStory] = useState('');
    const [vision, setVision] = useState('');

    const [breakEvenStreams, setBreakEvenStreams] = useState<number>(0);

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [isValid, setIsValid] = useState(false);

    // --- Helpers ---
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // --- Effects ---
    // Calculate Breakeven
    useEffect(() => {
        const ask = parseInt(fundingAsk.replace(/,/g, '') || '0', 10);
        const share = parseFloat(fanSharePct || '0'); // Input is percentage (e.g., 50)

        if (ask > 0 && share > 0 && revShareEnabled) {
            // Formula: (funding_ask / equity_fans) / revenue_per_stream
            // equity_fans is share / 100 ?
            // The prompt says: streams_to_breakeven = (funding_ask / equity_fans) / revenue_per_stream
            // Assuming equity_fans is the decimal representation (e.g. 0.5 for 50%)
            // If share is 0, division by zero, handle it.

            // Wait, if I raise 1000 and give 50% equity.
            // Valuation = 1000 / 0.5 = 2000.
            // Breakeven Revenue = 2000.
            // Streams = 2000 / 0.05 = 40,000.

            const equity = share / 100;
            const streams = (ask / equity) / DEFAULT_REVENUE_PER_STREAM;
            setBreakEvenStreams(Math.floor(streams));
        } else {
            setBreakEvenStreams(0);
        }
    }, [fundingAsk, fanSharePct, revShareEnabled]);

    // Validation
    const errors: Record<string, string> = {};
    const askVal = parseInt(fundingAsk.replace(/,/g, '') || '0', 10);
    if (!fundingAsk) errors.ask = "Funding amount is required";
    else if (askVal < 200) errors.ask = "Minimum funding ask is ₹200";

    const shareVal = parseFloat(fanSharePct || '0');
    if (revShareEnabled) {
        if (!fanSharePct) errors.share = "Revenue share percentage is required";
        else if (shareVal < 25 || shareVal > 100) errors.share = "Share must be between 25% and 100%";
    }

    // Budget check (loose)
    const totalBudget = Object.values(budget).reduce((a, b) => a + b, 0);
    // Not strictly blocking, but warning could be good. Prompt says loose enforcement.

    if (!khapeetarType) errors.khapeetar = "Please select a Khapeetar option";
    if (!story.trim()) errors.story = "Campaign story is required";
    if (!vision.trim()) errors.vision = "Creative vision is required";

    const formIsValid = Object.keys(errors).length === 0;

    useEffect(() => {
        setIsValid(formIsValid);
    }, [formIsValid]);


    // --- Handlers ---
    const handleBudgetChange = (key: keyof Budget, val: number) => {
        setBudget(prev => ({ ...prev, [key]: val }));
    };

    const handleSave = async () => {
        setShowErrors(true);
        if (!isValid) {
            showToast("Please fix errors before saving.", "error");
            return;
        }

        setIsLoading(true);

        const payload = {
            fundingAsk: parseInt(fundingAsk.replace(/,/g, '') || '0', 10),
            revShareEnabled,
            fanSharePct: revShareEnabled ? parseFloat(fanSharePct) : 0,
            budget,
            revenuePerStream: DEFAULT_REVENUE_PER_STREAM,
            breakEvenStreams,
            khapeetarType,
            story,
            vision
        };

        try {
            const res = await fetch(`/api/campaigns/${campaignId}/funding`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save funding details");

            showToast("Draft Saved Successfully!", "success");
            // Maybe redirect to dashboard or stay here? 
            // Prompt says: "Completion of this page must result in a fully populated draft campaign... The campaign must not be visible to fans... must not trigger any future or fan-side logic."
            // Assuming we stay here or go to a success state/dashboard.
            // I'll show a persistent success message or redirect to dashboard after a delay.
            setTimeout(() => {
                // router.push('/dashboard'); // Assuming dashboard exists or just refresh
            }, 1000);

        } catch (err) {
            console.error(err);
            showToast("Error saving draft.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
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

            <div className={styles.card}>
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Funding & Story</h1>
                    <p className="text-gray-400">Define your budget and tell your story.</p>
                </header>

                {/* 1. Funding Ask */}
                <div className={styles.section}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Total Funding Ask (₹) *</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                            <input
                                type="number"
                                className={clsx(styles.input, "pl-8", showErrors && errors.ask && styles.errorInput)}
                                value={fundingAsk}
                                onChange={(e) => setFundingAsk(e.target.value)}
                                placeholder="50000"
                                min="200"
                            />
                        </div>
                        <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.ask}</span>
                    </div>

                    <div className={styles.formGroup}>
                        <div className="flex items-center justify-between mb-4">
                            <label className={styles.label} style={{ marginBottom: 0 }}>Enable Revenue Sharing</label>
                            <button
                                type="button"
                                onClick={() => setRevShareEnabled(!revShareEnabled)}
                                className={clsx("w-12 h-6 rounded-full p-1 transition-colors relative", revShareEnabled ? "bg-purple-600" : "bg-gray-700")}
                            >
                                <motion.div
                                    className="h-4 w-4 rounded-full bg-white shadow-sm"
                                    animate={{ x: revShareEnabled ? 24 : 0 }}
                                />
                            </button>
                        </div>

                        <AnimatePresence>
                            {revShareEnabled && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label className={styles.label}>
                                        Fan Revenue Share (%) *
                                        <div className="group relative ml-2 inline-flex">
                                            <Info size={14} className="text-gray-500 hover:text-white cursor-help" />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-white/10 rounded-lg text-[10px] text-gray-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                Percentage of net streaming revenue shared with fans.
                                            </div>
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className={clsx(styles.input, "pr-8", showErrors && errors.share && styles.errorInput)}
                                            value={fanSharePct}
                                            onChange={(e) => setFanSharePct(e.target.value)}
                                            placeholder="50"
                                            min="25"
                                            max="100"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                                    </div>
                                    <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.share}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <hr className="border-white/5 my-8" />

                {/* 2. Budget Allocation */}
                <div className={styles.section}>
                    <h3 className="text-lg font-bold text-white mb-4">Budget Allocation</h3>
                    <div className="space-y-4">
                        {[
                            { key: 'video', label: 'Music Video' },
                            { key: 'marketing', label: 'Marketing' },
                            { key: 'audio', label: 'Audio Production' },
                            { key: 'fees', label: 'Artist Fees' },
                            { key: 'expenses', label: 'Other Expenses' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center gap-4">
                                <label className="w-32 text-sm text-gray-400">{item.label}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    className={styles.range}
                                    value={budget[item.key as keyof Budget]}
                                    onChange={(e) => handleBudgetChange(item.key as keyof Budget, parseInt(e.target.value))}
                                />
                                <span className="w-12 text-right text-sm font-mono text-white">{budget[item.key as keyof Budget]}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <span className={clsx("text-xs font-mono", totalBudget === 100 ? "text-green-400" : "text-yellow-500")}>
                        Total: {totalBudget}% {totalBudget !== 100 && "(Should ideally be 100%)"}
                    </span>
                </div>
            </div>

            {/* 3. Breakeven Calculator */}
            <div className="my-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/10 border border-white/10 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Calculator size={120} />
                </div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Calculator size={18} className="text-purple-400" />
                    Breakeven Calculator
                </h3>

                <div className="grid grid-cols-2 gap-8 relative z-10">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Revenue Per Stream</p>
                        <p className="text-xl font-mono text-white">₹{DEFAULT_REVENUE_PER_STREAM}</p>
                        <p className="text-[10px] text-gray-600 mt-1">Industry Average (Read-only)</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Streams to Breakeven</p>
                        <p className="text-2xl font-bold font-mono text-green-400">
                            {breakEvenStreams.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-1">Estimated based on Funding Ask & Share</p>
                    </div>
                </div>
            </div>

            {/* 4. Khapeetar Selection */}
            <div className={styles.section}>
                <label className={styles.label}>Select Khapeetar *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={clsx(styles.radioCard, khapeetarType === 'fannybags' && styles.active)}>
                        <input
                            type="radio"
                            name="khapeetar"
                            className="hidden"
                            checked={khapeetarType === 'fannybags'}
                            onChange={() => setKhapeetarType('fannybags')}
                        />
                        <div className="font-bold text-white mb-1">Use FANNYBAGS Khapeetar</div>
                        <div className="text-xs text-gray-400">We assign a verified pro</div>
                    </label>
                    <label className={clsx(styles.radioCard, khapeetarType === 'own' && styles.active)}>
                        <input
                            type="radio"
                            name="khapeetar"
                            className="hidden"
                            checked={khapeetarType === 'own'}
                            onChange={() => setKhapeetarType('own')}
                        />
                        <div className="font-bold text-white mb-1">Use Own Khapeetar</div>
                        <div className="text-xs text-gray-400">Bring your own team</div>
                    </label>
                </div>
                <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && errors.khapeetar}</span>
            </div>

            <hr className="border-white/5 my-8" />

            {/* 5. Narrative */}
            <div className={styles.section}>
                <div className="flex gap-6 border-b border-white/10 mb-4">
                    <button
                        className={clsx("pb-2 text-sm font-medium transition-colors border-b-2", activeTab === 'story' ? "text-white border-purple-500" : "text-gray-500 border-transparent hover:text-gray-300")}
                        onClick={() => setActiveTab('story')}
                    >
                        Campaign Story (For Fans) *
                    </button>
                    <button
                        className={clsx("pb-2 text-sm font-medium transition-colors border-b-2", activeTab === 'vision' ? "text-white border-purple-500" : "text-gray-500 border-transparent hover:text-gray-300")}
                        onClick={() => setActiveTab('vision')}
                    >
                        Creative Vision (For Khapeetar) *
                    </button>
                </div>

                <div className="min-h-[200px]">
                    {activeTab === 'story' && (
                        <textarea
                            className={clsx(styles.textarea, showErrors && errors.story && styles.errorInput)}
                            placeholder="Tell your fans why they should invest in this song..."
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                        />
                    )}
                    {activeTab === 'vision' && (
                        <textarea
                            className={clsx(styles.textarea, showErrors && errors.vision && styles.errorInput)}
                            placeholder="Describe your visual and sonic direction for the creative team..."
                            value={vision}
                            onChange={(e) => setVision(e.target.value)}
                        />
                    )}
                </div>
                <span className="text-xs text-red-500 mt-1.5 block min-h-[1.25rem]">{showErrors && (activeTab === 'story' ? errors.story : errors.vision)}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-8">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={styles.buttonSecondary}
                >
                    {isLoading ? 'Saving...' : 'Save as Draft'}
                </button>

                <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-[#262626] text-gray-500 font-bold cursor-not-allowed opacity-70"
                >
                    <Lock size={16} />
                    Publish Campaign (Coming Soon)
                </button>
            </div>

        </div>
        </div >
    );
}
