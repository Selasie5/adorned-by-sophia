"use client";

import React from "react";
import Header from "@/app/components/layout/Header";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import WelcomeCard from "@/app/components/layout/WelcomeCard";
import { useQuery } from "@apollo/client/react";
import { GET_DASHBOARD_DATA, GET_LOW_STOCK_ALERTS, GET_RECENT_DASHBOARD_ORDERS } from "@/app/apollo/queries";
import Link from "next/link";
import Loader from "@/app/components/core/ui/loader";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
}

interface LowStockProduct {
  id: string;
  name: string;
  stockQuantity: number;
  lowStockThreshold: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface GetDashboardDataResponse {
  getDashboardData: {
    code: number;
    success: boolean;
    message: string;
    data: DashboardStats;
  };
}

interface GetLowStockAlertsResponse {
  getLowStockAlerts: {
    code: number;
    success: boolean;
    message: string;
    data: LowStockProduct[];
  };
}

interface GetRecentOrdersResponse {
  getRecentDashboardOrders: {
    code: number;
    success: boolean;
    message: string;
    data: RecentOrder[];
  };
}

const DashboardHome = () => {
  const { data: dashboardData, loading: dashboardLoading, refetch: refetchDashboard } = useQuery<GetDashboardDataResponse>(GET_DASHBOARD_DATA);
  const { data: lowStockData, loading: lowStockLoading } = useQuery<GetLowStockAlertsResponse>(GET_LOW_STOCK_ALERTS, {
    variables: { limit: 5 },
  });
  const { data: recentOrdersData, loading: ordersLoading } = useQuery<GetRecentOrdersResponse>(GET_RECENT_DASHBOARD_ORDERS, {
    variables: { limit: 5 },
  });

  const stats: DashboardStats = dashboardData?.getDashboardData?.data || {
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockCount: 0,
  };

  const lowStockProducts: LowStockProduct[] = lowStockData?.getLowStockAlerts?.data || [];
  const recentOrders: RecentOrder[] = recentOrdersData?.getRecentDashboardOrders?.data || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      REFUNDED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const statCards = [
    { title: "Total Revenue", value: formatCurrency(stats.totalRevenue) },
    { title: "Total Orders", value: stats.totalOrders.toString() },
    { title: "Total Customers", value: stats.totalCustomers.toString() },
    { title: "Total Products", value: stats.totalProducts.toString() },
    { title: "Pending Orders", value: stats.pendingOrders.toString() },
    { title: "Processing Orders", value: stats.processingOrders.toString() },
    { title: "Completed Orders", value: stats.completedOrders.toString() },
  ];

  const isLoading = dashboardLoading || lowStockLoading || ordersLoading;

  return (
    <div className="flex flex-col min-h-screen sudo">
      <Header
        title="Dashboard"
        breadCrumbs={[
          { label: "Dashboard", to: "/sudo/dashboard/general/home" },
          { label: "Overview", to: "/sudo/dashboard/general/home" },
        ]}
        actions={
          <button
            onClick={() => refetchDashboard()}
            className="p-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        }
      />

      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards with Welcome Card */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <WelcomeCard />
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-md p-5 flex flex-col justify-center items-start"
                >
                  <p className="text-sm text-green-500">{stat.title}</p>
                  <p className="text-lg font-semibold text-black">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders & Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Recent Orders</h2>
                  <Link
                    href="/sudo/dashboard/orders"
                    className="text-green-600 hover:text-green-700 text-xs font-medium transition-colors"
                  >
                    View All →
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentOrders.length === 0 ? (
                    <div className="py-16 px-4 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">No recent orders</p>
                      <p className="text-xs text-gray-500">Orders will appear here once customers start purchasing</p>
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {order.customer.firstName} {order.customer.lastName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.totalAmount)}
                            </p>
                            <span
                              className={`inline-flex text-xs px-2 py-0.5 rounded-full mt-0.5 ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
                    Low Stock Alerts
                  </h2>
                  <Link
                    href="/sudo/dashboard/stocks/inventory"
                    className="text-green-600 hover:text-green-700 text-xs font-medium transition-colors"
                  >
                    View Inventory →
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {lowStockProducts.length === 0 ? (
                    <div className="py-16 px-4 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">All products well stocked</p>
                      <p className="text-xs text-gray-500">No inventory alerts at this time</p>
                    </div>
                  ) : (
                    lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Threshold: {product.lowStockThreshold} units
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                                product.stockQuantity === 0
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  product.stockQuantity === 0
                                    ? "bg-red-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              {product.stockQuantity} left
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;

