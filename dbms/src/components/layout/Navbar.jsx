import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../../services/api';
import { motion } from 'framer-motion';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  
  // Data states
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch data for search
    const fetchSearchData = async () => {
      try {
        const [employeesRes, departmentsRes, projectsRes] = await Promise.all([
          services.getAllEmployees(),
          services.getAllDepartments(),
          services.getAllProjects()
        ]);
        setEmployees(employeesRes.data);
        setDepartments(departmentsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Error fetching search data:', error);
      }
    };

    fetchSearchData();
  }, []);

  // Implement debounce for search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    // Handle clicks outside the search results
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Search logic
    if (debouncedTerm.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const term = debouncedTerm.toLowerCase();
    
    // Search employees
    const matchedEmployees = employees
      .filter(emp => 
        emp.FirstName?.toLowerCase().includes(term) || 
        emp.LastName?.toLowerCase().includes(term) ||
        emp.Email?.toLowerCase().includes(term)
      )
      .slice(0, 3) // Limit to 3 results per category
      .map(emp => ({
        id: emp.EmployeeID,
        name: `${emp.FirstName} ${emp.LastName}`,
        type: 'employee',
        path: `/employees/${emp.EmployeeID}`
      }));
    
    // Search departments
    const matchedDepartments = departments
      .filter(dept => 
        dept.DepartmentName?.toLowerCase().includes(term)
      )
      .slice(0, 3)
      .map(dept => ({
        id: dept.DepartmentID,
        name: dept.DepartmentName,
        type: 'department',
        path: `/departments` // Navigate to departments page with this dept highlighted
      }));
    
    // Search projects
    const matchedProjects = projects
      .filter(proj => 
        proj.ProjectName?.toLowerCase().includes(term)
      )
      .slice(0, 3)
      .map(proj => ({
        id: proj.ProjectID,
        name: proj.ProjectName,
        type: 'project',
        path: `/projects` // Navigate to projects page with this project highlighted
      }));
    
    // Combine all results
    const combinedResults = [
      ...matchedEmployees,
      ...matchedDepartments,
      ...matchedProjects
    ];
    
    setSearchResults(combinedResults);
    setShowResults(combinedResults.length > 0);
    setIsSearching(false);
  }, [debouncedTerm, employees, departments, projects]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === '') {
      setShowResults(false);
    } else if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleResultClick = (result) => {
    navigate(result.path);
    setSearchTerm('');
    setShowResults(false);
  };
  
  // Handle keyboard navigation in search results
  const handleKeyDown = (e) => {
    if (!showResults || searchResults.length === 0) return;
    
    if (e.key === 'Escape') {
      setShowResults(false);
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      handleResultClick(searchResults[0]); // Select first result on Enter
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-card shadow-md px-6 py-3 flex justify-between items-center border-b border-border/40"
    >
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center"
      >
        <h1 className="text-xl font-semibold text-card-foreground">Employee Management System</h1>
      </motion.div>
      
      <div className="flex items-center space-x-4">
        {/* Search bar */}
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 bg-muted border-muted focus:bg-card transition-colors"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowResults(true);
                }
              }}
            />
          </div>
          
          {/* Search Results Dropdown */}
          {showResults && (
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 w-full bg-card rounded-md shadow-lg border border-border overflow-hidden"
            >
              <Card>
                <CardContent className="p-0">
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">No results found</div>
                  ) : (
                    <ul className="max-h-72 overflow-auto">
                      {searchResults.map((result) => (
                        <li key={`${result.type}-${result.id}`} className="border-b border-border last:border-0">
                          <button
                            className="w-full px-4 py-2 hover:bg-accent text-left flex items-center justify-between transition-colors"
                            onClick={() => handleResultClick(result)}
                          >
                            <div>
                              <div className="font-medium text-card-foreground">{result.name}</div>
                              <div className="text-xs text-muted-foreground capitalize">{result.type}</div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {result.type}
                            </Badge>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        
        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{currentUser?.name || 'User'}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          {isProfileOpen && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-card rounded-md shadow-lg border border-border z-50"
            >
              <Card>
                <CardContent className="p-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{currentUser?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email || 'user@example.com'}</p>
                    <p className="text-xs font-medium mt-1 text-primary capitalize">
                      {currentUser?.role || 'User'}
                    </p>
                  </div>
                  <div className="border-t border-border mt-2 pt-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar; 