import { createClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProjectCard } from '@/components/home/ProjectCard'
import { Mail, ArrowRight } from 'lucide-react'

export const revalidate = 60

export default async function ProjetosPage() {
    const supabase = await createClient()

    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .in('status', ['published', 'archived', 'draft']) // Fetching broader range if needed, or stick to 'published'
        // Ideally we just want published ones visible to public, user requirement implies standard list
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute inset-0 bg-[#941c1d]/5 pointer-events-none" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#941c1d] mb-6 max-w-4xl mx-auto leading-tight">
                        Nossos Projetos: <br className="hidden md:block" />
                        <span className="text-[#941c1d]/80">Semeando Transformação</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Descubra as iniciativas que movem o Instituto Yary em direção a um futuro mais sustentável e equitativo.
                        Através de projetos inovadores e colaborativos, buscamos fortalecer comunidades, restaurar ecossistemas
                        e promover o Bem Viver em cada território onde atuamos.
                    </p>
                </div>
            </section>

            {/* Projects List Section */}
            <main className="flex-1 container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects?.map((project) => (
                        <div key={project.id} className="h-full">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                    {(!projects || projects.length === 0) && (
                        <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <p className="text-xl">Nenhum projeto publicado no momento.</p>
                            <p className="text-sm mt-2">Volte em breve para ver nossas novidades.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Engagement & Collaboration CTA */}
            <section className="bg-white py-20 md:py-28 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-[#941c1d] rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        {/* Background pattern/decoration */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Quer Conhecer Nossos Projetos em Detalhe e Colaborar?
                            </h2>
                            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                                Entre em contato conosco para saber mais sobre nossos projetos em andamento e futuras iniciativas.
                                Ficaremos muito felizes em compartilhar nossas experiências e explorar formas de trabalharmos juntos na construção de um mundo melhor.
                            </p>

                            <a
                                href="mailto:contato@institutoyary.org" // Replace with actual contact link/page if known
                                className="inline-flex items-center gap-2 bg-white text-[#941c1d] px-8 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                            >
                                <Mail className="w-5 h-5" />
                                Entrar em Contato
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
