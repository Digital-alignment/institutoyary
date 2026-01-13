'use client'

import React from 'react'
import { Plus, Type, Heading1, Heading2, Heading3, Image as ImageIcon, Video, MousePointerClick } from 'lucide-react'
import { BlockWrapper } from './BlockWrapper'
import { TextBlock } from './TextBlock'
import { ImageBlock } from './ImageBlock'
import { VideoBlock } from './VideoBlock'
import { ButtonsBlock } from './ButtonsBlock'

export type BlockType = 'p' | 'h1' | 'h2' | 'h3' | 'image' | 'video' | 'buttons'

export interface Block {
    id: string
    type: BlockType
    content: any // string for text, object for image/video/buttons
}

interface BlockEditorProps {
    blocks: Block[]
    onChange: (blocks: Block[]) => void
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
    const addBlock = (type: BlockType) => {
        const newBlock: Block = {
            id: crypto.randomUUID(),
            type,
            content: (type === 'image' || type === 'video') ? { url: '', caption: '' } : type === 'buttons' ? [] : ''
        }
        onChange([...blocks, newBlock])
    }

    const updateBlock = (id: string, content: any) => {
        onChange(blocks.map(b => b.id === id ? { ...b, content } : b))
    }

    const updateBlockType = (id: string, newType: BlockType) => {
        onChange(blocks.map(b => b.id === id ? { ...b, type: newType } : b))
    }

    const deleteBlock = (id: string) => {
        onChange(blocks.filter(b => b.id !== id))
    }

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === blocks.length - 1)
        ) return

        const newBlocks = [...blocks]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
            ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
        onChange(newBlocks)
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4 min-h-[200px]">
                {blocks.map((block, index) => (
                    <BlockWrapper
                        key={block.id}
                        onDelete={() => deleteBlock(block.id)}
                        onMoveUp={() => moveBlock(index, 'up')}
                        onMoveDown={() => moveBlock(index, 'down')}
                        isFirst={index === 0}
                        isLast={index === blocks.length - 1}
                    >
                        {block.type === 'image' ? (
                            <ImageBlock
                                url={block.content.url}
                                caption={block.content.caption}
                                onChange={(val) => updateBlock(block.id, val)}
                            />
                        ) : block.type === 'video' ? (
                            <VideoBlock
                                url={block.content.url}
                                caption={block.content.caption}
                                onChange={(val) => updateBlock(block.id, val)}
                            />
                        ) : block.type === 'buttons' ? (
                            <ButtonsBlock
                                buttons={block.content}
                                onChange={(val) => updateBlock(block.id, val)}
                            />
                        ) : (
                            <TextBlock
                                id={block.id}
                                type={block.type as any}
                                content={block.content as string}
                                onChange={(val) => updateBlock(block.id, val)}
                                onTypeChange={(newType) => updateBlockType(block.id, newType)}
                            />
                        )}
                    </BlockWrapper>
                ))}
            </div>

            {/* Add Block Controls */}
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center gap-4">
                <span className="text-sm font-medium text-gray-500">Add Block:</span>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => addBlock('p')}
                        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600 hover:text-[#941c1d]"
                        title="Text"
                    >
                        <Type className="w-5 h-5" />
                    </button>
                    {/* Headings can be added via Text block switching */}

                    <div className="w-px h-5 bg-gray-300 self-center mx-1" />
                    <button
                        type="button"
                        onClick={() => addBlock('image')}
                        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600 hover:text-[#941c1d]"
                        title="Image"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => addBlock('video')}
                        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600 hover:text-[#941c1d]"
                        title="Video"
                    >
                        <Video className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => addBlock('buttons')}
                        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600 hover:text-[#941c1d]"
                        title="Buttons"
                    >
                        <MousePointerClick className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
