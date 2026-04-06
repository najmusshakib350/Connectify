-- Enforce at most one image row per post: remove duplicates before unique index.
-- Keeps the row with lowest sort_order, then smallest id per post_id.
DELETE FROM "post_images" AS pi
WHERE EXISTS (
  SELECT 1
  FROM "post_images" AS pi2
  WHERE pi2.post_id = pi.post_id
    AND (
      pi2.sort_order < pi.sort_order
      OR (pi2.sort_order = pi.sort_order AND pi2.id < pi.id)
    )
);

-- CreateIndex
CREATE UNIQUE INDEX "post_images_post_id_key" ON "post_images"("post_id");
