"use client";

import React from "react";
import DataTable, { TableColumn } from "@/app/components/core/ui/DataTable";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export interface LoginActivityItem {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  status: "SUCCESS" | "FAILED" | "BLOCKED";
  reason?: string;
  timestamp: string;
}

interface LoginActivityTableProps {
  activities: LoginActivityItem[];
  loading?: boolean;
  error?: string;
}

const getStatusBadge = (status: LoginActivityItem["status"]) => {
  const statusConfig = {
    SUCCESS: {
      icon: CheckCircleIcon,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      label: "Success",
    },
    FAILED: {
      icon: XCircleIcon,
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      label: "Failed",
    },
    BLOCKED: {
      icon: ExclamationTriangleIcon,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      label: "Blocked",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

const parseUserAgent = (userAgent: string) => {
 
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  return "Unknown Browser";
};

const LoginActivityTable = ({
  activities,
  loading = false,
  error,
}: LoginActivityTableProps) => {
  const columns: TableColumn<LoginActivityItem>[] = [
    {
      key: "email",
      header: "Email",
      minWidth: "200px",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">{row.email}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      minWidth: "100px",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "ipAddress",
      header: "IP Address",
      minWidth: "130px",
      render: (row) => (
        <span className="text-sm text-gray-600 font-mono">{row.ipAddress}</span>
      ),
    },
    {
      key: "userAgent",
      header: "Browser",
      minWidth: "120px",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {parseUserAgent(row.userAgent)}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      minWidth: "200px",
      render: (row) => (
        <span className="text-sm text-gray-500">{row.reason || "-"}</span>
      ),
    },
    {
      key: "timestamp",
      header: "Time",
      minWidth: "180px",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(parseInt(row.timestamp)).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={activities}
      loading={loading}
      error={error}
      emptyMessage="No login activity found."
      idKey="id"
    />
  );
};

export default LoginActivityTable;
