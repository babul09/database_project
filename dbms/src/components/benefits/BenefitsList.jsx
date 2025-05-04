import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import services from '../../services/api';

const BenefitsList = () => {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [filterType, setFilterType] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch employee details
        const employeeResponse = await services.getEmployeeById(id);
        setEmployee(employeeResponse.data);
        
        // Fetch benefits data
        const benefitsResponse = await services.getEmployeeBenefits(id);
        setBenefits(benefitsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching benefits data:', err);
        setError('Failed to load benefits data. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Get unique benefit types for filter
  const benefitTypes = [...new Set(benefits.map(benefit => benefit.BenefitType))];
  
  // Filter benefits based on type
  const filteredBenefits = benefits.filter(benefit => {
    return filterType === '' || benefit.BenefitType === filterType;
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
  const totalPremium = benefits.reduce((total, benefit) => {
    return total + parseFloat(benefit.Premium || 0);
  }, 0);

  // Group benefits by type for summary
  const benefitSummary = benefits.reduce((acc, benefit) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Benefits for {employee?.FirstName} {employee?.LastName}</h2>
        <p className="text-gray-600">View and manage employee benefits</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Benefit Type</label>
            <select
              id="type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {benefitTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => setFilterType('')}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Total Benefits</div>
          <div className="mt-1 text-3xl font-semibold">{benefits.length}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Benefit Types</div>
          <div className="mt-1 text-3xl font-semibold">{Object.keys(benefitSummary).length}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Total Premium</div>
          <div className="mt-1 text-3xl font-semibold">{formatCurrency(totalPremium)}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm font-medium text-gray-500">Avg Premium/Benefit</div>
          <div className="mt-1 text-3xl font-semibold">
            {benefits.length > 0 
              ? formatCurrency(totalPremium / benefits.length)
              : formatCurrency(0)}
          </div>
        </div>
      </div>

      {/* Benefits Summary */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Benefits Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefit Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Premium</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(benefitSummary).map(([type, data], index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {data.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(data.totalPremium)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-semibold">Benefits Details</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefit Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBenefits.length > 0 ? (
                filteredBenefits.map((benefit) => (
                  <tr key={benefit.BenefitID}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{benefit.BenefitType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(benefit.StartDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {benefit.Coverage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(benefit.Premium)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No benefits found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Employee Dependents (for benefits context) */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Dependents</h3>
          <div className="text-sm text-gray-500">
            Showing dependents covered under benefits
          </div>
        </div>
        
        <div className="p-4">
          {/* This will be populated with actual data if we had dependent information */}
          <div className="text-sm text-gray-600 italic">
            Dependent information will be loaded from the database when available.
          </div>
          
          {/* Placeholder for dependents - in a real app this would fetch from the dependents endpoint */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  FD
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Family Dependent</div>
                  <div className="text-xs text-gray-500">Spouse</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>Covered under:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Health Insurance</li>
                  <li>Dental Insurance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsList; 