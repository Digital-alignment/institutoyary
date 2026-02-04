'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Loader2, Save, Globe, Smartphone, Home, Image as ImageIcon } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

export default function AdminSettingsPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'general' | 'social' | 'home'>('general')

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
            show_mission: true,
            hero_title: '',
            hero_subtitle: ''
        }
    })

    useEffect(() => {
        fetchSettings()
    }, [])

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
                    home_layout: data.home_layout || {}
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

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#941c1d]" /></div>

    return (
        <div className="max-w-4xl mx-auto space-y-6">
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
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'general' ? 'text-[#941c1d]' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Geral & Identidade
                    </div>
                    {activeTab === 'general' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#941c1d]" />}
                </button>
                <button
                    onClick={() => setActiveTab('social')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'social' ? 'text-[#941c1d]' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Contato & Social
                    </div>
                    {activeTab === 'social' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#941c1d]" />}
                </button>
                <button
                    onClick={() => setActiveTab('home')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'home' ? 'text-[#941c1d]' : 'text-gray-500 hover:text-gray-700'
                        }`}
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
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-medium text-gray-900">Seção Hero (Topo)</h3>
                                <p className="text-sm text-gray-500">Exibir o banner principal com vídeo/imagem.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.home_layout.show_hero}
                                    onChange={(e) => updateHome('show_hero', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#941c1d]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-medium text-gray-900">Seção Missão/Valores</h3>
                                <p className="text-sm text-gray-500">Exibir o bloco de manifesto e valores.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.home_layout.show_mission}
                                    onChange={(e) => updateHome('show_mission', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#941c1d]"></div>
                            </label>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-4">Textos da Home</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título do Hero</label>
                                    <input
                                        type="text"
                                        value={settings.home_layout.hero_title}
                                        onChange={(e) => updateHome('hero_title', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo do Hero</label>
                                    <input
                                        type="text"
                                        value={settings.home_layout.hero_subtitle}
                                        onChange={(e) => updateHome('hero_subtitle', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#941c1d] focus:ring-[#941c1d]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
