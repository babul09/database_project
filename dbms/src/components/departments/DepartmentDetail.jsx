import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import services from '../../services/api';
import { motion } from 'framer-motion';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AnimatedHeader, AnimatedSection } from '../ui/animated-section';
import { 
  ArrowLeft, Briefcase, DollarSign, Users, Calendar, Building, 
  MapPin, Edit, Trash 
} from 'lucide-react';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartmentDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch department data
        const departmentResponse = await services.getDepartmentById(id);
        setDepartment(departmentResponse.data);
        
        // Fetch employees in this department
        const employeesResponse = await services.getAllEmployees();
        const departmentEmployees = employeesResponse.data.filter(
          emp => emp.DepartmentID === parseInt(id)
        );
        setEmployees(departmentEmployees);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching department details:', err);
        setError('Failed to load department details.');
        setLoading(false);
      }
    };

    fetchDepartmentDetails();
  }, [id]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/departments')}
        >
          Back to Departments
        </Button>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Department not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/departments')}
        >
          Back to Departments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatedHeader>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate('/departments')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-semibold">Department Details</h2>
        </div>
      </AnimatedHeader>
      
      {/* Department Info Card */}
      <AnimatedSection delay={0.1}>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{department.DepartmentName}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {department.Location || 'No location specified'}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/departments/${id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="destructive"
                    onClick={() => {/* Handle delete */}}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Budget */}
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-primary/10 rounded-full">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Budget</p>
                        <p className="text-2xl font-semibold">
                          {department.Budget 
                            ? formatCurrency(department.Budget) 
                            : 'Not Specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Employee Count */}
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-primary/10 rounded-full">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Employees</p>
                        <p className="text-2xl font-semibold">{employees.length}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/employees', { 
                        state: { filterDepartment: department.DepartmentID } 
                      })}
                    >
                      View All
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Location */}
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-primary/10 rounded-full">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-lg font-semibold">
                        {department.Location || 'Not Specified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Description */}
            {department.Description && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {department.Description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>
      
      {/* Department Employees */}
      <AnimatedSection delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Department Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No employees in this department
              </p>
            ) : (
              <div className="space-y-4">
                {employees.slice(0, 5).map(employee => (
                  <div 
                    key={employee.EmployeeID}
                    className="flex items-center justify-between p-3 bg-card/50 rounded-md hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{`${employee.FirstName} ${employee.LastName}`}</p>
                        <p className="text-sm text-muted-foreground">{employee.Email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/employees/${employee.EmployeeID}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
                
                {employees.length > 5 && (
                  <div className="text-center pt-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/employees', { 
                        state: { filterDepartment: department.DepartmentID } 
                      })}
                    >
                      View All Employees
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
};

export default DepartmentDetail; 