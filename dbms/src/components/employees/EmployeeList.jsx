import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import services from '../../services/api';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectOption } from '../ui/select';
import { Badge } from '../ui/badge';
import { AnimatedHeader, AnimatedSection } from '../ui/animated-section';
import { Search, Plus, Edit, Trash, Eye } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ show: false, employeeId: null, employeeName: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const employeesResponse = await services.getAllEmployees();
      setEmployees(employeesResponse.data);
      
      const departmentsResponse = await services.getAllDepartments();
      setDepartments(departmentsResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  // Filter employees based on search term and department filter
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      employee.LastName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      employee.Email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === '' || 
      employee.DepartmentID?.toString() === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleEditClick = (employeeId) => {
    navigate(`/employees/${employeeId}/edit`);
  };

  const handleDeleteClick = (employee) => {
    setDeleteModal({
      show: true,
      employeeId: employee.EmployeeID,
      employeeName: `${employee.FirstName} ${employee.LastName}`
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, employeeId: null, employeeName: '' });
  };

  const confirmDelete = async () => {
    if (!deleteModal.employeeId) return;
    
    try {
      setDeleteLoading(true);
      await services.deleteEmployee(deleteModal.employeeId);
      
      // Update the employees list after deletion
      setEmployees(employees.filter(emp => emp.EmployeeID !== deleteModal.employeeId));
      
      setDeleteLoading(false);
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setDeleteLoading(false);
      // Could add error notification here
    }
  };

  return (
    <div className="space-y-6">
      <AnimatedHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Employees</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate('/employees/new')}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </motion.div>
        </div>
      </AnimatedHeader>
      
      {/* Filters */}
      <AnimatedSection delay={0.1}>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-1">Search</label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search employees..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-muted-foreground mb-1">Department</label>
                <Select
                  id="department"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <SelectOption value="">All Departments</SelectOption>
                  {departments.map(dept => (
                    <SelectOption key={dept.DepartmentID} value={dept.DepartmentID.toString()}>
                      {dept.DepartmentName}
                    </SelectOption>
                  ))}
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDepartment('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
      
      {/* Employees Table */}
      <AnimatedSection delay={0.2}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-6 font-medium text-muted-foreground">Employee</th>
                      <th className="text-left py-3 px-6 font-medium text-muted-foreground">Department</th>
                      <th className="text-left py-3 px-6 font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-6 font-medium text-muted-foreground">Phone</th>
                      <th className="text-left py-3 px-6 font-medium text-muted-foreground">Supervisor</th>
                      <th className="text-right py-3 px-6 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map(employee => (
                        <motion.tr 
                          key={employee.EmployeeID} 
                          className="border-b hover:bg-muted/50"
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                {employee.FirstName?.charAt(0)}{employee.LastName?.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-foreground">
                                  <Link to={`/employees/${employee.EmployeeID}`} className="hover:text-primary">
                                    {employee.FirstName} {employee.LastName}
                                  </Link>
                                </div>
                                <Badge variant="secondary" className="mt-1">
                                  {employee.Gender}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>{employee.DepartmentName}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div>{employee.Email}</div>
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {employee.PhoneNo}
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {employee.SupervisorName || 'None'}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => navigate(`/employees/${employee.EmployeeID}`)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              
                              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleEditClick(employee.EmployeeID)}
                                  className="text-indigo-600 hover:text-indigo-800"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              
                              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteClick(employee)}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-muted-foreground">
                          No employees found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </AnimatedSection>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Confirm Delete</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Are you sure you want to delete {deleteModal.employeeName}? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={closeDeleteModal}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmDelete}
                    disabled={deleteLoading}
                    className="flex items-center"
                  >
                    {deleteLoading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeList; 