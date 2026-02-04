'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Loader2, Save, Globe, Smartphone, Home, Plus, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { FileUploader } from '@/components/admin/FileUploader'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CollapsibleSection } from '@/components/admin/CollapsibleSection'
import { IconPicker } from '@/components/admin/IconPicker'

// Toast Component
interface ToastProps {
    message: string
    type: 'success' | 'error'
    onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={cn(
                "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border backdrop-blur-md",
                type === 'success'
                    ? "bg-white/90 border-green-200 text-green-800"
                    : "bg-white/90 border-red-200 text-red-800"
            )}
        >
            {type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 hover:bg-black/5 p-1 rounded-full"><X className="w-4 h-4" /></button>
        </motion.div>
    )
}

export default function AdminSettingsPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'general' | 'social' | 'home'>('general')
    const [blogs, setBlogs] = useState<any[]>([])
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

    // State
    const [settings, setSettings] = useState<any>({
        site_title: '',
        site_description: '',
        logo_url: '',
        social_links: {
            instagram: '',
            facebook: '',
            youtube: '',
            whatsapp: '',
            email: '',
            phone: ''
        },
        home_layout: {
            show_hero: true,
            hero_slides: [], // { image: '', alt: '' }
            hero_title: '',
            hero_subtitle: '',
            hero_text: '',
            hero_button_1: { text: '', url: '' },
            hero_button_2: { text: '', url: '' },
            show_mission: true,
            mission_title: '',
            mission_subtitle: '',
            mission_text: '',
            mission_button: { text: '', url: '' },
            show_quote: true,
            quote_title: '',
            quote_text: '',
            show_blog: true,
            featured_blogs: [],
            // New Fields
            manifesto_title: '',
            manifesto_text: '',
            show_partners: true,
            partners_title: '',
            partners: [],
            announcement_bar: { enabled: false, text: '', link: '', background_color: '#941c1d', text_color: '#ffffff' }
        },
        // About Page Layout
        about_layout: {
            // Hero
            show_hero: true,
            hero_image: '', hero_title: '', hero_subtitle: '',

            // History
            show_history: true,
            history_tag: '', history_title: '', history_text: '', history_highlight_title: '', history_highlight_text: '', history_image: '',

            // Mission
            show_mission: true,
            mission_quote: '', mission_text: '',

            // Values
            show_values: true,
            values_title: '', values_subtitle: '', values_list: [],

            // Territories
            show_territories: true,
            territories_title: '', territories_list: [], territories_map_image: '',

            // Transparency
            show_transparency: true,
            transparency_title: '', transparency_subtitle: '', transparency_documents: [], team_text: '',

            // CTA
            show_cta: true,
            cta_title: '', cta_subtitle: '', cta_button_text: '', cta_button_url: ''
        }
    })

    useEffect(() => {
        Promise.all([fetchSettings(), fetchBlogs()])
    }, [])

    const fetchBlogs = async () => {
        const { data } = await supabase.from('blogs').select('id, title').eq('status', 'published')
        if (data) setBlogs(data)
    }

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single()

            if (error) {
                if (error.code !== 'PGRST116') { // Not found code
                    console.error('Error fetching settings:', error)
                }
            } else if (data) {
                setSettings({
                    ...data,
                    social_links: data.social_links || {},
                    home_layout: {
                        ...settings.home_layout, // Keep defaults for new fields if missing
                        ...data.home_layout,
                        hero_slides: data.home_layout?.hero_slides || [],
                        hero_button_1: data.home_layout?.hero_button_1 || { text: '', url: '' },
                        hero_button_2: data.home_layout?.hero_button_2 || { text: '', url: '' },
                        mission_button: data.home_layout?.mission_button || { text: '', url: '' },
                        featured_blogs: data.home_layout?.featured_blogs || [],
                        partners: data.home_layout?.partners || [],
                        announcement_bar: data.home_layout?.announcement_bar || { enabled: false, text: '', link: '', background_color: '#941c1d', text_color: '#ffffff' }
                    },
                    about_layout: {
                        ...settings.about_layout,
                        ...data.about_layout,
                        values_list: data.about_layout?.values_list || [],
                        territories_list: data.about_layout?.territories_list || [],
                        transparency_documents: data.about_layout?.transparency_documents || []
                    }
                })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    id: 1,
                    site_title: settings.site_title,
                    site_description: settings.site_description,
                    logo_url: settings.logo_url,
                    social_links: settings.social_links,
                    home_layout: settings.home_layout,
                    about_layout: settings.about_layout,
                    updated_at: new Date().toISOString()
                })

            if (error) throw error
            setToast({ message: 'Configurações salvas com sucesso!', type: 'success' })
        } catch (error: any) {
            setToast({ message: 'Erro ao salvar: ' + error.message, type: 'error' })
        } finally {
            setSaving(false)
        }
    }

    // Helpers to update nested state
    const updateSocial = (key: string, value: string) => {
        setSettings({
            ...settings,
            social_links: { ...settings.social_links, [key]: value }
        })
    }

    const updateHome = (key: string, value: any) => {
        setSettings({
            ...settings,
            home_layout: { ...settings.home_layout, [key]: value }
        })
    }

    const updateHeroSlide = (index: number, field: 'image' | 'alt', value: string) => {
        const newSlides = [...settings.home_layout.hero_slides];
        if (!newSlides[index]) newSlides[index] = { image: '', alt: '' };
        newSlides[index][field] = value;
        updateHome('hero_slides', newSlides);
    }

    const updatePartner = (index: number, field: string, value: string) => {
        const newPartners = [...(settings.home_layout.partners || [])];
        if (!newPartners[index]) return;
        newPartners[index] = { ...newPartners[index], [field]: value };
        updateHome('partners', newPartners);
    }

    const addPartner = () => {
        const newPartners = [...(settings.home_layout.partners || []), { name: '', logo: '', url: '' }];
        updateHome('partners', newPartners);
    }

    const removePartner = (index: number) => {
        const newPartners = [...(settings.home_layout.partners || [])].filter((_, i) => i !== index);
        updateHome('partners', newPartners);
    }

    const updateAbout = (key: string, value: any) => {
        setSettings({
            ...settings,
            about_layout: { ...settings.about_layout, [key]: value }
        })
    }

    const updateValueItem = (index: number, field: string, value: string) => {
        const newValues = [...(settings.about_layout.values_list || [])];
        if (!newValues[index]) return;
        newValues[index] = { ...newValues[index], [field]: value };
        updateAbout('values_list', newValues);
    }

    const updateTerritoryItem = (index: number, field: string, value: string) => {
        const newTerritories = [...(settings.about_layout.territories_list || [])];
        if (!newTerritories[index]) return;
        newTerritories[index] = { ...newTerritories[index], [field]: value };
        updateAbout('territories_list', newTerritories);
    }

    const addDoc = (name: string, url: string) => {
        const newDocs = [...(settings.about_layout.transparency_documents || []), { name, url }];
        updateAbout('transparency_documents', newDocs);
    }

    const removeDoc = (index: number) => {
        const newDocs = [...(settings.about_layout.transparency_documents || [])].filter((_, i) => i !== index);
        updateAbout('transparency_documents', newDocs);
    }

    // Ensure we have at least 3 empty slots if less
    const heroSlides = settings.home_layout.hero_slides || [];
    const displaySlides = [...heroSlides];
    while (displaySlides.length < 3) {
        displaySlides.push({ image: '', alt: '' });
    }

    if (loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

    const tabs = [
        { id: 'general', label: 'Geral & Identidade', icon: Globe },
        { id: 'social', label: 'Contato & Social', icon: Smartphone },
        { id: 'home', label: 'Home Page', icon: Home },
        { id: 'about', label: 'Página Sobre', icon: Globe },
    ]

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações do Site</h1>
                    <p className="text-muted-foreground mt-1">Gerencie a aparência e conteúdo do seu site.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    size="lg"
                    className="shadow-lg shadow-primary/20"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    Salvar Alterações
                </Button>
            </div>

            {/* Custom Tabs */}
            <div className="flex p-1 bg-muted/30 rounded-xl w-fit border border-border/50 backdrop-blur-sm">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "relative flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all z-10",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white shadow-sm border border-border/50 rounded-lg -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Content with Animation */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Identidade do Site</CardTitle>
                            <CardDescription>Configure as informações básicas que aparecem nos resultados de busca.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Título do Site</label>
                                <Input
                                    value={settings.site_title}
                                    onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                                    placeholder="Ex: Instituto Yary"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Descrição (SEO)</label>
                                <textarea
                                    value={settings.site_description}
                                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Descrição curta do site para aparecer no Google..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Logo do Site</label>
                                <div className="p-4 border border-dashed rounded-lg bg-muted/20 w-fit">
                                    <div className="w-48">
                                        <ImageUploader
                                            value={settings.logo_url}
                                            onChange={(url) => setSettings({ ...settings, logo_url: url })}
                                            bucket="site-assets"
                                            height="h-32"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">Recomendado: 512x512 PNG Transparente</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* SOCIAL TAB */}
                {activeTab === 'social' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Redes Sociais & Contato</CardTitle>
                            <CardDescription>Links que aparecerão no rodapé e na página de contato.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email de Contato</label>
                                    <Input
                                        type="email"
                                        value={settings.social_links.email}
                                        onChange={(e) => updateSocial('email', e.target.value)}
                                        placeholder="contato@exemplo.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">WhatsApp / Telefone</label>
                                    <Input
                                        type="text"
                                        value={settings.social_links.whatsapp}
                                        onChange={(e) => updateSocial('whatsapp', e.target.value)}
                                        placeholder="Link ou número"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Instagram URL</label>
                                    <Input
                                        type="url"
                                        value={settings.social_links.instagram}
                                        onChange={(e) => updateSocial('instagram', e.target.value)}
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Facebook URL</label>
                                    <Input
                                        type="url"
                                        value={settings.social_links.facebook}
                                        onChange={(e) => updateSocial('facebook', e.target.value)}
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">YouTube URL</label>
                                    <Input
                                        type="url"
                                        value={settings.social_links.youtube}
                                        onChange={(e) => updateSocial('youtube', e.target.value)}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* HOME TAB */}
                {activeTab === 'home' && (
                    <div className="space-y-8">
                        {/* ANNOUNCEMENT BAR */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl">Barra de Anúncio (Topo)</CardTitle>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.home_layout.announcement_bar?.enabled}
                                        onChange={(e) => updateHome('announcement_bar', { ...settings.home_layout.announcement_bar, enabled: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </CardHeader>
                            <CardContent className="pt-6 grid gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Texto do Anúncio</label>
                                    <Input
                                        value={settings.home_layout.announcement_bar?.text}
                                        onChange={(e) => updateHome('announcement_bar', { ...settings.home_layout.announcement_bar, text: e.target.value })}
                                        placeholder="Ex: Inscrições abertas para o curso!"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Link (opcional)</label>
                                    <Input
                                        value={settings.home_layout.announcement_bar?.link}
                                        onChange={(e) => updateHome('announcement_bar', { ...settings.home_layout.announcement_bar, link: e.target.value })}
                                        placeholder="/projetos ou https://..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Cor de Fundo</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={settings.home_layout.announcement_bar?.background_color}
                                                onChange={(e) => updateHome('announcement_bar', { ...settings.home_layout.announcement_bar, background_color: e.target.value })}
                                                className="h-10 w-10 p-1 rounded border overflow-hidden cursor-pointer"
                                            />
                                            <Input
                                                value={settings.home_layout.announcement_bar?.background_color}
                                                onChange={(e) => updateHome('announcement_bar', { ...settings.home_layout.announcement_bar, background_color: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Cor do Texto</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={settings.home_layout.announcement_bar?.text_color}
                                                onChange={(e) => updateHome('announcement_bar', { ...settings.home_layout.announcement_bar, text_color: e.target.value })}
                                                className="h-10 w-10 p-1 rounded border overflow-hidden cursor-pointer"
                                            />
                                            <Input
                                                value={settings.home_layout.announcement_bar?.text_color}
                                                onChange={(e) => updateHome('announcement_bar', { ...settings.home_layout.announcement_bar, text_color: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* HERO SECTION CONFIG */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl">Hero (Banner Principal)</CardTitle>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.home_layout.show_hero}
                                        onChange={(e) => updateHome('show_hero', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[0, 1, 2].map((idx) => (
                                        <div key={idx} className="space-y-3 p-4 bg-muted/20 rounded-xl border border-dashed text-center">
                                            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Slide {idx + 1}</p>
                                            <ImageUploader
                                                value={displaySlides[idx]?.image || ''}
                                                onChange={(url) => updateHeroSlide(idx, 'image', url)}
                                                bucket="site-assets"
                                                height="h-32"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Título Principal</label>
                                        <Input
                                            value={settings.home_layout.hero_title}
                                            onChange={(e) => updateHome('hero_title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subtítulo</label>
                                        <Input
                                            value={settings.home_layout.hero_subtitle}
                                            onChange={(e) => updateHome('hero_subtitle', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Texto Adicional</label>
                                    <textarea
                                        value={settings.home_layout.hero_text}
                                        onChange={(e) => updateHome('hero_text', e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        rows={2}
                                    />
                                </div>

                                <div className="bg-muted/30 p-4 rounded-xl space-y-4">
                                    <h4 className="text-sm font-semibold text-foreground">Botões de Ação</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Texto Botão 1"
                                                value={settings.home_layout.hero_button_1?.text || ''}
                                                onChange={(e) => updateHome('hero_button_1', { ...settings.home_layout.hero_button_1, text: e.target.value })}
                                            />
                                            <Input
                                                placeholder="Link Botão 1"
                                                value={settings.home_layout.hero_button_1?.url || ''}
                                                onChange={(e) => updateHome('hero_button_1', { ...settings.home_layout.hero_button_1, url: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Texto Botão 2"
                                                value={settings.home_layout.hero_button_2?.text || ''}
                                                onChange={(e) => updateHome('hero_button_2', { ...settings.home_layout.hero_button_2, text: e.target.value })}
                                            />
                                            <Input
                                                placeholder="Link Botão 2"
                                                value={settings.home_layout.hero_button_2?.url || ''}
                                                onChange={(e) => updateHome('hero_button_2', { ...settings.home_layout.hero_button_2, url: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* MISSION SECTION */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl">Seção Missão</CardTitle>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.home_layout.show_mission}
                                        onChange={(e) => updateHome('show_mission', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <Input
                                    placeholder="Título da Seção"
                                    value={settings.home_layout.mission_title}
                                    onChange={(e) => updateHome('mission_title', e.target.value)}
                                />
                                <textarea
                                    placeholder="Texto descritivo..."
                                    value={settings.home_layout.mission_text}
                                    onChange={(e) => updateHome('mission_text', e.target.value)}
                                    className="flex w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={4}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Texto do Botão"
                                        value={settings.home_layout.mission_button?.text || ''}
                                        onChange={(e) => updateHome('mission_button', { ...settings.home_layout.mission_button, text: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Link do Botão"
                                        value={settings.home_layout.mission_button?.url || ''}
                                        onChange={(e) => updateHome('mission_button', { ...settings.home_layout.mission_button, url: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* QUOTE SECTION */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl">Seção Citação</CardTitle>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.home_layout.show_quote}
                                        onChange={(e) => updateHome('show_quote', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <Input
                                    placeholder="Título (ex: Nossa Missão)"
                                    value={settings.home_layout.quote_title}
                                    onChange={(e) => updateHome('quote_title', e.target.value)}
                                />
                                <textarea
                                    placeholder="Frase ou Citação..."
                                    value={settings.home_layout.quote_text}
                                    onChange={(e) => updateHome('quote_text', e.target.value)}
                                    className="flex w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={3}
                                />
                            </CardContent>
                        </Card>

                        {/* MANIFESTO SECTION */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Seção Manifesto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    placeholder="Título do Manifesto"
                                    value={settings.home_layout.manifesto_title}
                                    onChange={(e) => updateHome('manifesto_title', e.target.value)}
                                />
                                <textarea
                                    placeholder="Texto do manifesto..."
                                    value={settings.home_layout.manifesto_text}
                                    onChange={(e) => updateHome('manifesto_text', e.target.value)}
                                    className="flex w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={5}
                                />
                            </CardContent>
                        </Card>

                        {/* PARTNERS SECTION */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl">Parceiros & Apoio</CardTitle>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.home_layout.show_partners}
                                        onChange={(e) => updateHome('show_partners', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <Input
                                    placeholder="Título da Seção (ex: Nossos Parceiros)"
                                    value={settings.home_layout.partners_title}
                                    onChange={(e) => updateHome('partners_title', e.target.value)}
                                />

                                <div className="space-y-4">
                                    {settings.home_layout.partners?.map((partner: any, idx: number) => (
                                        <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 bg-muted/20 border rounded-xl items-start relative group">
                                            <div className="w-24 shrink-0">
                                                <ImageUploader
                                                    value={partner.logo}
                                                    onChange={(url) => updatePartner(idx, 'logo', url)}
                                                    bucket="site-assets"
                                                    height="h-24"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-3 w-full">
                                                <Input
                                                    placeholder="Nome do Parceiro"
                                                    value={partner.name}
                                                    onChange={(e) => updatePartner(idx, 'name', e.target.value)}
                                                />
                                                <Input
                                                    placeholder="Link do Site (opcional)"
                                                    value={partner.url}
                                                    onChange={(e) => updatePartner(idx, 'url', e.target.value)}
                                                />
                                            </div>
                                            <button
                                                onClick={() => removePartner(idx)}
                                                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <Button onClick={addPartner} variant="outline" className="w-full border-dashed border-2 py-8">
                                        <Plus className="w-4 h-4 mr-2" /> Adicionar Parceiro
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* BLOG SELECTION */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl">Saberes em Destaque</CardTitle>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.home_layout.show_blog}
                                        onChange={(e) => updateHome('show_blog', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="bg-muted/30 p-4 rounded-xl max-h-60 overflow-y-auto border border-border/50">
                                    <p className="text-sm font-medium text-muted-foreground mb-4">Selecione os artigos para exibir na Home:</p>
                                    <div className="space-y-3">
                                        {blogs.map((blog) => (
                                            <label key={blog.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.home_layout.featured_blogs?.includes(blog.id)}
                                                    onChange={(e) => {
                                                        const current = settings.home_layout.featured_blogs || [];
                                                        if (e.target.checked) {
                                                            updateHome('featured_blogs', [...current, blog.id]);
                                                        } else {
                                                            updateHome('featured_blogs', current.filter((id: string) => id !== blog.id));
                                                        }
                                                    }}
                                                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                                                />
                                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{blog.title}</span>
                                            </label>
                                        ))}
                                        {blogs.length === 0 && <span className="text-sm text-muted-foreground">Nenhum artigo publicado encontrado.</span>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* ABOUT TAB */}
                {activeTab === 'about' && (
                    <div className="space-y-4">
                        {/* HERO */}
                        <CollapsibleSection
                            title="Hero (Banner Principal)"
                            subtitle="Imagem de destaque e título principal da página sobre."
                            isVisible={settings.about_layout?.show_hero}
                            onVisibilityChange={(checked) => updateAbout('show_hero', checked)}
                            defaultOpen={true}
                        >
                            <div className="space-y-6">
                                <div className="p-4 border border-dashed rounded-lg bg-muted/20 w-full animate-in fade-in zoom-in duration-300">
                                    <div className="w-full max-w-md mx-auto">
                                        <ImageUploader
                                            value={settings.about_layout?.hero_image || ''}
                                            onChange={(url) => updateAbout('hero_image', url)}
                                            bucket="site-assets"
                                            height="h-52"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3 text-center">Imagem de fundo do banner (Recomendado: 1920x1080px)</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Título Principal</label>
                                        <Input
                                            value={settings.about_layout?.hero_title || ''}
                                            onChange={(e) => updateAbout('hero_title', e.target.value)}
                                            placeholder="Ex: Nossa Jornada"
                                            className="text-lg font-semibold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subtítulo</label>
                                        <Input
                                            value={settings.about_layout?.hero_subtitle || ''}
                                            onChange={(e) => updateAbout('hero_subtitle', e.target.value)}
                                            placeholder="Uma frase curta de impacto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* HISTORY */}
                        <CollapsibleSection
                            title="História e Identidade"
                            subtitle="Conte sua história e destaque sua origem."
                            isVisible={settings.about_layout?.show_history}
                            onVisibilityChange={(checked) => updateAbout('show_history', checked)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 order-2 md:order-1">
                                    <Input
                                        placeholder="Tag (ex: Nossa História)"
                                        value={settings.about_layout?.history_tag || ''}
                                        onChange={(e) => updateAbout('history_tag', e.target.value)}
                                        className="w-1/2"
                                    />
                                    <Input
                                        placeholder="Título da Seção"
                                        value={settings.about_layout?.history_title || ''}
                                        onChange={(e) => updateAbout('history_title', e.target.value)}
                                        className="font-semibold text-lg"
                                    />
                                    <textarea
                                        placeholder="Texto principal da história..."
                                        value={settings.about_layout?.history_text || ''}
                                        onChange={(e) => updateAbout('history_text', e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]"
                                    />
                                </div>
                                <div className="order-1 md:order-2 space-y-2">
                                    <p className="text-sm font-medium mb-2">Imagem Lateral</p>
                                    <div className="rounded-xl overflow-hidden shadow-sm border">
                                        <ImageUploader
                                            value={settings.about_layout?.history_image || ''}
                                            onChange={(url) => updateAbout('history_image', url)}
                                            bucket="site-assets"
                                            height="h-64"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 p-5 bg-[#f8f2d8]/30 rounded-xl border border-[#f8f2d8] space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                                    <p className="text-sm font-semibold text-primary-dark">Caixa de Destaque</p>
                                </div>
                                <Input
                                    placeholder="Título do Destaque"
                                    value={settings.about_layout?.history_highlight_title || ''}
                                    onChange={(e) => updateAbout('history_highlight_title', e.target.value)}
                                    className="bg-white/80"
                                />
                                <textarea
                                    placeholder="Texto do Destaque..."
                                    value={settings.about_layout?.history_highlight_text || ''}
                                    onChange={(e) => updateAbout('history_highlight_text', e.target.value)}
                                    className="flex w-full rounded-md border border-input bg-white/80 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                                />
                            </div>
                        </CollapsibleSection>

                        {/* MISSION */}
                        <CollapsibleSection
                            title="Missão (Faixa Vermelha)"
                            subtitle="A seção de alto impacto visual com a frase principal."
                            isVisible={settings.about_layout?.show_mission}
                            onVisibilityChange={(checked) => updateAbout('show_mission', checked)}
                        >
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Citação Principal (Grande)</label>
                                    <textarea
                                        value={settings.about_layout?.mission_quote || ''}
                                        onChange={(e) => updateAbout('mission_quote', e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-white/50 px-3 py-2 text-lg font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Texto Secundário</label>
                                    <textarea
                                        value={settings.about_layout?.mission_text || ''}
                                        onChange={(e) => updateAbout('mission_text', e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* VALUES */}
                        <CollapsibleSection
                            title="Valores Fundamentais"
                            subtitle="Liste os valores que definem a organização."
                            isVisible={settings.about_layout?.show_values}
                            onVisibilityChange={(checked) => updateAbout('show_values', checked)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <Input
                                    placeholder="Título da Seção de Valores"
                                    value={settings.about_layout?.values_title || ''}
                                    onChange={(e) => updateAbout('values_title', e.target.value)}
                                    className="font-semibold"
                                />
                                <Input
                                    placeholder="Subtítulo"
                                    value={settings.about_layout?.values_subtitle || ''}
                                    onChange={(e) => updateAbout('values_subtitle', e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Star className="w-4 h-4" /> Lista de Valores
                                </p>
                                <div className="grid grid-cols-1 gap-4">
                                    {settings.about_layout?.values_list?.map((val: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-white border rounded-xl shadow-sm relative group space-y-4 hover:shadow-md transition-shadow">
                                            <div className="flex gap-6 items-start">
                                                <div className="w-1/4 space-y-2">
                                                    <label className="text-xs font-semibold text-muted-foreground">Ícone</label>
                                                    <IconPicker
                                                        value={val.icon || 'Star'}
                                                        onChange={(icon) => updateValueItem(idx, 'icon', icon)}
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <Input
                                                        placeholder="Título do Valor"
                                                        value={val.title || ''}
                                                        onChange={(e) => updateValueItem(idx, 'title', e.target.value)}
                                                        className="font-medium"
                                                    />
                                                    <textarea
                                                        placeholder="Descrição do valor..."
                                                        value={val.description || ''}
                                                        onChange={(e) => updateValueItem(idx, 'description', e.target.value)}
                                                        className="flex w-full rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px]"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newList = [...settings.about_layout.values_list].filter((_, i) => i !== idx);
                                                    updateAbout('values_list', newList);
                                                }}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    onClick={() => updateAbout('values_list', [...(settings.about_layout.values_list || []), { icon: 'Star', title: '', description: '' }])}
                                    variant="outline"
                                    className="w-full border-dashed py-6 hover:bg-gray-50 hover:border-primary/50 hover:text-primary transition-all"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Adicionar Novo Valor
                                </Button>
                            </div>
                        </CollapsibleSection>

                        {/* TERRITORIES */}
                        <CollapsibleSection
                            title="Territórios"
                            subtitle="Regiões onde a organização atua."
                            isVisible={settings.about_layout?.show_territories}
                            onVisibilityChange={(checked) => updateAbout('show_territories', checked)}
                        >
                            <Input
                                placeholder="Título da Seção de Territórios"
                                value={settings.about_layout?.territories_title || ''}
                                onChange={(e) => updateAbout('territories_title', e.target.value)}
                                className="mb-6 font-semibold"
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        {settings.about_layout?.territories_list?.map((terr: any, idx: number) => (
                                            <div key={idx} className="p-4 bg-white border rounded-xl relative group space-y-2 hover:border-primary/30 transition-colors">
                                                <Input
                                                    placeholder="Região (ex: Bahia)"
                                                    value={terr.region || ''}
                                                    onChange={(e) => updateTerritoryItem(idx, 'region', e.target.value)}
                                                    className="font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary shadow-none"
                                                />
                                                <textarea
                                                    placeholder="Descrição da atuação nesta região..."
                                                    value={terr.description || ''}
                                                    onChange={(e) => updateTerritoryItem(idx, 'description', e.target.value)}
                                                    className="flex w-full rounded-md bg-transparent px-0 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] resize-none"
                                                    rows={2}
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newList = [...settings.about_layout.territories_list].filter((_, i) => i !== idx);
                                                        updateAbout('territories_list', newList);
                                                    }}
                                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={() => updateAbout('territories_list', [...(settings.about_layout.territories_list || []), { region: '', description: '' }])}
                                        variant="ghost"
                                        className="w-full border border-dashed text-muted-foreground hover:text-primary hover:border-primary/50"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Adicionar Território
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Imagem do Mapa</p>
                                    <div className="bg-muted/10 rounded-xl p-2 border">
                                        <ImageUploader
                                            value={settings.about_layout?.territories_map_image || ''}
                                            onChange={(url) => updateAbout('territories_map_image', url)}
                                            bucket="site-assets"
                                            height="h-full min-h-[300px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* TRANSPARENCY & DOCUMENTS */}
                        <CollapsibleSection
                            title="Transparência e Governança"
                            subtitle="Documentos públicos e informações sobre a equipe."
                            isVisible={settings.about_layout?.show_transparency}
                            onVisibilityChange={(checked) => updateAbout('show_transparency', checked)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <Input
                                    placeholder="Título (ex: Transparência)"
                                    value={settings.about_layout?.transparency_title || ''}
                                    onChange={(e) => updateAbout('transparency_title', e.target.value)}
                                />
                                <Input
                                    placeholder="Subtítulo"
                                    value={settings.about_layout?.transparency_subtitle || ''}
                                    onChange={(e) => updateAbout('transparency_subtitle', e.target.value)}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {settings.about_layout?.transparency_documents?.map((doc: any, idx: number) => (
                                            <div key={idx} className="flex gap-3 items-center p-3 border rounded-xl bg-gray-50/50 group hover:bg-white hover:shadow-sm transition-all">
                                                <div className="bg-red-50 p-2 rounded-lg text-red-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                                </div>
                                                <div className="flex-1 space-y-1 min-w-0">
                                                    <Input
                                                        placeholder="Nome do Documento"
                                                        value={doc.name}
                                                        onChange={(e) => {
                                                            const newDocs = [...settings.about_layout.transparency_documents];
                                                            newDocs[idx].name = e.target.value;
                                                            updateAbout('transparency_documents', newDocs);
                                                        }}
                                                        className="text-sm h-7 p-0 border-0 bg-transparent focus-visible:ring-0 font-medium"
                                                    />
                                                    <a href={doc.url} target="_blank" className="text-xs text-muted-foreground truncate block hover:text-primary hover:underline">{doc.url}</a>
                                                </div>
                                                <button onClick={() => removeDoc(idx)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 border border-dashed rounded-xl bg-gray-50/30 hover:bg-gray-50/80 transition-colors">
                                        <p className="text-sm font-medium mb-3">Adicionar Novo Documento:</p>
                                        <FileUploader
                                            value=""
                                            onChange={(url) => {
                                                if (url) addDoc("Novo Documento", url);
                                            }}
                                            bucket="site-assets"
                                            label="Clique para selecionar e enviar PDF"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4 border-t">
                                    <label className="text-sm font-medium">Texto Equipe/Governança</label>
                                    <textarea
                                        placeholder="Texto sobre a equipe..."
                                        value={settings.about_layout?.team_text || ''}
                                        onChange={(e) => updateAbout('team_text', e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* CTA */}
                        <CollapsibleSection
                            title="Chamada para Ação (Rodapé)"
                            subtitle="Convite final para o usuário."
                            isVisible={settings.about_layout?.show_cta}
                            onVisibilityChange={(checked) => updateAbout('show_cta', checked)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Título</label>
                                    <Input
                                        placeholder="Título CTA"
                                        value={settings.about_layout?.cta_title || ''}
                                        onChange={(e) => updateAbout('cta_title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subtítulo</label>
                                    <Input
                                        placeholder="Subtítulo CTA"
                                        value={settings.about_layout?.cta_subtitle || ''}
                                        onChange={(e) => updateAbout('cta_subtitle', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Texto do Botão</label>
                                    <Input
                                        placeholder="Texto do Botão"
                                        value={settings.about_layout?.cta_button_text || ''}
                                        onChange={(e) => updateAbout('cta_button_text', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Link do Botão</label>
                                    <Input
                                        placeholder="Link do Botão"
                                        value={settings.about_layout?.cta_button_url || ''}
                                        onChange={(e) => updateAbout('cta_button_url', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CollapsibleSection>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
