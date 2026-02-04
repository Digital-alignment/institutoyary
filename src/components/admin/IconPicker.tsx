"use client"

import * as React from "react"
import { Sprout, Globe, Users, Heart, Star, CheckCircle, Leaf, Sun, Award, Zap, Shield, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface IconPickerProps {
    value: string
    onChange: (value: string) => void
}

const icons = [
    { name: 'Sprout', icon: Sprout },
    { name: 'Globe', icon: Globe },
    { name: 'Users', icon: Users },
    { name: 'Heart', icon: Heart },
    { name: 'Star', icon: Star },
    { name: 'Check', icon: CheckCircle },
    { name: 'Leaf', icon: Leaf },
    { name: 'Sun', icon: Sun },
    { name: 'Award', icon: Award },
    { name: 'Zap', icon: Zap },
    { name: 'Shield', icon: Shield },
    { name: 'Target', icon: Target },
]

export function IconPicker({ value, onChange }: IconPickerProps) {
    return (
        <div className="grid grid-cols-6 gap-2">
            {icons.map((item) => {
                const Icon = item.icon
                const isSelected = value === item.name

                return (
                    <button
                        key={item.name}
                        type="button"
                        onClick={() => onChange(item.name)}
                        className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-lg border transition-all hover:bg-gray-50",
                            isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary text-primary"
                                : "border-gray-200 text-gray-500 hover:border-gray-300"
                        )}
                        title={item.name}
                    >
                        <Icon className="w-5 h-5 mb-1" />
                    </button>
                )
            })}
        </div>
    )
}
