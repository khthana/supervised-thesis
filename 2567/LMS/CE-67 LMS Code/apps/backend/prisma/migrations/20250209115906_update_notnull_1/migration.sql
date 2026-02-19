/*
  Warnings:

  - Made the column `is_root` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `course_categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `course_categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_restrict_enroll` on table `course_cycles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `course_cycles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `course_cycles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `course_cycles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `completed_at` on table `course_enrollments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_enrolled_at` on table `course_enrollments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_dropped_at` on table `course_enrollments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `course_enrollments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `course_subcategories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `course_subcategories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `language` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `media_files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `media_files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `media_references` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `media_references` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_verified` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "is_root" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "course_categories" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "course_cycles" ALTER COLUMN "is_restrict_enroll" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "course_enrollments" ALTER COLUMN "completed_at" SET NOT NULL,
ALTER COLUMN "last_enrolled_at" SET NOT NULL,
ALTER COLUMN "last_dropped_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "course_subcategories" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "language" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "media_files" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "media_references" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "is_verified" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
