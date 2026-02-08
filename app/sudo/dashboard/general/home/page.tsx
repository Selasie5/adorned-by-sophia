"use client";

import React from "react";
import Header from "@/app/components/layout/Header";
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import WelcomeCard from "@/app/components/layout/WelcomeCard";

// Placeholder data for future dashboard stats
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _placeholderIcons = { ShoppingBagIcon, CurrencyDollarIcon, UsersIcon, ChartBarIcon };

const DashboardHome = () => {
  return (
    <div className="flex flex-col min-h-screen sudo">
      <Header
        title="Dashboard"
        breadCrumbs={[
          { label: "General", to: "/sudo/dashboard/general/home" },
          { label: "Dashboard", to: "/sudo/dashboard/general/home" },
        ]}
        showSearch
        // actions={
        //  <Button 
        //  label="+ Add Product"
        //  primary
        //  onClick={() => {}}
        //  />
        // }
      />

      <div className="flex-1 p-6">

        <div className="grid grid-cols-1 md:grid-cols-4 place-items-center w-full">
          <WelcomeCard/>
          </div>
      
             </div>
    </div>
  );
};

export default DashboardHome;

