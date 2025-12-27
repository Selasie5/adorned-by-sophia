"use client";

import React from "react";
import Loader from "./loader";
import { DocumentArrowDownIcon, DocumentPlusIcon, FolderPlusIcon } from "@heroicons/react/24/outline";

export interface TableColumn<T> {
  key: string;
  header: string;
  minWidth?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  highlightedId?: string | number | null;
  idKey?: keyof T;
  onRowClick?: (row: T) => void;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  error,
  emptyMessage = "No data found.",
  highlightedId,
  idKey = "id" as keyof T,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-md border border-gray-200 sudo">
        <div className="flex flex-col items-center gap-2">
<Loader/>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-md border border-gray-200 sudo">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full min-h-[77vh] flex flex-col  items-center justify-center bg-white rounded-md border border-gray-200 sudo">
        <FolderPlusIcon className="w-10 h-10 font-normal text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-0">
      <div className="w-full max-h-[calc(100vh-300px)] overflow-x-auto overflow-y-auto border border-gray-200 rounded-md no-scrollbar">
        <table className="w-full border-collapse bg-white">
          <thead className="sticky top-0 z-10">
            <tr className="text-left text-xs text-gray-800 bg-gray-100 border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="font-medium py-3 px-4 uppercase"
                  style={{ minWidth: column.minWidth || "150px" }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row, rowIndex) => {
              const isHighlighted = highlightedId !== null && row[idKey] === highlightedId;
              return (
                <tr
                  key={row[idKey] || rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-gray-200 ${
                    isHighlighted
                      ? "bg-yellow-100 outline outline-yellow-400"
                      : "hover:bg-gray-50"
                  } ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 px-4">
                      {column.render ? (
                        column.render(row, rowIndex)
                      ) : (
                        <span className="text-sm text-gray-900">
                          {row[column.key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
