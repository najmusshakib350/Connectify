-- CreateEnum
CREATE TYPE "PostReactionType" AS ENUM ('LIKE', 'HAHA', 'LOVE');

-- AlterTable
ALTER TABLE "post_likes" ADD COLUMN     "reaction_type" "PostReactionType" NOT NULL DEFAULT 'LIKE';

-- CreateIndex
CREATE INDEX "post_likes_post_id_reaction_type_idx" ON "post_likes"("post_id", "reaction_type");
