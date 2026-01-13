
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkColumn() {
    const { data, error } = await supabase
        .from('blogs')
        .select('category')
        .limit(1)

    if (error) {
        console.error('Error selecting category:', error.message)
        // If error says column does not exist, we know.
    } else {
        console.log('Category column exists. Data:', data)
    }
}

checkColumn()
