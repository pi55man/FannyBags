'use client';

import React, { useState } from 'react';
import {
    ShieldCheck,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';

// --- Types ---

type TransactionType =
    | 'Deposit'
    | 'Funding Contribution'
    | 'Escrow Lock'
    | 'Escrow Release'
    | 'Payout'
    | 'Royalty Income'
    | 'Investment'
    | 'Sale'
    | 'Withdrawal';

type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Processing';

interface Transaction {
    id: string;
    date: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
}

interface WalletState {
    availableBalance: number;
    pendingPayouts: number;
    lifetimeEarnings: number;
}

// --- Mock Data ---

// --- Mock Data ---

const INITIAL_WALLET: WalletState = {
    availableBalance: 0,
    pendingPayouts: 0,
    lifetimeEarnings: 0,
};

// --- Main Component ---

export default function WalletPage() {
    const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/wallet');
                const data = await res.json();

                if (data.error) {
                    console.error('Wallet API Error:', data.error);
                    return;
                }

                setWallet({
                    availableBalance: data.availableBalance,
                    pendingPayouts: data.pendingPayouts,
                    lifetimeEarnings: data.lifetimeEarnings,
                });
                setTransactions(data.transactions);
            } catch (error) {
                console.error('Failed to fetch wallet data', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [amount, setAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    // Formatting currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleTransaction = async (type: 'Deposit' | 'Withdrawal') => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
        setProcessing(true);

        try {
            const res = await fetch('/api/wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, amount: Number(amount) })
            });
            const data = await res.json();

            if (data.success) {
                // Update local state
                setWallet(prev => ({ ...prev, availableBalance: data.newBalance }));
                // Add new transaction to top of list
                const newTx: Transaction = {
                    id: Math.random().toString(), // Temp ID until refresh
                    date: new Date().toISOString(),
                    type: type,
                    amount: Number(amount),
                    status: 'Completed'
                };
                setTransactions(prev => [newTx, ...prev]);

                // Close modals
                setShowDeposit(false);
                setShowWithdraw(false);
                setAmount('');
            } else {
                alert(data.error || 'Transaction failed');
            }
        } catch (error) {
            console.error('Transaction error', error);
            alert('Transaction failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#050505] relative">
            {/* --- MODALS --- */}
            {(showDeposit || showWithdraw) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6 relative overflow-hidden">
                        {/* Glow */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 ${showDeposit ? 'bg-pink-600/20' : 'bg-blue-600/20'} blur-[50px] pointer-events-none`} />

                        <h3 className="text-xl font-bold text-white mb-2 relative z-10">
                            {showDeposit ? 'Deposit Funds' : 'Withdraw Funds'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 relative z-10">
                            {showDeposit ? 'Add money to your wallet instantly.' : 'Withdraw earnings to your bank account.'}
                        </p>

                        <div className="space-y-4 relative z-10">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-white/30 transition-colors"
                                    placeholder="Enter amount..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => { setShowDeposit(false); setShowWithdraw(false); setAmount(''); }}
                                    className="px-4 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleTransaction(showDeposit ? 'Deposit' : 'Withdrawal')}
                                    disabled={processing}
                                    className={`px-4 py-3 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed
                                        ${showDeposit
                                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 shadow-purple-900/20'
                                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-900/20'
                                        }
                                    `}
                                >
                                    {processing ? 'Processing...' : (showDeposit ? 'Confirm Deposit' : 'Confirm Withdraw')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-8 max-w-[1200px] mx-auto space-y-8 font-sans text-gray-200">

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Wallet</h1>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#052e16] border border-green-500/20 rounded-full">
                        <ShieldCheck size={14} className="text-green-500" />
                        <span className="text-xs font-medium text-green-400">Secure</span>
                    </div>
                </div>

                {/* ------------------------------------------------ */}
                {/* 💰 SECTION 1 — BALANCE OVERVIEW CARD             */}
                {/* ------------------------------------------------ */}
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-0 group">
                    {/* Glow Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center justify-center py-16 px-8 text-center">

                        {/* Available Balance */}
                        <div className="mb-12">
                            <h2 className="text-lg text-gray-400 font-medium mb-3">Available Balance:</h2>
                            <div className="text-6xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                                {formatCurrency(wallet.availableBalance)}
                            </div>
                        </div>

                        {/* Secondary Stats */}
                        <div className="flex items-center justify-between w-full max-w-2xl px-4">
                            <div className="text-center">
                                <div className="text-base text-gray-400 font-medium mb-1.5">Pending Payouts:</div>
                                <div className="text-2xl font-bold text-white tracking-tight">
                                    {formatCurrency(wallet.pendingPayouts)}
                                </div>
                            </div>

                            <div className="w-px h-12 bg-white/10" />

                            <div className="text-center">
                                <div className="text-base text-gray-400 font-medium mb-1.5">Total Lifetime Payouts:</div>
                                <div className="text-2xl font-bold text-white tracking-tight">
                                    {formatCurrency(wallet.lifetimeEarnings)}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>


                {/* ------------------------------------------------ */}
                {/* ⚡ SECTION 2 — ACTION BUTTONS                    */}
                {/* ------------------------------------------------ */}
                <section className="grid grid-cols-2 gap-6">
                    <button
                        onClick={() => setShowDeposit(true)}
                        className="
                    relative overflow-hidden rounded-2xl p-4 h-[60px] 
                    bg-gradient-to-r from-pink-500/10 to-purple-500/10 
                    border border-pink-500/20 hover:border-pink-500/40
                    group transition-all duration-300
                "
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 text-xl font-medium text-pink-100/90 group-hover:text-white flex items-center justify-center gap-2">
                            Deposit
                        </span>
                    </button>

                    <button
                        onClick={() => setShowWithdraw(true)}
                        className="
                    relative overflow-hidden rounded-2xl p-4 h-[60px] 
                    bg-white/[0.03] hover:bg-white/[0.06]
                    border border-white/10 hover:border-white/20
                    transition-all duration-300
                "
                    >
                        <span className="text-xl font-medium text-gray-300 group-hover:text-white flex items-center justify-center gap-2">
                            Withdraw
                        </span>
                    </button>
                </section>


                {/* ------------------------------------------------ */}
                {/* 📊 SECTION 3 — TRANSACTION HISTORY TABLE         */}
                {/* ------------------------------------------------ */}
                <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-medium text-white">Transaction History</h3>
                    </div>

                    <div className="w-full">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr] px-6 py-4 bg-white/[0.02] border-b border-white/[0.06] text-sm font-medium text-gray-400">
                            <div>Date</div>
                            <div>Type</div>
                            <div>Amount</div>
                            <div className="text-right pr-4">Status</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-white/[0.06]">
                            {transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr] px-6 py-5 hover:bg-white/[0.02] transition-colors items-center group"
                                >
                                    <div className="text-gray-300 text-[15px]">
                                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="text-gray-300 text-[15px]">{tx.type}</div>
                                    <div className="text-white font-medium text-[15px]">
                                        {formatCurrency(tx.amount)}
                                    </div>
                                    <div className="flex justify-end">
                                        <StatusBadge status={tx.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}


// --- Subcomponents ---

function StatusBadge({ status }: { status: TransactionStatus }) {
    const styles = {
        Completed: 'bg-[#052e16] text-[#4ade80] border-green-500/20',
        Pending: 'bg-[#451a03] text-[#fbbf24] border-yellow-500/20',
        Failed: 'bg-[#450a0a] text-[#f87171] border-red-500/20',
        Processing: 'bg-[#172554] text-[#60a5fa] border-blue-500/20',
    };

    return (
        <span className={`
            px-3 py-1 rounded-md text-xs font-medium border ${styles[status]}
            inline-flex items-center justify-center min-w-[90px]
        `}>
            {status}
        </span>
    );
}
