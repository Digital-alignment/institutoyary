import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    console.log('Migrating statuses...');
    
    const r1 = await supabase.from('projects').update({ project_status: 'Em execução' }).eq('project_status', 'Em Processo');
    console.log('Migrated Em Processo -> Em execução', r1.error ? r1.error : 'Success');
    
    const r2 = await supabase.from('projects').update({ project_status: 'Buscando apoiadores' }).eq('project_status', 'Publicado');
    console.log('Migrated Publicado -> Buscando apoiadores', r2.error ? r2.error : 'Success');
    
    const r3 = await supabase.from('projects').update({ project_status: 'Concluído' }).eq('project_status', 'Terminado');
    console.log('Migrated Terminado -> Concluído', r3.error ? r3.error : 'Success');
    
    console.log('Done.');
}
run();
