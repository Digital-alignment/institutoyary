'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, FolderKanban, Settings } from 'lucide-react'

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
        label: 'Config',
        href: '/admin/settings',
        icon: Settings
    }
]

export function AdminMobileNav() {
    const pathname = usePathname()

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive
                                    ? "text-[#941c1d]"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", isActive && "fill-current/10")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
