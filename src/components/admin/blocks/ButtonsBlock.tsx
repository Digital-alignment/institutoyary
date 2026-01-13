'use client'

import React from 'react'
import { Plus, Trash2, ExternalLink } from 'lucide-react'

interface ButtonItem {
    id: string
    text: string
    href: string
}

interface ButtonsBlockProps {
    buttons: ButtonItem[]
    onChange: (buttons: ButtonItem[]) => void
}

export function ButtonsBlock({ buttons = [], onChange }: ButtonsBlockProps) {
    const addButton = () => {
        if (buttons.length >= 3) return

        const newButton: ButtonItem = {
            id: crypto.randomUUID(),
            text: 'Click Here',
            href: '#'
        }
        onChange([...buttons, newButton])
    }

    const updateButton = (id: string, field: 'text' | 'href', value: string) => {
        onChange(buttons.map(b => b.id === id ? { ...b, [field]: value } : b))
    }

    const removeButton = (id: string) => {
        onChange(buttons.filter(b => b.id !== id))
    }

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
            <div className="flex flex-wrap gap-4">
                {buttons.map((button) => (
                    <div key={button.id} className="flex-1 min-w-[250px] bg-white p-3 rounded border shadow-sm space-y-3 relative group">
                        <div className="absolute top-2 right-2">
                            <button
                                type="button"
                                onClick={() => removeButton(button.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Remove Button"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Button Text</label>
                            <input
                                type="text"
                                value={button.text}
                                onChange={(e) => updateButton(button.id, 'text', e.target.value)}
                                className="w-full rounded border-gray-300 text-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                placeholder="e.g. Learn More"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> Link URL
                            </label>
                            <input
                                type="text"
                                value={button.href}
                                onChange={(e) => updateButton(button.id, 'href', e.target.value)}
                                className="w-full rounded border-gray-300 text-sm text-gray-600 font-mono focus:border-[#941c1d] focus:ring-[#941c1d]"
                                placeholder="https://"
                            />
                        </div>

                        {/* Preview */}
                        <div className="pt-2">
                            <div className="inline-block px-4 py-2 bg-[#941c1d] text-white rounded text-sm font-medium text-center w-full opacity-90">
                                {button.text || 'Button Preview'}
                            </div>
                        </div>
                    </div>
                ))}

                {buttons.length < 3 && (
                    <button
                        type="button"
                        onClick={addButton}
                        className="flex-1 min-w-[200px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#941c1d]/50 hover:text-[#941c1d] transition-all text-gray-400 gap-2"
                    >
                        <Plus className="w-6 h-6" />
                        <span className="text-sm font-medium">Add Button ({buttons.length}/3)</span>
                    </button>
                )}
            </div>
        </div>
    )
}
