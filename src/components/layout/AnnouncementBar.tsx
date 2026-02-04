'use client'

import React, { useState } from 'react'
import { X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export function AnnouncementBar() {
    const { settings } = useSiteSettings()
    const { announcement_bar } = settings.home_layout
    const [isVisible, setIsVisible] = useState(true)

    if (!announcement_bar.enabled || !isVisible || !announcement_bar.text) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="relative z-50 text-white"
                    style={{ backgroundColor: announcement_bar.background_color || '#941c1d' }}
                >
                    <div className="container mx-auto px-4 py-3 pr-12 text-center text-sm font-medium md:text-base">
                        <span style={{ color: announcement_bar.text_color || '#ffffff' }}>
                            {announcement_bar.text}
                        </span>
                        {announcement_bar.link && (
                            <Link
                                href={announcement_bar.link}
                                className="ml-2 inline-flex items-center underline hover:no-underline"
                                style={{ color: announcement_bar.text_color || '#ffffff' }}
                            >
                                Saiba mais <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        )}
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 opacity-80 hover:opacity-100"
                        aria-label="Fechar anúncio"
                    >
                        <X className="h-4 w-4" style={{ color: announcement_bar.text_color || '#ffffff' }} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
