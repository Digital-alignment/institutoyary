'use client'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-[#f8f2d8]">
            {/* Desktop Sidebar */}
            <AdminSidebar />

            {/* Mobile Bottom Nav */}
            <AdminMobileNav />

            {/* Main Content */}
            <main className="flex-1 min-h-screen md:ml-72 pb-20 md:pb-8 p-4 md:p-8 transition-all duration-300">
                {children}
            </main>
        </div>
    )
}
