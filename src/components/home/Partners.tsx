'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export function Partners() {
    const { settings } = useSiteSettings()
    const { home_layout } = settings

    if (!home_layout.show_partners || home_layout.partners.length === 0) return null

    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4 md:px-8 text-center">
                {home_layout.partners_title && (
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold text-gray-900 mb-12 uppercase tracking-wide"
                    >
                        {home_layout.partners_title}
                    </motion.h3>
                )}

                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {home_layout.partners.map((partner, index) => (
                        <motion.div
                            key={partner.id || index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative h-20 w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                        >
                            {partner.url ? (
                                <Link href={partner.url} target="_blank" rel="noopener noreferrer">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="h-full w-full object-contain"
                                    />
                                </Link>
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="h-full w-full object-contain"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
