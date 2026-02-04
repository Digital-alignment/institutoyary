import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export interface ButtonConfig {
    text: string
    url: string
}

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
        // Hero Section
        show_hero: boolean
        hero_slides: { image: string, alt?: string }[] // Array of images
        hero_title?: string
        hero_subtitle?: string
        hero_text?: string
        hero_button_1?: ButtonConfig
        hero_button_2?: ButtonConfig

        // Section 2 (Mission)
        show_mission: boolean
        mission_title?: string
        mission_subtitle?: string
        mission_text?: string
        mission_button?: ButtonConfig

        // Quote Section
        show_quote: boolean
        quote_title?: string
        quote_text?: string

        // Blog Section
        show_blog: boolean
        featured_blogs?: string[] // IDs of blogs to show
    }
}

const defaultSettings: SiteSettings = {
    site_title: 'Instituto Yary',
    site_description: 'Instituto Yary',
    logo_url: '',
    social_links: {},
    home_layout: {
        show_hero: true,
        hero_slides: [],
        hero_title: 'Atuar no mundo hoje cooperando para regeneração',
        hero_subtitle: 'Co-criando possibilidades de um futuro belo para as gerações que virão.',
        hero_button_1: { text: 'Conheça Nossos Projetos', url: '/projetos' },
        hero_button_2: { text: 'Saiba Mais Sobre Nós', url: '/sobre' },

        show_mission: true,
        mission_title: 'Uma OSCIP dedicada à regeneração socioambiental e ao fortalecimento cultural',
        mission_text: 'O Instituto Yary é uma associação sem fins lucrativos (OSCIP) que atua há mais de 15 anos em conjunto com populações tradicionais e na área socioambiental.',
        mission_button: { text: 'Conheça Nossa História', url: '/sobre' },

        show_quote: true,
        quote_title: 'Nossa Missão',
        quote_text: '',

        show_blog: true,
        featured_blogs: []
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
                // Merge with defaults to ensure new fields exist even if DB has old JSON
                setSettings((prev) => ({
                    ...prev,
                    ...data,
                    social_links: { ...prev.social_links, ...data.social_links },
                    home_layout: { ...prev.home_layout, ...data.home_layout }
                }))
            }
            setLoading(false)
        }

        fetchSettings()
    }, [])

    return { settings, loading }
}
