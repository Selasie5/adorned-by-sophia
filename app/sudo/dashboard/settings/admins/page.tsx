"use client";

import React, { useState, useContext } from "react";
import Header from "@/app/components/layout/Header";
import Button from "@/app/components/core/ui/button";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import SelectInput from "@/app/components/core/ui/SelectInput";
import SearchInput from "@/app/components/core/ui/SearchInput";
import AdminsTable, { Admin } from "@/app/components/dashboard/settings/AdminsTable";
import Alert from "@/app/components/core/ui/Alert";
import { useRouter, useSearchParams } from "next/navigation";
import AdminModal, { GET_ADMINS } from "@/app/components/dashboard/settings/AdminModal";
import { showToast } from "@/app/components/core/ui/toast";
import { AuthContext } from "@/app/context/AuthContext";
import { useAuth } from "@/app/hooks/useAuth";

const DELETE_ADMIN = gql`
  mutation DeleteAdmin($id: ID!) {
    deleteAdmin(id: $id)
  }
`;

type GetAdminsData = {
  getAdmins: Admin[];
};

const AdminsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    admin: Admin | null;
  }>({
    isOpen: false,
    admin: null,
  });

  const { admin: currentUser } = useContext(AuthContext);
  const router = useRouter();
  const params = useSearchParams();

  const { data, loading, error, refetch } = useQuery<GetAdminsData>(GET_ADMINS, {
    variables: roleFilter ? { role: roleFilter } : {},
  });

  const [deleteAdmin, { loading: deleteLoading }] = useMutation<{ deleteAdmin: boolean }>(DELETE_ADMIN, {
    onCompleted: (responseData) => {
      if (responseData.deleteAdmin) {
        showToast("Admin deleted successfully", "success");
        refetch();
      } else {
        showToast("Failed to delete admin", "error");
      }
      setDeleteAlert({ isOpen: false, admin: null });
    },
    onError: (error) => {
      showToast(error.message, "error");
      setDeleteAlert({ isOpen: false, admin: null });
    },
  });

  const admins = data?.getAdmins || [];

  const filteredAdmins = admins.filter((admin) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm
      ? admin.firstName.toLowerCase().includes(searchLower) ||
        admin.lastName.toLowerCase().includes(searchLower) ||
        admin.email.toLowerCase().includes(searchLower)
      : true;

    return matchesSearch;
  });

  const showModal =
    params.get("modal") === "view" &&
    (params.get("action") === "create-admin" ||
      params.get("action") === "edit-admin" ||
      params.get("action") === "view-admin");

  const handleDelete = (admin: Admin) => {
    setDeleteAlert({ isOpen: true, admin });
  };

  const confirmDelete = async () => {
    if (deleteAlert.admin) {
      await deleteAdmin({ variables: { id: deleteAlert.admin.id } });
    }
  };

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode("edit");
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "edit-admin");
    router.push(`?${searchParams.toString()}`);
  };

  const handleView = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode("view");
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "view-admin");
    router.push(`?${searchParams.toString()}`);
  };

  const handleCreate = () => {
    setSelectedAdmin(null);
    setModalMode("create");
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set("modal", "view");
    searchParams.set("action", "create-admin");
    router.push(`?${searchParams.toString()}`);
  };

  const handleCloseModal = () => {
    setSelectedAdmin(null);
    const searchParams = new URLSearchParams(params.toString());
    searchParams.delete("modal");
    searchParams.delete("action");
    const query = searchParams.toString();
    router.push(query ? `?${query}` : "/sudo/dashboard/settings/admins");
  };

  const roleFilterOptions = [
    { id: "all", label: "All Roles", value: "" },
    { id: "SUPER_ADMIN", label: "Super Admin", value: "SUPER_ADMIN" },
    { id: "ADMIN", label: "Admin", value: "ADMIN" },
    { id: "MANAGER", label: "Manager", value: "MANAGER" },
  ];

  const itemsPerPageOptions = [
    { id: "10", label: "10 items per page", value: "10" },
    { id: "25", label: "25 items per page", value: "25" },
    { id: "50", label: "50 items per page", value: "50" },
    { id: "100", label: "100 items per page", value: "100" },
  ];


  const currentUserId = admins.find(
    (admin) => admin.email === currentUser?.email
  )?.id;

  const {user} = useAuth();

  const currentUserRole = user?.role;

  return (
    <>
     
      <Alert
        isOpen={deleteAlert.isOpen}
        heading="Delete Admin"
        message={
          <>
            Are you sure you want to delete{" "}
            <strong>
              {deleteAlert.admin?.firstName} {deleteAlert.admin?.lastName}
            </strong>
            ? This action cannot be undone.
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, admin: null })}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmLoading={deleteLoading}
        variant="danger"
      />

   
      {showModal && (
        <AdminModal
          isOpen={showModal}
          onClose={handleCloseModal}
          admin={selectedAdmin}
          mode={modalMode}
        />
      )}

      <div className="flex flex-col h-full overflow-hidden">
        <div className="shrink-0">
          <Header
            title="Admins"
            breadCrumbs={[
              { label: "Dashboard", to: "/sudo/dashboard/general/home" },
              { label: "Settings", to: "/sudo/dashboard/settings" },
              { label: "Admins", to: "/sudo/dashboard/settings/admins" },
            ]}
            actions={
              <div className="flex justify-end items-center gap-4">
                <Button
                  label="+ Create new admin"
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
              <div className="w-40">
                <SelectInput
                  name="roleFilter"
                  placeholder="Filter by Role"
                  options={roleFilterOptions}
                  value={roleFilter}
                  onChange={setRoleFilter}
                />
              </div>
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search admins by name or email..."
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

        
          <div className="flex-1 min-h-0">
            <AdminsTable
              admins={filteredAdmins}
              loading={loading}
              error={error?.message}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
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

export default AdminsPage;
