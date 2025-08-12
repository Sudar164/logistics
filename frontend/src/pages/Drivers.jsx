import React, { useState, useEffect } from "react";
import { driversAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  // Drawer states
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add"); // 'add', 'edit', 'view'
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    shiftHours: "",
    pastWeekHours: Array(7).fill(""),
  });
  const [errors, setErrors] = useState({});
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    fetchDrivers();
  }, [pagination.currentPage]);

  const fetchDrivers = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      const response = await driversAPI.getAll({
        page,
        limit: 10,
        isActive: true,
      });
      setDrivers(response.data.drivers);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      toast.error("Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages && page !== pagination.currentPage) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const openDrawer = (mode, driver = null) => {
    setDrawerMode(mode);
    setSelectedDriver(driver);
    setErrors({});
    if (mode === "add") {
      setFormData({ name: "", shiftHours: "", pastWeekHours: Array(7).fill("") });
    } else if (driver) {
      setFormData({
        name: driver.name,
        shiftHours: driver.shiftHours.toString(),
        pastWeekHours: driver.pastWeekHours.map((h) => h.toString()),
      });
    }
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedDriver(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleDayHoursChange = (index, value) => {
    const newPastWeekHours = [...formData.pastWeekHours];
    newPastWeekHours[index] = value;
    setFormData((prev) => ({ ...prev, pastWeekHours: newPastWeekHours }));
    setErrors((prev) => ({ ...prev, [`day${index}`]: "" }));
  };

  const calculateAverageHours = (hours) => {
    const total = hours.reduce((sum, val) => sum + val, 0);
    return (total / 7).toFixed(1);
  };

  const getWorkloadStatus = (avg) => {
    if (avg < 6) return { status: "Light", color: "bg-green-100 text-green-800" };
    if (avg < 8) return { status: "Normal", color: "bg-blue-100 text-blue-800" };
    if (avg < 10) return { status: "Heavy", color: "bg-yellow-100 text-yellow-800" };
    return { status: "Overwork", color: "bg-red-100 text-red-800" };
  };

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-72">
        <div className="loading-spinner mr-2"></div> Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Drivers <span className="text-gray-500 text-sm">({pagination.total} total)</span>
        </h1>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute h-5 w-5 text-gray-400 top-2.5 left-3" />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border rounded-lg w-full"
            />
          </div>
          <button
            onClick={() => openDrawer("add")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
          >
            <PlusIcon className="h-5 w-5" /> Add
          </button>
        </div>
      </div>

      {/* Driver Cards */}
      {filteredDrivers.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No Drivers Found</h3>
          {!searchTerm && (
            <p className="text-gray-600">Start by adding your first driver.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDrivers.map((driver) => {
            const avg = calculateAverageHours(driver.pastWeekHours);
            const workload = getWorkloadStatus(parseFloat(avg));
            return (
              <div
                key={driver._id}
                className="bg-white p-5 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{driver.name}</h4>
                    <p className="text-xs text-gray-500">ID: {driver._id.slice(-6)}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm space-y-1">
                  <p className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-gray-400" /> Shift:{" "}
                    <span className="font-medium">{driver.shiftHours}h</span>
                  </p>
                  <p>Avg Week: {avg}h</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${workload.color}`}
                  >
                    {workload.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openDrawer("view", driver)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <EyeIcon className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => openDrawer("edit", driver)}
                    className="p-1 hover:bg-blue-50 rounded"
                  >
                    <PencilIcon className="h-4 w-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => console.log("Delete")}
                    className="p-1 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black bg-opacity-30" onClick={closeDrawer}></div>
          <div className="w-full sm:w-[400px] bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {drawerMode === "add" && "Add Driver"}
                {drawerMode === "edit" && "Edit Driver"}
                {drawerMode === "view" && "Driver Details"}
              </h2>
              <button onClick={closeDrawer}>
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {drawerMode === "view" ? (
              <div>
                <p className="mb-2"><strong>Name:</strong> {selectedDriver.name}</p>
                <p><strong>Shift:</strong> {selectedDriver.shiftHours}h</p>
              </div>
            ) : (
              <form>
                <label className="block mb-2">Name</label>
                <input
                  className="border w-full mb-4 p-2 rounded"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
