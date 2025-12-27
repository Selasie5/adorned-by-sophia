"use client";

import React from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DataTable, { TableColumn } from "@/app/components/core/ui/DataTable";

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesTableProps {
  categories: Category[];
  loading?: boolean;
  error?: string;
  highlightedId?: string | null;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onView?: (category: Category) => void;
}

const CategoriesTable = ({
  categories,
  loading = false,
  error,
  highlightedId,
  onEdit,
  onDelete,
  onView,
}: CategoriesTableProps) => {
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
        Inactive
      </span>
    );
  };

  const columns: TableColumn<Category>[] = [
    {
      key: "name",
      header: "Category",
      minWidth: "250px",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="w-10 h-10 rounded-md object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm font-medium">
                {row.name[0]?.toUpperCase()}
              </span>
            </div>
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
      key: "slug",
      header: "Slug",
      minWidth: "150px",
      render: (row) => (
        <span className="text-sm text-gray-600 font-mono">{row.slug}</span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      minWidth: "100px",
      render: (row) => getStatusBadge(row.isActive),
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
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(row);
            }}
            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(row);
            }}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
      data={categories}
      loading={loading}
      error={error}
      emptyMessage="No categories found. Create your first category!"
      highlightedId={highlightedId}
      idKey="id"
    />
  );
};

export default CategoriesTable;
