'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoPlay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ButtonConfig {
    text: string
    url: string
}

interface HeroProps {
    title?: string;
    subtitle?: string;
    text?: string;
    slides?: { image: string, alt?: string }[];
    button1?: ButtonConfig;
    button2?: ButtonConfig;
}

const DEFAULT_IMAGES = [
    { image: '/herohome-1.jpg', alt: 'Floresta Amazônica' },
    { image: '/herohome-2.jpg', alt: 'Cultura Indígena' },
    { image: '/herohome-3.jpg', alt: 'Comunidade em Círculo' },
]

export function Hero({ title, subtitle, text, slides, button1, button2 }: HeroProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true, duration: 60 }, [
        AutoPlay({ delay: 6000, stopOnInteraction: false }),
        Fade(),
    ])

    const heroSlides = (slides && slides.length > 0) ? slides : DEFAULT_IMAGES;

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Slider */}
            <div className="absolute inset-0 h-full w-full" ref={emblaRef}>
                <div className="flex h-full w-full">
                    {heroSlides.map((img, index) => (
                        <div key={index} className="relative h-full min-w-0 flex-[0_0_100%]">
                            <Image
                                src={img.image}
                                alt={img.alt || 'Hero Image'}
                                fill
                                priority={index === 0}
                                className="object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Content - Centered */}
            <div className="relative z-10 flex h-full items-center justify-center p-4">
                <div className="container mx-auto px-4 md:px-8 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="space-y-8"
                    >
                        {/* Title */}
                        <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-[0.9] tracking-tight md:text-7xl lg:text-8xl drop-shadow-lg">
                            {title || "Atuar no mundo hoje cooperando para regeneração"}
                        </h1>

                        {/* Subtitle */}
                        {subtitle && (
                            <p className="mx-auto max-w-2xl text-xl font-bold md:text-3xl text-white/90 drop-shadow-md">
                                {subtitle}
                            </p>
                        )}

                        {/* Text */}
                        {text && (
                            <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/80 drop-shadow-md font-light">
                                {text}
                            </p>
                        )}

                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-8">
                            {button1 && button1.text && (
                                <Link href={button1.url || '#'}>
                                    <Button size="lg" className="h-14 rounded-full bg-[#941c1d] px-8 text-lg font-bold hover:bg-[#7a1617] hover:scale-105 transition-all shadow-lg shadow-[#941c1d]/30">
                                        {button1.text}
                                    </Button>
                                </Link>
                            )}

                            {button2 && button2.text && (
                                <Link href={button2.url || '#'}>
                                    <Button size="lg" variant="outline" className="h-14 rounded-full border-2 border-white bg-transparent px-8 text-lg font-bold text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all">
                                        {button2.text}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80"
            >
                <div className="h-12 w-8 rounded-full border-2 border-white/50 p-1 flex justify-center">
                    <div className="h-3 w-1.5 rounded-full bg-white animate-scroll" />
                </div>
            </motion.div>
        </section>
    )
}
