"use client";

import React from "react";
import Modal from "@/app/components/core/ui/Modal";
import { useQuery } from "@apollo/client/react";
import { GET_CUSTOMER_ORDER_HISTORY } from "@/app/apollo/queries";

interface CustomerAddress {
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface CustomerDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: CustomerAddress[];
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerDetail | null;
}

interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

interface OrderHistoryData {
  getCustomerOrderHistory: {
    code: number;
    success: boolean;
    data: OrderHistoryItem[];
    totalCount: number;
  };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const CustomerDetailModal = ({
  isOpen,
  onClose,
  customer,
}: CustomerDetailModalProps) => {
  const { data: orderHistory, loading: ordersLoading } = useQuery<OrderHistoryData>(
    GET_CUSTOMER_ORDER_HISTORY,
    {
      variables: { customerId: customer?.id, page: 1, limit: 10 },
      skip: !customer?.id,
    }
  );

  if (!customer) return null;

  const orders = orderHistory?.getCustomerOrderHistory?.data || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${customer.firstName} ${customer.lastName}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
            <span className="text-sm text-gray-900">{customer.email}</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
            <span className="text-sm text-gray-900">{customer.phone || "-"}</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                customer.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {customer.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Member Since</h4>
            <span className="text-sm text-gray-900">
              {new Date(parseInt(customer.createdAt)).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Stats</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{customer.totalOrders}</p>
              <p className="text-xs text-gray-500">Total Orders</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">GHS {customer.totalSpent?.toFixed(2) || "0.00"}</p>
              <p className="text-xs text-gray-500">Total Spent</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {customer.totalOrders > 0 
                  ? `GHS ${(customer.totalSpent / customer.totalOrders).toFixed(2)}`
                  : "N/A"}
              </p>
              <p className="text-xs text-gray-500">Avg Order Value</p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        {customer.addresses?.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Saved Addresses</h4>
            <div className="space-y-3">
              {customer.addresses.map((address, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{address.label}</span>
                    {address.isDefault && (
                      <span className="text-xs bg-green-100 text-rose-700 px-2 py-0.5 rounded">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.fullName}</p>
                  <p className="text-sm text-gray-600">{address.addressLine1}</p>
                  {address.addressLine2 && <p className="text-sm text-gray-600">{address.addressLine2}</p>}
                  <p className="text-sm text-gray-600">{address.city}, {address.country}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order History */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Orders</h4>
          {ordersLoading ? (
            <div className="text-sm text-gray-500">Loading orders...</div>
          ) : orders.length > 0 ? (
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <span className="text-sm font-medium text-green-700">{order.orderNumber}</span>
                    <p className="text-xs text-gray-500">
                      {new Date(parseInt(order.createdAt)).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm font-medium text-gray-900">GHS {order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No orders yet</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDetailModal;
