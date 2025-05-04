import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../../services/api';
import { motion } from 'framer-motion';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
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
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute mt-1 w-full z-50"
            >
              <Card className="border border-border/60 shadow-lg shadow-black/20">
                <CardContent className="p-2">
                  {isSearching ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((result) => (
                        <motion.button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-md my-1"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="font-medium">{result.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Badge variant="secondary" className="mt-1 capitalize">
                              {result.type}
                            </Badge>
                          </div>
                        </motion.button>
                      ))}
                      {searchResults.length > 8 && (
                        <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border/40">
                          Showing top results. Type more to refine.
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground">No results found</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
        
        {/* Notification bell */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-accent">
            <Bell className="h-5 w-5" />
          </Button>
        </motion.div>
        
        {/* Profile dropdown */}
        <div className="relative">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 hover:bg-accent"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden md:block">John Doe</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
          
          {isProfileOpen && (
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 z-50"
            >
              <Card className="border border-border/60 shadow-lg shadow-black/20">
                <CardContent className="p-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-md my-1"
                    onClick={() => {
                      navigate('/profile');
                      setIsProfileOpen(false);
                    }}
                  >
                    Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-md my-1"
                    onClick={() => {
                      navigate('/settings');
                      setIsProfileOpen(false);
                    }}
                  >
                    Settings
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-md my-1 text-destructive"
                    onClick={() => {
                      // Handle logout
                      setIsProfileOpen(false);
                    }}
                  >
                    Logout
                  </motion.button>
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