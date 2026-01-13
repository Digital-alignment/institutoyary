'use client'

import React from 'react'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sprout, Users, Heart, Globe, MapPin, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    }

    const values = [
        {
            icon: <Sprout className="h-10 w-10 text-[#941c1d]" />,
            title: "Somos Natureza",
            description: "Resgate da percepção de sermos parte integrante da Teia da vida e estarmos à serviço de sua diversidade."
        },
        {
            icon: <Globe className="h-10 w-10 text-[#941c1d]" />,
            title: "Futuro Ancestral",
            description: "Valorização dos saberes que sustentam as raízes, redesenhando o presente para o futuro que sonhamos."
        },
        {
            icon: <Users className="h-10 w-10 text-[#941c1d]" />,
            title: "Diversidade",
            description: "Reconhecer a riqueza nas diferenças para potencializar soluções e a resiliência dos sistemas vivos."
        },
        {
            icon: <Heart className="h-10 w-10 text-[#941c1d]" />,
            title: "Com-Unidade",
            description: "Foco na co-criação e no coletivo como parte da natureza."
        },
        {
            icon: <Sprout className="h-10 w-10 text-[#941c1d]" />,
            title: "Bem-Viver",
            description: "Prática de valorização das tradições e memórias para um aprendizado contínuo."
        },
        {
            icon: <Globe className="h-10 w-10 text-[#941c1d]" />,
            title: "Percepção Sistêmica",
            description: "Visão integrada da vida como uma grande rede onde tudo está interligado."
        }
    ]

    const territories = [
        {
            region: "Alto Xingu (MT)",
            description: "Foco na preservação cultural e saberes medicinais, com destaque para o projeto Atatapa."
        },
        {
            region: "Mata Atlântica",
            description: "Ações de regeneração e fortalecimento comunitário no Sul, Sudeste e Sul da Bahia."
        },
        {
            region: "Itacaré (BA)",
            description: "Sede administrativa e centro de atividades através da Oca Yary."
        }
    ]

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            <Header />

            <main className="flex-1">

                {/* Seção 1: Hero Institucional */}
                <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0">
                        {/* Using one of the new images as background */}
                        <Image
                            src="/herosobre1.jpg"
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
                                Instituto Yary: Manifestando o Futuro Ancestral e o Bem Viver
                            </h1>
                            <p className="mx-auto max-w-3xl text-xl md:text-2xl font-light text-white/90 drop-shadow-md">
                                Uma jornada cooperando para a regeneração e o fortalecimento de populações tradicionais
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Seção 2: Identidade e História (O Manifesto) */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div {...fadeInUp} className="space-y-8">
                                <span className="inline-block rounded-full bg-[#faefe0] px-4 py-1.5 text-sm font-bold tracking-wider text-[#941c1d] uppercase">
                                    Nossa História
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    Nascemos da terra e da sabedoria ancestral
                                </h2>
                                <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-justify">
                                    <p>
                                        O Instituto Yary é uma associação sem fins lucrativos, qualificada como OSCIP desde 2024. Ele nasceu da experiência acumulada de mais de 15 anos de seus fundadores atuando com povos indígenas e causas socioambientais.
                                    </p>
                                    <p>
                                        Nossa origem remonta à <strong className="text-[#941c1d]">Oca Yary em Itacaré-BA</strong>, onde nossas atividades acontecem há 7 anos e de onde surgiu o impulso vital para expandir nossa atuação.
                                    </p>
                                    <div className="p-6 bg-[#f9f9f9] rounded-2xl border-l-4 border-[#941c1d]">
                                        <h4 className="font-bold text-gray-900 mb-2">Diferencial Crítico</h4>
                                        <p className="text-gray-700">
                                            Nossa diretoria conta com dois membros indígenas Guarani, garantindo que todas as nossas ações sejam guiadas por demandas reais e pela sabedoria das comunidades.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                {...fadeInUp}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <Image
                                    src="/herohome-3.jpg"
                                    alt="Comunidade Yary"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Seção 3: Nossa Missão e Propósito */}
                <section className="py-24 bg-[#941c1d] text-white text-center">
                    <div className="container mx-auto px-4 md:px-8">
                        <motion.div {...fadeInUp} className="max-w-4xl mx-auto space-y-8">
                            <Sprout className="h-16 w-16 mx-auto text-[#e8debc]" />
                            <h2 className="text-3xl md:text-5xl font-serif leading-tight">
                                "Atuar no mundo hoje buscando cooperar para a regeneração, co-criando as possibilidades de um futuro belo para as gerações que irão viver na Terra e com ela o legado que estamos semeando"
                            </h2>
                            <div className="w-24 h-1 bg-[#e8debc] mx-auto rounded-full" />
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">
                                Através do paradigma do <strong>Bem Viver</strong>, construímos caminhos de desenvolvimento sustentável e valorização da memória viva dos povos originários.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Seção 4: Valores Fundamentais */}
                <section className="py-24 bg-[#f8f2d8]">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Valores Fundamentais</h2>
                            <p className="mt-4 text-lg text-gray-600">Os pilares que sustentam nossa caminhada</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {values.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4"
                                >
                                    <div className="p-4 rounded-full bg-[#faefe0]">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Seção 5: Territórios de Atuação */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="lg:w-1/2">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Territórios de Atuação</h2>
                                <div className="space-y-8">
                                    {territories.map((t, i) => (
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
                            <div className="lg:w-1/2 h-[400px] bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                {/* Placeholder para Mapa Estilizado */}
                                <span className="text-gray-400 font-medium">[Mapa Estilizado dos Territórios]</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seção 6: Transparência e Governança */}
                <section className="py-24 bg-gray-50 border-t border-gray-100">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Transparência e Governança</h2>
                            <p className="mt-4 text-lg text-gray-600">Compromisso com a verdade e a responsabilidade</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Documentos */}
                            <motion.div {...fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FileText className="h-6 w-6 text-[#941c1d]" />
                                    Documentação Oficial
                                </h3>
                                <ul className="space-y-4">
                                    <li>
                                        <Button variant="outline" className="w-full justify-start text-gray-600 hover:text-[#941c1d] hover:border-[#941c1d]">
                                            Download Estatuto Social
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="outline" className="w-full justify-start text-gray-600 hover:text-[#941c1d] hover:border-[#941c1d]">
                                            Relatório Anual 2024
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="outline" className="w-full justify-start text-gray-600 hover:text-[#941c1d] hover:border-[#941c1d]">
                                            Certificado OSCIP
                                        </Button>
                                    </li>
                                </ul>
                            </motion.div>

                            {/* Equipe / Liderança */}
                            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Users className="h-6 w-6 text-[#941c1d]" />
                                    Nossa Equipe
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Conheça a diretoria e o conselho que guiam nossas ações, incluindo lideranças Guarani fundamentais para nossa governança.
                                </p>
                                <div className="flex gap-[-10px]">
                                    {/* Avatars placeholder */}
                                    {[1, 2, 3, 4].map(n => (
                                        <div key={n} className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white -ml-3 first:ml-0 flex items-center justify-center text-xs font-bold text-gray-500">
                                            Foto
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full bg-[#f8f2d8] border-2 border-white -ml-3 flex items-center justify-center text-xs text-[#941c1d] font-bold">
                                        +10
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <p className="text-sm text-gray-500 italic">
                                        Monitoramos políticas indigenistas para assegurar direitos originários.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Seção 7: CTA */}
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
                                Quer co-criar esse futuro conosco?
                            </h2>
                            <p className="text-xl text-white/80">
                                Faça parte dessa rede de regeneração e transformação.
                            </p>
                            <Link href="/projetos">
                                <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-full bg-[#e8debc] text-[#941c1d] hover:bg-white hover:scale-105 transition-all shadow-xl">
                                    Apoie Nossos Projetos
                                    <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}
