import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import services from '../../services/api';

const TimeTrackingList = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [filterProject, setFilterProject] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [projects, setProjects] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch employee details
        const employeeResponse = await services.getEmployeeById(id);
        setEmployee(employeeResponse.data);
        
        // Fetch time tracking data
        const timeTrackingResponse = await services.getEmployeeTimeTracking(id);
        setTimeEntries(timeTrackingResponse.data);
        
        // Fetch projects for filtering
        const projectsResponse = await services.getEmployeeProjects(id);
        setProjects(projectsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching time tracking data:', err);
        setError('Failed to load time tracking data. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Filter time entries based on project and date range
  const filteredTimeEntries = timeEntries.filter(entry => {
    const matchesProject = filterProject === '' || 
      entry.ProjectID.toString() === filterProject;
    
    const entryDate = new Date(entry.Date);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    
    const matchesDateRange = 
      (!startDate || entryDate >= startDate) && 
      (!endDate || entryDate <= endDate);
    
    return matchesProject && matchesDateRange;
  });

  // Calculate total hours
  const totalHours = filteredTimeEntries.reduce(
    (total, entry) => total + parseFloat(entry.HoursWorked || 0), 
    0
  );

  // Group time entries by project for summary
  const projectSummary = filteredTimeEntries.reduce((acc, entry) => {
    const projectId = entry.ProjectID;
    if (!acc[projectId]) {
      acc[projectId] = {
        projectName: entry.ProjectName,
        totalHours: 0
      };
    }
    acc[projectId].totalHours += parseFloat(entry.HoursWorked || 0);
    return acc;
  }, {});

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
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Time Tracking for {employee?.FirstName} {employee?.LastName}</h2>
        <p className="text-gray-600">View and analyze time spent on different projects</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              id="project"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
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
                setFilterProject('');
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
          <div className="text-sm font-medium text-gray-500">Total Hours</div>
          <div className="mt-1 text-3xl font-semibold">{totalHours.toFixed(1)}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Projects</div>
          <div className="mt-1 text-3xl font-semibold">{Object.keys(projectSummary).length}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Time Entries</div>
          <div className="mt-1 text-3xl font-semibold">{filteredTimeEntries.length}</div>
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

      {/* Project Summary */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Project Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.values(projectSummary).map((project, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.projectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {project.totalHours.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {totalHours > 0 ? ((project.totalHours / totalHours) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
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
                      {entry.ProjectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {parseFloat(entry.HoursWorked).toFixed(1)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
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

export default TimeTrackingList; 