import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type BlockType = 'p' | 'h1' | 'h2' | 'h3' | 'image' | 'video' | 'buttons'

interface Block {
    id: string
    type: BlockType
    content: any
}

interface BlockRendererProps {
    blocks: Block[]
    className?: string
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
    if (!blocks || !Array.isArray(blocks)) return null

    // Group consecutive image blocks to show them side-by-side if they are many
    const processedBlocks: any[] = [];
    let currentImageGroup: any[] = [];

    blocks.forEach((block) => {
        if (block.type === 'image') {
            currentImageGroup.push(block);
        } else {
            if (currentImageGroup.length > 0) {
                processedBlocks.push({
                    type: 'image_grid',
                    id: `grid-${currentImageGroup[0].id}`,
                    imageBlocks: [...currentImageGroup]
                });
                currentImageGroup = [];
            }
            processedBlocks.push(block);
        }
    });
    if (currentImageGroup.length > 0) {
        processedBlocks.push({
            type: 'image_grid',
            id: `grid-${currentImageGroup[0].id}`,
            imageBlocks: [...currentImageGroup]
        });
    }

    return (
        <div className={cn("space-y-6", className)}>
            {processedBlocks.map((block) => {
                const { type, content, id } = block

                switch (type) {
                    case 'h1':
                        return (
                            <h1 key={id} className="text-4xl font-bold text-[#941c1d] mt-8 mb-4 leading-tight">
                                <span dangerouslySetInnerHTML={{ __html: content }} />
                            </h1>
                        )
                    case 'h2':
                        return (
                            <h2 key={id} className="text-3xl font-bold text-gray-800 mt-8 mb-4 leading-snug">
                                <span dangerouslySetInnerHTML={{ __html: content }} />
                            </h2>
                        )
                    case 'h3':
                        return (
                            <h3 key={id} className="text-2xl font-semibold text-gray-800 mt-6 mb-3 leading-snug">
                                <span dangerouslySetInnerHTML={{ __html: content }} />
                            </h3>
                        )
                    case 'p':
                        return (
                            <div
                                key={id}
                                className="text-lg leading-relaxed text-gray-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_b]:font-bold [&_i]:italic"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        )
                    case 'image_grid':
                        const imageBlocks = (block as any).imageBlocks;
                        if (imageBlocks.length === 1) {
                            const { content: imgContent, id: imgId } = imageBlocks[0];
                            return (
                                <figure key={imgId} className="my-8">
                                    <div className="relative w-full rounded-xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100">
                                        <img
                                            src={imgContent.url}
                                            alt={imgContent.caption || 'Project image'}
                                            className="w-full h-auto max-h-[85vh] object-contain mx-auto block"
                                        />
                                    </div>
                                    {imgContent.caption && (
                                        <figcaption className="text-center text-sm text-gray-500 mt-3 italic px-4">
                                            {imgContent.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            )
                        }
                        return (
                            <div key={id} className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 items-start">
                                {imageBlocks.map((img: any) => (
                                    <figure key={img.id} className="flex flex-col group">
                                        <div className="relative rounded-xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100 transition-shadow hover:shadow-md">
                                            <img
                                                src={img.content.url}
                                                alt={img.content.caption || 'Project image'}
                                                className="w-full h-auto max-h-[75vh] object-contain mx-auto block"
                                            />
                                        </div>
                                        {img.content.caption && (
                                            <figcaption className="text-center text-sm text-gray-500 mt-3 italic px-2">
                                                {img.content.caption}
                                            </figcaption>
                                        )}
                                    </figure>
                                ))}
                            </div>
                        )
                    case 'video':
                        // Helper to get embed URL (duplicated from VideoBlock, ideally clear utility)
                        const getEmbedUrl = (inputUrl: string) => {
                            try {
                                const urlObj = new URL(inputUrl)
                                if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                                    const videoId = urlObj.searchParams.get('v') || urlObj.pathname.slice(1)
                                    return `https://www.youtube.com/embed/${videoId}`
                                }
                                if (urlObj.hostname.includes('vimeo')) {
                                    const videoId = urlObj.pathname.slice(1)
                                    return `https://player.vimeo.com/video/${videoId}`
                                }
                            } catch (e) {
                                return null
                            }
                            return null
                        }
                        const embedUrl = getEmbedUrl(content.url)

                        if (!embedUrl) return null

                        return (
                            <figure key={id} className="my-8">
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm bg-black">
                                    <iframe
                                        src={embedUrl}
                                        className="absolute inset-0 w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>
                                {content.caption && (
                                    <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                                        {content.caption}
                                    </figcaption>
                                )}
                            </figure>
                        )
                    case 'buttons':
                        return (
                            <div key={id} className="flex flex-wrap gap-4 my-8 justify-center md:justify-start">
                                {content.map((btn: any) => (
                                    <Link
                                        key={btn.id}
                                        href={btn.href}
                                        target={btn.href.startsWith('http') ? "_blank" : undefined}
                                        rel={btn.href.startsWith('http') ? "noopener noreferrer" : undefined}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#941c1d] hover:bg-[#7a1617] transition-colors"
                                    >
                                        {btn.text}
                                    </Link>
                                ))}
                            </div>
                        )
                    default:
                        return null
                }
            })}
        </div>
    )
}
