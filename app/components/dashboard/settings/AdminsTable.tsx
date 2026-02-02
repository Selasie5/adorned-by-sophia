"use client";

import React from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DataTable, { TableColumn } from "@/app/components/core/ui/DataTable";

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER";
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface AdminsTableProps {
  admins: Admin[];
  loading?: boolean;
  error?: string;
  highlightedId?: string | null;
  currentUserId?: string;
  currentUserRole?: string | undefined;
  onEdit?: (admin: Admin) => void;
  onDelete?: (admin: Admin) => void;
  onView?: (admin: Admin) => void;
}

const getRoleBadge = (role: Admin["role"]) => {
  const roleStyles = {
    SUPER_ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    ADMIN: "bg-blue-100 text-blue-700 border-blue-200",
    MANAGER: "bg-green-100 text-green-700 border-green-200",
  };

  const roleLabels = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    MANAGER: "Manager",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-sm text-gray-500 uppercase border bg-gray-100 border-gray-200`}
    >
      {roleLabels[role]}
    </span>
  );
};

const getStatusBadge = (isActive: boolean) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${
        isActive
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

const AdminsTable = ({
  admins,
  loading = false,
  error,
  highlightedId,
  currentUserId,
  currentUserRole,
  onEdit,
  onDelete,
  onView,
}: AdminsTableProps) => {
  const columns: TableColumn<Admin>[] = [
    {
      key: "name",
      header: "Admin",
      minWidth: "250px",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-black font-semibold text-sm">
            {row.firstName.charAt(0)}
            {row.lastName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {row.firstName} {row.lastName}
              {/* {row.id === currentUserId && (
                <span className="ml-2 text-xs text-gray-500">(You)</span>
              )} */}
            </span>
            <span className="text-xs text-gray-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      minWidth: "130px",
      render: (row) => getRoleBadge(row.role),
    },
    {
      key: "isActive",
      header: "Status",
      minWidth: "100px",
      render: (row) => getStatusBadge(row.isActive),
    },
    {
      key: "twoFactorEnabled",
      header: "2FA",
      minWidth: "80px",
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.twoFactorEnabled
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {row.twoFactorEnabled ? "Enabled" : "Disabled"}
        </span>
      ),
    },
    {
      key: "lastLogin",
      header: "Last Login",
      minWidth: "150px",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.lastLogin
            ? new Date(parseInt(row.lastLogin)).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Never"}
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
            title="View"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(row);
            }}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          {row.id !== currentUserId &&  currentUserRole === "SUPER_ADMIN" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(row);
              }}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
              title="Delete"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={admins}
      loading={loading}
      error={error}
      emptyMessage="No admins found."
      highlightedId={highlightedId}
      idKey="id"
    />
  );
};

export default AdminsTable;
