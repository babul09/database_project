import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import services from '../../services/api';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [timeTracking, setTimeTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        
        // Fetch employee details
        const employeeResponse = await services.getEmployeeById(id);
        setEmployee(employeeResponse.data);
        
        // Fetch employee projects
        const projectsResponse = await services.getEmployeeProjects(id);
        setProjects(projectsResponse.data);
        
        // Fetch employee leaves
        const leavesResponse = await services.getEmployeeLeaves(id);
        setLeaves(leavesResponse.data);
        
        // Fetch employee benefits
        const benefitsResponse = await services.getEmployeeBenefits(id);
        setBenefits(benefitsResponse.data);
        
        // Fetch employee dependents
        const dependentsResponse = await services.getEmployeeDependents(id);
        setDependents(dependentsResponse.data);
        
        // Fetch employee time tracking
        const timeTrackingResponse = await services.getEmployeeTimeTracking(id);
        setTimeTracking(timeTrackingResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Employee Not Found</h2>
        <p className="text-gray-600 mb-6">The employee you are looking for does not exist or has been removed.</p>
        <Link to="/employees" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          Back to Employees
        </Link>
      </div>
    );
  }

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      {/* Employee Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/employees" className="mr-4 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h2 className="text-2xl font-semibold">Employee Profile</h2>
        </div>
        <div className="flex space-x-2">
          <Link 
            to={`/employees/${id}/edit`} 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </Link>
        </div>
      </div>

      {/* Employee Profile Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-blue-600 md:w-48 flex md:flex-col justify-center items-center p-6 text-white">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl font-bold mb-4">
              {employee.FirstName?.charAt(0)}{employee.LastName?.charAt(0)}
            </div>
            <h3 className="text-xl font-semibold">{employee.FirstName} {employee.LastName}</h3>
            <p className="text-blue-200">{employee.DepartmentName}</p>
          </div>
          <div className="p-6 md:flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-500 uppercase mb-1">Employee ID</h4>
                <p className="text-gray-800 font-medium">{employee.EmployeeID}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500 uppercase mb-1">Email</h4>
                <p className="text-gray-800 font-medium">{employee.Email}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500 uppercase mb-1">Phone</h4>
                <p className="text-gray-800 font-medium">{employee.PhoneNo}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500 uppercase mb-1">Date of Birth</h4>
                <p className="text-gray-800 font-medium">{formatDate(employee.DateOfBirth)}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500 uppercase mb-1">Gender</h4>
                <p className="text-gray-800 font-medium">{employee.Gender}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500 uppercase mb-1">Supervisor</h4>
                <p className="text-gray-800 font-medium">{employee.SupervisorName || 'None'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'projects'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'leaves'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('leaves')}
            >
              Leave Records
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'benefits'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('benefits')}
            >
              Benefits
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'dependents'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('dependents')}
            >
              Dependents
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'timeTracking'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('timeTracking')}
            >
              Time Tracking
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Employee Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-blue-700 font-medium mb-2">Projects Involvement</h4>
                <p className="text-3xl font-bold text-blue-800">{projects.length}</p>
                <p className="text-blue-600">Active projects</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-green-700 font-medium mb-2">Leave Balance</h4>
                <p className="text-3xl font-bold text-green-800">{leaves.filter(leave => leave.Status === 'Approved').length}</p>
                <p className="text-green-600">Approved leaves</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-purple-700 font-medium mb-2">Benefits</h4>
                <p className="text-3xl font-bold text-purple-800">{benefits.length}</p>
                <p className="text-purple-600">Active benefits</p>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Projects ({projects.length})</h3>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Assign to Project</button>
            </div>
            {projects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours/Week</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map(project => (
                      <tr key={project.ProjectID}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{project.ProjectName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{project.Role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${project.Status === 'Completed' ? 'bg-green-100 text-green-800' : 
                              project.Status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'}`}
                          >
                            {project.Status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.HoursPerWeek}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(project.StartDate)} - {formatDate(project.EndDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No projects assigned to this employee</p>
            )}
          </div>
        )}

        {/* Leaves Tab */}
        {activeTab === 'leaves' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Leave Records ({leaves.length})</h3>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Request Leave</button>
            </div>
            {leaves.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaves.map(leave => {
                      const startDate = new Date(leave.StartDate);
                      const endDate = new Date(leave.EndDate);
                      const durationDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                      
                      return (
                        <tr key={leave.ID}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {leave.ID}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{leave.LeaveType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(leave.StartDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(leave.EndDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {durationDays} day{durationDays !== 1 ? 's' : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${leave.Status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                leave.Status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}
                            >
                              {leave.Status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No leave records found for this employee</p>
            )}
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === 'benefits' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Benefits ({benefits.length})</h3>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Add Benefit</button>
            </div>
            {benefits.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefit ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefit Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {benefits.map(benefit => (
                      <tr key={benefit.BenefitID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {benefit.BenefitID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{benefit.BenefitType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(benefit.StartDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {benefit.Coverage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${benefit.Premium.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No benefits found for this employee</p>
            )}
          </div>
        )}

        {/* Dependents Tab */}
        {activeTab === 'dependents' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Dependents ({dependents.length})</h3>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Add Dependent</button>
            </div>
            {dependents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dependent ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dependents.map(dependent => (
                      <tr key={dependent.DependentID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dependent.DependentID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dependent.FirstName} {dependent.LastName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dependent.Relationship}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(dependent.DateOfBirth)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No dependents found for this employee</p>
            )}
          </div>
        )}

        {/* Time Tracking Tab */}
        {activeTab === 'timeTracking' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Time Tracking ({timeTracking.length} entries)</h3>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Log Time</button>
            </div>
            {timeTracking.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Worked</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {timeTracking.map(entry => (
                      <tr key={entry.ID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(entry.Date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{entry.ProjectName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.HoursWorked} hours
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No time tracking entries found for this employee</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail; 