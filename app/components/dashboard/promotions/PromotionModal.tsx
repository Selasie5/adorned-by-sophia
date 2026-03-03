"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/app/components/core/ui/Modal";
import Button from "@/app/components/core/ui/button";
import SelectInput from "@/app/components/core/ui/SelectInput";
import { useMutation } from "@apollo/client/react";
import { CREATE_PROMOTION, UPDATE_PROMOTION } from "@/app/apollo/queries";
import { showToast } from "@/app/components/core/ui/toast";
import { Promotion } from "./PromotionsTable";

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion?: Promotion | null;
  mode: "create" | "edit";
  onRefetch: () => void;
}

const discountTypeOptions = [
  { id: "PERCENTAGE", label: "Percentage (%)", value: "PERCENTAGE" },
  { id: "FIXED_AMOUNT", label: "Fixed Amount (GHS)", value: "FIXED_AMOUNT" },
];

const PromotionModal = ({
  isOpen,
  onClose,
  promotion,
  mode,
  onRefetch,
}: PromotionModalProps) => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minimumOrderAmount: 0,
    maximumDiscount: 0,
    usageLimit: 0,
    perCustomerLimit: 1,
    validFrom: "",
    validUntil: "",
    isActive: true,
  });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (mode === "edit" && promotion) {
      setFormData({
        code: promotion.code,
        description: promotion.description || "",
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
        minimumOrderAmount: promotion.minimumOrderAmount || 0,
        maximumDiscount: promotion.maximumDiscount || 0,
        usageLimit: promotion.usageLimit || 0,
        perCustomerLimit: promotion.perCustomerLimit || 1,
        validFrom: new Date(parseInt(promotion.validFrom)).toISOString().split("T")[0],
        validUntil: new Date(parseInt(promotion.validUntil)).toISOString().split("T")[0],
        isActive: promotion.isActive,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      setFormData({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minimumOrderAmount: 0,
        maximumDiscount: 0,
        usageLimit: 0,
        perCustomerLimit: 1,
        validFrom: today,
        validUntil: nextMonth,
        isActive: true,
      });
    }
  }, [mode, promotion, isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const [createPromotion, { loading: createLoading }] = useMutation(CREATE_PROMOTION, {
    onCompleted: (responseData) => {
      const data = responseData as { createPromotion: { success: boolean; message: string } };
      if (data.createPromotion.success) {
        showToast("Promotion created successfully", "success");
        onRefetch();
        onClose();
      } else {
        showToast(data.createPromotion.message, "error");
      }
    },
    onError: (error) => showToast(error.message, "error"),
  });

  const [updatePromotion, { loading: updateLoading }] = useMutation(UPDATE_PROMOTION, {
    onCompleted: (responseData) => {
      const data = responseData as { updatePromotion: { success: boolean; message: string } };
      if (data.updatePromotion.success) {
        showToast("Promotion updated successfully", "success");
        onRefetch();
        onClose();
      } else {
        showToast(data.updatePromotion.message, "error");
      }
    },
    onError: (error) => showToast(error.message, "error"),
  });

  const handleSubmit = () => {
    if (!formData.code.trim()) {
      showToast("Code is required", "error");
      return;
    }
    if (formData.discountValue <= 0) {
      showToast("Discount value must be greater than 0", "error");
      return;
    }

    const input = {
      code: formData.code.toUpperCase(),
      description: formData.description || undefined,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minimumOrderAmount: formData.minimumOrderAmount || undefined,
      maximumDiscount: formData.maximumDiscount || undefined,
      usageLimit: formData.usageLimit || undefined,
      perCustomerLimit: formData.perCustomerLimit || undefined,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      isActive: formData.isActive,
    };

    if (mode === "create") {
      createPromotion({ variables: { input } });
    } else if (promotion) {
      updatePromotion({ variables: { id: promotion.id, input } });
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create Promotion" : "Edit Promotion"}
      size="lg"
      footer={
        <Button
          label={mode === "create" ? "Create" : "Save Changes"}
          onClick={handleSubmit}
          primary
          loading={createLoading || updateLoading}
        />
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
              placeholder="e.g., SAVE20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={mode === "edit"}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type *
            </label>
            <SelectInput
              name="discountType"
              placeholder="Select type"
              options={discountTypeOptions}
              value={formData.discountType}
              onChange={(value) => handleChange("discountType", value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Optional description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value *
            </label>
            <input
              type="number"
              value={formData.discountValue}
              onChange={(e) => handleChange("discountValue", parseFloat(e.target.value) || 0)}
              placeholder={formData.discountType === "PERCENTAGE" ? "e.g., 20" : "e.g., 50.00"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
              step={formData.discountType === "PERCENTAGE" ? "1" : "0.01"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Discount (GHS)
            </label>
            <input
              type="number"
              value={formData.maximumDiscount}
              onChange={(e) => handleChange("maximumDiscount", parseFloat(e.target.value) || 0)}
              placeholder="0 = no limit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Order Amount (GHS)
            </label>
            <input
              type="number"
              value={formData.minimumOrderAmount}
              onChange={(e) => handleChange("minimumOrderAmount", parseFloat(e.target.value) || 0)}
              placeholder="0 = no minimum"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Limit
            </label>
            <input
              type="number"
              value={formData.usageLimit}
              onChange={(e) => handleChange("usageLimit", parseInt(e.target.value) || 0)}
              placeholder="0 = unlimited"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid From *
            </label>
            <input
              type="date"
              value={formData.validFrom}
              onChange={(e) => handleChange("validFrom", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid Until *
            </label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => handleChange("validUntil", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
            className="h-4 w-4 text-green-700 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Active (can be used by customers)
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default PromotionModal;
