import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../../services/api';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AnimatedHeader, AnimatedSection, StaggeredItems } from '../ui/animated-section';
import { Search, Plus, Edit, Trash, Users, Briefcase } from 'lucide-react';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await services.getAllDepartments();
      
      // Get employee counts per department
      const employeesResponse = await services.getAllEmployees();
      const employees = employeesResponse.data;
      
      // Add employee count to each department
      const departmentsWithCounts = response.data.map(dept => {
        const employeeCount = employees.filter(emp => emp.DepartmentID === dept.DepartmentID).length;
        return { ...dept, employeeCount };
      });
      
      setDepartments(departmentsWithCounts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setLoading(false);
    }
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(department => 
    searchTerm === '' || 
    department.DepartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.Location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AnimatedHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Departments</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate('/departments/new')}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </motion.div>
        </div>
      </AnimatedHeader>
      
      {/* Search */}
      <AnimatedSection delay={0.1}>
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
      
      {/* Departments Grid */}
      <AnimatedSection delay={0.2}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StaggeredItems>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map(department => (
                  <Card 
                    key={department.DepartmentID} 
                    className="overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{department.DepartmentName}</CardTitle>
                        <div className="flex space-x-1">
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-indigo-600 hover:text-indigo-800"
                              onClick={() => navigate(`/departments/${department.DepartmentID}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive/80"
                              onClick={() => {/* Handle delete */}}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {department.Location || 'No location specified'}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Badge variant="secondary">
                            {department.employeeCount} Employees
                          </Badge>
                        </div>
                        
                        {department.Description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {department.Description}
                          </p>
                        )}
                        
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => navigate(`/departments/${department.DepartmentID}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center p-8">
                  <p className="text-muted-foreground">No departments found matching your search</p>
                </div>
              )}
            </StaggeredItems>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
};

export default DepartmentList; 