'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Blog {
    id: string
    title: string
    slug: string
    cover_image?: string
    created_at: string
    // Add other fields if needed
}

interface FeaturedBlogsProps {
    blogIds?: string[]
}

export function FeaturedBlogs({ blogIds }: FeaturedBlogsProps) {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlogs = async () => {
            // If no IDs provided, fetch generic recent ones or return empty?
            // Requirement: "display the blogs that admin what to show at home"
            // If empty, we show nothing.
            if (!blogIds || blogIds.length === 0) {
                setLoading(false)
                return
            }

            const supabase = createClient()
            const { data } = await supabase
                .from('blogs')
                .select('*')
                .in('id', blogIds)
                .eq('status', 'published') // Ensure they are still published

            if (data) setBlogs(data)
            setLoading(false)
        }

        fetchBlogs()
    }, [blogIds])

    if (!blogIds || blogIds.length === 0 || (blogs.length === 0 && !loading)) return null

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block rounded-full bg-[#faefe0] px-4 py-1.5 text-sm font-bold tracking-wider text-[#941c1d] uppercase mb-4">
                        Nossos Saberes
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                        Últimas do Blog
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex flex-col bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <Link href={`/saberes/${blog.slug}`} className="relative h-64 overflow-hidden">
                                {blog.cover_image ? (
                                    <Image
                                        src={blog.cover_image}
                                        alt={blog.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                        Sem Imagem
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            </Link>

                            <div className="flex flex-col flex-1 p-6">
                                <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(blog.created_at).toLocaleDateString('pt-BR')}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-[#941c1d] transition-colors">
                                    <Link href={`/saberes/${blog.slug}`}>
                                        {blog.title}
                                    </Link>
                                </h3>

                                <div className="mt-auto pt-4">
                                    <Link href={`/saberes/${blog.slug}`}>
                                        <Button variant="link" className="p-0 text-[#941c1d] font-bold hover:no-underline gap-2">
                                            Ler Artigo
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
