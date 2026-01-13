'use client'

import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoPlay from 'embla-carousel-autoplay'
import { ProjectCard } from './ProjectCard'
import { createClient } from '@/lib/supabase' // Use client-side helper

import { motion } from 'framer-motion'

export function ProjectsCarousel() {
    const [projects, setProjects] = useState<any[]>([])
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
        AutoPlay({ delay: 4000, stopOnInteraction: false })
    ])

    useEffect(() => {
        const fetchProjects = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('projects')
                .select('*')
                .eq('is_featured', true)
                .eq('status', 'published') // Only published
                .limit(7)

            if (data) setProjects(data)
        }
        fetchProjects()
    }, [])

    if (projects.length === 0) return null

    return (
        <div className="w-full py-20">
            <div className="mb-12 flex items-center justify-between px-4 md:px-8 container mx-auto">
                <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold text-[#941c1d]"
                >
                    Projetos em Destaque
                </motion.h2>
                <div className="hidden sm:flex gap-2">
                    {/* Optional: Add custom nav buttons here */}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="overflow-hidden p-4 -m-4"
                ref={emblaRef}
            >
                <div className="flex -ml-4">
                    {projects.map((project) => (
                        <div key={project.id} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] pl-4">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
