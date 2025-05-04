import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import services from '../../services/api';

const LeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch employees for filtering
        const employeesResponse = await services.getAllEmployees();
        setEmployees(employeesResponse.data);
        
        // Create a placeholder for all leaves
        const leavesData = [];
        
        // For each employee, fetch their leave records
        for (const employee of employeesResponse.data) {
          try {
            const leavesResponse = await services.getEmployeeLeaves(employee.EmployeeID);
            const leavesWithEmployeeName = leavesResponse.data.map(leave => ({
              ...leave,
              EmployeeID: employee.EmployeeID,
              EmployeeName: `${employee.FirstName} ${employee.LastName}`
            }));
            leavesData.push(...leavesWithEmployeeName);
          } catch (err) {
            console.error(`Error fetching leaves for employee ${employee.EmployeeID}:`, err);
          }
        }
        
        setLeaves(leavesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load leave records. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique leave types for filter
  const leaveTypes = [...new Set(leaves.map(leave => leave.LeaveType))];
  
  // Filter leaves based on employee, status, type, and date range
  const filteredLeaves = leaves.filter(leave => {
    const matchesEmployee = filterEmployeeId === '' || 
      leave.EmployeeID.toString() === filterEmployeeId;
    
    const matchesStatus = filterStatus === '' || leave.Status === filterStatus;
    const matchesType = filterType === '' || leave.LeaveType === filterType;
    
    const startDate = new Date(leave.StartDate);
    const endDate = new Date(leave.EndDate);
    const filterStartDate = dateRange.start ? new Date(dateRange.start) : null;
    const filterEndDate = dateRange.end ? new Date(dateRange.end) : null;
    
    const matchesDateRange = 
      (!filterStartDate || endDate >= filterStartDate) && 
      (!filterEndDate || startDate <= filterEndDate);
    
    return matchesEmployee && matchesStatus && matchesType && matchesDateRange;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate duration in days
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate leave statistics
  const calculateLeaveStats = () => {
    const approved = filteredLeaves.filter(leave => leave.Status === 'Approved').length;
    const pending = filteredLeaves.filter(leave => leave.Status === 'Pending').length;
    const rejected = filteredLeaves.filter(leave => leave.Status === 'Rejected').length;
    
    const totalDays = filteredLeaves.reduce((total, leave) => {
      return total + calculateDuration(leave.StartDate, leave.EndDate);
    }, 0);
    
    return {
      approved,
      pending,
      rejected,
      total: filteredLeaves.length,
      totalDays
    };
  };

  const stats = calculateLeaveStats();

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
          <h2 className="text-2xl font-semibold">Leave Management</h2>
          <p className="text-gray-600">View and manage employee leave records</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Leave Request
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
            <select
              id="type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {leaveTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              id="startDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">To</label>
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
                setFilterStatus('');
                setFilterType('');
                setDateRange({ start: '', end: '' });
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Total Leaves</div>
          <div className="mt-1 text-3xl font-semibold">{stats.total}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Approved</div>
          <div className="mt-1 text-3xl font-semibold text-green-600">{stats.approved}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Pending</div>
          <div className="mt-1 text-3xl font-semibold text-yellow-600">{stats.pending}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Rejected</div>
          <div className="mt-1 text-3xl font-semibold text-red-600">{stats.rejected}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Total Days</div>
          <div className="mt-1 text-3xl font-semibold">{stats.totalDays}</div>
        </div>
      </div>

      {/* Leave Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-semibold">Leave Records</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr key={leave.ID}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {leave.ID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/employees/${leave.EmployeeID}`} className="text-blue-600 hover:text-blue-900">
                        {leave.EmployeeName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {leave.LeaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(leave.StartDate)} - {formatDate(leave.EndDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {calculateDuration(leave.StartDate, leave.EndDate)} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leave.Status)}`}>
                        {leave.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <button 
                        className={`text-indigo-600 hover:text-indigo-900 mr-3 ${leave.Status !== 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={leave.Status !== 'Pending'}
                      >
                        Approve
                      </button>
                      <button 
                        className={`text-red-600 hover:text-red-900 ${leave.Status !== 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={leave.Status !== 'Pending'}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No leave records found for the selected filters.
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

export default LeavesPage; 