import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import services from '../../services/api';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    employeeCount: 0,
    departmentCount: 0,
    projectCount: 0,
    activeProjectCount: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get dashboard summary data
        const dashboardResponse = await services.getDashboardData();
        setDashboardData(dashboardResponse.data);
        
        // Get employees for department distribution chart
        const employeesResponse = await services.getAllEmployees();
        setEmployees(employeesResponse.data);
        
        // Get projects for project status chart
        const projectsResponse = await services.getAllProjects();
        setProjects(projectsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare data for department distribution chart
  const departmentDistributionData = () => {
    const departments = {};
    
    employees.forEach(employee => {
      if (employee.DepartmentName) {
        departments[employee.DepartmentName] = (departments[employee.DepartmentName] || 0) + 1;
      }
    });
    
    return {
      labels: Object.keys(departments),
      datasets: [
        {
          label: 'Employees by Department',
          data: Object.values(departments),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)',
            'rgba(83, 102, 255, 0.7)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for project status chart
  const projectStatusData = () => {
    const statusCounts = {
      'Completed': 0,
      'In Progress': 0,
      'Planning': 0
    };
    
    projects.forEach(project => {
      if (project.Status) {
        statusCounts[project.Status] = (statusCounts[project.Status] || 0) + 1;
      }
    });
    
    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: 'Project Status',
          data: Object.values(statusCounts),
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(54, 162, 235, 0.7)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Stats cards to display at the top
  const statsCards = [
    { title: 'Total Employees', value: dashboardData.employeeCount, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'bg-blue-500' },
    { title: 'Departments', value: dashboardData.departmentCount, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'bg-green-500' },
    { title: 'Total Projects', value: dashboardData.projectCount, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: 'bg-purple-500' },
    { title: 'Active Projects', value: dashboardData.activeProjectCount, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-yellow-500' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className={`${card.color} text-white p-3 rounded-lg mr-4`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Department Distribution Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Employee Distribution by Department</h3>
              <div className="h-72 flex justify-center items-center">
                {employees.length > 0 ? (
                  <Pie data={departmentDistributionData()} />
                ) : (
                  <p className="text-gray-500">No employee data available</p>
                )}
              </div>
            </div>
            
            {/* Project Status Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
              <div className="h-72 flex justify-center items-center">
                {projects.length > 0 ? (
                  <Bar 
                    data={projectStatusData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                ) : (
                  <p className="text-gray-500">No project data available</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Recent Employees */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Recent Employees</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.slice(0, 5).map((employee) => (
                    <tr key={employee.EmployeeID}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {employee.FirstName?.charAt(0)}{employee.LastName?.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.FirstName} {employee.LastName}</div>
                            <div className="text-sm text-gray-500">{employee.Gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.DepartmentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.Email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.PhoneNo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 