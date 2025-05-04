import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: '1001',  // Replace with your MySQL password
  database: 'employee_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB connection
app.get('/api/test', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Database connection successful', result: result[0].result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.*, 
        d.DepartmentName,
        CONCAT(s.FirstName, ' ', s.LastName) AS SupervisorName
      FROM 
        Employee e
      LEFT JOIN 
        Department d ON e.DepartmentID = d.DepartmentID
      LEFT JOIN 
        Employee s ON e.SupervisorID = s.EmployeeID
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        e.*, 
        d.DepartmentName,
        CONCAT(s.FirstName, ' ', s.LastName) AS SupervisorName
      FROM 
        Employee e
      LEFT JOIN 
        Department d ON e.DepartmentID = d.DepartmentID
      LEFT JOIN 
        Employee s ON e.SupervisorID = s.EmployeeID
      WHERE e.EmployeeID = ?`,
      [req.params.id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Department');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Project');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get projects by employee ID
app.get('/api/employees/:id/projects', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        p.*, w.Role, w.HoursPerWeek
      FROM 
        Project p
      JOIN 
        WorksOn w ON p.ProjectID = w.ProjectID
      WHERE 
        w.EmployeeID = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaves by employee ID
app.get('/api/employees/:id/leaves', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM LeaveRecords WHERE EmployeeID = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get benefits by employee ID
app.get('/api/employees/:id/benefits', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Benefits WHERE EmployeeID = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dependents by employee ID
app.get('/api/employees/:id/dependents', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Dependent WHERE EmployeeID = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get time tracking data by employee ID
app.get('/api/employees/:id/timetracking', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        t.*, p.ProjectName
      FROM 
        TimeTracking t
      JOIN 
        Project p ON t.ProjectID = p.ProjectID
      WHERE 
        t.EmployeeID = ?
      ORDER BY 
        t.Date DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard summary data
app.get('/api/dashboard', async (req, res) => {
  try {
    // Get employee count
    const [employeeCount] = await pool.query('SELECT COUNT(*) as count FROM Employee');
    
    // Get department count
    const [departmentCount] = await pool.query('SELECT COUNT(*) as count FROM Department');
    
    // Get project count
    const [projectCount] = await pool.query('SELECT COUNT(*) as count FROM Project');
    
    // Get active projects count
    const [activeProjectCount] = await pool.query('SELECT COUNT(*) as count FROM Project WHERE Status = "In Progress"');
    
    res.json({
      employeeCount: employeeCount[0].count,
      departmentCount: departmentCount[0].count,
      projectCount: projectCount[0].count,
      activeProjectCount: activeProjectCount[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 