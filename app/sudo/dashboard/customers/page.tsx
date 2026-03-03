"use client";

import React, { useState } from "react";
import Header from "@/app/components/layout/Header";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import SearchInput from "@/app/components/core/ui/SearchInput";
import CustomersTable, { Customer } from "@/app/components/dashboard/customers/CustomersTable";
import CustomerDetailModal, { CustomerDetail } from "@/app/components/dashboard/customers/CustomerDetailModal";
import { GET_CUSTOMERS, GET_CUSTOMER_BY_ID } from "@/app/apollo/queries";

interface GetCustomersData {
  getCustomers: {
    code: number;
    success: boolean;
    message: string;
    data: Customer[];
    totalCount: number;
    page: number;
    limit: number;
  };
}

interface GetCustomerByIdData {
  getCustomerById: {
    code: number;
    success: boolean;
    message: string;
    data: CustomerDetail;
  };
}

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery<GetCustomersData>(GET_CUSTOMERS, {
    variables: {
      page: 1,
      limit: 50,
      search: searchTerm || undefined,
    },
  });

  const [getCustomerById, { loading: detailLoading }] = useLazyQuery<GetCustomerByIdData>(
    GET_CUSTOMER_BY_ID
  );

  const customers = data?.getCustomers?.data || [];

  const handleView = async (customer: Customer) => {
    const { data: result } = await getCustomerById({ variables: { id: customer.id } });
    if (result?.getCustomerById?.success) {
      setSelectedCustomer(result.getCustomerById.data);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <>
      {/* Customer Detail Modal */}
      <CustomerDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customer={selectedCustomer}
      />

      <div className="flex flex-col h-full overflow-hidden">
        <div className="shrink-0">
          <Header
            title="Customers"
            breadCrumbs={[
              { label: "Dashboard", to: "/sudo/dashboard/general/home" },
              { label: "Customers", to: "/sudo/dashboard/customers" },
            ]}
          />
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <div className="w-full flex justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search by name or email..."
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
            <CustomersTable
              customers={customers}
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

export default CustomersPage;
