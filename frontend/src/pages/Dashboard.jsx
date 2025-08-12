import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { simulationAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  CurrencyRupeeIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarDaysIcon,
  TruckIcon,
  BeakerIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalProfit: 0,
    efficiencyScore: 0,
    onTimeDeliveries: 0,
    lateDeliveries: 0,
    fuelCostBreakdown: {
      baseCost: 0,
      trafficSurcharge: 0,
      totalCost: 0
    }
  });
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const historyResponse = await simulationAPI.getHistory({ limit: 10 });
      const history = historyResponse.data.simulations;
      setSimulationHistory(history);

      if (history.length > 0) {
        const latestSimulation = history[0];
        setDashboardData(latestSimulation.results);
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced chart data with gradients and animations
  const deliveryChartData = {
    labels: ['On-time Deliveries', 'Late Deliveries'],
    datasets: [
      {
        data: [dashboardData.onTimeDeliveries, dashboardData.lateDeliveries],
        backgroundColor: [
          'rgba(16, 185, 129, 0.9)',
          'rgba(239, 68, 68, 0.9)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 3,
        hoverBorderWidth: 5,
        hoverOffset: 8,
      },
    ],
  };

  const fuelCostChartData = {
    labels: ['Base Cost', 'Traffic Surcharge'],
    datasets: [
      {
        label: 'Fuel Costs (₹)',
        data: [
          dashboardData.fuelCostBreakdown.baseCost,
          dashboardData.fuelCostBreakdown.trafficSurcharge
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const historyTrendData = {
    labels: simulationHistory.slice(0, 7).reverse().map((_, index) => `Run ${index + 1}`),
    datasets: [
      {
        label: 'Total Profit (₹)',
        data: simulationHistory.slice(0, 7).reverse().map(sim => sim.results.totalProfit),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
      },
      {
        label: 'Efficiency Score (%)',
        data: simulationHistory.slice(0, 7).reverse().map(sim => sim.results.efficiencyScore),
        borderColor: 'rgba(147, 51, 234, 1)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y1',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600',
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <TruckIcon className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 rounded-3xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <ChartBarIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
              <p className="text-emerald-100 text-lg mt-1">Real-time logistics performance insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-emerald-100">
            <CalendarDaysIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Profit Card */}
        <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <CurrencyRupeeIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-emerald-600 text-sm font-medium">
                <ArrowUpIcon className="w-4 h-4" />
                <span>+12.5%</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">Total Profit</p>
            <p className="text-3xl font-bold text-slate-800">₹{dashboardData.totalProfit.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">vs last simulation</p>
          </div>
        </div>

        {/* Efficiency Score Card */}
        <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-lg">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-purple-600 text-sm font-medium">
                <ArrowUpIcon className="w-4 h-4" />
                <span>+8.2%</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">Efficiency Score</p>
            <p className="text-3xl font-bold text-slate-800">{dashboardData.efficiencyScore.toFixed(1)}%</p>
            <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${dashboardData.efficiencyScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* On-time Deliveries Card */}
        <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                <ArrowUpIcon className="w-4 h-4" />
                <span>+5.7%</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">On-time Deliveries</p>
            <p className="text-3xl font-bold text-slate-800">{dashboardData.onTimeDeliveries}</p>
            <p className="text-xs text-slate-500 mt-2">Success rate: 94.2%</p>
          </div>
        </div>

        {/* Late Deliveries Card */}
        <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-red-600 text-sm font-medium">
                <ArrowDownIcon className="w-4 h-4" />
                <span>-3.1%</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">Late Deliveries</p>
            <p className="text-3xl font-bold text-slate-800">{dashboardData.lateDeliveries}</p>
            <p className="text-xs text-slate-500 mt-2">Target: &lt;10 deliveries</p>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Performance Chart */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Delivery Performance</h3>
              <p className="text-sm text-slate-600">Distribution of delivery outcomes</p>
            </div>
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
              <TruckIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="h-64 relative">
            <Doughnut 
              data={deliveryChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: {
                        size: 12,
                        weight: '600',
                      },
                    },
                  },
                },
                cutout: '60%',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">
                  {dashboardData.onTimeDeliveries + dashboardData.lateDeliveries}
                </p>
                <p className="text-sm text-slate-600">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fuel Cost Breakdown */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Fuel Cost Analysis</h3>
              <p className="text-sm text-slate-600">Breakdown of fuel expenses</p>
            </div>
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
              <FireIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="h-64">
            <Bar 
              data={fuelCostChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                    ticks: {
                      callback: function(value) {
                        return '₹' + value.toLocaleString();
                      },
                      font: {
                        size: 11,
                      },
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      font: {
                        size: 11,
                        weight: '600',
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div className="text-center">
              <p className="font-semibold text-slate-700">Total Cost</p>
              <p className="text-lg font-bold text-orange-600">₹{dashboardData.fuelCostBreakdown.totalCost.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-700">Avg per Route</p>
              <p className="text-lg font-bold text-blue-600">₹{Math.round(dashboardData.fuelCostBreakdown.totalCost / Math.max(1, dashboardData.onTimeDeliveries + dashboardData.lateDeliveries)).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation History Trend */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Performance Trends</h3>
            <p className="text-sm text-slate-600">Historical simulation results over time</p>
          </div>
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
            <BeakerIcon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="h-80">
          <Line 
            data={historyTrendData} 
            options={chartOptions}
          />
        </div>
      </div>

      {/* Enhanced Recent Simulations Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Recent Simulations</h3>
              <p className="text-sm text-slate-600">Latest simulation runs and their outcomes</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-200">
              <span className="text-sm font-medium">View All</span>
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Drivers
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Max Hours
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Total Profit
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {simulationHistory.slice(0, 5).map((simulation, index) => (
                <tr key={simulation._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(simulation.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(simulation.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{simulation.inputs.availableDrivers}</span>
                      </div>
                      <span className="text-sm text-slate-700">drivers</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {simulation.inputs.maxHoursPerDay}h
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <CurrencyRupeeIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-slate-900">
                        {simulation.results.totalProfit.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      simulation.results.efficiencyScore >= 80 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                        : simulation.results.efficiencyScore >= 60
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border border-orange-200'
                        : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                    }`}>
                      {simulation.results.efficiencyScore.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {simulationHistory.length === 0 && (
          <div className="text-center py-12">
            <BeakerIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No simulations found</p>
            <p className="text-slate-500 text-sm">Run your first simulation to see data here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
