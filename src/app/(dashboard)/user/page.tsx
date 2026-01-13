'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UserDashboard() {
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
            setLoading(false)
        }
        checkUser()
    }, [router, supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading User Dashboard...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
                <div className="flex items-center justify-between border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                    >
                        Logout
                    </button>
                </div>

                <div className="mt-6">
                    <p className="text-lg">Welcome, <strong>{userEmail}</strong></p>
                    <p className="mt-2 text-gray-600">This is the standard user area. You have limited access compared to admins.</p>
                    <div className="mt-8">
                        <div className="rounded bg-blue-50 p-4 border border-blue-100">
                            <h3 className="font-semibold text-blue-800">Public Content</h3>
                            <p className="text-sm mt-2 text-blue-600">You can view public projects and blogs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
