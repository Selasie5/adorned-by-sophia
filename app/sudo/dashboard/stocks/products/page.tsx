"use client";

import React, { useState } from "react";
import Header from "@/app/components/layout/Header";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import SelectInput from "@/app/components/core/ui/SelectInput";
import SearchInput from "@/app/components/core/ui/SearchInput";
import ProductsTable, { Product } from "@/app/components/dashboard/stocks/ProductsTable";
import Button from "@/app/components/core/ui/button";
import Alert from "@/app/components/core/ui/Alert";
import { useRouter, useSearchParams } from "next/navigation";
import ProductModal from "@/app/components/dashboard/stocks/ProductModal";
import { showToast } from "@/app/components/core/ui/toast";
import { GET_ALL_PRODUCTS } from "@/app/apollo/queries";

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      code
      success
      message
    }
  }
`;

type GetAllProductsData = {
  getAllProducts: {
    code: number;
    success: boolean;
    message: string;
    data: Product[];
  };
};

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null,
  });

  const router = useRouter();
  const params = useSearchParams();

  const { data, loading, error, refetch } = useQuery<GetAllProductsData>(GET_ALL_PRODUCTS);
  const [deleteProduct, { loading: deleteLoading }] = useMutation(DELETE_PRODUCT, {
    onCompleted: (responseData) => {
      const data = responseData as { deleteProduct: { success: boolean; message: string } };
      if (data.deleteProduct.success) {
        showToast('Product deleted successfully', 'success');
        refetch();
      } else {
        showToast(data.deleteProduct.message, 'error');
      }
      setDeleteAlert({ isOpen: false, product: null });
    },
    onError: (error) => {
      showToast(error.message, 'error');
      setDeleteAlert({ isOpen: false, product: null });
    },
  });

  const products = data?.getAllProducts?.data || [];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesSearch;
  });

  const showModal =
    params.get("modal") === "view" &&
    (params.get("action") === "create-product" ||
      params.get("action") === "edit-product" ||
      params.get("action") === "view-product");

  const handleDelete = (product: Product) => {
    setDeleteAlert({ isOpen: true, product });
  };

  const confirmDelete = async () => {
    if (deleteAlert.product) {
      await deleteProduct({ variables: { id: deleteAlert.product.id } });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "edit-product");
    router.push(`?${searchParams.toString()}`);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('view');
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "view-product");
    router.push(`?${searchParams.toString()}`);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setModalMode('create');
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "create-product");
    router.push(`?${searchParams.toString()}`);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    const searchParams = new URLSearchParams(params.toString());
    searchParams.delete("modal");
    searchParams.delete("action");
    const query = searchParams.toString();
    router.push(query ? `?${query}` : "/sudo/dashboard/stocks/products");
  };

  const searchByOptions = [
    { id: "name", label: "Name", value: "name" },
    { id: "description", label: "Description", value: "description" },
  ];

  const itemsPerPageOptions = [
    { id: "10", label: "10 items per page", value: "10" },
    { id: "25", label: "25 items per page", value: "25" },
    { id: "50", label: "50 items per page", value: "50" },
    { id: "100", label: "100 items per page", value: "100" },
  ];

  return (
    <>
      {/* Delete Alert */}
      <Alert
        isOpen={deleteAlert.isOpen}
        heading="Delete Product"
        message={`Are you sure you want to delete "${deleteAlert.product?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, product: null })}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmLoading={deleteLoading}
        variant="danger"
      />

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          isOpen={showModal}
          onClose={handleCloseModal}
          product={selectedProduct}
          mode={modalMode}
        />
      )}

      <div className="flex flex-col h-full overflow-hidden">
        <div className="shrink-0">
          <Header
            title="Products"
            breadCrumbs={[
              { label: "Dashboard", to: "/sudo/dashboard/general/home" },
              { label: "Stocks", to: "/sudo/dashboard/stocks" },
              { label: "Products", to: "/sudo/dashboard/stocks/products" },
            ]}
            actions={
              <div className="flex justify-end items-center gap-4">
                <Button
                  label="+ Create new product"
                  primary
                  onClick={handleCreate}
                />
              </div>
            }
          />
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <div className="w-full flex justify-between items-center gap-10 mb-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-32">
                <SelectInput
                  name="searchBy"
                  placeholder="Search By"
                  options={searchByOptions}
                  value={searchBy}
                  onChange={setSearchBy}
                />
              </div>
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search products..."
                />
              </div>
            </div>

            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => refetch()}
                className="p-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
              <div className="w-44">
                <SelectInput
                  name="itemsPerPage"
                  placeholder="Items per page"
                  options={itemsPerPageOptions}
                  value={itemsPerPage}
                  onChange={setItemsPerPage}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0">
            <ProductsTable
              products={filteredProducts}
              loading={loading}
              error={error?.message}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage
