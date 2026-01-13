import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft } from 'lucide-react'

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

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            <Header />

            <main className="flex-1">
                {/* Hero Rendering */}
                <div className="relative h-[60vh] min-h-[500px] w-full bg-gray-900 flex items-center justify-center">
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

                    <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl space-y-6">
                        <Link
                            href="/projetos"
                            className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4 hover:-translate-x-1 duration-300"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Todos os Projetos
                        </Link>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                            {project.title}
                        </h1>
                        {project.description && (
                            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
                                {project.description}
                            </p>
                        )}
                    </div>
                </div>

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
