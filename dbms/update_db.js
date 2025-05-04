import mysql from 'mysql2/promise';
import fs from 'fs/promises';

const main = async () => {
  // Database connection pool
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1001',
    database: 'employee_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('Reading schema update SQL file...');
    const sqlScript = await fs.readFile('./database/schema_update.sql', 'utf8');
    
    console.log('Splitting SQL commands...');
    // Split the SQL script into individual commands
    const commands = sqlScript
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);
    
    console.log(`Found ${commands.length} SQL commands to execute`);
    
    // Execute each command sequentially
    for (const command of commands) {
      try {
        console.log(`Executing: ${command.substring(0, 80)}...`);
        await pool.query(command);
        console.log('Command executed successfully');
      } catch (error) {
        console.error(`Error executing command: ${error.message}`);
      }
    }
    
    console.log('Database schema update completed');
  } catch (error) {
    console.error('Error updating database schema:', error);
  } finally {
    // Close the connection pool
    await pool.end();
  }
};

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 