"use client";

import React, { useState } from "react";
import Header from "@/app/components/layout/Header";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import SelectInput from "@/app/components/core/ui/SelectInput";
import Button from "@/app/components/core/ui/button";
import Alert from "@/app/components/core/ui/Alert";
import PromotionsTable, { Promotion } from "@/app/components/dashboard/promotions/PromotionsTable";
import PromotionModal from "@/app/components/dashboard/promotions/PromotionModal";
import { GET_PROMOTIONS, DELETE_PROMOTION } from "@/app/apollo/queries";
import { showToast } from "@/app/components/core/ui/toast";

interface GetPromotionsData {
  getPromotions: {
    code: number;
    success: boolean;
    message: string;
    data: Promotion[];
    totalCount: number;
    page: number;
    limit: number;
  };
}

const PromotionsPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; promotion: Promotion | null }>({
    isOpen: false,
    promotion: null,
  });

  const { data, loading, error, refetch } = useQuery<GetPromotionsData>(GET_PROMOTIONS, {
    variables: {
      page: 1,
      limit: 50,
      isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
    },
  });

  const [deletePromotion, { loading: deleteLoading }] = useMutation(DELETE_PROMOTION, {
    onCompleted: (data:any) => {
      if (data.deletePromotion.success) {
        showToast("Promotion deleted", "success");
        refetch();
      } else {
        showToast(data.deletePromotion.message, "error");
      }
      setDeleteAlert({ isOpen: false, promotion: null });
    },
    onError: (error) => {
      showToast(error.message, "error");
      setDeleteAlert({ isOpen: false, promotion: null });
    },
  });

  const promotions = data?.getPromotions?.data || [];

  const handleCreate = () => {
    setSelectedPromotion(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (promotion: Promotion) => {
    setDeleteAlert({ isOpen: true, promotion });
  };

  const confirmDelete = () => {
    if (deleteAlert.promotion) {
      deletePromotion({ variables: { id: deleteAlert.promotion.id } });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };

  const statusOptions = [
    { id: "", label: "All Promotions", value: "" },
    { id: "active", label: "Active", value: "active" },
    { id: "inactive", label: "Inactive", value: "inactive" },
  ];

  return (
    <>
      {/* Delete Alert */}
      <Alert
        isOpen={deleteAlert.isOpen}
        heading="Delete Promotion"
        message={`Are you sure you want to delete "${deleteAlert.promotion?.code}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, promotion: null })}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmLoading={deleteLoading}
        variant="danger"
      />

      {/* Promotion Modal */}
      <PromotionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        promotion={selectedPromotion}
        mode={modalMode}
        onRefetch={refetch}
      />

      <div className="flex flex-col h-full overflow-hidden">
        <div className="shrink-0">
          <Header
            title="Promotions"
            breadCrumbs={[
              { label: "Dashboard", to: "/sudo/dashboard/general/home" },
              { label: "Promotions", to: "/sudo/dashboard/promotions" },
            ]}
            actions={
              <div className="flex justify-end items-center gap-4">
                <Button
                  label="+ Create Discount Code"
                  primary
                  onClick={handleCreate}
                />
              </div>
            }
          />
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <div className="w-full flex justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-40">
                <SelectInput
                  name="statusFilter"
                  placeholder="Filter"
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
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
            <PromotionsTable
              promotions={promotions}
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

export default PromotionsPage;
