import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Employees
import EmployeeList from './components/employees/EmployeeList';
import EmployeeDetail from './components/employees/EmployeeDetail';

// Departments
import DepartmentList from './components/departments/DepartmentList';

// Projects
import ProjectList from './components/projects/ProjectList';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Employees */}
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          
          {/* Departments */}
          <Route path="/departments" element={<DepartmentList />} />
          
          {/* Projects */}
          <Route path="/projects" element={<ProjectList />} />
          
          {/* 404 Page */}
          <Route path="*" element={
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
                <p className="text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
