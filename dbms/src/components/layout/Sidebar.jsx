import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { 
  Home, 
  Users, 
  Briefcase, 
  FolderOpen, 
  Clock, 
  CalendarDays, 
  Heart 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/employees', label: 'Employees', icon: <Users className="h-5 w-5" /> },
    { path: '/departments', label: 'Departments', icon: <Briefcase className="h-5 w-5" /> },
    { path: '/projects', label: 'Projects', icon: <FolderOpen className="h-5 w-5" /> },
    { path: '/timetracking', label: 'Time Tracking', icon: <Clock className="h-5 w-5" /> },
    { path: '/leaves', label: 'Leave Management', icon: <CalendarDays className="h-5 w-5" /> },
    { path: '/benefits', label: 'Benefits', icon: <Heart className="h-5 w-5" /> },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card text-card-foreground border-r border-border/40 w-64 min-h-screen p-4"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-2xl font-bold mb-8 text-center"
      >
        <span className="text-primary">EMS</span>
        <span className="text-foreground">Dashboard</span>
      </motion.div>
      
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
          >
            <Link
              to={item.path}
              className="block w-full"
            >
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === item.path 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </div>
              </Button>
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar; 