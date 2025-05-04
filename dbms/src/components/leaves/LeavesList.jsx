import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import services from '../../services/api';

const LeavesList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch employee details
        const employeeResponse = await services.getEmployeeById(id);
        setEmployee(employeeResponse.data);
        
        // Fetch leave records
        const leavesResponse = await services.getEmployeeLeaves(id);
        setLeaves(leavesResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leave records:', err);
        setError('Failed to load leave records. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Get unique leave types for filter
  const leaveTypes = [...new Set(leaves.map(leave => leave.LeaveType))];
  
  // Filter leaves based on status and type
  const filteredLeaves = leaves.filter(leave => {
    const matchesStatus = filterStatus === '' || leave.Status === filterStatus;
    const matchesType = filterType === '' || leave.LeaveType === filterType;
    return matchesStatus && matchesType;
  });

  // Calculate leave statistics
  const calculateLeaveStats = () => {
    const approved = leaves.filter(leave => leave.Status === 'Approved').length;
    const pending = leaves.filter(leave => leave.Status === 'Pending').length;
    const rejected = leaves.filter(leave => leave.Status === 'Rejected').length;
    
    const totalDays = leaves.reduce((total, leave) => {
      const start = new Date(leave.StartDate);
      const end = new Date(leave.EndDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      return total + days;
    }, 0);
    
    return {
      approved,
      pending,
      rejected,
      total: leaves.length,
      totalDays
    };
  };

  const stats = calculateLeaveStats();

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
        <h2 className="text-2xl font-semibold">Leave Records for {employee?.FirstName} {employee?.LastName}</h2>
        <p className="text-gray-600">View and manage leave applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          
          <div className="flex items-end">
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => {
                setFilterStatus('');
                setFilterType('');
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr key={leave.ID}>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No leave records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Leave Balance (Mock data since we don't have actual balance in the database) */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-semibold">Leave Balance</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Allowance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Mock data for leave balance */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Vacation</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20 days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {leaves.filter(l => l.LeaveType === 'Vacation' && l.Status === 'Approved')
                    .reduce((total, leave) => total + calculateDuration(leave.StartDate, leave.EndDate), 0)} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {20 - leaves.filter(l => l.LeaveType === 'Vacation' && l.Status === 'Approved')
                    .reduce((total, leave) => total + calculateDuration(leave.StartDate, leave.EndDate), 0)} days
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sick Leave</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {leaves.filter(l => l.LeaveType === 'Sick Leave' && l.Status === 'Approved')
                    .reduce((total, leave) => total + calculateDuration(leave.StartDate, leave.EndDate), 0)} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {10 - leaves.filter(l => l.LeaveType === 'Sick Leave' && l.Status === 'Approved')
                    .reduce((total, leave) => total + calculateDuration(leave.StartDate, leave.EndDate), 0)} days
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Personal Leave</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {leaves.filter(l => l.LeaveType === 'Personal Leave' && l.Status === 'Approved')
                    .reduce((total, leave) => total + calculateDuration(leave.StartDate, leave.EndDate), 0)} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {5 - leaves.filter(l => l.LeaveType === 'Personal Leave' && l.Status === 'Approved')
                    .reduce((total, leave) => total + calculateDuration(leave.StartDate, leave.EndDate), 0)} days
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeavesList; 