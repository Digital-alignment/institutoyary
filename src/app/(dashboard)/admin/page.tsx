'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            setUserEmail(user.email || null)

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'admin') {
                router.push('/user') // Redirect non-admins to user dashboard
            }
            setLoading(false)
        }
        checkUser()
    }, [router, supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading Admin Dashboard...</div>
    }

    return (
        <div className="min-h-screen bg-[#f8f2d8] p-8 text-[#1c260e]">
            <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
                <div className="flex items-center justify-between border-b pb-4">
                    <h1 className="text-3xl font-bold text-[#941c1d]">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                    >
                        Logout
                    </button>
                </div>

                <div className="mt-6">
                    <p className="text-lg">Welcome, Admin <strong>{userEmail}</strong></p>
                    <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2">
                        <Link href="/admin/projetos" className="block">
                            <div className="rounded border p-4 hover:shadow-lg transition bg-[#fdfaf1] border-[#6e1516] h-full">
                                <h3 className="font-semibold text-[#941c1d]">Manage Projects</h3>
                                <p className="text-sm mt-2">Create, edit, or delete projects.</p>
                            </div>
                        </Link>
                        <Link href="/admin/saberes" className="block">
                            <div className="rounded border p-4 hover:shadow-lg transition bg-[#fdfaf1] border-[#6e1516] h-full">
                                <h3 className="font-semibold text-[#941c1d]">Manage Blogs</h3>
                                <p className="text-sm mt-2">Write and publish blog posts.</p>
                            </div>
                        </Link>
                        <Link href="/admin/settings" className="block">
                            <div className="rounded border p-4 hover:shadow-lg transition bg-[#fdfaf1] border-[#6e1516] h-full">
                                <h3 className="font-semibold text-[#941c1d]">CMS Settings</h3>
                                <p className="text-sm mt-2">Configure platform settings.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
