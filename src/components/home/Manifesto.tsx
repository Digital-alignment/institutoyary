'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export function Manifesto() {
    const { settings } = useSiteSettings()
    const { home_layout } = settings

    return (
        <section className="relative overflow-hidden bg-[#faefe0] py-20 md:py-32">
            {/* Background Graphic Element - Simplified Yary pattern */}
            <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#e8dccb] opacity-50 blur-3xl mix-blend-multiply" />
            <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#fcead9] opacity-50 blur-3xl mix-blend-multiply" />

            <div className="container relative z-10 mx-auto px-4 md:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="mb-8 text-4xl font-bold font-serif text-[#941c1d] md:text-6xl">
                            {home_layout.manifesto_title || "Manifesto Yary"}
                        </h2>

                        <div className="prose prose-lg mx-auto text-gray-700 md:prose-xl">
                            <p className="whitespace-pre-line leading-relaxed">
                                {home_layout.manifesto_text || "Acreditamos na força da união e na sabedoria ancestral para construir um futuro onde a natureza e a humanidade prosperem juntas.\n\nSomos guardiões de sonhos e semeadores de esperança."}
                            </p>
                        </div>

                        <div className="mt-12">
                            <span className="inline-block h-1 w-24 bg-[#941c1d] rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
