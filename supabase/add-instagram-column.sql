-- Add instagram_url column to Announcement Web
ALTER TABLE "Announcement Web"
ADD COLUMN IF NOT EXISTS instagram_url text;

-- No-op for existing rows; set specific values if needed using UPDATE
-- Example (if you want to set it to a specific URL for a given id):
-- UPDATE "Announcement Web" SET instagram_url = 'https://www.instagram.com/p/POST_ID/' WHERE id = '...';
