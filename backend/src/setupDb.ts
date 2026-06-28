import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function setup() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const schemaPath = path.join(__dirname, '../schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the entire schema script natively
    await pool.query(schemaSql);
    
    console.log('Database schema successfully initialized!');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

setup();
