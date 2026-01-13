'use client'

import React from 'react'
import { ImageUploader } from '../ImageUploader'

interface ImageBlockProps {
    url: string
    caption: string
    onChange: (value: { url: string, caption: string }) => void
}

export function ImageBlock({ url, caption, onChange }: ImageBlockProps) {
    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm space-y-3">
            <ImageUploader
                value={url}
                onChange={(newUrl) => onChange({ url: newUrl, caption })}
            />

            {url && (
                <input
                    type="text"
                    value={caption}
                    onChange={(e) => onChange({ url, caption: e.target.value })}
                    placeholder="Write a caption..."
                    className="w-full text-center text-sm text-gray-500 border-none focus:ring-0 focus:text-gray-800 bg-transparent"
                />
            )}
        </div>
    )
}
