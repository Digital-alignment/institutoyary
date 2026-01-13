'use client'

import React from 'react'
import { Sprout, Users, Heart, Globe } from 'lucide-react'

import { motion } from 'framer-motion'

export function Manifesto() {
    const values = [
        {
            icon: <Sprout className="h-10 w-10 text-[#941c1d]" />,
            title: "Somos Natureza",
            description: "Resgate da percepção de sermos parte integrante da Teia da vida."
        },
        {
            icon: <Globe className="h-10 w-10 text-[#941c1d]" />,
            title: "Futuro Ancestral",
            description: "Conexão profunda com tradições e memórias para guiar o amanhã."
        },
        {
            icon: <Users className="h-10 w-10 text-[#941c1d]" />,
            title: "Diversidade e Com-unidade",
            description: "Valorização das diferenças e serviço amoroso à coletividade."
        },
        {
            icon: <Heart className="h-10 w-10 text-[#941c1d]" />,
            title: "Percepção Sistêmica",
            description: "Visão integrada de que tudo está interligado e é interdependente."
        }
    ]

    return (
        <section className="bg-[#f8f2d8] py-24 text-gray-900">
            <div className="container mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto max-w-4xl text-center mb-20"
                >
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[#941c1d] mb-4">Nossa Missão</h2>
                    <p className="text-3xl font-medium leading-relaxed md:text-5xl font-serif">
                        "Cooperar para a regeneração, co-criando as possibilidades de um futuro belo para as gerações que irão viver na Terra e com ela o legado que estamos semeando".
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4"
                >
                    {values.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-4 group">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e8debc] transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#d8ceac]">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p className="text-gray-700 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
