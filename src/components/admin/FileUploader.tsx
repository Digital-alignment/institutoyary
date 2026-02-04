'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Loader2, FileText, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
    value: string
    onChange: (url: string) => void
    className?: string
    bucket?: string
    accept?: string
    label?: string
}

export function FileUploader({
    value,
    onChange,
    className = '',
    bucket = 'site-assets',
    accept = '.pdf,.doc,.docx',
    label = 'Upload Arquivo'
}: FileUploaderProps) {
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
            const filePath = `docs/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            onChange(publicUrl)
        } catch (error: any) {
            console.error('Error uploading file:', error)
            alert(`Erro ao fazer upload: ${error.message}`)
        } finally {
            setIsUploading(false)
        }
    }

    if (value) {
        return (
            <div className={cn("relative flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50/50", className)}>
                <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-5 h-5 text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800 truncate">Arquivo enviado</p>
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline truncate block">
                        Ver arquivo
                    </a>
                </div>
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remover arquivo"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )
    }

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
                "border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/50 hover:bg-gray-50 py-6 px-4",
                isUploading && "opacity-50 cursor-wait",
                className
            )}
        >
            <input
                type="file"
                accept={accept}
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
                disabled={isUploading}
            />

            {isUploading ? (
                <div className="flex flex-col items-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                    <p className="text-xs text-muted-foreground">Enviando...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center text-center">
                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX</span>
                </div>
            )}
        </div>
    )
}
