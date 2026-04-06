-- Add columns (first_name nullable until backfilled)
ALTER TABLE "users" ADD COLUMN "first_name" TEXT;
ALTER TABLE "users" ADD COLUMN "last_name" TEXT;

-- Backfill existing users (derive from email local-part; fallback label)
UPDATE "users"
SET "first_name" = COALESCE(
  NULLIF(trim(split_part("email", '@', 1)), ''),
  'User'
)
WHERE "first_name" IS NULL;

ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL;

CREATE INDEX "users_first_name_last_name_idx" ON "users"("first_name", "last_name");
