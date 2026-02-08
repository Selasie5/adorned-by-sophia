"use client";

import React from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DataTable, { TableColumn } from "@/app/components/core/ui/DataTable";

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: {
    id: string;
    name: string;
  };
  price: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductsTableProps {
  products: Product[];
  loading?: boolean;
  error?: string;
  highlightedId?: string | null;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onView?: (product: Product) => void;
}

const ProductsTable = ({
  products,
  loading = false,
  error,
  highlightedId,
  onEdit,
  onDelete,
  onView,
}: ProductsTableProps) => {
  const columns: TableColumn<Product>[] = [
    {
      key: "name",
      header: "Product",
      minWidth: "250px",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.images && row.images.length > 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.images[0]}
              alt={row.name}
              className="w-10 h-10 rounded-md object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{row.name}</span>
            <span className="text-xs text-gray-500 truncate max-w-[200px]">
              {row.description || "No description"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      minWidth: "150px",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.category?.name || "Uncategorized"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      minWidth: "120px",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">
          GHS {row.price}
        </span>
      ),
    },
    {
      key: "images",
      header: "Images",
      minWidth: "100px",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.images?.length || 0} image(s)
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
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
      minWidth: "120px",
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
      data={products}
      loading={loading}
      error={error}
      emptyMessage="No products found. Create your first product!"
      highlightedId={highlightedId}
      idKey="id"
    />
  );
};

export default ProductsTable;
