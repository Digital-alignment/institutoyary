'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, FolderKanban, Settings, LogOut, Users, ClipboardList } from 'lucide-react'

const navItems = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard
    },
    {
        label: 'Saberes',
        href: '/admin/saberes',
        icon: FileText
    },
    {
        label: 'Projetos',
        href: '/admin/projetos',
        icon: FolderKanban
    },
    {
        label: 'Usuários',
        href: '/admin/users',
        icon: Users
    },
    {
        label: 'Formulários',
        href: '/admin/forms',
        icon: ClipboardList
    },
    {
        label: 'Configurações',
        href: '/admin/settings',
        icon: Settings
    }
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex w-72 bg-white/80 backdrop-blur-xl border-r border-[#941c1d]/10 min-h-screen flex-col fixed left-0 top-0 bottom-0 z-40 shadow-xl shadow-[#941c1d]/5">
            <div className="h-24 flex items-center px-8">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#941c1d] to-[#d92e2f] bg-clip-text text-transparent">
                    Yary Admin
                </span>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-[#941c1d] to-[#b32223] text-white shadow-lg shadow-[#941c1d]/20 translate-x-1"
                                    : "text-gray-600 hover:bg-[#941c1d]/5 hover:text-[#941c1d] hover:translate-x-1"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                isActive ? "text-white" : "text-gray-400 group-hover:text-[#941c1d]"
                            )} />
                            {item.label}
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-[#941c1d]/10 bg-gradient-to-b from-transparent to-[#941c1d]/5">
                <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-gray-600 hover:bg-white hover:text-red-600 hover:shadow-md hover:shadow-red-500/10 w-full transition-all duration-300 group border border-transparent hover:border-red-100">
                    <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    Sair
                </button>
            </div>
        </aside>
    )
}
