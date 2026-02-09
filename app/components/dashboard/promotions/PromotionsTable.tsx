"use client";

import React from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DataTable, { TableColumn } from "@/app/components/core/ui/DataTable";

export interface Promotion {
  id: string;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  perCustomerLimit?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

interface PromotionsTableProps {
  promotions: Promotion[];
  loading?: boolean;
  error?: string;
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (promotion: Promotion) => void;
}

const PromotionsTable = ({
  promotions,
  loading = false,
  error,
  onEdit,
  onDelete,
}: PromotionsTableProps) => {
  const isExpired = (validUntil: string) => {
    return new Date(parseInt(validUntil)) < new Date();
  };

  const columns: TableColumn<Promotion>[] = [
    {
      key: "code",
      header: "Code",
      minWidth: "140px",
      render: (row) => (
        <span className="text-sm font-medium font-mono text-green-700">{row.code}</span>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      minWidth: "120px",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">
          {row.discountType === "PERCENTAGE"
            ? `${row.discountValue}%`
            : `GHS ${row.discountValue.toFixed(2)}`}
        </span>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      minWidth: "100px",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.usageCount} / {row.usageLimit || "∞"}
        </span>
      ),
    },
    {
      key: "minOrder",
      header: "Min Order",
      minWidth: "100px",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.minimumOrderAmount ? `GHS ${row.minimumOrderAmount.toFixed(2)}` : "-"}
        </span>
      ),
    },
    {
      key: "validity",
      header: "Valid Until",
      minWidth: "120px",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">
            {new Date(parseInt(row.validUntil)).toLocaleDateString()}
          </span>
          {isExpired(row.validUntil) && (
            <span className="text-xs text-red-500">Expired</span>
          )}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      minWidth: "100px",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.isActive && !isExpired(row.validUntil)
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {isExpired(row.validUntil) ? "Expired" : row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: "100px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(row);
            }}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(row);
            }}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={promotions}
      loading={loading}
      error={error}
      emptyMessage="No promotions found. Create your first discount code!"
      idKey="id"
    />
  );
};

export default PromotionsTable;
