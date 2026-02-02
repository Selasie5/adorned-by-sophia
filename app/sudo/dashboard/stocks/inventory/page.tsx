"use client";

import React, { useState } from "react";
import Header from "@/app/components/layout/Header";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import SearchInput from "@/app/components/core/ui/SearchInput";
import SelectInput from "@/app/components/core/ui/SelectInput";
import InventoryTable, { InventoryItem } from "@/app/components/dashboard/stocks/InventoryTable";
import Button from "@/app/components/core/ui/button";
import Alert from "@/app/components/core/ui/Alert";
import { useRouter, useSearchParams } from "next/navigation";
import InventoryModal from "@/app/components/dashboard/stocks/InventoryModal";
import StockAdjustModal from "@/app/components/dashboard/stocks/StockAdjustModal";
import { showToast } from "@/app/components/core/ui/toast";

export const GET_ALL_INVENTORY = gql`
  query GetAllInventory {
    getAllInventory {
      code
      success
      message
      data {
        id
        product {
          id
          name
          images
          price
        }
        sizes
        quantity
        createdBy { id name email }
        updatedBy { id name email }
        createdAt
        updatedAt
      }
    }
  }
`;

const DELETE_INVENTORY = gql`
  mutation DeleteInventory($id: ID!) {
    deleteInventory(id: $id) {
      code
      success
      message
    }
  }
`;

type GetAllInventoryData = {
  getAllInventory: {
    code: number;
    success: boolean;
    message: string;
    data: InventoryItem[];
  };
};

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; item: InventoryItem | null }>({
    isOpen: false,
    item: null,
  });
  const [adjustModal, setAdjustModal] = useState<{
    isOpen: boolean;
    item: InventoryItem | null;
    type: 'increase' | 'decrease';
  }>({ isOpen: false, item: null, type: 'increase' });

  const router = useRouter();
  const params = useSearchParams();

  const { data, loading, error, refetch } = useQuery<GetAllInventoryData>(GET_ALL_INVENTORY);

  const [deleteInventory, { loading: deleteLoading }] = useMutation(DELETE_INVENTORY, {
    onCompleted: (responseData) => {
      const data = responseData as { deleteInventory: { success: boolean; message: string } };
      if (data.deleteInventory.success) {
        showToast('Inventory deleted successfully', 'success');
        refetch();
      } else {
        showToast(data.deleteInventory.message, 'error');
      }
      setDeleteAlert({ isOpen: false, item: null });
    },
    onError: (error) => {
      showToast(error.message, 'error');
      setDeleteAlert({ isOpen: false, item: null });
    },
  });

  const inventory = data?.getAllInventory?.data || [];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = searchTerm
      ? item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    let matchesStock = true;
    if (stockFilter === 'out') matchesStock = item.quantity === 0;
    else if (stockFilter === 'low') matchesStock = item.quantity > 0 && item.quantity <= 10;
    else if (stockFilter === 'in') matchesStock = item.quantity > 10;

    return matchesSearch && matchesStock;
  });

  const showModal =
    params.get("modal") === "view" &&
    (params.get("action") === "create-inventory" ||
      params.get("action") === "edit-inventory" ||
      params.get("action") === "view-inventory");

  const handleDelete = (item: InventoryItem) => setDeleteAlert({ isOpen: true, item });

  const confirmDelete = async () => {
    if (deleteAlert.item) {
      await deleteInventory({ variables: { id: deleteAlert.item.id } });
    }
  };

  const handleAdjust = (item: InventoryItem, type: 'increase' | 'decrease') => {
    setAdjustModal({ isOpen: true, item, type });
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedInventory(item);
    setModalMode('edit');
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "edit-inventory");
    router.push(`?${searchParams.toString()}`);
  };

  const handleView = (item: InventoryItem) => {
    setSelectedInventory(item);
    setModalMode('view');
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "view-inventory");
    router.push(`?${searchParams.toString()}`);
  };

  const handleCreate = () => {
    setSelectedInventory(null);
    setModalMode('create');
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "create-inventory");
    router.push(`?${searchParams.toString()}`);
  };

  const handleCloseModal = () => {
    setSelectedInventory(null);
    const searchParams = new URLSearchParams(params.toString());
    searchParams.delete("modal");
    searchParams.delete("action");
    const query = searchParams.toString();
    router.push(query ? `?${query}` : window.location.pathname);
  };

  return (
    <div className="w-full flex flex-col h-full shrink-0">
      <Header
        title="Inventory Management"
          breadCrumbs={[
        { label: 'Dashboard', to: '/sudo/dashboard/general' },
        { label: 'Stock', to: '/sudo/dashboard/stocks' },
        { label: 'Inventory', to: '/sudo/dashboard/stocks/inventory' },
      ]}
        actions={<Button label="Add Inventory" primary onClick={handleCreate} />}
      />

      <section className="flex-1 flex flex-col p-6 overflow-auto space-y-4">
        <div className="w-full flex justify-between items-center gap-10">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by product name..."
              />
            </div>
            <div className="w-40">
              <SelectInput
                name="stockFilter"
                placeholder="All Stock"
                options={[
                  { id: 'all', label: 'All Stock', value: '' },
                  { id: 'in', label: 'In Stock', value: 'in' },
                  { id: 'low', label: 'Low Stock', value: 'low' },
                  { id: 'out', label: 'Out of Stock', value: 'out' },
                ]}
                value={stockFilter}
                onChange={setStockFilter}
              />
            </div>
          </div>

          <button
            onClick={() => refetch()}
            className="p-3 border border-gray-300 rounded-[5px] text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <InventoryTable
          inventory={filteredInventory}
          loading={loading}
          error={error?.message}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onAdjust={handleAdjust}
        />
      </section>

      <InventoryModal
        isOpen={showModal}
        onClose={handleCloseModal}
        inventory={selectedInventory}
        mode={modalMode}
      />

      <Alert
        isOpen={deleteAlert.isOpen}
        heading="Delete Inventory"
        message={`Are you sure you want to delete inventory for "${deleteAlert.item?.product?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, item: null })}
        confirmLoading={deleteLoading}
        variant="danger"
      />

      <StockAdjustModal
        isOpen={adjustModal.isOpen}
        onClose={() => setAdjustModal({ isOpen: false, item: null, type: 'increase' })}
        inventory={adjustModal.item}
        type={adjustModal.type}
      />
    </div>
  );
};

export default InventoryPage;
