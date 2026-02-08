"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  ChartPieIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/app/hooks/useAuth";
import { ChartBarSquareIcon } from "@heroicons/react/24/outline";

interface MenuRef {
  tag: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to: string;
}

interface MenuItem {
  mainTag: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  refs?: MenuRef[];
  to?: string;
}

const Sidebar = () => {
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({});
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const toggleDropdown = (index: number) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isActive = (path: string) => pathname === path;

  const primaryMenuItems: MenuItem[] = [
    {
      mainTag: "General",
      icon: HomeIcon,
      refs: [
        {
          tag: "Dashboard",
          icon: ChartBarSquareIcon,
          to: "/sudo/dashboard/general/home",
        },
        {
          tag: "Analytics",
          icon: ChartPieIcon,
          to: "/sudo/dashboard/general/analytics",
        },
      ],
    },
    {
      mainTag: "Stocks",
      icon: ShoppingBagIcon,
      refs: [
        {
          tag: "Categories",
          icon: TagIcon,
          to: "/sudo/dashboard/stocks/categories",
        },
        {
          tag: "Products",
          icon: CubeIcon,
          to: "/sudo/dashboard/stocks/products",
        },
        {
          tag: "Inventory",
          icon: ClipboardDocumentListIcon,
          to: "/sudo/dashboard/stocks/inventory",
        },
      ],
    },
    {
      mainTag: "Orders",
      icon: ClipboardDocumentListIcon,
      refs: [
        {
          tag: "Order Tracking",
          icon: ClipboardDocumentListIcon,
          to: "/sudo/dashboard/orders/tracking",
        },
        {
          tag: "Complaints",
          icon: QuestionMarkCircleIcon,
          to: "/sudo/dashboard/orders/complaints",
        }
      ],
    },
    {
      mainTag: "Customers",
      icon: UsersIcon,
      refs: [
        {
          tag: "All Customers",
          icon: UsersIcon,
          to: "/sudo/dashboard/customers/all",
        },
        {
          tag: "Feedback",
          icon: UsersIcon,
          to: "/sudo/dashboard/customers/feedback",
        },
      ],
    },
    // {
    //   mainTag: "Media",
    //   icon: PhotoIcon,
    //   refs: [
    //     {
    //       tag: "Media Library",
    //       icon: PhotoIcon,
    //       to: "/sudo/dashboard/media",
    //     },
    //   ],
    // },
    {
      mainTag: "Settings",
      icon: Cog6ToothIcon,
      refs: [
        {
          tag: "General",
          icon: Cog6ToothIcon,
          to: "/sudo/dashboard/settings",
        },
        {
          tag: "Admins",
          icon: UsersIcon,
          to: "/sudo/dashboard/settings/admins",
        },
      ],
    },
  ];

  const secondaryMenuItems = [
    {
      tag: "Notifications",
      icon: BellIcon,
      to: "/sudo/dashboard/notifications",
    },
    {
      tag: "Logout",
      icon: ArrowRightStartOnRectangleIcon,
      onClick: logout,
    },
  ];

  return (
    <div className="w-64 bg-rose-600 h-screen flex flex-col fixed left-0 top-0 ">
      {/* Logo Section */}
      <div className="flex-shrink-0 w-full">
        <div className="w-full h-16 border-b border-rose-300 flex items-center justify-start px-4">
          <div className="flex justify-start items-center gap-2">
            <span className="text-base font-mono font-semibold text-white">STORE MANAGEMENT & POS CONSOLE</span>
            {/* <span className="text-xs bg-amber-500 rounded px-2 py-0.5 font-mono text-white">
              {
                user?.role
              }
            </span> */}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sudo no-scrollbar">
        <div className="w-full flex flex-col justify-start items-start gap-1">
          {primaryMenuItems.map((menuItem, index) => (
            <div key={index} className="w-full">
              <button
                onClick={() => toggleDropdown(index)}
                className={`w-full flex justify-between items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors ${
                  openDropdowns[index]
                    ? "bg-black/30 text-white font-medium"
                    : "text-gray-50 hover:bg-black/30 font-extralight hover:text-white"
                }`}
              >
                <span className="text-sm font-medium">{menuItem.mainTag}</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openDropdowns[index] ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  openDropdowns[index] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {menuItem.refs && (
                  <div className="mt-1 flex flex-col gap-1 ml-2">
                    {menuItem.refs.map((refItem, refIndex) => (
                      <Link
                        key={refIndex}
                        href={refItem.to}
                        className={`w-full flex justify-start items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors ${
                          isActive(refItem.to)
                            ? "bg-black/30 text-white"
                            : "text-white hover:bg-black/30 hover:text-white"
                        }`}
                      >
                        <refItem.icon className="w-5 h-5" />
                        <span className="text-sm">{refItem.tag}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="shrink-0 w-full px-3 py-2  sudo">
        <div className="w-full flex flex-col justify-center items-start gap-1">
          {secondaryMenuItems.map((item, index) =>
            item.to ? (
              <Link
                key={index}
                href={item.to}
                className="w-full flex justify-start items-center gap-3 text-white px-4 py-3 cursor-pointer rounded-md hover:bg-black/30 hover:text-white transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.tag}</span>
              </Link>
            ) : (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex justify-start items-center gap-3 text-white px-4 py-3 cursor-pointer rounded-md hover:bg-black/30 hover:text-white transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.tag}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex-shrink-0 w-full px-3 py-3  sudo border-t border-rose-300 mt-auto">
        <div className="w-full flex justify-start items-center gap-3 p-2">
          <div className="w-5 h-5 p-4 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-normal">
              {user?.firstName?.[0] || "A"}
              {user?.lastName?.[0] || "S"}
            </span>
          </div>
          <div className="flex flex-col justify-start items-start">
            <span className="text-sm font-medium text-white">
              {user?.firstName || "Admin"} {user?.lastName || "User"}
            </span>
            <span className="text-xs text-gray-100">{user?.email || "admin@adornedbysophia.com"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
