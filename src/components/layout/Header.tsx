'use client';

import Link from 'next/link';
import { Search, Menu } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl px-8">

            {/* Left: Menu & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Menu size={20} />
                </button>

                <div className="relative w-full max-w-[480px]">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        strokeWidth={1.5}
                    />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-white/20 focus:bg-[#111]"
                    />
                </div>
            </div>

            {/* Right: Profile Avatar */}
            <div className="flex items-center gap-4">
                <Link href="/profile" className="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-gray-800 transition-transform hover:scale-105">
                    <img
                        src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
                        alt="Profile"
                        className="h-full w-full object-cover"
                    />
                </Link>
            </div>

        </header>
    );
}
