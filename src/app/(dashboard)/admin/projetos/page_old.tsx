'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { ContentCard } from '@/components/admin/ContentCard'

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchProjects = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching projects:', error)
        } else {
            setProjects(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published'

        // Optimistic update
        setProjects(prev => prev.map(item =>
            item.id === id ? { ...item, status: newStatus } : item
        ))

        const { error } = await supabase
            .from('projects')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            console.error('Error updating status:', error)
            // Revert optimistic update
            fetchProjects()
        }
    }

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting project:', error)
            alert('Error deleting project')
        } else {
            setProjects(prev => prev.filter(item => item.id !== id))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#941c1d]">Projects</h1>
                    <p className="text-gray-600 mt-1">Manage your projects</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#941c1d] text-white rounded-lg hover:bg-[#7a1617] transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                    <p className="text-gray-500">No projects found. Create your first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map((project) => (
                        <ContentCard
                            key={project.id}
                            id={project.id}
                            title={project.title}
                            status={project.status}
                            coverImage={project.cover_image}
                            type="projects"
                            onHide={handleToggleStatus}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
