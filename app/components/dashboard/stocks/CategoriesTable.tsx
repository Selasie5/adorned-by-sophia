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
  parentCategory?: {
    id: string;
    name: string;
  };
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
  

  const columns: TableColumn<Category>[] = [
    {
      key: "name",
      header: "Category",
      minWidth: "250px",
      render: (row) => (
        <div className="flex items-center gap-3">
    
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{row.name}</span>
            {/* <span className="text-xs text-gray-500 truncate max-w-[200px]">
              {row.description || "No description"}
            </span> */}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      minWidth: "300px",
      render: (row) => (
        <span className="text-sm text-gray-600 truncate max-w-[250px]">
          {row.description || "------------------"}
        </span>
      ),
    },
    // {
    //   key: "slug",
    //   header: "Slug",
    //   minWidth: "150px",
    //   render: (row) => (
    //     <span className="text-sm text-gray-600 font-mono">{row.slug}</span>
    //   ),
    // },
    // {
    //   key: "isActive",
    //   header: "Status",
    //   minWidth: "100px",
    //   render: (row) => getStatusBadge(row.isActive),
    // },
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
            className="p-2 text-gray-500  hover:bg-gray-100 rounded-md transition-colors"
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
