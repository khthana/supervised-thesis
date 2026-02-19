-- =============================================
-- Author: Wiraphat Prasomphong
-- Created: 26-01-2025
-- Last modified: 25-02-2025
-- Description: This file contains the SQL queries for the ce-learnify database.
-- =============================================

-- =============================================
-- Utility functions
-- ===============================
-- Function to update the updated_at column of a table
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- ===============================
-- =============================================

-- =============================================
-- Table creation
-- ===============================
-- Table: users
-- Description: This table stores information about users
CREATE TYPE user_role AS ENUM ('ANNOUNCER', 'INSTRUCTOR', 'LEARNER');
CREATE TABLE users (
  "user_id" serial PRIMARY KEY NOT NULL,
  "email" varchar(120) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "firstname_th" varchar(50),
  "lastname_th" varchar(50),
  "firstname_en" varchar(50) NOT NULL,
  "lastname_en" varchar(50) NOT NULL,
  "role" user_role NOT NULL,
  "is_verified" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
-- ===============================
-- Table: admins
-- Description: This table stores information about admins
CREATE TABLE admins (
  "user_id" int PRIMARY KEY,
  "is_root" boolean DEFAULT FALSE NOT NULL,
  "is_active" boolean DEFAULT TRUE NOT NULL,
  "created_by" int NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE,
  FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE CASCADE
);
CREATE TRIGGER set_timestamp_admins
BEFORE UPDATE ON admins
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
-- ===============================
-- Table: course_categories
-- Description: This table stores information about course categories
CREATE TABLE course_categories (
  "category_id" serial PRIMARY KEY,
  "name" varchar(70) UNIQUE NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TRIGGER set_timestamp_course_categories
BEFORE UPDATE ON course_categories
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
-- ===============================
-- Table: course_subcategories
-- Description: This table stores information about course subcategories
CREATE TABLE course_subcategories (
  "subcategory_id" serial PRIMARY KEY,
  "category_id" int NOT NULL,
  "name" varchar(70) UNIQUE NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY ("category_id") REFERENCES "course_categories"("category_id") ON DELETE CASCADE
);
CREATE TRIGGER set_timestamp_course_subcategories
BEFORE UPDATE ON course_subcategories
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
-- ===============================
-- Table: courses
-- Description: This table stores information about courses
CREATE TYPE course_type AS ENUM ('PUBLIC', 'PRIVATE', 'INTERNAL');
CREATE TABLE courses (
  "course_id" serial PRIMARY KEY,
  "subject_id" varchar(255) UNIQUE,
  "name" text NOT NULL,
  "description" text,
  "category_id" int NOT NULL,
  "subcategory_id" int NOT NULL,
  "type" course_type DEFAULT 'PUBLIC' NOT NULL,
  "language" varchar(5) NOT NULL,
  "created_by" int NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY ("category_id") REFERENCES "course_categories"("category_id") ON DELETE CASCADE,
  FOREIGN KEY ("subcategory_id") REFERENCES "course_subcategories"("subcategory_id") ON DELETE CASCADE,
  FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE CASCADE
);
CREATE TRIGGER set_timestamp_courses
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
-- ===============================
-- Table: course_cycles
-- Description: This table stores information about course cycles
CREATE TYPE course_cycle_status AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
CREATE TABLE course_cycles (
  "cycle_id" serial PRIMARY KEY,
  "course_id" int NOT NULL,
  "course_start" date NOT NULL,
  "course_end" date NOT NULL,
  "enroll_start" date NOT NULL,
  "enroll_end" date NOT NULL,
  "max_enrollments" int NOT NULL,
  "is_restrict_enroll" boolean DEFAULT FALSE NOT NULL,
  "status" course_cycle_status DEFAULT 'UPCOMING' NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE
);
CREATE TRIGGER set_timestamp_course_cycles
BEFORE UPDATE ON course_cycles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
-- ===============================
-- Table: course_enrollments
-- Description: This table stores information about course enrollments
CREATE TYPE course_enrollment_status AS ENUM ('ENROLLED', 'COMPLETED', 'DROPPED');
CREATE TABLE course_enrollments (
  "user_id" int NOT NULL,
  "cycle_id" int NOT NULL,
  "status" course_enrollment_status DEFAULT 'ENROLLED' NOT NULL,
  "completed_at" TIMESTAMP NULL,
  "last_enrolled_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "last_dropped_at" TIMESTAMP DEFAULT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("cycle_id", "user_id"),
  FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE,
  FOREIGN KEY ("cycle_id") REFERENCES "course_cycles"("cycle_id") ON DELETE CASCADE
);
CREATE TRIGGER set_timestamp_course_enrollments
BEFORE UPDATE ON course_enrollments
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
-- ===============================
-- Table: course_parts
-- Description: This table stores information about course parts
CREATE TABLE course_parts (
  "cycle_id" int NOT NULL,
  "part_id" serial NOT NULL,
  "text" text NOT NULL,
  "parts_sequence" int NOT NULL,
  "requires_previous_part" boolean DEFAULT FALSE NOT NULL,
  PRIMARY KEY ("cycle_id", "part_id"),
  FOREIGN KEY ("cycle_id") REFERENCES "course_cycles"("cycle_id") ON DELETE CASCADE
);
-- ===============================
-- Table: course_contents
-- Description: This table stores information about course contents
CREATE TABLE course_contents (
  "cycle_id" int NOT NULL,
  "reference_id" int NOT NULL,
  "reference_type" varchar(120) NOT NULL,
  "part_id" int,
  "reference_settings" json,
  "sequence" int NOT NULL,
  PRIMARY KEY ("cycle_id", "reference_id", "reference_type"),
  FOREIGN KEY ("cycle_id", "part_id") REFERENCES "course_parts"("cycle_id", "part_id") ON DELETE CASCADE,
  FOREIGN KEY ("cycle_id") REFERENCES "course_cycles"("cycle_id") ON DELETE CASCADE
);
-- ===============================
-- Table: content_blog
-- Description: This table stores information about blog content
CREATE TYPE content_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TABLE content_blog (
  "blog_id" serial PRIMARY KEY,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "status" content_status NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TRIGGER set_timestamp_content_blog
BEFORE UPDATE ON content_blog
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
-- ===============================
-- Table: content_quizzes
-- Description: This table stores information about quizzes
CREATE TABLE content_quizzes (
  "quiz_id" serial PRIMARY KEY,
  "total_points" int NOT NULL DEFAULT 0,
  "time_limit" int NOT NULL DEFAULT 0,
  "status" content_status NOT NULL
);
-- Table: quiz_questions
-- Description: This table stores information about quiz questions
CREATE TYPE question_type AS ENUM ('MULTIPLE_CHOICE', 'TEXT', 'CHECKBOX');
CREATE TABLE quiz_questions (
  "quiz_id" int NOT NULL,
  "question_id" serial PRIMARY KEY,
  "question_text" text NOT NULL,
  "point" int NOT NULL DEFAULT 0,
  "type" question_type NOT NULL,
  FOREIGN KEY ("quiz_id") REFERENCES "content_quizzes"("quiz_id") ON DELETE CASCADE
);
-- Table: quiz_options
-- Description: This table stores information about quiz options
CREATE TABLE quiz_options (
  "question_id" int NOT NULL,
  "option_id" serial PRIMARY KEY,
  "option_text" text NOT NULL,
  "is_correct" boolean DEFAULT FALSE NOT NULL,
  FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("question_id") ON DELETE CASCADE
);
-- Table: quiz_submissions
-- Description: This table stores information about quiz submissions
CREATE TABLE quiz_submissions (
  "user_id" int NOT NULL,
  "quiz_id" int NOT NULL,
  "attempt_number" int NOT NULL DEFAULT 1,
  "score" int NOT NULL DEFAULT 0,
  "submitted_at" TIMESTAMP NOT NULL,
  "is_validated" boolean DEFAULT FALSE NOT NULL,
  PRIMARY KEY ("user_id", "quiz_id", "attempt_number"),
  FOREIGN KEY ("quiz_id") REFERENCES "content_quizzes"("quiz_id") ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);
-- Table: quiz_answers
-- Description: This table stores information about quiz answers
CREATE TABLE quiz_answers (
  "user_id" int NOT NULL,
  "quiz_id" int NOT NULL,
  "attempt_number" int NOT NULL,
  "question_id" int NOT NULL,
  "text_answer" text,
  "score" int NOT NULL DEFAULT 0,
  "submitted_at" TIMESTAMP NOT NULL,
  PRIMARY KEY ("user_id", "quiz_id", "attempt_number", "question_id"),
  FOREIGN KEY ("quiz_id") REFERENCES "content_quizzes"("quiz_id") ON DELETE CASCADE,
  FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("question_id") ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);
-- Table: quiz_answer_options
-- Description: This table stores information about quiz answer options
CREATE TABLE quiz_answer_options (
  "user_id" int NOT NULL,
  "quiz_id" int NOT NULL,
  "attempt_number" int NOT NULL,
  "question_id" int NOT NULL,
  "option_id" int NOT NULL,
  PRIMARY KEY ("user_id", "quiz_id", "attempt_number", "question_id", "option_id"),
  FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("question_id") ON DELETE CASCADE,
  FOREIGN KEY ("option_id") REFERENCES "quiz_options"("option_id") ON DELETE CASCADE,
  FOREIGN KEY ("quiz_id") REFERENCES "content_quizzes"("quiz_id") ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);
-- ===============================
-- Table: content_assignments
-- Description: This table stores information about assignments
CREATE TYPE assignment_type AS ENUM ('UPLOAD', 'TEXT');
CREATE TABLE content_assignments (
  "blog_id" int NOT NULL,
  "assignment_id" serial PRIMARY KEY,
  "total_points" int NOT NULL DEFAULT 0,
  "type" assignment_type NOT NULL,
  FOREIGN KEY ("blog_id") REFERENCES "content_blog"("blog_id") ON DELETE CASCADE
);
-- Table: assignment_submissions
-- Description: This table stores information about assignment submissions
CREATE TABLE assignment_submissions (
  "user_id" int NOT NULL,
  "assignment_id" int NOT NULL,
  "attempt_number" int NOT NULL DEFAULT 1,
  "score" int NOT NULL DEFAULT 0,
  "answer" text,
  PRIMARY KEY ("user_id", "assignment_id", "attempt_number"),
  FOREIGN KEY ("assignment_id") REFERENCES "content_assignments"("assignment_id") ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);
-- ===============================
-- Table: media_files
-- Description: This table stores information about media files
CREATE TABLE media_files (
  "reference_id" int NOT NULL,
  "reference_type" varchar(120) NOT NULL,
  "reference_sequence" int NOT NULL,
  "reference_settings" json,
  "url" text NOT NULL,
  "type" varchar(120) NOT NULL,
  "mime_type" varchar(120) NOT NULL,
  "size" int NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("reference_id", "reference_type")
);
CREATE TRIGGER set_timestamp_media_files
BEFORE UPDATE ON media_files
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
-- ===============================
-- Table: announcements
-- Description: This table stores information about announcements
CREATE TABLE announcements (
  "blog_id" int NOT NULL,
  "reference_id" int NOT NULL,
  "reference_type" varchar(120) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("blog_id", "reference_id", "reference_type"),
  FOREIGN KEY ("blog_id") REFERENCES "content_blog"("blog_id") ON DELETE CASCADE
);
CREATE TRIGGER set_timestamp_announcements
BEFORE UPDATE ON announcements
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
-- ===============================
-- =============================================

-- =============================================
-- Pre insertion
-- ===============================
-- Pre insert default admin user
INSERT INTO users (
  user_id,
  email,
  password_hash,
  firstname_en,
  lastname_en,
  role,
  is_verified
) VALUES (
  1,
  'noreply.learnifyplatform@gmail.com',
  '$argon2id$v=19$m=20480,t=2,p=1$cwYn+pAvdKHG1hRyM6uQGefuAsfXdKIViSopZdH7TUo$GAGkoxhU+oe7xp0znOR8b4y3JxeEfZwG2p16plGp9tk',
  'Admin',
  'AtLearnify',
  'ANNOUNCER',
  TRUE
);

INSERT INTO admins (
  user_id,
  is_root,
  is_active,
  created_by
) VALUES (
  1,
  TRUE,
  TRUE,
  1
);

SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
-- ===============================
-- =============================================
