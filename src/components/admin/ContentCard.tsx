'use client'

import React from 'react'
import Image from 'next/image'
import { Edit2, EyeOff, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface ContentCardProps {
    id: string
    title: string
    status: 'draft' | 'published'
    coverImage?: string | null
    type: 'blogs' | 'projects'
    onHide: (id: string, currentStatus: string) => void
    onDelete: (id: string) => void
}

export function ContentCard({ id, title, status, coverImage, type, onHide, onDelete }: ContentCardProps) {
    const isPublished = status === 'published'

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative h-40 w-full bg-gray-100">
                {coverImage ? (
                    <Image
                        src={coverImage}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Sem Imagem
                    </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-white/90 shadow-sm">
                    <span className={isPublished ? 'text-green-600' : 'text-amber-600'}>
                        {isPublished ? 'Publicado' : 'Rascunho'}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 truncate mb-4" title={title}>
                    {title}
                </h3>

                <div className="flex gap-2">
                    <Link
                        href={`/admin/${type === 'blogs' ? 'saberes' : 'projetos'}/${id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[#941c1d] bg-[#fdfaf1] border border-[#6e1516]/20 rounded hover:bg-[#faeed6] transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                        Editar
                    </Link>
                    <button
                        onClick={() => onHide(id, status)}
                        className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded border border-transparent transition-colors"
                        title={isPublished ? "Ocultar (Despublicar)" : "Publicar"}
                    >
                        {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.')) {
                                onDelete(id)
                            }
                        }}
                        className="flex items-center justify-center p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded border border-transparent transition-colors"
                        title="Excluir"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
