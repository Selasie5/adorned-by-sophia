"use client";

import React, { useState } from "react";
import Header from "@/app/components/layout/Header";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import SelectInput from "@/app/components/core/ui/SelectInput";
import SearchInput from "@/app/components/core/ui/SearchInput";
import CategoriesTable, { Category } from "@/app/components/dashboard/stocks/CategoriesTable";
import Button from "@/app/components/core/ui/button";
import { url } from "inspector";

const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      code
      success
      message
      data {
        id
        name
        description
        slug
        image
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

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
  const [statusFilter, setStatusFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("10");

  const { data, loading, error, refetch } = useQuery<GetAllCategoriesData>(GET_ALL_CATEGORIES);
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => refetch(),
  });

  const categories = data?.getAllCategories?.data || [];

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = searchTerm
      ? category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesStatus = statusFilter
      ? statusFilter === "active"
        ? category.isActive
        : !category.isActive
      : true;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      await deleteCategory({ variables: { id: category.id } });
    }
  };

  const handleEdit = (category: Category) => {
   
    console.log("Edit category:", category);
  };

  const handleView = (category: Category) => {
    
    console.log("View category:", category);
  };

  const searchByOptions = [
    { id: "name", label: "Name", value: "name" },
    { id: "slug", label: "Slug", value: "slug" },
  ];

  const statusOptions = [
    { id: "all", label: "All Status", value: "" },
    { id: "active", label: "Active", value: "active" },
    { id: "inactive", label: "Inactive", value: "inactive" },
  ];

  const itemsPerPageOptions = [
    { id: "10", label: "10 items per page", value: "10" },
    { id: "25", label: "25 items per page", value: "25" },
    { id: "50", label: "50 items per page", value: "50" },
    { id: "100", label: "100 items per page", value: "100" },
  ];



  const urlParams = new URLSearchParams();
 


  return (
    <div className="flex flex-col h-full overflow-hidden">
  
  {
    urlParams.get("modal") === "view" && urlParams.get("action") === "create-category"  && (
      <>
      <h1>Modal is coming</h1>
      </>
    )
  }
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
              <div className="w-40">
                <SelectInput
                  name="status"
                  placeholder="Filter by Status"
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
              </div>
             <Button 
              label="+ Create new category"
              primary
              onClick={()=>
              {
                urlParams.set("action","create-category")
                urlParams.set("modal","view")
                window.history.replaceState(null, "", `?${urlParams.toString()}`);
              }
              }
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
              className="p-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
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

        {/* Results Count */}
        {/* <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredCategories.length}</span> of{" "}
            <span className="font-medium">{categories.length}</span> categories
          </p>
        </div> */}

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
  );
};

export default CategoriesPage;
