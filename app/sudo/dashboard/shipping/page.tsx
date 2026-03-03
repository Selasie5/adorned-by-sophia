"use client";

import React, { useState } from "react";
import Header from "@/app/components/layout/Header";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Button from "@/app/components/core/ui/button";
import Alert from "@/app/components/core/ui/Alert";
import ShippingRatesTable, { ShippingRate } from "@/app/components/dashboard/shipping/ShippingRatesTable";
import ShippingRateModal from "@/app/components/dashboard/shipping/ShippingRateModal";
import { GET_SHIPPING_RATES, DELETE_SHIPPING_RATE } from "@/app/apollo/queries";
import { showToast } from "@/app/components/core/ui/toast";

interface GetShippingRatesData {
  getShippingRates: {
    code: number;
    success: boolean;
    message: string;
    data: ShippingRate[];
  };
}

const ShippingPage = () => {
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; rate: ShippingRate | null }>({
    isOpen: false,
    rate: null,
  });

  const { data, loading, error, refetch } = useQuery<GetShippingRatesData>(GET_SHIPPING_RATES);

  const [deleteShippingRate, { loading: deleteLoading }] = useMutation(DELETE_SHIPPING_RATE, {
    onCompleted: (responseData) => {
      const data = responseData as { deleteShippingRate: { success: boolean; message: string } };
      if (data.deleteShippingRate.success) {
        showToast("Shipping rate deleted", "success");
        refetch();
      } else {
        showToast(data.deleteShippingRate.message, "error");
      }
      setDeleteAlert({ isOpen: false, rate: null });
    },
    onError: (error) => {
      showToast(error.message, "error");
      setDeleteAlert({ isOpen: false, rate: null });
    },
  });

  const rates = data?.getShippingRates?.data || [];

  const handleCreate = () => {
    setSelectedRate(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (rate: ShippingRate) => {
    setSelectedRate(rate);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (rate: ShippingRate) => {
    setDeleteAlert({ isOpen: true, rate });
  };

  const confirmDelete = () => {
    if (deleteAlert.rate) {
      deleteShippingRate({ variables: { id: deleteAlert.rate.id } });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRate(null);
  };

  return (
    <>
      {/* Delete Alert */}
      <Alert
        isOpen={deleteAlert.isOpen}
        heading="Delete Shipping Rate"
        message={`Are you sure you want to delete "${deleteAlert.rate?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, rate: null })}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmLoading={deleteLoading}
        variant="danger"
      />

      {/* Shipping Rate Modal */}
      <ShippingRateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        rate={selectedRate}
        mode={modalMode}
        onRefetch={refetch}
      />

      <div className="flex flex-col h-full overflow-hidden">
        <div className="shrink-0">
          <Header
            title="Shipping Rates"
            breadCrumbs={[
              { label: "Dashboard", to: "/sudo/dashboard/general/home" },
              { label: "Shipping", to: "/sudo/dashboard/shipping" },
            ]}
            actions={
              <div className="flex justify-end items-center gap-4">
                <Button
                  label="+ Add Shipping Rate"
                  primary
                  onClick={handleCreate}
                />
              </div>
            }
          />
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <div className="w-full flex justify-end items-center gap-4 mb-4">
            <button
              onClick={() => refetch()}
              className="p-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0">
            <ShippingRatesTable
              rates={rates}
              loading={loading}
              error={error?.message}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingPage;
