import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export interface SiteSettings {
    site_title: string
    site_description: string
    logo_url: string
    social_links: {
        instagram?: string
        facebook?: string
        youtube?: string
        whatsapp?: string
        email?: string
        phone?: string
    }
    home_layout: {
        show_hero: boolean
        show_mission: boolean
        hero_title?: string
        hero_subtitle?: string
    }
}

const defaultSettings: SiteSettings = {
    site_title: 'Instituto Yary',
    site_description: 'Instituto Yary',
    logo_url: '',
    social_links: {},
    home_layout: {
        show_hero: true,
        show_mission: true
    }
}

export function useSiteSettings() {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSettings() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single()

            if (!error && data) {
                setSettings({
                    ...data,
                    social_links: data.social_links || {},
                    home_layout: data.home_layout || {}
                })
            }
            setLoading(false)
        }

        fetchSettings()
    }, [])

    return { settings, loading }
}
