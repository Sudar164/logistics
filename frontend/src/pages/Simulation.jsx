import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { simulationAPI, driversAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  PlayIcon,
  ChartBarIcon,
  ClockIcon,
  TruckIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  EyeIcon,
  ChevronDownIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ClockIcon as TimeIcon,
  MapPinIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

function Simulation() {
  // State management
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDriverDetails, setShowDriverDetails] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors }, setValue, reset } = useForm({
    defaultValues: {
      selectedDriverIds: [],
      startTime: '09:00',
      maxHoursPerDay: 8
    }
  });

  const watchedDriverIds = watch('selectedDriverIds');

  // Fetch drivers on component mount
  useEffect(() => {
    fetchDrivers();
    fetchSimulationHistory();
  }, []);

  // Update selected drivers when form changes
  useEffect(() => {
    if (watchedDriverIds && drivers.length > 0) {
      const selected = drivers.filter(driver => 
        watchedDriverIds.includes(driver._id)
      );
      setSelectedDrivers(selected);
    }
  }, [watchedDriverIds, drivers]);

  // Fetch drivers function
  const fetchDrivers = async () => {
    try {
      const response = await driversAPI.getAll({ limit: 100, isActive: true });
      setDrivers(response.data.drivers);
    } catch (error) {
      console.error('Fetch drivers error:', error);
      toast.error('Failed to fetch drivers');
    }
  };

  // Fetch simulation history
  const fetchSimulationHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await simulationAPI.getHistory({ limit: 10 });
      setSimulationHistory(response.data.simulations);
    } catch (error) {
      console.error('Fetch history error:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Calculate driver fatigue for display
  const calculateDriverFatigue = (driver) => {
    const totalHours = driver.pastWeekHours.reduce((sum, hours) => sum + hours, 0);
    const avgHoursPerDay = totalHours / 7;
    return {
      average: avgHoursPerDay.toFixed(1),
      status: avgHoursPerDay > 8 ? 'High Fatigue' : avgHoursPerDay > 6 ? 'Medium Fatigue' : 'Low Fatigue',
      color: avgHoursPerDay > 8 ? 'text-red-600 bg-red-100 border-red-200' : avgHoursPerDay > 6 ? 'text-amber-600 bg-amber-100 border-amber-200' : 'text-emerald-600 bg-emerald-100 border-emerald-200'
    };
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (data.selectedDriverIds.length === 0) {
      toast.error('Please select at least one driver');
      return;
    }

    setLoading(true);
    try {
      const response = await simulationAPI.runSimulation({
        availableDrivers: data.selectedDriverIds.length,
        selectedDriverIds: data.selectedDriverIds,
        startTime: data.startTime,
        maxHoursPerDay: parseFloat(data.maxHoursPerDay)
      });

      setSimulationResult(response.data.results);
      toast.success('Simulation completed successfully! 🎉');
      
      // Refresh history
      fetchSimulationHistory();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Simulation failed');
      console.error('Simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Quick select functions
  const selectAllDrivers = () => {
    const allDriverIds = drivers.map(driver => driver._id);
    setValue('selectedDriverIds', allDriverIds);
  };

  const clearAllDrivers = () => {
    setValue('selectedDriverIds', []);
  };

  const selectTopPerformers = () => {
    const topPerformers = drivers
      .filter(driver => calculateDriverFatigue(driver).average <= 7)
      .slice(0, 5)
      .map(driver => driver._id);
    setValue('selectedDriverIds', topPerformers);
  };

  // Reset form and results
  const resetSimulation = () => {
    reset();
    setSimulationResult(null);
    setSelectedDrivers([]);
  };

  // Load a previous simulation
  const loadSimulation = (simulation) => {
    setValue('startTime', simulation.inputs.startTime);
    setValue('maxHoursPerDay', simulation.inputs.maxHoursPerDay);
    if (simulation.inputs.selectedDriverIds) {
      setValue('selectedDriverIds', simulation.inputs.selectedDriverIds);
    }
    setSimulationResult(simulation.results);
    toast.success('Simulation loaded successfully! 📊');
  };

  return (
    <div className="space-y-8 p-1">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 mb-6 sm:mb-0">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <BoltIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Smart Simulation Lab</h1>
                <p className="text-indigo-100 text-lg mt-1">AI-powered delivery optimization engine</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/30"
              >
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                {showHistory ? 'Hide' : 'Show'} History
              </button>
              <button
                type="button"
                onClick={resetSimulation}
                className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/30"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Simulation Form */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-slate-200/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <AdjustmentsHorizontalIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Simulation Configuration</h2>
              <p className="text-slate-600">Configure parameters for optimal delivery simulation</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Driver Selection with Modern Cards */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-1">
                  Driver Selection
                </label>
                <p className="text-sm text-slate-600">
                  {selectedDrivers.length} of {drivers.length} drivers selected
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectAllDrivers}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={selectTopPerformers}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Top Performers
                </button>
                <button
                  type="button"
                  onClick={clearAllDrivers}
                  className="px-3 py-1.5 bg-gradient-to-r from-slate-500 to-slate-600 text-white text-sm rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowDriverDetails(!showDriverDetails)}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  {showDriverDetails ? 'Hide' : 'Show'} Details
                </button>
              </div>
            </div>

            <Controller
              name="selectedDriverIds"
              control={control}
              rules={{ required: 'Please select at least one driver' }}
              render={({ field }) => (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60">
                  {drivers.map((driver) => {
                    const fatigue = calculateDriverFatigue(driver);
                    const isSelected = field.value.includes(driver._id);
                    
                    return (
                      <div
                        key={driver._id}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-lg' 
                            : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }`}
                        onClick={() => {
                          const checkbox = document.getElementById(`driver-${driver._id}`);
                          checkbox.click();
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id={`driver-${driver._id}`}
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                if (e.target.checked) {
                                  field.onChange([...field.value, driver._id]);
                                } else {
                                  field.onChange(field.value.filter(id => id !== driver._id));
                                }
                              }}
                              className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-bold text-slate-800">{driver.name}</h4>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${fatigue.color}`}>
                                  {fatigue.status}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-slate-600">
                                <div className="flex items-center space-x-1">
                                  <ClockIcon className="w-4 h-4" />
                                  <span>{driver.shiftHours}h shift</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <ChartBarIcon className="w-4 h-4" />
                                  <span>{fatigue.average}h avg</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                            </div>
                          )}
                        </div>

                        {showDriverDetails && (
                          <div className="mt-4 p-3 bg-white/60 rounded-xl border border-slate-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-slate-700">Past Week Hours</span>
                              <div className="flex space-x-1">
                                {driver.pastWeekHours.map((hours, index) => (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center justify-center w-8 h-8 text-xs font-bold rounded-lg ${
                                      hours > 8 ? 'bg-red-100 text-red-700' :
                                      hours > 6 ? 'bg-amber-100 text-amber-700' :
                                      'bg-emerald-100 text-emerald-700'
                                    }`}
                                  >
                                    {hours}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            />
            {errors.selectedDriverIds && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.selectedDriverIds.message}
              </p>
            )}
          </div>

          {/* Configuration Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center text-lg font-bold text-slate-800">
                <TimeIcon className="w-5 h-5 mr-2 text-indigo-600" />
                Route Start Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  {...register('startTime', { required: 'Start time is required' })}
                  className="w-full pl-4 pr-4 py-4 bg-white/80 border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 text-lg font-medium"
                />
              </div>
              {errors.startTime && (
                <p className="text-red-500 text-sm flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-lg font-bold text-slate-800">
                <ClockIcon className="w-5 h-5 mr-2 text-purple-600" />
                Max Hours per Driver per Day
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="24"
                  step="0.5"
                  {...register('maxHoursPerDay', { 
                    required: 'Max hours is required',
                    min: { value: 1, message: 'Must be at least 1 hour' },
                    max: { value: 24, message: 'Must be at most 24 hours' }
                  })}
                  className="w-full pl-4 pr-12 py-4 bg-white/80 border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200 text-lg font-medium"
                  placeholder="8"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">hours</span>
              </div>
              {errors.maxHoursPerDay && (
                <p className="text-red-500 text-sm flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {errors.maxHoursPerDay.message}
                </p>
              )}
            </div>
          </div>

          {/* Selected Drivers Summary */}
          {selectedDrivers.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
              <h4 className="flex items-center text-lg font-bold text-blue-900 mb-4">
                <UserGroupIcon className="w-6 h-6 mr-2" />
                Selected Team Overview
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/60 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{selectedDrivers.length}</div>
                  <div className="text-sm font-medium text-blue-800">Total Drivers</div>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    {(selectedDrivers.reduce((sum, d) => sum + d.shiftHours, 0) / selectedDrivers.length).toFixed(1)}h
                  </div>
                  <div className="text-sm font-medium text-indigo-800">Avg Shift Hours</div>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {selectedDrivers.filter(d => calculateDriverFatigue(d).average > 8).length}
                  </div>
                  <div className="text-sm font-medium text-red-800">High Fatigue Risk</div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || selectedDrivers.length === 0}
              className="relative group px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  <span>Running Simulation...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-6 h-6 mr-3" />
                  <span>Launch Simulation</span>
                  <SparklesIcon className="w-6 h-6 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Enhanced Simulation History */}
      {showHistory && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Simulation Archive</h3>
                  <p className="text-slate-600">Historical simulation results and insights</p>
                </div>
              </div>
              <button
                onClick={fetchSimulationHistory}
                className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors duration-200"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            {historyLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Loading simulation history...</p>
              </div>
            ) : simulationHistory.length === 0 ? (
              <div className="text-center py-12">
                <ChartPieIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium text-lg">No simulation history found</p>
                <p className="text-slate-500">Run your first simulation to see results here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Drivers</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Profit</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Efficiency</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {simulationHistory.map((simulation, index) => (
                      <tr key={simulation._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {new Date(simulation.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(simulation.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{simulation.inputs.availableDrivers}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-700">drivers</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <CurrencyRupeeIcon className="w-5 h-5 text-emerald-600" />
                            <span className="text-lg font-bold text-slate-900">
                              {simulation.results.totalProfit.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold border-2 ${
                            simulation.results.efficiencyScore >= 80 
                              ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200'
                              : simulation.results.efficiencyScore >= 60
                              ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200'
                              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
                          }`}>
                            {simulation.results.efficiencyScore.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => loadSimulation(simulation)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
                            title="Load Simulation"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Simulation Results */}
      {simulationResult && (
        <div className="space-y-8">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="relative z-10 flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <CheckCircleIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold">Simulation Complete! 🎉</h3>
                <p className="text-emerald-100 text-lg mt-1">
                  Successfully processed {simulationResult.onTimeDeliveries + simulationResult.lateDeliveries} deliveries
                  with {selectedDrivers.length} optimized drivers
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <CurrencyRupeeIcon className="w-6 h-6 text-white" />
                  </div>
                  <SparklesIcon className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-emerald-700 mb-1">Total Profit</p>
                <p className="text-3xl font-bold text-slate-800">₹{simulationResult.totalProfit.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-2">Revenue generated</p>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-lg">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  <StarIcon className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-sm font-bold text-purple-700 mb-1">Efficiency Score</p>
                <p className="text-3xl font-bold text-slate-800">{simulationResult.efficiencyScore.toFixed(1)}%</p>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${simulationResult.efficiencyScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <ClockIcon className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm font-bold text-green-700 mb-1">On-time Deliveries</p>
                <p className="text-3xl font-bold text-slate-800">{simulationResult.onTimeDeliveries}</p>
                <p className="text-xs text-slate-500 mt-2">Successful deliveries</p>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg">
                    <ExclamationCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <BoltIcon className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-sm font-bold text-red-700 mb-1">Late Deliveries</p>
                <p className="text-3xl font-bold text-slate-800">{simulationResult.lateDeliveries}</p>
                <p className="text-xs text-slate-500 mt-2">Needs improvement</p>
              </div>
            </div>
          </div>

          {/* Enhanced Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Delivery Performance</h3>
                  <p className="text-sm text-slate-600">Distribution of delivery outcomes</p>
                </div>
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <ChartPieIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="h-64 relative">
                <Doughnut 
                  data={{
                    labels: ['On-time', 'Late'],
                    datasets: [{
                      data: [simulationResult.onTimeDeliveries, simulationResult.lateDeliveries],
                      backgroundColor: [
                        'rgba(16, 185, 129, 0.9)',
                        'rgba(239, 68, 68, 0.9)',
                      ],
                      borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(239, 68, 68, 1)',
                      ],
                      borderWidth: 3,
                      hoverOffset: 8,
                    }]
                  }}
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
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed * 100) / total).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    cutout: '60%',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">
                      {simulationResult.onTimeDeliveries + simulationResult.lateDeliveries}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">Total Orders</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Fuel Cost Analysis</h3>
                  <p className="text-sm text-slate-600">Breakdown of operational expenses</p>
                </div>
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                  <FireIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="h-64">
                <Bar 
                  data={{
                    labels: ['Base Cost', 'Traffic Surcharge', 'Total Cost'],
                    datasets: [{
                      label: 'Amount (₹)',
                      data: [
                        simulationResult.fuelCostBreakdown.baseCost,
                        simulationResult.fuelCostBreakdown.trafficSurcharge,
                        simulationResult.fuelCostBreakdown.totalCost
                      ],
                      backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                      ],
                      borderColor: [
                        'rgba(59, 130, 246, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)'
                      ],
                      borderWidth: 2,
                      borderRadius: 8,
                      borderSkipped: false,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `₹${context.parsed.y.toLocaleString()}`;
                          }
                        }
                      }
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
                        }
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
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Delivery Details Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Delivery Details</h3>
                  <p className="text-sm text-slate-600">Comprehensive breakdown of all deliveries</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Profit</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Penalty</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Bonus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {simulationResult.deliveryStats?.map((delivery) => (
                    <tr key={delivery.orderId} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-900">#{delivery.orderId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border-2 ${
                          delivery.isOnTime 
                            ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200'
                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
                        }`}>
                          {delivery.isOnTime ? '✅ On-time' : '⚠️ Late'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-900">₹{delivery.profit?.toFixed(2) || 0}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${delivery.penalty > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                          {delivery.penalty > 0 ? `₹${delivery.penalty}` : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${delivery.bonus > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {delivery.bonus > 0 ? `₹${delivery.bonus?.toFixed(2)}` : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Enhanced Summary Statistics */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 border-2 border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white/80 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {simulationResult.deliveryStats?.length || 0}
                </div>
                <div className="text-sm font-medium text-slate-600">Total Orders</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  ₹{(simulationResult.totalProfit / (simulationResult.deliveryStats?.length || 1)).toFixed(0)}
                </div>
                <div className="text-sm font-medium text-slate-600">Avg Profit/Order</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ₹{simulationResult.fuelCostBreakdown.totalCost.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-slate-600">Total Fuel Cost</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {selectedDrivers.length}
                </div>
                <div className="text-sm font-medium text-slate-600">Drivers Deployed</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Simulation;
