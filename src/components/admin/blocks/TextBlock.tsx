'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Bold, Italic, List, Heading1, Heading2, Heading3, Type } from 'lucide-react'

interface TextBlockProps {
    id: string
    type: 'p' | 'h1' | 'h2' | 'h3'
    content: string
    onChange: (content: string) => void
    onTypeChange: (type: 'p' | 'h1' | 'h2' | 'h3') => void
}

export function TextBlock({ type, content, onChange, onTypeChange }: TextBlockProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    // Sync content changes from parent (e.g. loading saved data) to the editable div
    // But ONLY if the content is different and we're not currently typing (to avoid cursor jumps)
    // Or if we need to force an update (like changing block type potentially)
    useEffect(() => {
        if (editorRef.current && content !== editorRef.current.innerHTML) {
            // Only update if the new content is substantially different
            // This check is simple but prevents the loop where:
            // Type 'a' -> onChange('a') -> Prop becomes 'a' -> Effect runs -> innerHTML='a' (Cursor Reset)

            // If we are focused, we assume the user is typing and local DOM is source of truth.
            // We only override if it's COMPLETELY different (like a reset or external change).
            // For this simple editor, skipping update while focused is usually safe enough 
            // unless we have external collaborators.

            if (!isFocused) {
                editorRef.current.innerHTML = content
            } else {
                // Even if focused, if the difference is huge (pasted content? undo?), we might want to update?
                // For now, let's keep it simple: Trust local DOM while focused.

                // CORRECTION: If we don't update, how do we handle formatting actions that might change content?
                // execCommand handles the DOM update locally, so we are good there.

                // What about initial load? isFocused is false initially.
            }
        }
    }, [content, isFocused])

    // One-time mount initialization to handle legacy markdown if needed
    useEffect(() => {
        if (editorRef.current && !editorRef.current.innerHTML && content) {
            // Basic markdown to HTML parser for migration
            const isHtml = /<[a-z][\s\S]*>/i.test(content)
            if (!isHtml) {
                let parsed = content
                    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
                    .replace(/_(.*?)_/g, '<i>$1</i>')       // Italic
                    .replace(/^- (.*)$/gm, '<ul><li>$1</li></ul>') // Lists
                    .replace(/\n/g, '<br>')
                parsed = parsed.replace(/<\/ul><br><ul>/g, '')
                editorRef.current.innerHTML = parsed
                // Update parent with the parsed HTML so it saves correctly next time
                if (parsed !== content) onChange(parsed)
            } else {
                editorRef.current.innerHTML = content
            }
        }
    }, [])

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.innerHTML
        if (newContent !== content) {
            onChange(newContent)
        }
    }


    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
        // Force update state after command
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const toggleFormat = (format: 'bold' | 'italic') => {
        execCommand(format)
    }

    const toggleList = () => {
        execCommand('insertUnorderedList')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            toggleFormat('bold')
        }
        if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            toggleFormat('italic')
        }
    }

    return (
        <div className="relative group/text">
            {/* Formatting Toolbar - Shows on Focus or Hover */}
            <div
                className={`
                    absolute -top-10 left-0 bg-white border border-gray-200 shadow-md rounded-lg flex items-center p-1 z-20 gap-1 transition-all duration-200
                    ${isFocused ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible group-hover/text:opacity-100 group-hover/text:translate-y-0 group-hover/text:visible text-gray-400'}
                `}
            >
                {/* Block Type Switcher */}
                <div className="flex bg-gray-100 rounded p-0.5">
                    <button
                        type="button"
                        onClick={() => onTypeChange('p')}
                        className={`p-1.5 rounded text-gray-700 hover:text-black transition-colors ${type === 'p' ? 'bg-white shadow-sm text-black' : ''}`}
                        title="Normal Text"
                    >
                        <Type className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onTypeChange('h1')}
                        className={`p-1.5 rounded text-gray-700 hover:text-black transition-colors ${type === 'h1' ? 'bg-white shadow-sm text-black' : ''}`}
                        title="Heading 1"
                    >
                        <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onTypeChange('h2')}
                        className={`p-1.5 rounded text-gray-700 hover:text-black transition-colors ${type === 'h2' ? 'bg-white shadow-sm text-black' : ''}`}
                        title="Heading 2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onTypeChange('h3')}
                        className={`p-1.5 rounded text-gray-700 hover:text-black transition-colors ${type === 'h3' ? 'bg-white shadow-sm text-black' : ''}`}
                        title="Heading 3"
                    >
                        <Heading3 className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-px h-4 bg-gray-200 mx-1" />

                {/* Inline Formatting */}
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); toggleFormat('bold') }}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors"
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); toggleFormat('italic') }}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors"
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); toggleList() }}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors"
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
            </div>

            <div className={`
                w-full relative rounded-md transition-all duration-200
                ${isFocused ? 'ring-2 ring-blue-100 bg-gray-50/30' : 'hover:bg-gray-50/50'}
            `}>
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    className={`
                        w-full bg-transparent border-none focus:outline-none p-3 min-h-[1.5em] block
                        ${type === 'h1' ? 'text-4xl font-bold text-[#941c1d]' : ''}
                        ${type === 'h2' ? 'text-3xl font-bold text-gray-800' : ''}
                        ${type === 'h3' ? 'text-2xl font-semibold text-gray-800' : ''}
                        ${type === 'p' ? 'text-base leading-relaxed text-gray-700' : ''}
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2
                        empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300
                    `}
                    data-placeholder={
                        type === 'h1' ? 'Heading 1' :
                            type === 'h2' ? 'Heading 2' :
                                type === 'h3' ? 'Heading 3' :
                                    'Start writing...'
                    }
                    style={{ whiteSpace: 'pre-wrap' }}
                />
            </div>
        </div>
    )
}
