-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id int8 PRIMARY KEY DEFAULT 1,
    site_title text DEFAULT 'Instituto Yary',
    site_description text,
    logo_url text,
    social_links jsonb DEFAULT '{}'::jsonb,
    contact_info jsonb DEFAULT '{}'::jsonb,
    home_layout jsonb DEFAULT '{"show_hero": true, "show_mission": true}'::jsonb,
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row if not exists
INSERT INTO public.site_settings (id, site_title)
VALUES (1, 'Instituto Yary')
ON CONFLICT (id) DO NOTHING;

-- Open RLS (since it's public read, admin write)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view site settings" ON public.site_settings
    FOR SELECT TO public USING (true);

-- Allow admin full access
CREATE POLICY "Admins can update site settings" ON public.site_settings
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create storage bucket for site assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for site-assets (Public Read, Admin Write)
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'site-assets');

CREATE POLICY "Admin Upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'site-assets' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin Update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'site-assets' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
