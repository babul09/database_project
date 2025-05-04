import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import services from '../../services/api';

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Time Tracking</h2>
          <p className="text-gray-600">View and manage all time tracking entries</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Log Time
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              id="employee"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterEmployeeId}
              onChange={(e) => setFilterEmployeeId(e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map(employee => (
                <option key={employee.EmployeeID} value={employee.EmployeeID}>
                  {employee.FirstName} {employee.LastName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              id="project"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterProjectId}
              onChange={(e) => setFilterProjectId(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.ProjectID} value={project.ProjectID}>
                  {project.ProjectName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              id="startDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              id="endDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          
          <div className="flex items-end">
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => {
                setFilterEmployeeId('');
                setFilterProjectId('');
                setDateRange({ start: '', end: '' });
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Total Entries</div>
          <div className="mt-1 text-3xl font-semibold">{filteredTimeEntries.length}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Total Hours</div>
          <div className="mt-1 text-3xl font-semibold">{totalHours.toFixed(1)}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Unique Projects</div>
          <div className="mt-1 text-3xl font-semibold">
            {new Set(filteredTimeEntries.map(entry => entry.ProjectID)).size}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Average Hours/Entry</div>
          <div className="mt-1 text-3xl font-semibold">
            {filteredTimeEntries.length > 0 
              ? (totalHours / filteredTimeEntries.length).toFixed(1) 
              : '0.0'}
          </div>
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-semibold">Time Entries</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTimeEntries.length > 0 ? (
                filteredTimeEntries.map((entry) => (
                  <tr key={entry.ID}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(entry.Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link to={`/employees/${entry.EmployeeID}`} className="text-blue-600 hover:text-blue-900">
                        {entry.EmployeeName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.ProjectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {parseFloat(entry.HoursWorked).toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No time entries found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingPage; 