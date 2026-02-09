"use client";

import React, { useState } from "react";
import Modal from "@/app/components/core/ui/Modal";
import Button from "@/app/components/core/ui/button";
import SelectInput from "@/app/components/core/ui/SelectInput";
import { useMutation } from "@apollo/client/react";
import { UPDATE_ORDER_STATUS, UPDATE_TRACKING_NUMBER, ADD_ADMIN_NOTE, CANCEL_ORDER } from "@/app/apollo/queries";
import { showToast } from "@/app/components/core/ui/toast";

interface OrderItem {
  product: {
    id: string;
    name: string;
    images: string[];
  };
  productName: string;
  productImage: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

interface Payment {
  method: string;
  status: string;
  amount: number;
  currency: string;
  transactionId?: string;
  paidAt?: string;
  refundedAt?: string;
  refundReason?: string;
}

interface AdminNote {
  note: string;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface OrderCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  discountCode?: string;
  total: number;
  status: string;
  trackingNumber?: string;
  shippingAddress: ShippingAddress;
  shippingZone: string;
  payment: Payment;
  adminNotes: AdminNote[];
  createdAt: string;
  updatedAt: string;
}

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetail | null;
  onRefetch: () => void;
}

const statusOptions = [
  { id: "PENDING", label: "Pending", value: "PENDING" },
  { id: "PAID", label: "Paid", value: "PAID" },
  { id: "PROCESSING", label: "Processing", value: "PROCESSING" },
  { id: "SHIPPED", label: "Shipped", value: "SHIPPED" },
  { id: "DELIVERED", label: "Delivered", value: "DELIVERED" },
];

const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  onRefetch,
}: OrderDetailModalProps) => {
  const [newStatus, setNewStatus] = useState(order?.status || "");
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || "");
  const [adminNote, setAdminNote] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);

  const [updateStatus, { loading: statusLoading }] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: (responseData) => {
      const data = responseData as { updateOrderStatus: { success: boolean; message: string } };
      if (data.updateOrderStatus.success) {
        showToast("Order status updated", "success");
        onRefetch();
      } else {
        showToast(data.updateOrderStatus.message, "error");
      }
    },
    onError: (error) => showToast(error.message, "error"),
  });

  const [updateTracking, { loading: trackingLoading }] = useMutation(UPDATE_TRACKING_NUMBER, {
    onCompleted: (responseData) => {
      const data = responseData as { updateTrackingNumber: { success: boolean; message: string } };
      if (data.updateTrackingNumber.success) {
        showToast("Tracking number updated", "success");
        onRefetch();
      } else {
        showToast(data.updateTrackingNumber.message, "error");
      }
    },
    onError: (error) => showToast(error.message, "error"),
  });

  const [addNote, { loading: noteLoading }] = useMutation(ADD_ADMIN_NOTE, {
    onCompleted: (responseData) => {
      const data = responseData as { addAdminNote: { success: boolean; message: string } };
      if (data.addAdminNote.success) {
        showToast("Note added", "success");
        setAdminNote("");
        onRefetch();
      } else {
        showToast(data.addAdminNote.message, "error");
      }
    },
    onError: (error) => showToast(error.message, "error"),
  });

  const [cancelOrder, { loading: cancelLoading }] = useMutation(CANCEL_ORDER, {
    onCompleted: (responseData) => {
      const data = responseData as { cancelOrder: { success: boolean; message: string } };
      if (data.cancelOrder.success) {
        showToast("Order cancelled", "success");
        setShowCancelForm(false);
        onRefetch();
      } else {
        showToast(data.cancelOrder.message, "error");
      }
    },
    onError: (error) => showToast(error.message, "error"),
  });

  if (!order) return null;

  const handleStatusUpdate = () => {
    if (newStatus && newStatus !== order.status) {
      updateStatus({ variables: { id: order.id, status: newStatus } });
    }
  };

  const handleTrackingUpdate = () => {
    if (trackingNumber) {
      updateTracking({ variables: { id: order.id, trackingNumber } });
    }
  };

  const handleAddNote = () => {
    if (adminNote.trim()) {
      addNote({ variables: { id: order.id, note: adminNote } });
    }
  };

  const handleCancel = () => {
    if (cancelReason.trim()) {
      cancelOrder({ variables: { id: order.id, reason: cancelReason } });
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${order.orderNumber}`}
      size="2xl"
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[order.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Payment</h4>
            <span className="text-sm text-gray-900">{order.payment.status}</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Total</h4>
            <span className="text-lg font-semibold text-gray-900">
              {order.payment.currency} {order.total.toFixed(2)}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
            <span className="text-sm text-gray-900">
              {new Date(parseInt(order.createdAt)).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Customer</h4>
          <p className="text-sm text-gray-600">
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p className="text-sm text-gray-600">{order.customer.email}</p>
          {order.customer.phone && (
            <p className="text-sm text-gray-600">{order.customer.phone}</p>
          )}
        </div>

        {/* Shipping Address */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
          <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && (
            <p className="text-sm text-gray-600">{order.shippingAddress.addressLine2}</p>
          )}
          <p className="text-sm text-gray-600">
            {order.shippingAddress.city}, {order.shippingAddress.country}
          </p>
          <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
        </div>

        {/* Order Items */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  {item.product?.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.images[0]}
                      alt={item.productName}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500">Size: {item.size} × {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  GHS {item.totalPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">GHS {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="text-gray-900">GHS {order.shippingCost.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount {order.discountCode && `(${order.discountCode})`}</span>
                <span className="text-green-700">-GHS {order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold pt-2 border-t">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">GHS {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Update Status */}
        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Update Status</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SelectInput
                  name="status"
                  placeholder="Select status"
                  options={statusOptions}
                  value={newStatus || order.status}
                  onChange={setNewStatus}
                />
              </div>
              <Button
                label="Update"
                onClick={handleStatusUpdate}
                primary
                loading={statusLoading}
                disabled={!newStatus || newStatus === order.status}
              />
            </div>
          </div>
        )}

        {/* Tracking Number */}
        {(order.status === "PROCESSING" || order.status === "SHIPPED") && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Tracking Number</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button
                label="Update"
                onClick={handleTrackingUpdate}
                primary
                loading={trackingLoading}
                disabled={!trackingNumber}
              />
            </div>
          </div>
        )}

        {/* Admin Notes */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Admin Notes</h4>
          {order.adminNotes?.length > 0 && (
            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
              {order.adminNotes.map((note, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                  <p className="text-gray-700">{note.note}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {note.createdBy?.name} • {new Date(parseInt(note.createdAt)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              label="Add"
              onClick={handleAddNote}
              secondary
              loading={noteLoading}
              disabled={!adminNote.trim()}
            />
          </div>
        </div>

        {/* Cancel Order */}
        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
          <div className="border-t pt-4">
            {!showCancelForm ? (
              <Button
                label="Cancel Order"
                onClick={() => setShowCancelForm(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
              />
            ) : (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600">Cancel Order</h4>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter cancellation reason..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    label="Confirm Cancel"
                    onClick={handleCancel}
                    loading={cancelLoading}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={!cancelReason.trim()}
                  />
                  <Button
                    label="Nevermind"
                    onClick={() => setShowCancelForm(false)}
                    secondary
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
