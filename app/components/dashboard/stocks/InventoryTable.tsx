"use client";

import React from "react";
import { EyeIcon, PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import DataTable, { TableColumn } from "@/app/components/core/ui/DataTable";

export interface InventoryItem {
  id: string;
  product: {
    id: string;
    name: string;
    images: string[];
    price: string;
  };
  sizes: string[];
  quantity: number;
  createdBy: { id: string; name: string; email: string } | null;
  updatedBy: { id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface InventoryTableProps {
  inventory: InventoryItem[];
  loading?: boolean;
  error?: string;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
  onView?: (item: InventoryItem) => void;
  onAdjust?: (item: InventoryItem, type: 'increase' | 'decrease') => void;
}

const InventoryTable = ({
  inventory,
  loading = false,
  error,
  onEdit,
  onDelete,
  onView,
  onAdjust,
}: InventoryTableProps) => {
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-rose-100 text-rose-700" };
    if (quantity <= 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  };

  const columns: TableColumn<InventoryItem>[] = [
    {
      key: "product",
      header: "Product",
      minWidth: "250px",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.product?.images?.[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.product.images[0]}
              alt={row.product.name}
              className="w-10 h-10 rounded-md object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{row.product?.name}</span>
            <span className="text-xs text-gray-500">GHS {row.product?.price}</span>
          </div>
        </div>
      ),
    },
    {
      key: "sizes",
      header: "Sizes",
      minWidth: "150px",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.sizes.map((size) => (
            <span key={size} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
              {size}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      minWidth: "100px",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">{row.quantity}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      minWidth: "120px",
      render: (row) => {
        const status = getStockStatus(row.quantity);
        return (
          <span className={`text-xs px-2 py-1 rounded-md ${status.color}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      minWidth: "150px",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">
            {new Date(parseInt(row.updatedAt)).toLocaleDateString()}
          </span>
          <span className="text-xs text-gray-400">
            by {row.updatedBy?.name || "System"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: "180px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAdjust?.(row, 'increase')}
            className="p-1.5 rounded-md hover:bg-green-50 text-green-600 transition-colors"
            title="Increase Stock"
          >
            <ArrowUpIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAdjust?.(row, 'decrease')}
            className="p-1.5 rounded-md hover:bg-orange-50 text-orange-600 transition-colors"
            title="Decrease Stock"
          >
            <ArrowDownIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onView?.(row)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
            title="View"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit?.(row)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500    transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(row)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable<InventoryItem>
      columns={columns}
      data={inventory}
      loading={loading}
      error={error}
      emptyMessage="No inventory records found"
    />
  );
};

export default InventoryTable;
