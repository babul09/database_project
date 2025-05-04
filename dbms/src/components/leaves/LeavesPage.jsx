import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Filter, Plus, Users, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import services from '../../services/api';

// UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Select, SelectOption } from '../ui/select';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { AnimatedSection, AnimatedHeader, AnimatedCard, StaggeredItems } from '../ui/animated-section';

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

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case 'Pending':
        return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'Rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {status}</Badge>;
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
            <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage employee leave requests and approvals
            </p>
          </div>
          <Button className="self-start">
            <Plus className="mr-2 h-4 w-4" />
            New Leave Request
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <SelectOption value="">All Statuses</SelectOption>
                  <SelectOption value="Approved">Approved</SelectOption>
                  <SelectOption value="Pending">Pending</SelectOption>
                  <SelectOption value="Rejected">Rejected</SelectOption>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Leave Type
                </label>
                <Select
                  id="type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <SelectOption value="">All Types</SelectOption>
                  {leaveTypes.map((type, index) => (
                    <SelectOption key={index} value={type}>{type}</SelectOption>
                  ))}
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  From
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
                  To
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
                    setFilterStatus('');
                    setFilterType('');
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StaggeredItems>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Leaves</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalDays}</div>
              </CardContent>
            </Card>
          </StaggeredItems>
        </div>
      </AnimatedSection>

      {/* Leave Records Table */}
      <AnimatedCard delay={0.3} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Leave Records</CardTitle>
            <CardDescription>
              {filteredLeaves.length} records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((leave) => (
                    <TableRow key={leave.ID}>
                      <TableCell className="font-medium">
                        {leave.ID}
                      </TableCell>
                      <TableCell>
                        <Link to={`/employees/${leave.EmployeeID}`} className="text-primary hover:underline">
                          {leave.EmployeeName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {leave.LeaveType}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(leave.StartDate)}</span>
                          <span>to</span>
                          <span>{formatDate(leave.EndDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {calculateDuration(leave.StartDate, leave.EndDate)} days
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(leave.Status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          {leave.Status === 'Pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {leave.Status !== 'Pending' && (
                            <span className="text-sm text-muted-foreground">No actions available</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center text-muted-foreground py-8">
                      No leave records found for the selected filters.
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

export default LeavesPage; 