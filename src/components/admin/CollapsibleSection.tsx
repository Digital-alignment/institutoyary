"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
    title: string
    subtitle?: string
    isVisible?: boolean
    onVisibilityChange?: (checked: boolean) => void
    children: React.ReactNode
    defaultOpen?: boolean
    className?: string
}

export function CollapsibleSection({
    title,
    subtitle,
    isVisible,
    onVisibilityChange,
    children,
    defaultOpen = false,
    className
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className={cn("border rounded-xl bg-white shadow-sm overflow-hidden", className)}>
            <div className="flex items-center justify-between p-4 bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                </div>

                {onVisibilityChange && (
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 ml-4">
                        <span className="text-sm text-gray-500 hidden md:inline">
                            {isVisible ? 'Visível' : 'Oculto'}
                        </span>
                        <Switch checked={!!isVisible} onCheckedChange={onVisibilityChange} />
                    </div>
                )}
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-6 border-t border-gray-100">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
