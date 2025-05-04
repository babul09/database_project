import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import services from '../../services/api';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { AnimatedHeader, AnimatedSection, StaggeredItems } from '../ui/animated-section';
import { Users, Briefcase, FolderOpen, Clock } from 'lucide-react';

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
    { title: 'Total Employees', value: dashboardData.employeeCount, icon: <Users className="h-6 w-6" />, color: 'bg-primary' },
    { title: 'Departments', value: dashboardData.departmentCount, icon: <Briefcase className="h-6 w-6" />, color: 'bg-green-500' },
    { title: 'Total Projects', value: dashboardData.projectCount, icon: <FolderOpen className="h-6 w-6" />, color: 'bg-purple-500' },
    { title: 'Active Projects', value: dashboardData.activeProjectCount, icon: <Clock className="h-6 w-6" />, color: 'bg-yellow-500' }
  ];

  return (
    <div className="space-y-8">
      <AnimatedHeader>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </AnimatedHeader>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StaggeredItems>
                {statsCards.map((card, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-6 flex items-center">
                      <div className={`${card.color} text-white p-3 rounded-lg mr-4`}>
                        {card.icon}
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">{card.title}</p>
                        <p className="text-2xl font-bold text-foreground">{card.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </StaggeredItems>
            </div>
          </AnimatedSection>
          
          {/* Charts */}
          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Employee Distribution by Department</CardTitle>
                </CardHeader>
                <CardContent className="h-72 flex justify-center items-center">
                  {employees.length > 0 ? (
                    <Pie data={departmentDistributionData()} />
                  ) : (
                    <p className="text-muted-foreground">No employee data available</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Project Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-72 flex justify-center items-center">
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
                    <p className="text-muted-foreground">No project data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
          
          {/* Recent Employees */}
          <AnimatedSection delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.slice(0, 5).map((employee) => (
                        <motion.tr 
                          key={employee.EmployeeID}
                          className="border-b hover:bg-muted/50"
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                {employee.FirstName?.charAt(0)}{employee.LastName?.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="font-medium">{employee.FirstName} {employee.LastName}</div>
                                <Badge variant="secondary" className="mt-1">
                                  {employee.Gender}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>{employee.DepartmentName}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div>{employee.Email}</div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {employee.PhoneNo}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </>
      )}
    </div>
  );
};

export default Dashboard; 