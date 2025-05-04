import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../../services/api';

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
    <div className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">Employee Management System</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search bar */}
        <div className="relative" ref={searchRef}>
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowResults(true);
              }
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          
          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
              <div className="py-1">
                {isSearching ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <div className="font-medium">{result.name}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {result.type}
                        </div>
                      </button>
                    ))}
                    {searchResults.length > 8 && (
                      <div className="px-4 py-2 text-xs text-gray-500 border-t">
                        Showing top results. Type more to refine.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Notification bell */}
        <button className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
        
        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              BB
            </div>
            <span className="text-gray-700">Babul Bishwas</span>
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </a>
              <hr className="my-1" />
              <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar; 