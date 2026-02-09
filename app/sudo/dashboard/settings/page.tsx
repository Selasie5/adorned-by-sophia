"use client";

import React, { useContext, useState, useEffect } from "react";
import Header from "@/app/components/layout/Header";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowPathIcon, UsersIcon, ShieldCheckIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "@/app/context/AuthContext";
import LoginActivityTable, { LoginActivityItem } from "@/app/components/dashboard/settings/LoginActivityTable";
import { GET_STORE_SETTINGS, UPDATE_STORE_SETTINGS } from "@/app/apollo/queries";
import Button from "@/app/components/core/ui/button";
import Input from "@/app/components/core/ui/input";
import { showToast } from "@/app/components/core/ui/toast";
import Link from "next/link";
import Loader from "@/app/components/core/ui/loader";

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

interface StoreSettings {
  storeName: string;
  currency: string;
  taxRate: number;
  emailNotifications: {
    orderConfirmation: boolean;
    shippingUpdates: boolean;
    lowStockAlerts: boolean;
    lowStockThreshold: number;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

const SettingsPage = () => {
  const { admin } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<"store" | "login">("store");

  const { data: loginData, loading: loginLoading, error: loginError, refetch: refetchLogin } = useQuery<GetLoginActivityData>(
    GET_LOGIN_ACTIVITY,
    {
      variables: { limit: 10 },
    }
  );

  interface GetStoreSettingsResponse {
    getStoreSettings: {
      code: number;
      success: boolean;
      message: string;
      data: StoreSettings;
    };
  }

  const { data: settingsData, loading: settingsLoading, refetch: refetchSettings } = useQuery<GetStoreSettingsResponse>(GET_STORE_SETTINGS);

  const [updateSettings, { loading: updateLoading }] = useMutation(UPDATE_STORE_SETTINGS, {
    onCompleted: (responseData) => {
      const data = responseData as { updateStoreSettings: { success: boolean; message: string } };
      if (data.updateStoreSettings.success) {
        showToast("Settings updated successfully", "success");
        refetchSettings();
      } else {
        showToast(data.updateStoreSettings.message, "error");
      }
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  const [formData, setFormData] = useState<StoreSettings>({
    storeName: "",
    currency: "GHS",
    taxRate: 0,
    emailNotifications: {
      orderConfirmation: true,
      shippingUpdates: true,
      lowStockAlerts: true,
      lowStockThreshold: 10,
    },
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
  });

  useEffect(() => {
    if (settingsData?.getStoreSettings?.data) {
      const s = settingsData.getStoreSettings.data;
      setFormData({
        storeName: s.storeName || "",
        currency: s.currency || "GHS",
        taxRate: s.taxRate || 0,
        emailNotifications: {
          orderConfirmation: s.emailNotifications?.orderConfirmation ?? true,
          shippingUpdates: s.emailNotifications?.shippingUpdates ?? true,
          lowStockAlerts: s.emailNotifications?.lowStockAlerts ?? true,
          lowStockThreshold: s.emailNotifications?.lowStockThreshold ?? 10,
        },
        socialLinks: {
          facebook: s.socialLinks?.facebook || "",
          instagram: s.socialLinks?.instagram || "",
          twitter: s.socialLinks?.twitter || "",
        },
      });
    }
  }, [settingsData]);

  const activities = loginData?.getLoginActivity || [];

  const handleSaveSettings = () => {
    updateSettings({
      variables: {
        input: formData,
      },
    });
  };

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
    

        {/* Tabs */}
        <div className="bg-white border border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab("store")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "store"
                  ? "border-green-500 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <Cog6ToothIcon className="w-4 h-4" />
                Store Settings
              </span>
            </button>
            <button
              onClick={() => setActiveTab("login")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "login"
                  ? "border-green-500 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4" />
                Login Activity
              </span>
            </button>
          </nav>
        </div>

       
        {activeTab === "store" && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {settingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Store Configuration</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => refetchSettings()}
                      className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-dotted border-gray-200 rounded-lg p-6">
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name
                    </label>
                    <Input
                      name="storeName"
                      type="text"
                      value={formData.storeName}
                      onChange={(e) =>
                        setFormData({ ...formData, storeName: e.target.value })
                      }
                      placeholder="Enter store name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="GHS">GHS - Ghana Cedi</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) =>
                      setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="Enter tax rate"
                    min={0}
                    max={100}
                    step={0.1}
                    className="w-full px-4 py-3 border text-xs border-gray-300 rounded-md outline-none focus:border-gray-800 focus:ring-0"
                  />
                </div>

                {/* Email Notifications */}
                <div className="border border-dotted border-gray-200 p-6 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Email Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.emailNotifications.orderConfirmation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emailNotifications: {
                              ...formData.emailNotifications,
                              orderConfirmation: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Order Confirmation Emails</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.emailNotifications.shippingUpdates}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emailNotifications: {
                              ...formData.emailNotifications,
                              shippingUpdates: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Shipping Update Emails</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.emailNotifications.lowStockAlerts}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emailNotifications: {
                              ...formData.emailNotifications,
                              lowStockAlerts: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Low Stock Alert Emails</span>
                    </label>
                    <div className="ml-7">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        value={formData.emailNotifications.lowStockThreshold}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emailNotifications: {
                              ...formData.emailNotifications,
                              lowStockThreshold: parseInt(e.target.value) || 10,
                            },
                          })
                        }
                        placeholder="Items threshold"
                        min={1}
                        className="max-w-xs w-full px-4 py-3 border text-xs border-gray-300 rounded-md outline-none focus:border-gray-800 focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="border border-dotted border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Social Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facebook
                      </label>
                      <Input
                        name="facebook"
                        type="url"
                        value={formData.socialLinks.facebook}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socialLinks: {
                              ...formData.socialLinks,
                              facebook: e.target.value,
                            },
                          })
                        }
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram
                      </label>
                      <Input
                        name="instagram"
                        type="url"
                        value={formData.socialLinks.instagram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socialLinks: {
                              ...formData.socialLinks,
                              instagram: e.target.value,
                            },
                          })
                        }
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Twitter
                      </label>
                      <Input
                        name="twitter"
                        type="url"
                        value={formData.socialLinks.twitter}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socialLinks: {
                              ...formData.socialLinks,
                              twitter: e.target.value,
                            },
                          })
                        }
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    label={updateLoading ? "Saving..." : "Save Changes"}
                    primary
                    onClick={handleSaveSettings}
                    disabled={updateLoading}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Login Activity Tab */}
        {activeTab === "login" && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-normal text-gray-900">
                  Recent Login Activity
                </h3>
              </div>
              <button
                onClick={() => refetchLogin()}
                className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            </div>

            <LoginActivityTable
              activities={activities}
              loading={loginLoading}
              error={loginError?.message}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
