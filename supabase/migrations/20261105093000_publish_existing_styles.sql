-- Publish all existing styles that have images and are not deleted
update public.styles
set is_published = true,
    updated_at = now()
where is_published = false
  and is_deleted = false
  and image_path is not null;

-- Also ensure all categories are active
update public.style_categories
set is_active = true
where is_active = false;
