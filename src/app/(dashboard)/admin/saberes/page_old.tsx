'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { ContentCard } from '@/components/admin/ContentCard'

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchBlogs = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching blogs:', error)
        } else {
            setBlogs(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published'

        // Optimistic update
        setBlogs(prev => prev.map(item =>
            item.id === id ? { ...item, status: newStatus } : item
        ))

        const { error } = await supabase
            .from('blogs')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            console.error('Error updating status:', error)
            // Revert optimistic update
            fetchBlogs()
        }
    }

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting blog:', error)
            alert('Error deleting blog')
        } else {
            setBlogs(prev => prev.filter(item => item.id !== id))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#941c1d]">Blogs</h1>
                    <p className="text-gray-600 mt-1">Manage your blog posts</p>
                </div>
                <Link
                    href="/admin/blogs/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#941c1d] text-white rounded-lg hover:bg-[#7a1617] transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading blogs...</div>
            ) : blogs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                    <p className="text-gray-500">No blog posts found. Create your first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {blogs.map((blog) => (
                        <ContentCard
                            key={blog.id}
                            id={blog.id}
                            title={blog.title}
                            status={blog.status}
                            coverImage={blog.cover_image}
                            type="blogs"
                            onHide={handleToggleStatus}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
