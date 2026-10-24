
import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from your .env file.');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL connection error:', error.message);
});

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS learners (
      telegram_id TEXT PRIMARY KEY,
      language TEXT NOT NULL DEFAULT 'en'
        CHECK (language IN ('en', 'am', 'om')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      telegram_id TEXT NOT NULL
        REFERENCES learners(telegram_id) ON DELETE CASCADE,
      course_key TEXT NOT NULL,
      enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (telegram_id, course_key)
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      telegram_id TEXT NOT NULL
        REFERENCES learners(telegram_id) ON DELETE CASCADE,
      course_key TEXT NOT NULL,
      lesson_index INTEGER NOT NULL CHECK (lesson_index >= 0),
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (telegram_id, course_key, lesson_index)
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      telegram_id TEXT NOT NULL
        REFERENCES learners(telegram_id) ON DELETE CASCADE,
      course_key TEXT NOT NULL,
      lesson_index INTEGER NOT NULL CHECK (lesson_index >= 0),
      selected_answer INTEGER NOT NULL CHECK (selected_answer >= 0),
      is_correct BOOLEAN NOT NULL,
      attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      certificate_code TEXT NOT NULL UNIQUE,
      telegram_id TEXT NOT NULL
        REFERENCES learners(telegram_id) ON DELETE CASCADE,
      course_key TEXT NOT NULL,
      issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (telegram_id, course_key)
    );
  `);

  console.log('Database tables are ready.');
}
