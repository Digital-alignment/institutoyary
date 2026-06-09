'use client'

import { useState } from 'react'
import { ContactModal } from '@/components/contact-modal'

export function ProjectContactCTA() {
    const [isContactOpen, setIsContactOpen] = useState(false)

    return (
        <>
            <section className="bg-[#f8f2d8] py-24 border-t border-[#6e1516]/10 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-8 bg-white/50 backdrop-blur-md p-10 md:p-14 rounded-[2.5rem] shadow-lg border border-white">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#941c1d] tracking-tight">Gostou deste projeto?</h2>
                        <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                            Entre em contato conosco para saber como você pode apoiar ou participar desta iniciativa e nos ajudar a expandir nosso impacto.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={() => setIsContactOpen(true)}
                                className="inline-flex items-center justify-center gap-2 bg-[#941c1d] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#7a1617] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                            >
                                Entrar em Contato
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    )
}
