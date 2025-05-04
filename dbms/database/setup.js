import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1001',  // Replace with your MySQL password
};

// Database name
const DATABASE_NAME = 'employee_management';

async function setupDatabase() {
  let connection;
  
  try {
    console.log('Setting up database...');
    
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    
    // Create database if it doesn't exist
    console.log(`Creating database ${DATABASE_NAME} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
    
    // Use the database
    console.log(`Using database ${DATABASE_NAME}...`);
    await connection.query(`USE ${DATABASE_NAME}`);
    
    // Read SQL file content
    console.log('Reading SQL schema file...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');
    
    // Split SQL statements by delimiter
    const statements = schemaSql
      .replace(/DELIMITER \/\//g, '')
      .replace(/\/\/ DELIMITER ;/g, '')
      .split(';')
      .filter(statement => statement.trim() !== '');
    
    // Execute each SQL statement
    console.log('Executing SQL statements...');
    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (err) {
        console.error(`Error executing SQL statement: ${err.message}`);
        console.error(statement);
      }
    }
    
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase(); 