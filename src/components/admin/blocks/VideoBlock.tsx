'use client'

import React from 'react'
import { Video } from 'lucide-react'

interface VideoBlockProps {
    url: string
    caption?: string
    onChange: (data: { url: string; caption: string }) => void
}

export function VideoBlock({ url, caption = '', onChange }: VideoBlockProps) {
    // Basic helper to get embed URL for YouTube/Vimeo
    const getEmbedUrl = (inputUrl: string) => {
        try {
            const urlObj = new URL(inputUrl)
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                const videoId = urlObj.searchParams.get('v') || urlObj.pathname.slice(1)
                return `https://www.youtube.com/embed/${videoId}`
            }
            if (urlObj.hostname.includes('vimeo.com')) {
                const videoId = urlObj.pathname.slice(1)
                return `https://player.vimeo.com/video/${videoId}`
            }
        } catch (e) {
            return null
        }
        return null // Return null if not embeddable or invalid
    }

    const embedUrl = getEmbedUrl(url)

    return (
        <div className="space-y-3">
            {embedUrl ? (
                <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                    <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>
            ) : url ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    <Video className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm">Video URL not supported for preview or invalid.</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1">Test Link</a>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400">
                    <Video className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm">Enter a YouTube or Vimeo URL below</span>
                </div>
            )}

            <div className="flex gap-2">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => onChange({ url: e.target.value, caption })}
                    placeholder="Video URL (YouTube, Vimeo)"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d] text-sm"
                />
                <input
                    type="text"
                    value={caption}
                    onChange={(e) => onChange({ url, caption: e.target.value })}
                    placeholder="Caption (optional)"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d] text-sm"
                />
            </div>
        </div>
    )
}
