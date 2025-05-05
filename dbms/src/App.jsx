import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Auth
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthRedirect from './components/auth/AuthRedirect';
import Login from './components/auth/Login';

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
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          } />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Employees */}
          <Route path="/employees" element={
            <ProtectedRoute>
              <Layout>
                <EmployeeList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/employees/new" element={
            <ProtectedRoute requireAdmin={true}>
              <Layout>
                <EmployeeForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/employees/:id" element={
            <ProtectedRoute>
              <Layout>
                <EmployeeDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/employees/:id/edit" element={
            <ProtectedRoute requireAdmin={true}>
              <Layout>
                <EmployeeForm />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Departments */}
          <Route path="/departments" element={
            <ProtectedRoute>
              <Layout>
                <DepartmentList />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Projects */}
          <Route path="/projects" element={
            <ProtectedRoute>
              <Layout>
                <ProjectList />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Time Tracking - Employee Specific */}
          <Route path="/employees/:id/timetracking" element={
            <ProtectedRoute>
              <Layout>
                <TimeTrackingList />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Leave Management - Employee Specific */}
          <Route path="/employees/:id/leaves" element={
            <ProtectedRoute>
              <Layout>
                <LeavesList />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Benefits - Employee Specific */}
          <Route path="/employees/:id/benefits" element={
            <ProtectedRoute>
              <Layout>
                <BenefitsList />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Standalone Pages */}
          <Route path="/timetracking" element={
            <ProtectedRoute>
              <Layout>
                <TimeTrackingPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/leaves" element={
            <ProtectedRoute>
              <Layout>
                <LeavesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/benefits" element={
            <ProtectedRoute>
              <Layout>
                <BenefitsPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Redirect unknown routes to login if not authenticated, or dashboard if authenticated */}
          <Route path="*" element={
            <ProtectedRoute>
              <Layout>
                <div className="flex justify-center items-center h-96">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
                    <p className="text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
