# Employee Management System

A comprehensive Employee Management System built with React, Node.js, and MySQL.

## Features

- **Dashboard**: Overview of key metrics and charts
- **Employee Management**: View, add, edit, and delete employees
- **Department Management**: Track departments and budgets
- **Project Management**: Monitor project status and progress
- **Leave Management**: Track employee leave requests
- **Benefits Management**: Manage employee benefits
- **Time Tracking**: Track employee working hours

## Prerequisites

- Node.js (v14+)
- MySQL Server
- npm or yarn

## Setting Up the Database

1. Ensure you have MySQL installed and running on your machine
2. Open `database/setup.js` and update the database configuration (host, user, password) if needed
3. Run the database setup script:
   ```
   npm run db:setup
   ```
   This will:
   - Create a new database named `employee_management` (if it doesn't exist)
   - Create all required tables
   - Populate the database with sample data

## Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd dbms
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up the database (see section above)

## Running the Application

### Development Mode

To run both the frontend and backend in development mode:

```
npm run dev:all
```

This will start:
- React frontend on http://localhost:5173
- Node.js backend on http://localhost:3001

### Running Frontend Only

```
npm run dev
```

### Running Backend Only

```
npm run server
```

## API Endpoints

- **GET /api/employees**: Get all employees
- **GET /api/employees/:id**: Get a specific employee
- **GET /api/departments**: Get all departments
- **GET /api/projects**: Get all projects
- **GET /api/dashboard**: Get dashboard summary data

For more endpoints, see the server.js file.

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express
- **Database**: MySQL
- **API Communication**: Axios

## License

MIT
