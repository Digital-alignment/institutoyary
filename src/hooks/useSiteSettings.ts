import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export interface ButtonConfig {
    text: string
    url: string
}

export interface FooterLink {
    text: string
    url: string
}

export interface FooterColumn {
    title: string
    links: FooterLink[]
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

        // Manifesto Section
        manifesto_title?: string
        manifesto_text?: string

        // Partners Section
        show_partners: boolean
        partners_title?: string
        partners: { id: string, name: string, logo: string, url?: string }[]

        // Announcement Bar
        announcement_bar: {
            enabled: boolean
            text: string
            link?: string
            background_color?: string
            text_color?: string
        }
    }

    // About Page Layout
    about_layout: {
        // Hero
        show_hero: boolean
        hero_image: string
        hero_title: string
        hero_subtitle: string

        // History
        show_history: boolean
        history_tag: string
        history_title: string
        history_text: string
        history_highlight_title: string
        history_highlight_text: string
        history_image: string

        // Mission
        show_mission: boolean
        mission_quote: string
        mission_text: string

        // Values
        show_values: boolean
        values_title: string
        values_subtitle: string
        values_list: { icon: string, title: string, description: string }[]

        // Territories
        show_territories: boolean
        territories_title: string
        territories_list: { region: string, description: string }[]
        territories_map_image: string

        // Transparency
        show_transparency: boolean
        transparency_title: string
        transparency_subtitle: string
        transparency_documents: { name: string, url: string }[]
        team_text: string

        // CTA
        show_cta: boolean
        cta_title: string
        cta_subtitle: string
        cta_button_text: string
        cta_button_url: string
    }

    // Footer Layout
    footer_layout: {
        show_newsletter: boolean
        newsletter_title: string
        newsletter_text: string
        address: string
        copyright_text: string
        columns: FooterColumn[]
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
        featured_blogs: [],

        // Manifesto Section
        manifesto_title: 'Manifesto',
        manifesto_text: '', // Will default to hardcoded if empty

        // Partners Section
        show_partners: true,
        partners_title: 'Nossos Parceiros',
        partners: [],

        // Announcement Bar
        announcement_bar: {
            enabled: false,
            text: '',
            link: '',
            background_color: '#941c1d',
            text_color: '#ffffff'
        }
    },

    // About Page Defaults
    about_layout: {
        show_hero: true,
        hero_image: '/herosobre1.jpg',
        hero_title: 'Instituto Yary: Manifestando o Futuro Ancestral e o Bem Viver',
        hero_subtitle: 'Uma jornada cooperando para a regeneração e o fortalecimento de populações tradicionais',

        show_history: true,
        history_tag: 'Nossa História',
        history_title: 'Nascemos da terra e da sabedoria ancestral',
        history_text: 'O Instituto Yary é uma associação sem fins lucrativos, qualificada como OSCIP desde 2024. Ele nasceu da experiência acumulada de mais de 15 anos de seus fundadores atuando com povos indígenas e causas socioambientais.\n\nNossa origem remonta à Oca Yary em Itacaré-BA, onde nossas atividades acontecem há 7 anos e de onde surgiu o impulso vital para expandir nossa atuação.',
        history_highlight_title: 'Diferencial Crítico',
        history_highlight_text: 'Nossa diretoria conta com dois membros indígenas Guarani, garantindo que todas as nossas ações sejam guiadas por demandas reais e pela sabedoria das comunidades.',
        history_image: '/herohome-3.jpg',

        show_mission: true,
        mission_quote: 'Atuar no mundo hoje buscando cooperar para a regeneração, co-criando as possibilidades de um futuro belo para as gerações que irão viver na Terra e com ela o legado que estamos semeando',
        mission_text: 'Através do paradigma do Bem Viver, construímos caminhos de desenvolvimento sustentável e valorização da memória viva dos povos originários.',

        show_values: true,
        values_title: 'Valores Fundamentais',
        values_subtitle: 'Os pilares que sustentam nossa caminhada',
        values_list: [
            { icon: 'Sprout', title: 'Somos Natureza', description: 'Resgate da percepção de sermos parte integrante da Teia da vida e estarmos à serviço de sua diversidade.' },
            { icon: 'Globe', title: 'Futuro Ancestral', description: 'Valorização dos saberes que sustentam as raízes, redesenhando o presente para o futuro que sonhamos.' },
            { icon: 'Users', title: 'Diversidade', description: 'Reconhecer a riqueza nas diferenças para potencializar soluções e a resiliência dos sistemas vivos.' },
            { icon: 'Heart', title: 'Com-Unidade', description: 'Foco na co-criação e no coletivo como parte da natureza.' },
            { icon: 'Sprout', title: 'Bem-Viver', description: 'Prática de valorização das tradições e memórias para um aprendizado contínuo.' },
            { icon: 'Globe', title: 'Percepção Sistêmica', description: 'Visão integrada da vida como uma grande rede onde tudo está interligado.' }
        ],

        show_territories: true,
        territories_title: 'Territórios de Atuação',
        territories_list: [
            { region: 'Alto Xingu (MT)', description: 'Foco na preservação cultural e saberes medicinais, com destaque para o projeto Atatapa.' },
            { region: 'Mata Atlântica', description: 'Ações de regeneração e fortalecimento comunitário no Sul, Sudeste e Sul da Bahia.' },
            { region: 'Itacaré (BA)', description: 'Sede administrativa e centro de atividades através da Oca Yary.' }
        ],
        territories_map_image: '',

        show_transparency: true,
        transparency_title: 'Transparência e Governança',
        transparency_subtitle: 'Compromisso com a verdade e a responsabilidade',
        transparency_documents: [],
        team_text: 'Conheça a diretoria e o conselho que guiam nossas ações, incluindo lideranças Guarani fundamentais para nossa governança.',

        show_cta: true,
        cta_title: 'Quer co-criar esse futuro conosco?',
        cta_subtitle: 'Faça parte dessa rede de regeneração e transformação.',
        cta_button_text: 'Apoie Nossos Projetos',
        cta_button_url: '/projetos'
    },

    footer_layout: {
        show_newsletter: true,
        newsletter_title: 'Fique por dentro',
        newsletter_text: 'Receba novidades e atualizações sobre nossos projetos.',
        address: 'Rua Pedro Longo, 155 - Pituba, Itacaré - BA, 45530-000',
        copyright_text: '',
        columns: [
            {
                title: 'Institucional',
                links: [
                    { text: 'Sobre Nós', url: '/sobre' },
                    { text: 'Projetos', url: '/projetos' },
                    { text: 'Transparência', url: '/transparencia' },
                    { text: 'Contato', url: '/contato' }
                ]
            },
            {
                title: 'Apoie',
                links: [
                    { text: 'Faça uma Doação', url: '/doe' },
                    { text: 'Seja Voluntário', url: '/voluntario' },
                    { text: 'Parcerias', url: '/parcerias' }
                ]
            }
        ]
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
                    home_layout: { ...prev.home_layout, ...data.home_layout },
                    about_layout: { ...prev.about_layout, ...defaultSettings.about_layout, ...data.about_layout },
                    footer_layout: { ...prev.footer_layout, ...defaultSettings.footer_layout, ...data.footer_layout }
                }))
            }
            setLoading(false)
        }

        fetchSettings()
    }, [])

    return { settings, loading }
}
