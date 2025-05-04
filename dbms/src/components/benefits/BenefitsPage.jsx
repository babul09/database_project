import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Filter, Plus, DollarSign, Package, Settings, Users, Edit, Trash } from 'lucide-react';
import services from '../../services/api';

// UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Select, SelectOption } from '../ui/select';
import { Badge } from '../ui/badge';
import { AnimatedSection, AnimatedHeader, AnimatedCard, StaggeredItems } from '../ui/animated-section';

const BenefitsPage = () => {
  const [benefits, setBenefits] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch employees for filtering
        const employeesResponse = await services.getAllEmployees();
        setEmployees(employeesResponse.data);
        
        // Create a placeholder for all benefits
        const benefitsData = [];
        
        // For each employee, fetch their benefits
        for (const employee of employeesResponse.data) {
          try {
            const benefitsResponse = await services.getEmployeeBenefits(employee.EmployeeID);
            const benefitsWithEmployeeName = benefitsResponse.data.map(benefit => ({
              ...benefit,
              EmployeeID: employee.EmployeeID,
              EmployeeName: `${employee.FirstName} ${employee.LastName}`
            }));
            benefitsData.push(...benefitsWithEmployeeName);
          } catch (err) {
            console.error(`Error fetching benefits for employee ${employee.EmployeeID}:`, err);
          }
        }
        
        setBenefits(benefitsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load benefits data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique benefit types for filter
  const benefitTypes = [...new Set(benefits.map(benefit => benefit.BenefitType))];
  
  // Filter benefits based on employee and type
  const filteredBenefits = benefits.filter(benefit => {
    const matchesEmployee = filterEmployeeId === '' || 
      benefit.EmployeeID.toString() === filterEmployeeId;
    
    const matchesType = filterType === '' || benefit.BenefitType === filterType;
    
    return matchesEmployee && matchesType;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate total premium cost
  const totalPremium = filteredBenefits.reduce((total, benefit) => {
    return total + parseFloat(benefit.Premium || 0);
  }, 0);

  // Group benefits by type for summary
  const benefitSummary = filteredBenefits.reduce((acc, benefit) => {
    const type = benefit.BenefitType;
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        totalPremium: 0
      };
    }
    acc[type].count++;
    acc[type].totalPremium += parseFloat(benefit.Premium || 0);
    return acc;
  }, {});

  // Get appropriate icon for benefit type
  const getBenefitIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'health insurance':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'dental insurance':
        return <Heart className="h-4 w-4 text-blue-500" />;
      case 'vision insurance':
        return <Heart className="h-4 w-4 text-green-500" />;
      case '401k':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-primary" />;
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Benefits Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage employee benefit packages and enrollments
            </p>
          </div>
          <Button className="self-start">
            <Plus className="mr-2 h-4 w-4" />
            Add Benefit
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label htmlFor="type" className="text-sm font-medium">
                  Benefit Type
                </label>
                <Select
                  id="type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <SelectOption value="">All Types</SelectOption>
                  {benefitTypes.map((type, index) => (
                    <SelectOption key={index} value={type}>{type}</SelectOption>
                  ))}
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setFilterEmployeeId('');
                    setFilterType('');
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
                <CardTitle className="text-sm font-medium">Total Benefits</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{filteredBenefits.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Benefit Types</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Object.keys(benefitSummary).length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Premium</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(totalPremium)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Premium/Benefit</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {filteredBenefits.length > 0 
                    ? formatCurrency(totalPremium / filteredBenefits.length)
                    : formatCurrency(0)}
                </div>
              </CardContent>
            </Card>
          </StaggeredItems>
        </div>
      </AnimatedSection>

      {/* Benefits Summary */}
      <AnimatedCard delay={0.3} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Benefits Summary</CardTitle>
            <CardDescription>
              Overview by benefit type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Benefit Type</TableHead>
                  <TableHead className="text-center">Count</TableHead>
                  <TableHead className="text-right">Total Premium</TableHead>
                  <TableHead className="text-right">Avg Premium</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(benefitSummary).map(([type, data], index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center">
                      <span className="mr-2">{getBenefitIcon(type)}</span>
                      {type}
                    </TableCell>
                    <TableCell className="text-center">
                      {data.count}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(data.totalPremium)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(data.totalPremium / data.count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Benefits Table */}
      <AnimatedCard delay={0.4} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Benefits Details</CardTitle>
            <CardDescription>
              {filteredBenefits.length} records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Benefit Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead className="text-right">Premium</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBenefits.length > 0 ? (
                  filteredBenefits.map((benefit) => (
                    <TableRow key={benefit.BenefitID}>
                      <TableCell className="font-medium">
                        {benefit.BenefitID}
                      </TableCell>
                      <TableCell>
                        <Link to={`/employees/${benefit.EmployeeID}`} className="text-primary hover:underline">
                          {benefit.EmployeeName}
                        </Link>
                      </TableCell>
                      <TableCell className="flex items-center">
                        <span className="mr-2">{getBenefitIcon(benefit.BenefitType)}</span>
                        {benefit.BenefitType}
                      </TableCell>
                      <TableCell>
                        {formatDate(benefit.StartDate)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="info">
                          {benefit.Coverage}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(benefit.Premium)}
                      </TableCell>
                      <TableCell>
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
                    <TableCell colSpan="7" className="text-center text-muted-foreground py-8">
                      No benefits found for the selected filters.
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

export default BenefitsPage; 