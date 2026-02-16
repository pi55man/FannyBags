'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    User,
    UploadCloud,
    Briefcase,
    ShieldCheck,
    Wallet,
    LayoutDashboard,
    HelpCircle,
    FileText,
    LogOut,
} from 'lucide-react';

const MENU_ITEMS = [
    { name: 'Khapeetars', href: '/', icon: User },
    { name: 'Upload Campaign', href: '/campaign/new', icon: UploadCloud },
    { name: 'Work & Deal', href: '/work-deal', icon: Briefcase },
    { name: 'Proof of Work', href: '/proof-of-work', icon: ShieldCheck },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-white/[0.06] bg-[#050505] p-6">

            {/* Logo */}
            <div className="mb-10 flex items-center gap-3 px-2">
                <div className="flex items-center justify-center">
                    <img
                        src="/fanny_logo.png"
                        alt="Fanny Bags Logo"
                        className="h-8 w-auto object-contain"
                    />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">FANNYBAGS</span>
            </div>

            {/* Main Menu */}
            <nav className="flex flex-1 flex-col gap-1.5">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.name === 'Khapeetars' && pathname === '/');
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-300
                                ${isActive
                                    ? 'bg-gradient-to-r from-[#2e1065] to-[#be185d] text-white shadow-lg shadow-purple-900/20'
                                    : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'
                                }
                            `}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Links */}
            <div className="mt-auto flex flex-col gap-0.5 border-t border-white/[0.06] pt-6">
                {[
                    { name: 'Help / FAQ', icon: HelpCircle },
                    { name: 'Terms', icon: FileText },
                    { name: 'Logout', icon: LogOut },
                ].map((item) => (
                    <Link
                        key={item.name}
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-[13px] text-gray-400 transition-colors hover:bg-white/[0.03] hover:text-gray-200"
                    >
                        <item.icon size={16} strokeWidth={1.5} />
                        {item.name}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
