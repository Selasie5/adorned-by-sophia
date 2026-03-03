"use client";

import React, { useState } from "react";
import Header from "@/app/components/layout/Header";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import SelectInput from "@/app/components/core/ui/SelectInput";
import SearchInput from "@/app/components/core/ui/SearchInput";
import OrdersTable, { Order } from "@/app/components/dashboard/orders/OrdersTable";
import OrderDetailModal, { OrderDetail } from "@/app/components/dashboard/orders/OrderDetailModal";
import { GET_ORDERS, GET_ORDER_BY_ID } from "@/app/apollo/queries";

interface GetOrdersData {
  getOrders: {
    code: number;
    success: boolean;
    message: string;
    data: Order[];
    totalCount: number;
    page: number;
    limit: number;
  };
}

interface GetOrderByIdData {
  getOrderById: {
    code: number;
    success: boolean;
    message: string;
    data: OrderDetail;
  };
}

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery<GetOrdersData>(GET_ORDERS, {
    variables: {
      filter: {
        status: statusFilter || undefined,
        paymentStatus: paymentFilter || undefined,
        search: searchTerm || undefined,
      },
      page: 1,
      limit: 50,
    },
  });

  const [getOrderById, { loading: detailLoading }] = useLazyQuery<GetOrderByIdData>(
    GET_ORDER_BY_ID
  );

  const orders = data?.getOrders?.data || [];

  const handleView = async (order: Order) => {
    const { data: result } = await getOrderById({ variables: { id: order.id } });
    if (result?.getOrderById?.success) {
      setSelectedOrder(result.getOrderById.data);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const statusOptions = [
    { id: "", label: "All Statuses", value: "" },
    { id: "PENDING", label: "Pending", value: "PENDING" },
    { id: "PAID", label: "Paid", value: "PAID" },
    { id: "PROCESSING", label: "Processing", value: "PROCESSING" },
    { id: "SHIPPED", label: "Shipped", value: "SHIPPED" },
    { id: "DELIVERED", label: "Delivered", value: "DELIVERED" },
    { id: "CANCELLED", label: "Cancelled", value: "CANCELLED" },
  ];

  const paymentOptions = [
    { id: "", label: "All Payments", value: "" },
    { id: "PENDING", label: "Pending", value: "PENDING" },
    { id: "COMPLETED", label: "Completed", value: "COMPLETED" },
    { id: "FAILED", label: "Failed", value: "FAILED" },
    { id: "REFUNDED", label: "Refunded", value: "REFUNDED" },
  ];

  return (
    <>
      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        onRefetch={refetch}
      />

      <div className="flex flex-col h-full overflow-hidden">
        <div className="shrink-0">
          <Header
            title="Orders"
            breadCrumbs={[
              { label: "Dashboard", to: "/sudo/dashboard/general/home" },
              { label: "Orders", to: "/sudo/dashboard/orders" },
            ]}
          />
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <div className="w-full flex justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-36">
                <SelectInput
                  name="statusFilter"
                  placeholder="Status"
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
              </div>
              <div className="w-36">
                <SelectInput
                  name="paymentFilter"
                  placeholder="Payment"
                  options={paymentOptions}
                  value={paymentFilter}
                  onChange={setPaymentFilter}
                />
              </div>
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search by order # or customer..."
                />
              </div>
            </div>

            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => refetch()}
                className="p-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0">
            <OrdersTable
              orders={orders}
              loading={loading || detailLoading}
              error={error?.message}
              onView={handleView}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
