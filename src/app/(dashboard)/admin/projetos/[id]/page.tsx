'use client'

import { useEffect, useState } from 'react'
import { ContentEditor } from '@/components/admin/ContentEditor'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function EditProjectPage() {
    const params = useParams()
    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchProject = async () => {
            if (!params.id) return

            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) {
                console.error('Error fetching project:', error)
            } else {
                setProject(data)
            }
            setLoading(false)
        }

        fetchProject()
    }, [params.id])

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando...</div>
    if (!project) return <div className="p-8 text-center text-gray-500">Projeto não encontrado</div>

    return <ContentEditor type="projects" initialData={project} />
}
