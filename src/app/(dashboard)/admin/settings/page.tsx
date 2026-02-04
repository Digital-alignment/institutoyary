'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Loader2, Save, Globe, Smartphone, Home, Plus, Trash2 } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

export default function AdminSettingsPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'general' | 'social' | 'home'>('general')
    const [blogs, setBlogs] = useState<any[]>([])

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
            featured_blogs: []
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
                        featured_blogs: data.home_layout?.featured_blogs || []
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
                    updated_at: new Date().toISOString()
                })

            if (error) throw error
            alert('Configurações salvas com sucesso!')
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message)
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

    // Ensure we have at least 3 empty slots if less
    const heroSlides = settings.home_layout.hero_slides || [];
    const displaySlides = [...heroSlides];
    while (displaySlides.length < 3) {
        displaySlides.push({ image: '', alt: '' });
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#941c1d]" /></div>

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-[#941c1d]">Configurações do Site</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-[#941c1d] text-white rounded-lg hover:bg-[#7a1617] transition-colors font-medium disabled:opacity-50 shadow-sm"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Salvar Alterações
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'general' ? 'text-[#941c1d]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Geral & Identidade
                    </div>
                    {activeTab === 'general' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#941c1d]" />}
                </button>
                <button
                    onClick={() => setActiveTab('social')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'social' ? 'text-[#941c1d]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Contato & Social
                    </div>
                    {activeTab === 'social' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#941c1d]" />}
                </button>
                <button
                    onClick={() => setActiveTab('home')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'home' ? 'text-[#941c1d]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Home Page
                    </div>
                    {activeTab === 'home' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#941c1d]" />}
                </button>
            </div>

            {/* Content */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">

                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Site</label>
                            <input
                                type="text"
                                value={settings.site_title}
                                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                placeholder="Ex: Instituto Yary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (SEO)</label>
                            <textarea
                                value={settings.site_description}
                                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                rows={3}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                placeholder="Descrição curta do site para aparecer no Google..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Logo do Site</label>
                            <div className="max-w-xs">
                                <ImageUploader
                                    value={settings.logo_url}
                                    onChange={(url) => setSettings({ ...settings, logo_url: url })}
                                    bucket="site-assets"
                                    height="h-32"
                                />
                                <p className="text-xs text-gray-500 mt-2">Recomendado: PNG transparente (512x512)</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SOCIAL TAB */}
                {activeTab === 'social' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
                            <input
                                type="email"
                                value={settings.social_links.email}
                                onChange={(e) => updateSocial('email', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Telefone</label>
                            <input
                                type="text"
                                value={settings.social_links.whatsapp}
                                onChange={(e) => updateSocial('whatsapp', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                placeholder="Link ou número"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                            <input
                                type="url"
                                value={settings.social_links.instagram}
                                onChange={(e) => updateSocial('instagram', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                            <input
                                type="url"
                                value={settings.social_links.facebook}
                                onChange={(e) => updateSocial('facebook', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                            <input
                                type="url"
                                value={settings.social_links.youtube}
                                onChange={(e) => updateSocial('youtube', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                            />
                        </div>
                    </div>
                )}

                {/* HOME TAB */}
                {activeTab === 'home' && (
                    <div className="space-y-8">
                        {/* HERO SECTION CONFIG */}
                        <div className="space-y-6 border-b border-gray-200 pb-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#941c1d]">1. Hero (Banner Principal)</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.home_layout.show_hero}
                                        onChange={(e) => updateHome('show_hero', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[#941c1d] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[0, 1, 2].map((idx) => (
                                    <div key={idx} className="space-y-2">
                                        <label className="block text-xs font-semibold uppercase text-gray-500">Imagem {idx + 1}</label>
                                        <ImageUploader
                                            value={displaySlides[idx]?.image || ''}
                                            onChange={(url) => updateHeroSlide(idx, 'image', url)}
                                            bucket="site-assets"
                                            height="h-32"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Título Principal</label>
                                        <input
                                            type="text"
                                            value={settings.home_layout.hero_title}
                                            onChange={(e) => updateHome('hero_title', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                                        <input
                                            type="text"
                                            value={settings.home_layout.hero_subtitle}
                                            onChange={(e) => updateHome('hero_subtitle', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Texto Adicional (Opcional)</label>
                                    <textarea
                                        value={settings.home_layout.hero_text}
                                        onChange={(e) => updateHome('hero_text', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                        rows={2}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                                    <div className="space-y-3">
                                        <span className="text-sm font-bold text-gray-900">Botão 1 (Primário)</span>
                                        <input
                                            type="text"
                                            placeholder="Texto"
                                            value={settings.home_layout.hero_button_1?.text || ''}
                                            onChange={(e) => updateHome('hero_button_1', { ...settings.home_layout.hero_button_1, text: e.target.value })}
                                            className="w-full rounded-md border-gray-300 text-sm mb-2"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Link (ex: /projetos)"
                                            value={settings.home_layout.hero_button_1?.url || ''}
                                            onChange={(e) => updateHome('hero_button_1', { ...settings.home_layout.hero_button_1, url: e.target.value })}
                                            className="w-full rounded-md border-gray-300 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <span className="text-sm font-bold text-gray-900">Botão 2 (Secundário)</span>
                                        <input
                                            type="text"
                                            placeholder="Texto"
                                            value={settings.home_layout.hero_button_2?.text || ''}
                                            onChange={(e) => updateHome('hero_button_2', { ...settings.home_layout.hero_button_2, text: e.target.value })}
                                            className="w-full rounded-md border-gray-300 text-sm mb-2"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Link (ex: /sobre)"
                                            value={settings.home_layout.hero_button_2?.url || ''}
                                            onChange={(e) => updateHome('hero_button_2', { ...settings.home_layout.hero_button_2, url: e.target.value })}
                                            className="w-full rounded-md border-gray-300 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MISSION SECTION */}
                        <div className="space-y-6 border-b border-gray-200 pb-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#941c1d]">2. Seção Missão (Introdução)</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.home_layout.show_mission}
                                        onChange={(e) => updateHome('show_mission', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[#941c1d] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Título da Seção"
                                    value={settings.home_layout.mission_title}
                                    onChange={(e) => updateHome('mission_title', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                />
                                <textarea
                                    placeholder="Texto descritivo..."
                                    value={settings.home_layout.mission_text}
                                    onChange={(e) => updateHome('mission_text', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                    rows={4}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Texto do Botão"
                                        value={settings.home_layout.mission_button?.text || ''}
                                        onChange={(e) => updateHome('mission_button', { ...settings.home_layout.mission_button, text: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Link do Botão"
                                        value={settings.home_layout.mission_button?.url || ''}
                                        onChange={(e) => updateHome('mission_button', { ...settings.home_layout.mission_button, url: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* QUOTE SECTION */}
                        <div className="space-y-6 border-b border-gray-200 pb-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#941c1d]">3. Seção Citação/Frase</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.home_layout.show_quote}
                                        onChange={(e) => updateHome('show_quote', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[#941c1d] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Título (ex: Nossa Missão)"
                                    value={settings.home_layout.quote_title}
                                    onChange={(e) => updateHome('quote_title', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                />
                                <textarea
                                    placeholder="Frase ou Citação..."
                                    value={settings.home_layout.quote_text}
                                    onChange={(e) => updateHome('quote_text', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* BLOG SELECTION */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#941c1d]">4. Saberes em Destaque</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.home_layout.show_blog}
                                        onChange={(e) => updateHome('show_blog', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[#941c1d] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                                <p className="text-sm font-medium text-gray-700 mb-3">Selecione os artigos para exibir na Home:</p>
                                <div className="space-y-2">
                                    {blogs.map((blog) => (
                                        <label key={blog.id} className="flex items-center gap-2">
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
                                                className="rounded border-gray-300 text-[#941c1d] focus:ring-[#941c1d]"
                                            />
                                            <span className="text-sm text-gray-700">{blog.title}</span>
                                        </label>
                                    ))}
                                    {blogs.length === 0 && <span className="text-sm text-gray-500">Nenhum artigo publicado encontrado.</span>}
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}
