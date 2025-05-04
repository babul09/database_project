import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Employees
import EmployeeList from './components/employees/EmployeeList';
import EmployeeDetail from './components/employees/EmployeeDetail';
import EmployeeForm from './components/employees/EmployeeForm';

// Departments
import DepartmentList from './components/departments/DepartmentList';

// Projects
import ProjectList from './components/projects/ProjectList';

// Time Tracking
import TimeTrackingList from './components/timetracking/TimeTrackingList';
import TimeTrackingPage from './components/timetracking/TimeTrackingPage';

// Leave Management
import LeavesList from './components/leaves/LeavesList';
import LeavesPage from './components/leaves/LeavesPage';

// Benefits
import BenefitsList from './components/benefits/BenefitsList';
import BenefitsPage from './components/benefits/BenefitsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Employees */}
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/employees/:id/edit" element={<EmployeeForm />} />
          
          {/* Departments */}
          <Route path="/departments" element={<DepartmentList />} />
          
          {/* Projects */}
          <Route path="/projects" element={<ProjectList />} />
          
          {/* Time Tracking - Employee Specific */}
          <Route path="/employees/:id/timetracking" element={<TimeTrackingList />} />
          
          {/* Leave Management - Employee Specific */}
          <Route path="/employees/:id/leaves" element={<LeavesList />} />
          
          {/* Benefits - Employee Specific */}
          <Route path="/employees/:id/benefits" element={<BenefitsList />} />
          
          {/* Standalone Pages */}
          <Route path="/timetracking" element={<TimeTrackingPage />} />
          <Route path="/leaves" element={<LeavesPage />} />
          <Route path="/benefits" element={<BenefitsPage />} />
          
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
