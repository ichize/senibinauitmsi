-- Add an audience column to Announcement Web (text[])
ALTER TABLE "Announcement Web"
ADD COLUMN IF NOT EXISTS audience text[];

-- Optional: mark existing rows as public (homepage)
UPDATE "Announcement Web"
SET audience = ARRAY['public']
WHERE audience IS NULL;
