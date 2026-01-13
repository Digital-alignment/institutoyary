'use client'

import React from 'react'
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react'

interface BlockWrapperProps {
    children: React.ReactNode
    onDelete: () => void
    onMoveUp: () => void
    onMoveDown: () => void
    isFirst: boolean
    isLast: boolean
}

export function BlockWrapper({ children, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: BlockWrapperProps) {
    return (
        <div className="group relative border rounded-lg p-4 bg-white hover:border-[#941c1d]/50 transition-colors">
            {/* Actions overlay - always visible on mobile, hover on desktop */}
            <div className="absolute right-2 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white shadow-md border border-gray-200 rounded-lg p-1 z-10">
                <button
                    type="button"
                    onClick={onMoveUp}
                    disabled={isFirst}
                    className="p-1.5 text-gray-500 hover:text-[#941c1d] disabled:opacity-30 disabled:hover:text-gray-500 hover:bg-gray-50 rounded"
                    title="Move Up"
                >
                    <ArrowUp className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={onMoveDown}
                    disabled={isLast}
                    className="p-1.5 text-gray-500 hover:text-[#941c1d] disabled:opacity-30 disabled:hover:text-gray-500 hover:bg-gray-50 rounded"
                    title="Move Down"
                >
                    <ArrowDown className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button
                    type="button"
                    onClick={onDelete}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            {children}
        </div>
    )
}
