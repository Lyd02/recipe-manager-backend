import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'recipe_db',
  password: 'Admin@12345',
  port: 5432,
});

export default pool;
