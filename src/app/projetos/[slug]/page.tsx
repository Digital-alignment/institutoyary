// ... imports
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, Globe, Instagram, Facebook, Music, Video, Link as LinkIcon } from 'lucide-react'
import { ShareProject } from '@/components/projects/ShareProject'

export const revalidate = 60

interface Props {
    params: Promise<{ slug: string }>
}

export default async function ProjetoPage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    if (error || !project) {
        notFound()
    }

    const getLinkIcon = (type: string) => {
        switch (type) {
            case 'instagram': return <Instagram className="w-5 h-5" />
            case 'facebook': return <Facebook className="w-5 h-5" />
            case 'spotify': return <Music className="w-5 h-5" />
            case 'tiktok': return <Video className="w-5 h-5" />
            default: return <Globe className="w-5 h-5" />
        }
    }

    const getLinkLabel = (type: string) => {
        switch (type) {
            case 'instagram': return 'Instagram'
            case 'facebook': return 'Facebook'
            case 'spotify': return 'Spotify'
            case 'tiktok': return 'TikTok'
            default: return 'Website'
        }
    }

    // Determine current domain for share URL (fallback to localhost if undefined, but ideally env var)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://institutoyary.org'
    const shareUrl = `${baseUrl}/projetos/${slug}`

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            <Header />

            <main className="flex-1">
                {/* Hero Rendering */}
                <div className="relative h-[90vh] min-h-[700px] w-full bg-gray-900 flex flex-col">
                    {project.cover_image && (
                        <div className="absolute inset-0 opacity-60">
                            <Image
                                src={project.cover_image}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Top Actions Bar */}
                    <div className="relative z-20 container mx-auto px-4 pt-32 pb-8 md:pt-40 flex items-center justify-between">
                        <Link
                            href="/projetos"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 group text-sm"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Todos os Projetos</span>
                        </Link>

                        <ShareProject
                            title={project.title}
                            description={project.description || ''}
                            url={shareUrl}
                            coverImage={project.cover_image || ''}
                        />
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 container mx-auto px-4 flex-1 flex flex-col items-center justify-center text-center max-w-5xl -mt-20">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6 md:mb-8 drop-shadow-lg">
                            {project.title}
                        </h1>
                        {project.description && (
                            <p className="text-lg md:text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto font-light leading-relaxed drop-shadow">
                                {project.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Project Links Section - Moved below hero */}
                {project.links && Array.isArray(project.links) && project.links.length > 0 && (
                    <section className="bg-[#f8f2d8] py-12 border-b border-[#6e1516]/10">
                        <div className="container mx-auto px-4 text-center">
                            <h3 className="text-[#941c1d] text-sm font-bold uppercase tracking-widest mb-6">
                                Links do Projeto
                            </h3>
                            <div className="flex flex-wrap justify-center gap-4">
                                {project.links.map((link: any, index: number) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-2 px-6 py-3 bg-white border border-[#941c1d]/20 rounded-full text-[#941c1d] hover:bg-[#941c1d] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md"
                                    >
                                        {getLinkIcon(link.type)}
                                        <span className="font-medium">{getLinkLabel(link.type)}</span>
                                        <LinkIcon className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-50 group-hover:ml-0 transition-all" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Content */}
                <article className="container mx-auto px-4 max-w-4xl py-20">
                    <BlockRenderer blocks={project.content} className="prose-lg" />
                </article>

                {/* Join Call to Action */}
                <section className="bg-gray-50 py-20 border-t">
                    <div className="container mx-auto px-4 text-center max-w-2xl space-y-6">
                        <h2 className="text-3xl font-bold text-[#941c1d]">Gostou deste projeto?</h2>
                        <p className="text-gray-600 text-lg">
                            Entre em contato conosco para saber como você pode apoiar ou participar desta iniciativa.
                        </p>
                        <Link
                            href="/contato"
                            className="inline-block bg-[#941c1d] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7a1617] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Entrar em Contato
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
