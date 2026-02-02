"use client";

import React from "react";
import Header from "@/app/components/layout/Header";
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import Button from "@/app/components/core/ui/button";
import WelcomeCard from "@/app/components/layout/WelcomeCard";

const DashboardHome = () => {
  const stats = [
    {
      label: "Total Revenue",
      value: "$24,500",
      change: "+12.5%",
      trend: "up",
      icon: CurrencyDollarIcon,
      color: "bg-green-500",
    },
    {
      label: "Total Orders",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBagIcon,
      color: "bg-blue-500",
    },
    {
      label: "Total Customers",
      value: "1,245",
      change: "+5.1%",
      trend: "up",
      icon: UsersIcon,
      color: "bg-purple-500",
    },
    {
      label: "Conversion Rate",
      value: "3.2%",
      change: "-0.4%",
      trend: "down",
      icon: ChartBarIcon,
      color: "bg-amber-500",
    },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Sarah Johnson", product: "Gold Necklace", amount: "$450", status: "Completed" },
    { id: "ORD-002", customer: "Emily Davis", product: "Diamond Earrings", amount: "$1,200", status: "Processing" },
    { id: "ORD-003", customer: "Maria Garcia", product: "Silver Bracelet", amount: "$180", status: "Pending" },
    { id: "ORD-004", customer: "Lisa Anderson", product: "Pearl Ring", amount: "$320", status: "Completed" },
    { id: "ORD-005", customer: "Jennifer Wilson", product: "Rose Gold Pendant", amount: "$275", status: "Shipped" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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

