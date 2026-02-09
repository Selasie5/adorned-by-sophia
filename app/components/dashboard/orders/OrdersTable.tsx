"use client";

import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import DataTable, { TableColumn } from "@/app/components/core/ui/DataTable";

export interface OrderCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrderPayment {
  method: string;
  status: string;
  amount: number;
  currency: string;
  transactionId?: string;
  paidAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  total: number;
  status: string;
  trackingNumber?: string;
  payment: OrderPayment;
  createdAt: string;
  updatedAt: string;
}

interface OrdersTableProps {
  orders: Order[];
  loading?: boolean;
  error?: string;
  onView?: (order: Order) => void;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

const OrdersTable = ({
  orders,
  loading = false,
  error,
  onView,
}: OrdersTableProps) => {
  const columns: TableColumn<Order>[] = [
    {
      key: "orderNumber",
      header: "Order #",
      minWidth: "140px",
      render: (row) => (
        <span className="text-sm font-medium text-green-700">{row.orderNumber}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      minWidth: "200px",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {row.customer?.firstName} {row.customer?.lastName}
          </span>
          <span className="text-xs text-gray-500">{row.customer?.email}</span>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      minWidth: "120px",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">
          {row.payment?.currency || "GHS"} {row.total?.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      minWidth: "120px",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColors[row.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      minWidth: "120px",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            paymentStatusColors[row.payment?.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {row.payment?.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      minWidth: "120px",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(parseInt(row.createdAt)).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: "80px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView?.(row);
            }}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      loading={loading}
      error={error}
      emptyMessage="No orders found."
      idKey="id"
    />
  );
};

export default OrdersTable;
