import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import services from '../../services/api';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNo: '',
    Gender: 'Male',
    HireDate: '',
    DepartmentID: '',
    SupervisorID: '',
    Salary: '',
    Address: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments and potential supervisors
        const [departmentsRes, employeesRes] = await Promise.all([
          services.getAllDepartments(),
          services.getAllEmployees()
        ]);
        
        setDepartments(departmentsRes.data);
        setSupervisors(employeesRes.data);
        
        // If editing, fetch the employee data
        if (isEditing) {
          const employeeRes = await services.getEmployeeById(id);
          const employee = employeeRes.data;
          
          // Format dates for form input
          const formattedHireDate = employee.HireDate 
            ? new Date(employee.HireDate).toISOString().split('T')[0] 
            : '';
            
          setFormData({
            FirstName: employee.FirstName || '',
            LastName: employee.LastName || '',
            Email: employee.Email || '',
            PhoneNo: employee.PhoneNo || '',
            Gender: employee.Gender || 'Male',
            HireDate: formattedHireDate,
            DepartmentID: employee.DepartmentID || '',
            SupervisorID: employee.SupervisorID || '',
            Salary: employee.Salary || '',
            Address: employee.Address || ''
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Create a copy of form data to prepare for submission
      const submissionData = { ...formData };
      
      // Format data for submission
      // Convert empty strings to null
      Object.keys(submissionData).forEach(key => {
        if (submissionData[key] === '') {
          submissionData[key] = null;
        }
      });
      
      // Ensure DepartmentID is a number
      if (submissionData.DepartmentID) {
        submissionData.DepartmentID = parseInt(submissionData.DepartmentID, 10);
      }
      
      // Ensure SupervisorID is a number
      if (submissionData.SupervisorID) {
        submissionData.SupervisorID = parseInt(submissionData.SupervisorID, 10);
      }
      
      // Ensure Salary is a number
      if (submissionData.Salary) {
        submissionData.Salary = parseFloat(submissionData.Salary);
      }
      
      console.log('Submitting employee data:', submissionData);
      
      if (isEditing) {
        await services.updateEmployee(id, submissionData);
      } else {
        await services.createEmployee(submissionData);
      }
      
      // Redirect back to employees list on success
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      
      // Extract detailed error message if available
      const errorMessage = error.response && error.response.data 
        ? error.response.data.error || error.response.data.message
        : 'Failed to save employee. Please check your inputs and try again.';
        
      setError(errorMessage);
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {isEditing ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        <button
          onClick={() => navigate('/employees')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            
            <div className="mb-4">
              <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                type="text"
                id="FirstName"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="LastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                id="LastName"
                name="LastName"
                value={formData.LastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                id="Email"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="PhoneNo" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="PhoneNo"
                name="PhoneNo"
                value={formData.PhoneNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="Gender"
                    value="Male"
                    checked={formData.Gender === 'Male'}
                    onChange={handleInputChange}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="Gender"
                    value="Female"
                    checked={formData.Gender === 'Female'}
                    onChange={handleInputChange}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Female</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="Gender"
                    value="Other"
                    checked={formData.Gender === 'Other'}
                    onChange={handleInputChange}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Other</span>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="Address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="Address"
                name="Address"
                value={formData.Address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          
          {/* Employment Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
            
            <div className="mb-4">
              <label htmlFor="HireDate" className="block text-sm font-medium text-gray-700 mb-1">
                Hire Date*
              </label>
              <input
                type="date"
                id="HireDate"
                name="HireDate"
                value={formData.HireDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="DepartmentID" className="block text-sm font-medium text-gray-700 mb-1">
                Department*
              </label>
              <select
                id="DepartmentID"
                name="DepartmentID"
                value={formData.DepartmentID}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.DepartmentID} value={dept.DepartmentID}>
                    {dept.DepartmentName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="SupervisorID" className="block text-sm font-medium text-gray-700 mb-1">
                Supervisor
              </label>
              <select
                id="SupervisorID"
                name="SupervisorID"
                value={formData.SupervisorID}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Supervisor</option>
                {supervisors
                  .filter(sup => sup.EmployeeID !== Number(id)) // Prevent employee from being their own supervisor
                  .map(sup => (
                    <option key={sup.EmployeeID} value={sup.EmployeeID}>
                      {`${sup.FirstName} ${sup.LastName}`}
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="Salary" className="block text-sm font-medium text-gray-700 mb-1">
                Salary*
              </label>
              <input
                type="number"
                id="Salary"
                name="Salary"
                value={formData.Salary}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center"
          >
            {submitting && (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isEditing ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm; 