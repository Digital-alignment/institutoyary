'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface ImageUploaderProps {
    value: string
    onChange: (url: string) => void
    className?: string
    height?: string
    bucket?: string
}

export function ImageUploader({ value, onChange, className = '', height = 'min-h-[200px]', bucket = 'cms-images' }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            // Allow user to define bucket but defaults to cms-images
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            onChange(publicUrl)
        } catch (error: any) {
            console.error('Error uploading image:', error)
            const message = error.message || 'Unknown error'
            alert(`Error uploading image: ${message}. Please check if the '${bucket}' storage bucket exists and has correct permissions.`)
        } finally {
            setIsUploading(false)
        }
    }

    if (value) {
        return (
            <div className={`relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 ${className}`}>
                <img
                    src={value}
                    alt="Uploaded content"
                    className="w-full h-full object-cover"
                />
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    title="Remove Image"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        )
    }

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className={`
                border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
                ${isUploading ? 'bg-gray-50 cursor-wait' : 'hover:bg-gray-50 hover:border-[#941c1d]/50'}
                ${height} ${className}
            `}
        >
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
                disabled={isUploading}
            />

            {isUploading ? (
                <>
                    <Loader2 className="w-8 h-8 text-[#941c1d] animate-spin mb-2" />
                    <p className="text-sm text-gray-500">Uploading...</p>
                </>
            ) : (
                <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Upload Image</p>
                    <p className="text-xs text-gray-400 mt-1">Click or drag & drop</p>

                    <div className="flex items-center gap-2 mt-4 max-w-[200px] mx-auto">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-[10px] text-gray-400 uppercase">OR URL</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    <input
                        type="url"
                        placeholder="Paste URL"
                        className="mt-2 w-full text-xs border border-gray-200 rounded px-2 py-1 text-center focus:border-[#941c1d] focus:ring-0"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                            if (e.target.value) onChange(e.target.value)
                        }}
                    />
                </div>
            )}
        </div>
    )
}
