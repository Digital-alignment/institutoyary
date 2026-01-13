import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, Calendar } from 'lucide-react'

// Force dynamic rendering to ensure fresh content
export const revalidate = 60

interface Props {
    params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    // 1. Fetch the blog post
    const { data: blog, error } = await supabase
        .from('blogs') // Table name remains 'blogs'
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    if (error || !blog) {
        notFound()
    }

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                {/* Hero / Header */}
                <div className="container mx-auto px-4 max-w-4xl">
                    <Link
                        href="/saberes"
                        className="inline-flex items-center text-gray-500 hover:text-[#941c1d] transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Voltar para Saberes
                    </Link>

                    <div className="space-y-6 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <time>
                                {new Date(blog.created_at).toLocaleDateString('pt-BR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </time>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            {blog.title}
                        </h1>

                        {blog.excerpt && (
                            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                {blog.excerpt}
                            </p>
                        )}
                    </div>
                </div>

                {/* Cover Image */}
                {blog.cover_image && (
                    <div className="container mx-auto px-4 max-w-5xl my-12">
                        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src={blog.cover_image}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <article className="container mx-auto px-4 max-w-3xl">
                    <BlockRenderer blocks={blog.content} />
                </article>

                {/* Footer / Share / More */}
                <div className="container mx-auto px-4 max-w-3xl mt-16 pt-8 border-t border-gray-100 flex justify-center">
                    <Link href="/saberes" className="text-[#941c1d] hover:underline font-medium">
                        Ler outros conteúdos
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}
