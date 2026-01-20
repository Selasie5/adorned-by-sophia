"use client";

import React, { useContext } from "react";
import Header from "@/app/components/layout/Header";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ArrowPathIcon, UsersIcon, ShieldCheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "@/app/context/AuthContext";
import Link from "next/link";
import LoginActivityTable, { LoginActivityItem } from "@/app/components/dashboard/settings/LoginActivityTable";

const GET_LOGIN_ACTIVITY = gql`
  query GetLoginActivity($limit: Int) {
    getLoginActivity(limit: $limit) {
      id
      email
      ipAddress
      userAgent
      status
      reason
      timestamp
    }
  }
`;

type GetLoginActivityData = {
  getLoginActivity: LoginActivityItem[];
};

const SettingsPage = () => {
  const { admin } = useContext(AuthContext);
  const isSuperAdmin = admin?.role === "SUPER_ADMIN";

  const { data, loading, error, refetch } = useQuery<GetLoginActivityData>(
    GET_LOGIN_ACTIVITY,
    {
      variables: { limit: 10 },
    }
  );

  const activities = data?.getLoginActivity || [];

  const settingsLinks = [
    {
      title: "Admin Management",
      description: "Manage admins, create new accounts, and assign roles",
      icon: UsersIcon,
      href: "/sudo/dashboard/settings/admins",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      title: "Security Settings",
      description: "Two-factor authentication and password management",
      icon: ShieldCheckIcon,
      href: "/sudo/dashboard/settings/security",
      roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    },
  ];

  const accessibleLinks = settingsLinks.filter((link) =>
    link.roles.includes(admin?.role || "")
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden sub">
      <div className="shrink-0">
        <Header
          title="Settings"
          breadCrumbs={[
            { label: "Dashboard", to: "/sudo/dashboard/general/home" },
            { label: "Settings", to: "/sudo/dashboard/settings" },
          ]}
        />
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
{/*      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="p-6 bg-white border border-gray-200 rounded-lg hover:border-rose-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
                  <link.icon className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div> */}

       
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Login Activity
              </h3>
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
              title="Refresh"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>

          <LoginActivityTable
            activities={activities}
            loading={loading}
            error={error?.message}
          />

          {/* {!isSuperAdmin && (
            <p className="text-xs text-gray-500 mt-4">
              Note: You can only see your own login activity. Super admins can
              see all activity.
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
