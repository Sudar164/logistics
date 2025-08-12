import React, { useState, useEffect } from "react";
import { routesAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  MapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [formData, setFormData] = useState({
    routeId: "",
    distanceKm: "",
    trafficLevel: "Low",
    baseTimeMin: "",
  });
  const [errors, setErrors] = useState({});
  const trafficLevels = ["Low", "Medium", "High"];

  useEffect(() => {
    fetchRoutes();
  }, [pagination.currentPage]);

  const fetchRoutes = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      const res = await routesAPI.getAll({ page, limit: 10 });
      setRoutes(res.data.routes);
      setPagination({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        total: res.data.total,
      });
    } catch {
      toast.error("Failed to fetch routes");
    } finally {
      setLoading(false);
    }
  };

  const getTrafficColor = (level) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "High":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const calcSpeed = (dist, time) => {
    const hours = time / 60;
    return hours > 0 ? (dist / hours).toFixed(1) : 0;
  };

  const filteredRoutes = routes.filter(
    (r) =>
      r.routeId.toString().includes(searchTerm) ||
      r.trafficLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDrawer = (mode, route = null) => {
    setDrawerMode(mode);
    setSelectedRoute(route);
    if (mode === "add") {
      const ids = routes.map((r) => r.routeId);
      const nextId = ids.length ? Math.max(...ids) + 1 : 1;
      setFormData({
        routeId: nextId,
        distanceKm: "",
        trafficLevel: "Low",
        baseTimeMin: "",
      });
    } else if (route) {
      setFormData({
        routeId: route.routeId,
        distanceKm: route.distanceKm,
        trafficLevel: route.trafficLevel,
        baseTimeMin: route.baseTimeMin,
      });
    }
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRoute(null);
    setErrors({});
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-72">
        <div className="loading-spinner mr-2"></div> Loading...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">
          🗺 Routes{" "}
          <span className="text-gray-500 text-sm">({pagination.total} total)</span>
        </h1>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search routes..."
              className="pl-10 pr-3 py-2 border rounded-lg w-full"
            />
          </div>
          <button
            onClick={() => openDrawer("add")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" /> Add
          </button>
        </div>
      </div>

      {/* Grid View */}
      {filteredRoutes.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 rounded-lg">
          <MapIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-2 text-gray-500">No routes found</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoutes.map((route) => (
            <div
              key={route._id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <MapIcon className="h-6 w-6 text-primary-600" />
                  <h3 className="text-lg font-bold">Route #{route.routeId}</h3>
                </div>
                <p className="text-xs text-gray-500">ID: {route._id.slice(-6)}</p>

                <div className="mt-3 text-sm">
                  <p>Distance: {route.distanceKm} km</p>
                  <p>
                    Traffic:{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getTrafficColor(
                        route.trafficLevel
                      )}`}
                    >
                      {route.trafficLevel}
                    </span>
                  </p>
                  <p>
                    Base Time: {route.baseTimeMin} min
                  </p>
                  <p>Avg Speed: {calcSpeed(route.distanceKm, route.baseTimeMin)} km/h</p>
                </div>
              </div>

              <div className="flex mt-4 gap-2">
                <button
                  onClick={() => openDrawer("view", route)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <EyeIcon className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => openDrawer("edit", route)}
                  className="p-1 hover:bg-blue-50 rounded"
                >
                  <PencilIcon className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  onClick={() => console.log("delete route")}
                  className="p-1 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() =>
              setPagination((p) => ({ ...p, currentPage: p.currentPage - 1 }))
            }
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          Page {pagination.currentPage} of {pagination.totalPages}
          <button
            onClick={() =>
              setPagination((p) => ({ ...p, currentPage: p.currentPage + 1 }))
            }
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={closeDrawer}
          ></div>
          <div className="w-full sm:w-[400px] bg-white p-6 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {drawerMode === "add" && "Add Route"}
                {drawerMode === "edit" && "Edit Route"}
                {drawerMode === "view" && "Route Details"}
              </h2>
              <XMarkIcon
                className="h-6 w-6 cursor-pointer"
                onClick={closeDrawer}
              />
            </div>
            {drawerMode === "view" ? (
              <div>
                <p>Route ID: {selectedRoute?.routeId}</p>
                <p>Distance: {selectedRoute?.distanceKm} km</p>
              </div>
            ) : (
              <form>
                {/* Example input (add your validations) */}
                <label className="block mt-4">Distance (km)</label>
                <input
                  type="number"
                  value={formData.distanceKm}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, distanceKm: e.target.value }))
                  }
                  className="border rounded w-full p-2"
                />
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;
