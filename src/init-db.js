
import { pool, initializeDatabase } from './db.js';

try {
  await initializeDatabase();

  const result = await pool.query(
    'SELECT current_database() AS database_name'
  );

  console.log(
    `Connected successfully to: ${result.rows[0].database_name}`
  );
} catch (error) {
  console.error('Database initialization failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
