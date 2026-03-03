"use client";

import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import DataTable, { TableColumn } from "@/app/components/core/ui/DataTable";

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  isActive: boolean;
  createdAt: string;
}

interface CustomersTableProps {
  customers: Customer[];
  loading?: boolean;
  error?: string;
  onView?: (customer: Customer) => void;
}

const CustomersTable = ({
  customers,
  loading = false,
  error,
  onView,
}: CustomersTableProps) => {
  const columns: TableColumn<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      minWidth: "200px",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </span>
          <span className="text-xs text-gray-500">{row.email}</span>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      minWidth: "130px",
      render: (row) => (
        <span className="text-sm text-gray-600">{row.phone || "-"}</span>
      ),
    },
    {
      key: "totalOrders",
      header: "Orders",
      minWidth: "80px",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">{row.totalOrders}</span>
      ),
    },
    {
      key: "totalSpent",
      header: "Total Spent",
      minWidth: "120px",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">
          GHS {row.totalSpent?.toFixed(2) || "0.00"}
        </span>
      ),
    },
    {
      key: "lastOrderAt",
      header: "Last Order",
      minWidth: "120px",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.lastOrderAt ? new Date(parseInt(row.lastOrderAt)).toLocaleDateString() : "Never"}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      minWidth: "100px",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
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
      data={customers}
      loading={loading}
      error={error}
      emptyMessage="No customers found."
      idKey="id"
    />
  );
};

export default CustomersTable;
