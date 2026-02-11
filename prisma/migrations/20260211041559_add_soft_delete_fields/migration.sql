-- AlterTable
ALTER TABLE "habit_completions" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "mood_checkins" ADD COLUMN     "deleted_at" TIMESTAMP(3);
