'use client'

import { useEffect, useState } from 'react'
import { ContentEditor } from '@/components/admin/ContentEditor'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function EditBlogPage() {
    const params = useParams()
    const [blog, setBlog] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchBlog = async () => {
            if (!params.id) return

            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) {
                console.error('Error fetching blog:', error)
            } else {
                setBlog(data)
            }
            setLoading(false)
        }

        fetchBlog()
    }, [params.id])

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando...</div>
    if (!blog) return <div className="p-8 text-center text-gray-500">Conteúdo não encontrado</div>

    return <ContentEditor type="blogs" initialData={blog} />
}
