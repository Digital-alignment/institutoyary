'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { BlockEditor } from './blocks/BlockEditor'
import { ImageUploader } from './ImageUploader'

interface ContentEditorProps {
    type: 'blogs' | 'projects'
    initialData?: any
}

export function ContentEditor({ type, initialData }: ContentEditorProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    // Form State
    const [title, setTitle] = useState(initialData?.title || '')
    const [subtitle, setSubtitle] = useState(initialData?.subtitle || '')
    const [category, setCategory] = useState(initialData?.category || '')
    const [slug, setSlug] = useState(initialData?.slug || '')
    const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft')
    const [coverImage, setCoverImage] = useState(initialData?.cover_image || '')
    // Field for 'excerpt' (blogs) or 'description' (projects)
    const [summary, setSummary] = useState(initialData?.excerpt || initialData?.description || '')

    // Project specific fields
    const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.is_featured || false)
    const [projectStatus, setProjectStatus] = useState<string>(initialData?.project_status || 'Em Processo')
    const [progress, setProgress] = useState<number>(initialData?.progress || 0)

    // Initialize content as Block[]
    const [blocks, setBlocks] = useState<any[]>(
        initialData?.content ? (Array.isArray(initialData.content) ? initialData.content : []) : []
    )

    // Auto-generate slug from title if creating new
    useEffect(() => {
        if (!initialData && title) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
        }
    }, [title, initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData: any = {
                title,
                slug,
                status,
                cover_image: coverImage,
                content: blocks, // Save blocks directly as JSON
                updated_at: new Date().toISOString(),
                [type === 'blogs' ? 'excerpt' : 'description']: summary
            }

            if (type === 'blogs') {
                formData.subtitle = subtitle
                formData.category = category
            }

            if (type === 'projects') {
                formData.isFeatured = isFeatured
                formData.project_status = projectStatus
                formData.progress = progress
            }

            let result
            if (initialData?.id) {
                // Update
                result = await supabase
                    .from(type)
                    .update(formData)
                    .eq('id', initialData.id)
            } else {
                // Insert
                result = await supabase
                    .from(type)
                    .insert([formData])
            }

            if (result.error) throw result.error

            router.push(`/admin/${type === 'blogs' ? 'saberes' : 'projetos'}`)
            router.refresh()
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between sticky top-0 bg-[#f8f2d8] py-4 z-10 border-b border-[#6e1516]/10 mb-8 gap-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] -mx-4 px-4 md:mx-0 md:px-0 md:shadow-none">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/admin/${type === 'blogs' ? 'saberes' : 'projetos'}`}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-[#941c1d]" />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#941c1d]">
                        {initialData ? 'Editar' : 'Novo'} {type === 'blogs' ? 'Artigo' : 'Projeto'}
                    </h1>
                </div>
                <div className="flex items-center gap-3 justify-end">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                        className="bg-white/50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#941c1d]"
                    >
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-[#941c1d] text-white rounded-lg hover:bg-[#7a1617] transition-colors font-medium disabled:opacity-50 shadow-sm"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Salvar
                    </button>
                </div>
            </div>

            {/* Main Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-8 space-y-8">
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-3xl md:text-5xl font-bold bg-transparent border-none placeholder-gray-300 focus:ring-0 px-0 text-gray-900 leading-tight"
                                placeholder="Título do Conteúdo"
                                required
                            />
                            {type === 'blogs' && (
                                <input
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    className="w-full text-xl md:text-2xl font-medium bg-transparent border-none placeholder-gray-300 focus:ring-0 px-0 text-gray-600 leading-tight"
                                    placeholder="Subtítulo do Artigo"
                                />
                            )}
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                rows={2}
                                className="w-full text-lg text-gray-600 bg-transparent border-none focus:ring-0 px-0 resize-none font-medium placeholder-gray-300"
                                placeholder={type === 'blogs' ? "Escreva um breve resumo / teaser..." : "Descrição do projeto..."}
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-8 min-h-[500px]">
                            <BlockEditor blocks={blocks} onChange={setBlocks} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b pb-2">Configurações</h3>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Link Personalizado (Slug)</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d] text-sm"
                                required
                            />
                        </div>

                        {type === 'blogs' && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d] text-sm"
                                >
                                    <option value="">Selecione uma categoria...</option>
                                    <option value="Sabedoria Indígena">Sabedoria Indígena</option>
                                    <option value="Regeneração Ambiental">Regeneração Ambiental</option>
                                    <option value="Histórias da Comunidade">Histórias da Comunidade</option>
                                    <option value="Preservação Cultural">Preservação Cultural</option>
                                </select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Imagem de Capa</label>
                            {/* Use the new reusable uploader */}
                            <ImageUploader
                                value={coverImage}
                                onChange={setCoverImage}
                                height="h-48"
                            />
                        </div>

                        {type === 'projects' && (
                            <>
                                <hr className="border-gray-100 my-4" />
                                <h4 className="font-semibold text-gray-900 text-sm">Configuração do Projeto</h4>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isFeatured}
                                            onChange={(e) => setIsFeatured(e.target.checked)}
                                            className="rounded border-gray-300 text-[#941c1d] focus:ring-[#941c1d]"
                                        />
                                        Destaque na Home
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Status do Projeto</label>
                                    <select
                                        value={projectStatus}
                                        onChange={(e) => setProjectStatus(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d] text-sm"
                                    >
                                        <option value="Em Processo">Em Processo</option>
                                        <option value="Publicado">Publicado</option>
                                        <option value="Terminado">Terminado</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Progresso ({progress}%)</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={progress}
                                        onChange={(e) => setProgress(Number(e.target.value))}
                                        className="w-full accent-[#941c1d]"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}
