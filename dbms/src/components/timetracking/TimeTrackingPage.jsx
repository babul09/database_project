import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Briefcase, TrendingUp, Filter, Plus, Edit, Trash } from 'lucide-react';
import services from '../../services/api';

// UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Select, SelectOption } from '../ui/select';
import { Input } from '../ui/input';
import { AnimatedSection, AnimatedHeader, AnimatedCard, StaggeredItems } from '../ui/animated-section';

const TimeTrackingPage = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [filterProjectId, setFilterProjectId] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch employees for filtering
        const employeesResponse = await services.getAllEmployees();
        setEmployees(employeesResponse.data);
        
        // Fetch projects for filtering
        const projectsResponse = await services.getAllProjects();
        setProjects(projectsResponse.data);
        
        // Create a placeholder for all time entries
        // In a real app, you would have an API endpoint to get all time entries
        const timeEntriesData = [];
        
        // For each employee, fetch their time tracking data
        for (const employee of employeesResponse.data) {
          try {
            const timeTrackingResponse = await services.getEmployeeTimeTracking(employee.EmployeeID);
            const entriesWithEmployeeName = timeTrackingResponse.data.map(entry => ({
              ...entry,
              EmployeeName: `${employee.FirstName} ${employee.LastName}`
            }));
            timeEntriesData.push(...entriesWithEmployeeName);
          } catch (err) {
            console.error(`Error fetching time tracking for employee ${employee.EmployeeID}:`, err);
          }
        }
        
        setTimeEntries(timeEntriesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load time tracking data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter time entries based on employee, project, and date range
  const filteredTimeEntries = timeEntries.filter(entry => {
    const matchesEmployee = filterEmployeeId === '' || 
      entry.EmployeeID.toString() === filterEmployeeId;
    
    const matchesProject = filterProjectId === '' || 
      entry.ProjectID.toString() === filterProjectId;
    
    const entryDate = new Date(entry.Date);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    
    const matchesDateRange = 
      (!startDate || entryDate >= startDate) && 
      (!endDate || entryDate <= endDate);
    
    return matchesEmployee && matchesProject && matchesDateRange;
  });

  // Calculate total hours
  const totalHours = filteredTimeEntries.reduce(
    (total, entry) => total + parseFloat(entry.HoursWorked || 0), 
    0
  );

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <AnimatedCard className="bg-destructive/10 border border-destructive text-destructive p-6 rounded-2xl mb-8">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Error:</span>
          <span>{error}</span>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <AnimatedHeader className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor employee working hours across projects
            </p>
          </div>
          <Button className="self-start">
            <Plus className="mr-2 h-4 w-4" />
            Log Time
          </Button>
        </div>
      </AnimatedHeader>

      {/* Filters */}
      <AnimatedCard delay={0.1} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label htmlFor="employee" className="text-sm font-medium">
                  Employee
                </label>
                <Select
                  id="employee"
                  value={filterEmployeeId}
                  onChange={(e) => setFilterEmployeeId(e.target.value)}
                >
                  <SelectOption value="">All Employees</SelectOption>
                  {employees.map(employee => (
                    <SelectOption key={employee.EmployeeID} value={employee.EmployeeID}>
                      {employee.FirstName} {employee.LastName}
                    </SelectOption>
                  ))}
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="project" className="text-sm font-medium">
                  Project
                </label>
                <Select
                  id="project"
                  value={filterProjectId}
                  onChange={(e) => setFilterProjectId(e.target.value)}
                >
                  <SelectOption value="">All Projects</SelectOption>
                  {projects.map(project => (
                    <SelectOption key={project.ProjectID} value={project.ProjectID}>
                      {project.ProjectName}
                    </SelectOption>
                  ))}
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </label>
                <Input
                  type="date"
                  id="startDate"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <Input
                  type="date"
                  id="endDate"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setFilterEmployeeId('');
                    setFilterProjectId('');
                    setDateRange({ start: '', end: '' });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Summary Cards */}
      <AnimatedSection delay={0.2} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StaggeredItems>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{filteredTimeEntries.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalHours.toFixed(1)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Unique Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Set(filteredTimeEntries.map(entry => entry.ProjectID)).size}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Hours/Entry</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {filteredTimeEntries.length > 0 
                    ? (totalHours / filteredTimeEntries.length).toFixed(1) 
                    : '0.0'}
                </div>
              </CardContent>
            </Card>
          </StaggeredItems>
        </div>
      </AnimatedSection>

      {/* Time Entries Table */}
      <AnimatedCard delay={0.3} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Time Entries</CardTitle>
            <CardDescription>
              {filteredTimeEntries.length} entries found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimeEntries.length > 0 ? (
                  filteredTimeEntries.map((entry) => (
                    <TableRow key={entry.ID}>
                      <TableCell className="font-medium">
                        {formatDate(entry.Date)}
                      </TableCell>
                      <TableCell>
                        <Link to={`/employees/${entry.EmployeeID}`} className="text-primary hover:underline">
                          {entry.EmployeeName}
                        </Link>
                      </TableCell>
                      <TableCell>{entry.ProjectName}</TableCell>
                      <TableCell className="text-right">
                        {parseFloat(entry.HoursWorked).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center text-muted-foreground py-8">
                      No time entries found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
};

export default TimeTrackingPage; 