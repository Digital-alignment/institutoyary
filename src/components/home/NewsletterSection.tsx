
'use client'

import { useState } from 'react'
import { ArrowRight, Mail, Loader2 } from 'lucide-react'

export function NewsletterSection() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus('loading')

        // Simulate API call
        setTimeout(() => {
            setStatus('success')
            setEmail('')
            setTimeout(() => setStatus('idle'), 3000)
        }, 1500)
    }

    return (
        <section className="bg-[#f8f2d8] py-16 md:py-24 relative overflow-hidden">
            {/* Simple decorative elements - replacing SVG pattern with simple circles for cleaner code/performance if needed, 
                but keeping it clean as per request for "Rich Aesthetics" often means less clutter too. 
                Let's add a subtle background texture or shape if fits. Keeping it simple for now. 
            */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#941c1d]/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-[#941c1d]/5 blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#941c1d]">
                        Fique por dentro dos nossos saberes
                    </h2>

                    <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Assine nossa newsletter para receber saberes ancestrais e atualizações de impacto diretamente no seu e-mail.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto mt-8">
                        <div className="relative flex-1">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Seu melhor e-mail"
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-transparent bg-white focus:border-[#941c1d]/20 focus:ring-[#941c1d] outline-none transition-all placeholder-gray-400 text-gray-900"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className={`
                                flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]
                                ${status === 'success' ? 'bg-green-600' : 'bg-[#941c1d] hover:bg-[#7a1617]'}
                            `}
                        >
                            {status === 'loading' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : status === 'success' ? (
                                'Inscrito com Sucesso!'
                            ) : (
                                <>
                                    Inscrever-se
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 pt-4">
                        Respeitamos sua privacidade. Cancele a inscrição a qualquer momento.
                    </p>
                </div>
            </div>
        </section>
    )
}
