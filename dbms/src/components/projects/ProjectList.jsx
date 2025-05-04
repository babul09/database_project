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
import { Search, Plus, Edit, Trash, Eye, Calendar } from 'lucide-react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

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

  // Filter projects based on search term and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.ProjectName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.Description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || project.Status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Planning':
        return 'info';
      default:
        return 'secondary';
    }
  };

  // Format date to display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <AnimatedHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate('/projects/new')}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
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
                    placeholder="Search projects..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                <Select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <SelectOption value="">All Statuses</SelectOption>
                  <SelectOption value="Completed">Completed</SelectOption>
                  <SelectOption value="In Progress">In Progress</SelectOption>
                  <SelectOption value="Planning">Planning</SelectOption>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
      
      {/* Projects Grid */}
      <AnimatedSection delay={0.2}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <motion.div 
                  key={project.ProjectID}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant={getStatusBadge(project.Status)} className="mb-2">
                            {project.Status}
                          </Badge>
                          <CardTitle className="text-xl">
                            <Link to={`/projects/${project.ProjectID}`} className="hover:text-primary">
                              {project.ProjectName}
                            </Link>
                          </CardTitle>
                        </div>
                        <div className="flex space-x-1">
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => navigate(`/projects/${project.ProjectID}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-indigo-600 hover:text-indigo-800"
                              onClick={() => navigate(`/projects/${project.ProjectID}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2 mb-4 h-10">
                        {project.Description || 'No description provided.'}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Start Date</p>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <p>{formatDate(project.StartDate)}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">End Date</p>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <p>{formatDate(project.EndDate)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-muted-foreground text-sm">Team Size</p>
                        <p className="font-medium">{project.TeamSize || 'Not specified'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center p-8">
                <p className="text-muted-foreground">No projects found matching your filters</p>
              </div>
            )}
          </div>
        )}
      </AnimatedSection>
    </div>
  );
};

export default ProjectList; 