-- Create a new storage bucket for CMS images
insert into storage.buckets (id, name, public)
values ('cms-images', 'cms-images', true);

-- Allow public access to view files (read)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'cms-images' );

-- Allow authenticated users to upload files (insert)
create policy "Authenticated users can upload images"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'cms-images' );

-- Allow authenticated users to update their files (update)
create policy "Authenticated users can update images"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'cms-images' );

-- Allow authenticated users to delete files (delete)
create policy "Authenticated users can delete images"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'cms-images' );
