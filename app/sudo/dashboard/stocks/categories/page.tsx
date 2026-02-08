"use client";

import React, { useState } from "react";
import Header from "@/app/components/layout/Header";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import SelectInput from "@/app/components/core/ui/SelectInput";
import SearchInput from "@/app/components/core/ui/SearchInput";
import CategoriesTable, { Category } from "@/app/components/dashboard/stocks/CategoriesTable";
import Button from "@/app/components/core/ui/button";
import Alert from "@/app/components/core/ui/Alert";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryModal from "@/app/components/dashboard/stocks/CategoryModal";
import { showToast } from "@/app/components/core/ui/toast";
import { GET_ALL_CATEGORIES } from "@/app/apollo/queries";


const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      code
      success
      message
    }
  }
`;

type GetAllCategoriesData = {
  getAllCategories: {
    code: string;
    success: boolean;
    message: string;
    data: Category[];
  };
};

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; category: Category | null }>({
    isOpen: false,
    category: null,
  });

  const router = useRouter();
  const params = useSearchParams();

  const { data, loading, error, refetch } = useQuery<GetAllCategoriesData>(GET_ALL_CATEGORIES);
  const [deleteCategory, { loading: deleteLoading }] = useMutation(DELETE_CATEGORY, {
    onCompleted: (responseData) => {
      const data = responseData as { deleteCategory: { success: boolean; message: string } };
      if (data.deleteCategory.success) {
        showToast('Category deleted successfully', 'success');
        refetch();
      } else {
        showToast(data.deleteCategory.message, 'error');
      }
      setDeleteAlert({ isOpen: false, category: null });
    },
    onError: (error) => {
      showToast(error.message, 'error');
      setDeleteAlert({ isOpen: false, category: null });
    },
  });

  const categories = data?.getAllCategories?.data || [];

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = searchTerm
      ? category.name.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;

    return matchesSearch;
  });

  const showModal =
    params.get("modal") === "view" &&
    (params.get("action") === "create-category" ||
      params.get("action") === "edit-category" ||
      params.get("action") === "view-category");

  const handleDelete = (category: Category) => {
    setDeleteAlert({ isOpen: true, category });
  };

  const confirmDelete = async () => {
    if (deleteAlert.category) {
      await deleteCategory({ variables: { id: deleteAlert.category.id } });
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalMode('edit');
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "edit-category");
    router.push(`?${searchParams.toString()}`);
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setModalMode('view');
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "view-category");
    router.push(`?${searchParams.toString()}`);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setModalMode('create');
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "create-category");
    router.push(`?${searchParams.toString()}`);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    const searchParams = new URLSearchParams(params.toString());
    searchParams.delete("modal");
    searchParams.delete("action");
    const query = searchParams.toString();
    router.push(query ? `?${query}` : "/sudo/dashboard/stocks/categories");
  };

  const searchByOptions = [
    { id: "name", label: "Name", value: "name" },
   
  ];

 
  const itemsPerPageOptions = [
    { id: "10", label: "10 items per page", value: "10" },
    { id: "25", label: "25 items per page", value: "25" },
    { id: "50", label: "50 items per page", value: "50" },
    { id: "100", label: "100 items per page", value: "100" },
  ];



  const urlParams = new URLSearchParams();
 


  return (
    <>
      {/* Delete Alert */}
      <Alert
        isOpen={deleteAlert.isOpen}
        heading="Delete Category"
        message={`Are you sure you want to delete "${deleteAlert.category?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, category: null })}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmLoading={deleteLoading}
        variant="danger"
      />

      {/* Category Modal */}
      {showModal && (
        <CategoryModal
          isOpen={showModal}
          onClose={handleCloseModal}
          category={selectedCategory}
          mode={modalMode}
        />
      )}

    <div className="flex flex-col h-full overflow-hidden">
  
  
      <div className="shrink-0">
        <Header
          title="Categories"
          breadCrumbs={[
            { label: "Dashboard", to: "/sudo/dashboard/general/home" },
            { label: "Stocks", to: "/sudo/dashboard/stocks" },
            { label: "Categories", to: "/sudo/dashboard/stocks/categories" },
          ]}
          actions={
            <div className="flex justify-end items-center gap-4">
             
             <Button 
              label="+ Create new category"
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
                placeholder="Search categories..."
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
          <CategoriesTable
            categories={filteredCategories}
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

export default CategoriesPage;
