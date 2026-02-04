'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Loader2, Search, Shield, Trash2, UserCog } from 'lucide-react'

type Profile = {
    id: string
    email: string // We might need to fetch this from auth.users separately if not in profiles, but typically apps sync it. 
    // If email is not in profiles, we can only show ID or name if available.
    // Let's assume for now profiles might have name/email or we fetch.
    // Wait, Supabase auth tables are not directly queryable for emails usually unless exposed.
    // Let's check what 'profiles' has.
    role: string
    full_name?: string
    avatar_url?: string
}

export default function AdminUsersPage() {
    const supabase = createClient()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        // Fetch profiles. Note: Auth email is not in public profiles usually.
        // We will try to fetch whatever is in profiles.
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching users:', error)
        } else {
            console.log('Profiles:', profiles)
            setUsers(profiles || [])
        }
        setLoading(false)
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdating(userId)
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId)

        if (error) {
            alert('Erro ao atualizar função')
        } else {
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
        }
        setUpdating(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#941c1d]">Usuários</h1>
                    <p className="text-gray-500 mt-2">Gerencie os usuários e suas permissões.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#941c1d]" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Usuário</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Função</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">ID</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#941c1d]/10 flex items-center justify-center text-[#941c1d]">
                                                    <UserCog className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.full_name || 'Sem nome'}</div>
                                                    <div className="text-xs text-gray-500">{user.email || 'Email oculto'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin'
                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                    : user.role === 'guardiao'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                                }`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                            {user.id.slice(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <select
                                                disabled={updating === user.id}
                                                value={user.role || 'user'}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="text-xs border-gray-300 rounded-md shadow-sm focus:border-[#941c1d] focus:ring focus:ring-[#941c1d]/20 disabled:opacity-50"
                                            >
                                                <option value="user">User</option>
                                                <option value="brinde">Brinde</option>
                                                <option value="guardiao">Guardião</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
