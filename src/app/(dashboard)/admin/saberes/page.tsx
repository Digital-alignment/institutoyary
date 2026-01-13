'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ContentCard } from '@/components/admin/ContentCard'
import { Plus, Loader2 } from 'lucide-react'

export default function AdminSaberesPage() {
    const supabase = createClient()
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setBlogs(data)
        setLoading(false)
    }

    const handleHide = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published'

        // Optimistic update
        setBlogs(blogs.map(b => b.id === id ? { ...b, status: newStatus } : b))

        const { error } = await supabase
            .from('blogs')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            alert('Erro ao atualizar status')
            fetchBlogs() // Revert
        }
    }

    const handleDelete = async (id: string) => {
        // Optimistic update
        setBlogs(blogs.filter(b => b.id !== id))

        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id)

        if (error) {
            alert('Erro ao excluir')
            fetchBlogs()
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#941c1d]">Saberes</h1>
                    <p className="text-gray-500 mt-2">Gerencie as publicações do blog.</p>
                </div>
                <Link
                    href="/admin/saberes/novo"
                    className="flex items-center justify-center gap-2 bg-[#941c1d] text-white px-4 py-2 rounded-lg hover:bg-[#7a1617] transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Novo Artigo
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#941c1d]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <ContentCard
                            key={blog.id}
                            id={blog.id}
                            title={blog.title}
                            status={blog.status}
                            coverImage={blog.cover_image}
                            type="blogs"
                            onHide={handleHide}
                            onDelete={handleDelete}
                        />
                    ))}
                    {blogs.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">Nenhum artigo encontrado.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
