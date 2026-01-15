'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Calendar } from 'lucide-react'

interface Project {
    id: string
    title: string
    slug: string
    description: string
    cover_image: string
    project_status: string
    progress: number
    content: any
    start_date?: string
}

interface ProjectCardProps {
    project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Status Badge Colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Apresentado': return 'bg-purple-100 text-purple-800'
            case 'Publicado': return 'bg-green-100 text-green-800'
            case 'Terminado': return 'bg-blue-100 text-blue-800'
            case 'Em Processo': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <>
            <motion.div
                layoutId={`card-${project.id}`}
                onClick={() => setIsOpen(true)}
                className="group relative h-[450px] md:h-[550px] w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-xl transition-all hover:shadow-2xl"
                whileHover={{ y: -5 }}
            >
                {/* Image Background */}
                <div className="absolute inset-0 h-full w-full">
                    {project.cover_image ? (
                        <Image
                            src={project.cover_image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-200" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(project.project_status)}`}>
                            {project.project_status}
                        </span>
                        {project.start_date && (
                            <span className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                                <Calendar className="h-3 w-3" />
                                {new Date(project.start_date).toLocaleDateString('pt-BR')}
                            </span>
                        )}
                    </div>

                    <h3 className="mb-1 text-2xl font-bold leading-tight">{project.title}</h3>

                    <div className="space-y-3">
                        <p className="line-clamp-2 text-sm text-gray-200">
                            {project.description}
                        </p>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-white/80">
                                <span>Progresso</span>
                                <span>{project.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${project.progress}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-full bg-[#E5D5BC]" // Secondary brand color
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Popup Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            layoutId={`card-${project.id}`}
                            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="absolute right-4 top-4 z-10 rounded-full bg-black/10 p-2 text-black transition-colors hover:bg-black/20"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Left: Image (or Title on Mobile) */}
                            <div className="relative h-64 w-full md:h-auto md:w-5/12">
                                {project.cover_image ? (
                                    <Image
                                        src={project.cover_image}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gray-200" />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                <div className="absolute bottom-4 left-4 text-white md:hidden">
                                    <h2 className="text-2xl font-bold">{project.title}</h2>
                                </div>
                            </div>

                            {/* Right: Details */}
                            <div className="flex w-full flex-col p-8 md:w-7/12 overflow-y-auto">
                                <div className="hidden md:block">
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        <div className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(project.project_status)}`}>
                                            {project.project_status}
                                        </div>
                                        {project.start_date && (
                                            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                <Calendar className="h-3 w-3" />
                                                Início: {formatDate(project.start_date)}
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="mb-6 text-3xl font-bold text-gray-900">{project.title}</h2>
                                </div>

                                <div className="prose prose-stone mb-8 flex-1 text-gray-600">
                                    <p>{project.description}</p>
                                    {/* We could render blocks here if necessary, but description is enough for quick view */}
                                </div>

                                <div className="mt-auto space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium text-gray-900">
                                            <span>Progresso do Projeto</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                style={{ width: `${project.progress}%` }}
                                                className="h-full bg-[#941c1d]"
                                            />
                                        </div>
                                    </div>

                                    <a
                                        href={`/projetos/${project.slug}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#941c1d] px-6 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Ver Projeto Completo
                                        <ArrowRight className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
