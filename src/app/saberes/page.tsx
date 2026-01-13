
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BlogCard } from '@/components/ui/BlogCard'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export const revalidate = 60 // Revalidate every minute

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SaberesPage({ searchParams }: Props) {
    const supabase = await createClient()
    const { category } = await searchParams

    let query = supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    if (category && typeof category === 'string') {
        query = query.eq('category', category)
    }

    const { data: blogs } = await query

    const categories = [
        "Sabedoria Indígena",
        "Regeneração Ambiental",
        "Histórias da Comunidade",
        "Preservação Cultural"
    ]

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-[#941c1d] text-white pt-32 pb-20 px-4">
                    <div className="container mx-auto text-center max-w-4xl space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                            Saberes
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto">
                            Um espaço dedicado ao compartilhamento de conhecimentos tradicionais, histórias de impacto e reflexões sobre a regeneração da vida.
                        </p>
                    </div>
                </section>

                {/* Filters & Grid Section */}
                <section className="container mx-auto px-4 py-16">
                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <Link
                            href="/saberes"
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!category
                                    ? 'bg-[#941c1d] text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            Todos
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/saberes?category=${encodeURIComponent(cat)}`}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${category === cat
                                        ? 'bg-[#941c1d] text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs?.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>

                    {/* Empty State */}
                    {(!blogs || blogs.length === 0) && (
                        <div className="text-center py-20">
                            <div className="text-gray-400 text-6xl mb-4">🍂</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Nenhum artigo encontrado
                            </h3>
                            <p className="text-gray-500">
                                {category
                                    ? `Não encontramos artigos na categoria "${category}".`
                                    : "Ainda não há conteúdos publicados."}
                            </p>
                            {category && (
                                <Link
                                    href="/saberes"
                                    className="inline-block mt-6 text-[#941c1d] font-bold hover:underline"
                                >
                                    Limpar filtros
                                </Link>
                            )}
                        </div>
                    )}
                </section>

                {/* Newsletter Section */}
                <NewsletterSection />
            </main>

            <Footer />
        </div>
    )
}
