'use client'

import React from 'react'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sprout, Users, Heart, Globe, MapPin, FileText, ArrowRight, Loader2, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSiteSettings } from '@/hooks/useSiteSettings'

// Icon mapping for dynamic values
const IconMap: Record<string, React.ReactNode> = {
    'Sprout': <Sprout className="h-10 w-10 text-[#941c1d]" />,
    'Globe': <Globe className="h-10 w-10 text-[#941c1d]" />,
    'Users': <Users className="h-10 w-10 text-[#941c1d]" />,
    'Heart': <Heart className="h-10 w-10 text-[#941c1d]" />,
    'Star': <Star className="h-10 w-10 text-[#941c1d]" />,
    'Check': <CheckCircle className="h-10 w-10 text-[#941c1d]" />,
}

export default function AboutPage() {
    const { settings, loading } = useSiteSettings()
    const { about_layout } = settings

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-[#941c1d]" />
            </div>
        )
    }

    // Fallbacks to prevent crashes if data is missing during transition
    const heroImage = about_layout?.hero_image || '/herosobre1.jpg'
    const valuesList = about_layout?.values_list || []
    const territoriesList = about_layout?.territories_list || []
    const transparencyDocs = about_layout?.transparency_documents || []

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            <Header />

            <main className="flex-1">

                {/* Seção 1: Hero Institucional */}
                {about_layout?.show_hero && (
                    <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0">
                            <Image
                                src={heroImage}
                                alt="Background Hero"
                                fill
                                className="object-cover brightness-50"
                                priority
                            />
                        </div>
                        <div className="relative z-10 container mx-auto px-4 md:px-8 text-center text-white">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                className="space-y-6"
                            >
                                <h1 className="mx-auto max-w-5xl text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg">
                                    {about_layout.hero_title}
                                </h1>
                                <p className="mx-auto max-w-3xl text-xl md:text-2xl font-light text-white/90 drop-shadow-md">
                                    {about_layout.hero_subtitle}
                                </p>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Seção 2: Identidade e História */}
                {about_layout?.show_history && (
                    <section className="py-24 bg-white">
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <motion.div {...fadeInUp} className="space-y-8">
                                    {about_layout?.history_tag && (
                                        <span className="inline-block rounded-full bg-[#faefe0] px-4 py-1.5 text-sm font-bold tracking-wider text-[#941c1d] uppercase">
                                            {about_layout.history_tag}
                                        </span>
                                    )}
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                        {about_layout?.history_title}
                                    </h2>
                                    <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-justify whitespace-pre-wrap">
                                        {about_layout?.history_text}

                                        {about_layout?.history_highlight_title && (
                                            <div className="p-6 bg-[#f9f9f9] rounded-2xl border-l-4 border-[#941c1d] mt-6">
                                                <h4 className="font-bold text-gray-900 mb-2">{about_layout.history_highlight_title}</h4>
                                                <p className="text-gray-700">
                                                    {about_layout.history_highlight_text}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                                {about_layout?.history_image && (
                                    <motion.div
                                        {...fadeInUp}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
                                    >
                                        <Image
                                            src={about_layout.history_image}
                                            alt="História"
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Seção 3: Nossa Missão */}
                {about_layout?.show_mission && (
                    <section className="py-24 bg-[#941c1d] text-white text-center">
                        <div className="container mx-auto px-4 md:px-8">
                            <motion.div {...fadeInUp} className="max-w-4xl mx-auto space-y-8">
                                <Sprout className="h-16 w-16 mx-auto text-[#e8debc]" />
                                <h2 className="text-3xl md:text-5xl font-serif leading-tight">
                                    &quot;{about_layout?.mission_quote}&quot;
                                </h2>
                                <div className="w-24 h-1 bg-[#e8debc] mx-auto rounded-full" />
                                <p className="text-xl text-white/90 max-w-2xl mx-auto whitespace-pre-wrap">
                                    {about_layout?.mission_text}
                                </p>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Seção 4: Valores Fundamentais */}
                {about_layout?.show_values && (
                    <section className="py-24 bg-[#f8f2d8]">
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{about_layout?.values_title}</h2>
                                <p className="mt-4 text-lg text-gray-600">{about_layout?.values_subtitle}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {valuesList.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4"
                                    >
                                        <div className="p-4 rounded-full bg-[#faefe0]">
                                            {IconMap[item.icon] || <Star className="h-10 w-10 text-[#941c1d]" />}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Seção 5: Territórios de Atuação */}
                {about_layout?.show_territories && (
                    <section className="py-24 bg-white">
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="flex flex-col lg:flex-row gap-16 items-center">
                                <div className="lg:w-1/2">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{about_layout?.territories_title}</h2>
                                    <div className="space-y-8">
                                        {territoriesList.map((t, i) => (
                                            <motion.div
                                                key={i}
                                                {...fadeInUp}
                                                transition={{ duration: 0.5, delay: i * 0.2 }}
                                                className="flex gap-4"
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    <MapPin className="h-6 w-6 text-[#941c1d]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{t.region}</h3>
                                                    <p className="text-gray-600 mt-1">{t.description}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:w-1/2 h-[400px] bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
                                    {about_layout?.territories_map_image ? (
                                        <Image
                                            src={about_layout.territories_map_image}
                                            alt="Mapa"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400 font-medium">[Mapa Estilizado dos Territórios]</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Seção 6: Transparência e Governança */}
                {about_layout?.show_transparency && (
                    <section className="py-24 bg-gray-50 border-t border-gray-100">
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{about_layout?.transparency_title}</h2>
                                <p className="mt-4 text-lg text-gray-600">{about_layout?.transparency_subtitle}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {/* Documentos */}
                                <motion.div {...fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <FileText className="h-6 w-6 text-[#941c1d]" />
                                        Documentação Oficial
                                    </h3>
                                    {transparencyDocs.length > 0 ? (
                                        <ul className="space-y-4">
                                            {transparencyDocs.map((doc, idx) => (
                                                <li key={idx}>
                                                    <Link href={doc.url} target="_blank" passHref>
                                                        <Button variant="outline" className="w-full justify-start text-gray-600 hover:text-[#941c1d] hover:border-[#941c1d]">
                                                            {doc.name}
                                                        </Button>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted-foreground text-sm italic">Nenhum documento disponível no momento.</p>
                                    )}
                                </motion.div>

                                {/* Equipe / Liderança */}
                                <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Users className="h-6 w-6 text-[#941c1d]" />
                                        Nossa Equipe
                                    </h3>
                                    <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                                        {about_layout?.team_text}
                                    </p>
                                    <div className="flex gap-[-10px]">
                                        {/* Avatars placeholder - kept static for now as requested */}
                                        {[1, 2, 3, 4].map(n => (
                                            <div key={n} className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white -ml-3 first:ml-0 flex items-center justify-center text-xs font-bold text-gray-500">
                                                Foto
                                            </div>
                                        ))}
                                        <div className="w-12 h-12 rounded-full bg-[#f8f2d8] border-2 border-white -ml-3 flex items-center justify-center text-xs text-[#941c1d] font-bold">
                                            +10
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Seção 7: CTA */}
                {about_layout?.show_cta && (
                    <section className="py-32 bg-[#941c1d] relative overflow-hidden text-center">
                        <div className="absolute inset-0 opacity-10 pattern-dots"></div>
                        <div className="relative z-10 container mx-auto px-4 md:px-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="max-w-3xl mx-auto space-y-8"
                            >
                                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                    {about_layout?.cta_title}
                                </h2>
                                <p className="text-xl text-white/80">
                                    {about_layout?.cta_subtitle}
                                </p>
                                <Link href={about_layout?.cta_button_url || '/projetos'}>
                                    <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-full bg-[#e8debc] text-[#941c1d] hover:bg-white hover:scale-105 transition-all shadow-xl">
                                        {about_layout?.cta_button_text}
                                        <ArrowRight className="ml-2 h-6 w-6" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </section>
                )}

                <Footer />
            </main>
        </div>
    )
}
