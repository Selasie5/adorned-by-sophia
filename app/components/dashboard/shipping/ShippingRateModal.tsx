"use client";

import React, { useState, useMemo, useEffect } from "react";
import Modal from "@/app/components/core/ui/Modal";
import Button from "@/app/components/core/ui/button";
import SelectInput from "@/app/components/core/ui/SelectInput";
import { useMutation } from "@apollo/client/react";
import { CREATE_SHIPPING_RATE, UPDATE_SHIPPING_RATE } from "@/app/apollo/queries";
import { showToast } from "@/app/components/core/ui/toast";
import { ShippingRate } from "./ShippingRatesTable";

interface ShippingRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  rate?: ShippingRate | null;
  mode: "create" | "edit";
  onRefetch: () => void;
}

const zoneOptions = [
  { id: "LOCAL", label: "Local (City)", value: "LOCAL" },
  { id: "NATIONAL", label: "National", value: "NATIONAL" },
  { id: "INTERNATIONAL", label: "International", value: "INTERNATIONAL" },
];

const ShippingRateModal = ({
  isOpen,
  onClose,
  rate,
  mode,
  onRefetch,
}: ShippingRateModalProps) => {
  const initialFormData = useMemo(() => {
    if (mode === "edit" && rate) {
      return {
        name: rate.name,
        zone: rate.zone,
        countries: rate.countries.join(", "),
        flatRate: rate.flatRate,
        estimatedDaysMin: rate.estimatedDays.min,
        estimatedDaysMax: rate.estimatedDays.max,
        isActive: rate.isActive,
      };
    }
    return {
      name: "",
      zone: "NATIONAL",
      countries: "Ghana",
      flatRate: 0,
      estimatedDaysMin: 1,
      estimatedDaysMax: 5,
      isActive: true,
    };
  }, [mode, rate]);

  const [formData, setFormData] = useState(initialFormData);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setFormData(initialFormData); }, [initialFormData]);

  const [createShippingRate, { loading: createLoading }] = useMutation(CREATE_SHIPPING_RATE, {
    onCompleted: (responseData) => {
      const data = responseData as { createShippingRate: { success: boolean; message: string } };
      if (data.createShippingRate.success) {
        showToast("Shipping rate created", "success");
        onRefetch();
        onClose();
      } else {
        showToast(data.createShippingRate.message, "error");
      }
    },
    onError: (error) => showToast(error.message, "error"),
  });

  const [updateShippingRate, { loading: updateLoading }] = useMutation(UPDATE_SHIPPING_RATE, {
    onCompleted: (responseData) => {
      const data = responseData as { updateShippingRate: { success: boolean; message: string } };
      if (data.updateShippingRate.success) {
        showToast("Shipping rate updated", "success");
        onRefetch();
        onClose();
      } else {
        showToast(data.updateShippingRate.message, "error");
      }
    },
    onError: (error) => showToast(error.message, "error"),
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    if (!formData.countries.trim()) {
      showToast("At least one country is required", "error");
      return;
    }
    if (formData.flatRate < 0) {
      showToast("Rate cannot be negative", "error");
      return;
    }

    const countriesArray = formData.countries.split(",").map((c) => c.trim()).filter(Boolean);

    const input = {
      name: formData.name,
      zone: formData.zone,
      countries: countriesArray,
      flatRate: formData.flatRate,
      estimatedDaysMin: formData.estimatedDaysMin,
      estimatedDaysMax: formData.estimatedDaysMax,
      isActive: formData.isActive,
    };

    if (mode === "create") {
      createShippingRate({ variables: { input } });
    } else if (rate) {
      updateShippingRate({ variables: { id: rate.id, input } });
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create Shipping Rate" : "Edit Shipping Rate"}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rate Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Standard Shipping - Ghana"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zone *
          </label>
          <SelectInput
            name="zone"
            placeholder="Select zone"
            options={zoneOptions}
            value={formData.zone}
            onChange={(value) => handleChange("zone", value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Countries * (comma separated)
          </label>
          <input
            type="text"
            value={formData.countries}
            onChange={(e) => handleChange("countries", e.target.value)}
            placeholder="e.g., Ghana, Nigeria, Kenya"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Enter country names separated by commas</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Flat Rate (GHS) *
          </label>
          <input
            type="number"
            value={formData.flatRate}
            onChange={(e) => handleChange("flatRate", parseFloat(e.target.value) || 0)}
            placeholder="e.g., 25.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            min="0"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Delivery Days *
            </label>
            <input
              type="number"
              value={formData.estimatedDaysMin}
              onChange={(e) => handleChange("estimatedDaysMin", parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Delivery Days *
            </label>
            <input
              type="number"
              value={formData.estimatedDaysMax}
              onChange={(e) => handleChange("estimatedDaysMax", parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              min="1"
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
            Active (available for customers)
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default ShippingRateModal;
