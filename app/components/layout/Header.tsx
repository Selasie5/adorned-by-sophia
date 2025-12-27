"use client";

import React from "react";
import Link from "next/link";
import { ChevronRightIcon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface BreadcrumbItem {
  label: string;
  to: string;
}

interface HeaderProps {
  title: string;
  breadCrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  showSearch?: boolean;
}

const Header = ({ title, breadCrumbs, actions, className = "", showSearch = false }: HeaderProps) => {
  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 w-full flex items-center justify-between sudo ${className}`}>
      <div className="flex flex-col justify-center items-start gap-1">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {breadCrumbs && breadCrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            {breadCrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <Link
                  href={crumb.to}
                  className="hover:text-amber-600 transition-colors"
                >
                  {crumb.label}
                </Link>
                {index < breadCrumbs.length - 1 && (
                  <ChevronRightIcon className="w-3 h-3 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
            />
          </div>
        )}

        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

export default Header;
