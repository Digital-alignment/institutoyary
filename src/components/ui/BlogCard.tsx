
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'

interface Blog {
    id: string
    title: string
    subtitle?: string
    slug: string
    excerpt: string
    cover_image: string
    created_at: string
    category?: string
}

interface BlogCardProps {
    blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
    return (
        <Link
            href={`/saberes/${blog.slug}`}
            className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            <div className="relative h-64 w-full overflow-hidden">
                {blog.cover_image ? (
                    <Image
                        src={blog.cover_image}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-sm">Sem imagem</span>
                    </div>
                )}
                {blog.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#941c1d] shadow-sm">
                        {blog.category}
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-6 md:p-8">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                        {new Date(blog.created_at).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#941c1d] transition-colors line-clamp-2">
                    {blog.title}
                </h3>

                {blog.subtitle && (
                    <h4 className="text-md font-medium text-gray-500 mb-3 line-clamp-1">
                        {blog.subtitle}
                    </h4>
                )}

                <p className="text-gray-600 line-clamp-3 mb-6 flex-1 text-sm md:text-base leading-relaxed">
                    {blog.excerpt || 'Leia mais sobre este assunto clicando aqui.'}
                </p>

                <div className="flex items-center text-[#941c1d] font-bold text-sm tracking-wide group/link">
                    Ler artigo completo
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" />
                </div>
            </div>
        </Link>
    )
}
