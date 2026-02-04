'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Loader2, FileText, Eye, Calendar, AlertCircle } from 'lucide-react'

// Placeholder type - adjust based on actual schema
type FormSubmission = {
    id: string
    created_at: string
    user_id?: string
    data: any // JSON data
    status?: string
}

export default function AdminFormsPage() {
    const supabase = createClient()
    const [submissions, setSubmissions] = useState<FormSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tableName, setTableName] = useState('forms_jornada') // Default guess

    useEffect(() => {
        fetchSubmissions()
    }, [])

    const fetchSubmissions = async () => {
        setLoading(true)
        setError(null)

        // Try to fetch from the guessed table
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error(`Error fetching from ${tableName}:`, error)
            setError(`Failed to fetch from table '${tableName}'. The table might not exist or permissions are denied.`)
        } else {
            setSubmissions(data || [])
        }
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#941c1d]">Formulários</h1>
                    <p className="text-gray-500 mt-2">Visualize os formulários enviados.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#941c1d]" />
                </div>
            ) : (
                <div className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-100">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Erro de Conexão</p>
                                <p className="text-sm">{error}</p>
                                <p className="text-xs mt-2 text-red-500">
                                    Please verify the database table name for forms.
                                    Update <code>src/app/(dashboard)/admin/forms/page.tsx</code> with the correct table name.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {!error && submissions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Nenhum formulário encontrado na tabela <strong>{tableName}</strong>.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {submissions.map((sub) => (
                                    <div key={sub.id} className="p-4 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-[#941c1d]/10 rounded-lg text-[#941c1d] mt-1">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Envio #{sub.id.slice(0, 8)}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(sub.created_at).toLocaleDateString()}
                                                </div>
                                                {/* Preview some data if available */}
                                                {sub.data && (
                                                    <div className="text-sm text-gray-600 mt-2 line-clamp-1">
                                                        {JSON.stringify(sub.data)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                                <Eye className="w-4 h-4" />
                                                Ver Detalhes
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
