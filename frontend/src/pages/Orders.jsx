import React, { useState, useEffect } from "react";
import { ordersAPI, routesAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  ShoppingBagIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add"); // 'add', 'edit', 'view'
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [formData, setFormData] = useState({
    orderId: "",
    valueRs: "",
    routeId: "",
    deliveryTime: "",
    status: "pending",
  });
  const [errors, setErrors] = useState({});
  const statusOptions = ["pending", "assigned", "delivered", "cancelled"];

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, statusFilter]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchOrders = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      let params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await ordersAPI.getAll(params);
      setOrders(res.data.orders);
      setPagination({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        total: res.data.total,
      });
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await routesAPI.getAll({ limit: 100 });
      setRoutes(res.data.routes);
    } catch {
      console.error("Route fetch error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "assigned": return "bg-blue-100 text-blue-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRouteInfo = (routeId) =>
    routes.find((r) => r.routeId === routeId);

  const filteredOrders = orders.filter((o) =>
    o.orderId.toString().includes(searchTerm) ||
    o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDrawer = (mode, order = null) => {
    setDrawerMode(mode);
    if (mode === "add") {
      const ids = orders.map((o) => o.orderId);
      const nextId = ids.length ? Math.max(...ids) + 1 : 1;
      setFormData({ orderId: nextId, valueRs: "", routeId: "", deliveryTime: "", status: "pending" });
    } else if (order) {
      setFormData({ ...order });
      setSelectedOrder(order);
    }
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
    setErrors({});
  };

  if (loading) return (
    <div className="flex justify-center items-center h-72">
      <div className="loading-spinner mr-2"></div> Loading Orders...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <h1 className="text-2xl font-bold">📦 Orders <span className="text-gray-500 text-sm">({pagination.total})</span></h1>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="pl-10 pr-3 py-2 border rounded-lg w-full"
            />
          </div>
          <div className="flex items-center border rounded-lg px-2">
            <FunnelIcon className="h-5 w-5 text-gray-400"/>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, currentPage: 1 })); }}
              className="border-0 bg-transparent text-sm outline-none"
            >
              <option value="">All Status</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            onClick={() => openDrawer("add")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex gap-1 items-center"
          >
            <PlusIcon className="h-5 w-5"/> Add
          </button>
        </div>
      </div>

      {/* Order Cards */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 bg-gray-50 text-center rounded-lg">
          <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto"/>
          <p className="mt-2 text-gray-700">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map(order => {
            const route = getRouteInfo(order.routeId);
            return (
              <div key={order._id} className="bg-white rounded-lg p-5 shadow hover:shadow-md flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg">Order #{order.orderId}</h3>
                  <p className="text-gray-500 text-sm">ID: {order._id.slice(-6)}</p>
                  <div className="mt-3 flex items-center text-sm">
                    <CurrencyRupeeIcon className="h-4 w-4 mr-1 text-gray-400"/> {order.valueRs}
                  </div>
                  <div className="mt-1 flex items-center text-sm">
                    <MapPinIcon className="h-4 w-4 mr-1 text-gray-400"/> Route #{order.routeId}
                  </div>
                  {route && <p className="text-xs text-gray-500">{route.distanceKm}km, {route.trafficLevel} traffic</p>}
                  <div className="mt-1 flex items-center text-sm">
                    <ClockIcon className="h-4 w-4 mr-1 text-gray-400"/> {order.deliveryTime}
                  </div>
                  <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex mt-4 gap-2">
                  <button onClick={() => openDrawer("view", order)} className="p-1 hover:bg-gray-100 rounded">
                    <EyeIcon className="h-4 w-4 text-gray-600"/>
                  </button>
                  <button onClick={() => openDrawer("edit", order)} className="p-1 hover:bg-blue-50 rounded">
                    <PencilIcon className="h-4 w-4 text-blue-600"/>
                  </button>
                  <button onClick={() => handleDelete(order)} className="p-1 hover:bg-red-50 rounded">
                    <TrashIcon className="h-4 w-4 text-red-600"/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 items-center">
          <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>
            <ChevronLeftIcon className="h-5 w-5"/>
          </button>
          Page {pagination.currentPage} of {pagination.totalPages}
          <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}>
            <ChevronRightIcon className="h-5 w-5"/>
          </button>
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black bg-opacity-40" onClick={closeDrawer}></div>
          <div className="w-full sm:w-[400px] bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {drawerMode === "view" && "Order Details"}
                {drawerMode === "add" && "Add Order"}
                {drawerMode === "edit" && "Edit Order"}
              </h2>
              <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={closeDrawer}/>
            </div>

            {drawerMode === "view" ? (
              <div>
                <p><strong>Order ID:</strong> {selectedOrder?.orderId}</p>
                <p><strong>Value:</strong> ₹{selectedOrder?.valueRs}</p>
              </div>
            ) : (
              <form>
                {/* Add your input fields here using formData and handleInputChange */}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
