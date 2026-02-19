-- CreateEnum
CREATE TYPE "course_cycle_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "course_enrollment_status" AS ENUM ('ENROLLED', 'COMPLETED', 'DROPPED');

-- CreateEnum
CREATE TYPE "course_language" AS ENUM ('TH', 'EN');

-- CreateEnum
CREATE TYPE "course_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "course_type" AS ENUM ('PUBLIC', 'PRIVATE', 'INTERNAL');

-- CreateEnum
CREATE TYPE "media_type" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ANNOUCER', 'INSTRUCTOR', 'LEARNER');

-- CreateTable
CREATE TABLE "admins" (
    "user_id" INTEGER NOT NULL,
    "is_root" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "course_categories" (
    "name_en" VARCHAR(255) NOT NULL,
    "name_th" VARCHAR(255) NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_categories_pkey" PRIMARY KEY ("name_en")
);

-- CreateTable
CREATE TABLE "course_cycles" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "date_start" DATE NOT NULL,
    "date_end" DATE NOT NULL,
    "max_learners" INTEGER NOT NULL,
    "is_restrict_enroll" BOOLEAN DEFAULT false,
    "status" "course_cycle_status" DEFAULT 'DRAFT',
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_enrollments" (
    "course_id" INTEGER NOT NULL,
    "cycle_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "course_enrollment_status" DEFAULT 'ENROLLED',
    "completed_at" TIMESTAMP(6),
    "last_enrolled_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "last_dropped_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("course_id","cycle_id","user_id")
);

-- CreateTable
CREATE TABLE "course_subcategories" (
    "name_en" VARCHAR(255) NOT NULL,
    "category_name_en" VARCHAR(255) NOT NULL,
    "name_th" VARCHAR(255) NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_subcategories_pkey" PRIMARY KEY ("name_en")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category_name_en" VARCHAR(255) NOT NULL,
    "subcategory_name_en" VARCHAR(255) NOT NULL,
    "type" "course_type" DEFAULT 'PUBLIC',
    "status" "course_status" DEFAULT 'DRAFT',
    "language" "course_language" DEFAULT 'TH',
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses_internal" (
    "subject_id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "courses_internal_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "media_files" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" "media_type" NOT NULL,
    "mime_type" VARCHAR(50),
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_references" (
    "media_file_id" INTEGER NOT NULL,
    "media_sequence" INTEGER NOT NULL,
    "reference_id" INTEGER NOT NULL,
    "reference_type" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_references_pkey" PRIMARY KEY ("media_file_id","media_sequence","reference_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "firstname_th" VARCHAR(255),
    "lastname_th" VARCHAR(255),
    "firstname_en" VARCHAR(255) NOT NULL,
    "lastname_en" VARCHAR(255) NOT NULL,
    "role" "user_role" DEFAULT 'LEARNER',
    "is_verified" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_categories_name_th_key" ON "course_categories"("name_th");

-- CreateIndex
CREATE UNIQUE INDEX "course_subcategories_name_th_key" ON "course_subcategories"("name_th");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_cycles" ADD CONSTRAINT "course_cycles_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "course_cycles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_subcategories" ADD CONSTRAINT "course_subcategories_category_name_en_fkey" FOREIGN KEY ("category_name_en") REFERENCES "course_categories"("name_en") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_name_en_fkey" FOREIGN KEY ("category_name_en") REFERENCES "course_categories"("name_en") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_subcategory_name_en_fkey" FOREIGN KEY ("subcategory_name_en") REFERENCES "course_subcategories"("name_en") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courses_internal" ADD CONSTRAINT "courses_internal_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "media_references" ADD CONSTRAINT "media_references_media_file_id_fkey" FOREIGN KEY ("media_file_id") REFERENCES "media_files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
