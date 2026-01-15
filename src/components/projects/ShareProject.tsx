'use client'

import { useState } from 'react'
import { Share2, X, Copy, Mail, ExternalLink, Facebook, MessageCircle } from 'lucide-react'
import Image from 'next/image'

interface ShareProjectProps {
    title: string
    description: string
    url: string
    coverImage: string
}

export function ShareProject({ title, description, url, coverImage }: ShareProjectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        // Try Native Share first (Mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: url,
                })
                return
            } catch (error) {
                console.log('Error sharing:', error)
            }
        }

        // Fallback to Modal (Desktop)
        setIsOpen(true)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: <MessageCircle className="w-6 h-6" />,
            url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
            color: 'bg-[#25D366] hover:bg-[#128C7E]'
        },
        {
            name: 'Facebook',
            icon: <Facebook className="w-6 h-6" />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'bg-[#1877F2] hover:bg-[#166FE5]'
        },
        {
            name: 'E-mail',
            icon: <Mail className="w-6 h-6" />,
            url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
            color: 'bg-gray-600 hover:bg-gray-700'
        }
    ]

    return (
        <>
            <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 group text-sm"
            >
                <span className="font-medium">Compartilhar</span>
                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Desktop Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-bold text-gray-900">Compartilhar Projeto</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Preview */}
                            <div className="flex gap-4 items-start">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={coverImage}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 line-clamp-2">{title}</h4>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">instituyary.org</p>
                                </div>
                            </div>

                            {/* Copy Link */}
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <input
                                    type="text"
                                    readOnly
                                    value={url}
                                    className="bg-transparent border-none text-sm text-gray-600 flex-1 focus:ring-0 px-0"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {copied ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>

                            {/* Social Actions */}
                            <div className="grid grid-cols-3 gap-3">
                                {shareLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl text-white transition-all transform hover:-translate-y-1 ${link.color}`}
                                    >
                                        {link.icon}
                                        <span className="text-xs font-medium">{link.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
