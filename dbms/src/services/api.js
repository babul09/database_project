import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API services
export const services = {
  // Dashboard
  getDashboardData: () => apiClient.get('/dashboard'),
  
  // Employees
  getAllEmployees: () => apiClient.get('/employees'),
  getEmployeeById: (id) => apiClient.get(`/employees/${id}`),
  createEmployee: (employeeData) => apiClient.post('/employees', employeeData),
  updateEmployee: (id, employeeData) => apiClient.put(`/employees/${id}`, employeeData),
  deleteEmployee: (id) => apiClient.delete(`/employees/${id}`),
  
  // Departments
  getAllDepartments: () => apiClient.get('/departments'),
  
  // Projects
  getAllProjects: () => apiClient.get('/projects'),
  getEmployeeProjects: (id) => apiClient.get(`/employees/${id}/projects`),
  
  // Leaves
  getEmployeeLeaves: (id) => apiClient.get(`/employees/${id}/leaves`),
  
  // Benefits
  getEmployeeBenefits: (id) => apiClient.get(`/employees/${id}/benefits`),
  
  // Dependents
  getEmployeeDependents: (id) => apiClient.get(`/employees/${id}/dependents`),
  
  // Time Tracking
  getEmployeeTimeTracking: (id) => apiClient.get(`/employees/${id}/timetracking`),
};

export default services; 