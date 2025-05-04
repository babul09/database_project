import { useState, useEffect } from 'react';
import services from '../../services/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await services.getAllProjects();
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.ProjectName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || 
      project.Status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Calculate project progress
  const calculateProgress = (project) => {
    const startDate = new Date(project.StartDate);
    const endDate = new Date(project.EndDate);
    const today = new Date();
    
    // If project is completed, return 100%
    if (project.Status === 'Completed') return 100;
    
    // If project hasn't started yet, return 0%
    if (today < startDate) return 0;
    
    // If project has ended but not marked as completed, return 90%
    if (today > endDate) return 90;
    
    // Calculate progress percentage based on timeline
    const totalDuration = endDate - startDate;
    const elapsedDuration = today - startDate;
    const progress = Math.round((elapsedDuration / totalDuration) * 100);
    
    return Math.min(progress, 100);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Project
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-400 absolute left-3 top-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Planning">Planning</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Projects List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => {
              const progress = calculateProgress(project);
              
              return (
                <div key={project.ProjectID} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{project.ProjectName}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.Status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            project.Status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {project.Status}
                          </span>
                          <span className="text-gray-500 text-sm ml-3">
                            ID: {project.ProjectID}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                        <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Timeline</h4>
                        <p className="text-gray-800">
                          {formatDate(project.StartDate)} - {formatDate(project.EndDate)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Budget</h4>
                        <p className="text-gray-800">{formatCurrency(project.Budget)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Progress</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div 
                            className={`h-2.5 rounded-full ${
                              project.Status === 'Completed' ? 'bg-green-500' : 
                              progress > 75 ? 'bg-yellow-500' : 
                              'bg-blue-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{progress}% complete</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              No projects found matching your filters
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectList; 