"use client";

import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DataTable, { TableColumn } from "@/app/components/core/ui/DataTable";

export interface ShippingRate {
  id: string;
  name: string;
  zone: string;
  countries: string[];
  flatRate: number;
  currency: string;
  estimatedDays: {
    min: number;
    max: number;
  };
  isActive: boolean;
  createdAt: string;
}

interface ShippingRatesTableProps {
  rates: ShippingRate[];
  loading?: boolean;
  error?: string;
  onEdit?: (rate: ShippingRate) => void;
  onDelete?: (rate: ShippingRate) => void;
}

const zoneLabels: Record<string, string> = {
  LOCAL: "Local (City)",
  NATIONAL: "National",
  INTERNATIONAL: "International",
};

const ShippingRatesTable = ({
  rates,
  loading = false,
  error,
  onEdit,
  onDelete,
}: ShippingRatesTableProps) => {
  const columns: TableColumn<ShippingRate>[] = [
    {
      key: "name",
      header: "Rate Name",
      minWidth: "180px",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      key: "zone",
      header: "Zone",
      minWidth: "130px",
      render: (row) => (
        <span className="text-sm text-gray-600">{zoneLabels[row.zone] || row.zone}</span>
      ),
    },
    {
      key: "countries",
      header: "Countries",
      minWidth: "180px",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.countries.slice(0, 3).map((country, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
            >
              {country}
            </span>
          ))}
          {row.countries.length > 3 && (
            <span className="text-xs text-gray-500">+{row.countries.length - 3} more</span>
          )}
        </div>
      ),
    },
    {
      key: "flatRate",
      header: "Rate",
      minWidth: "100px",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">
          {row.currency} {row.flatRate.toFixed(2)}
        </span>
      ),
    },
    {
      key: "estimatedDays",
      header: "Est. Delivery",
      minWidth: "120px",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.estimatedDays.min}-{row.estimatedDays.max} days
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
      data={rates}
      loading={loading}
      error={error}
      emptyMessage="No shipping rates found. Create your first shipping rate!"
      idKey="id"
    />
  );
};

export default ShippingRatesTable;
