'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ContentCard } from '@/components/admin/ContentCard'
import { Plus, Loader2 } from 'lucide-react'

export default function AdminProjetosPage() {
    const supabase = createClient()
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setProjects(data)
        setLoading(false)
    }

    const handleHide = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published'

        // Optimistic update
        setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p))

        const { error } = await supabase
            .from('projects')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            alert('Erro ao atualizar status')
            fetchProjects() // Revert
        }
    }

    const handleDelete = async (id: string) => {
        // Optimistic update
        setProjects(projects.filter(p => p.id !== id))

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)

        if (error) {
            alert('Erro ao excluir')
            fetchProjects()
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#941c1d]">Projetos</h1>
                    <p className="text-gray-500 mt-2">Gerencie os projetos do instituto.</p>
                </div>
                <Link
                    href="/admin/projetos/novo"
                    className="flex items-center justify-center gap-2 bg-[#941c1d] text-white px-4 py-2 rounded-lg hover:bg-[#7a1617] transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Novo Projeto
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#941c1d]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ContentCard
                            key={project.id}
                            id={project.id}
                            title={project.title}
                            status={project.status}
                            coverImage={project.cover_image}
                            type="projects"
                            onHide={handleHide}
                            onDelete={handleDelete}
                        />
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">Nenhum projeto encontrado.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
