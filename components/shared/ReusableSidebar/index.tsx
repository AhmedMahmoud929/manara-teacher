"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

export type SidebarItem = {
  title: string;
  path?: string;
  icon: React.ReactNode;
  badge?: string | number;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
  endIcon?: React.ReactNode;
  children?: SidebarItem[];
};

export type SidebarProps = {
  items: SidebarItem[];
  logo?: React.ReactNode;
  title?: string;
  direction?: "ltr" | "rtl";
  onToggle?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
  mobileBreakpoint?: number;
  position?: "left" | "right";
  footer?: React.ReactNode;
  header?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (isCollapsed: boolean) => void;
  userInfo?: {
    name?: string;
    avatar?: string;
    role?: string;
  };
};

export const ReusableSidebar: React.FC<SidebarProps> = ({
  items,
  logo,
  title = "Dashboard",
  direction = "ltr",
  onToggle,
  defaultOpen = true,
  className = "",
  mobileBreakpoint = 768,
  position = "left",
  footer,
  header,
  collapsible = true,
  defaultCollapsed = false,
  onCollapsedChange,
  userInfo,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const pathname = usePathname();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < mobileBreakpoint;
      setIsMobile(isMobileView);

      if (isMobileView) {
        setIsOpen(false);
        // Reset collapsed state when going to mobile
        setIsCollapsed(false);
      } else {
        setIsOpen(defaultOpen);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBreakpoint, defaultOpen]);

  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  // Toggle collapse state
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onCollapsedChange) onCollapsedChange(newState);
  };

  // Determine if an item is active
  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path;
  };

  // Toggle submenu
  const toggleSubmenu = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Render a sidebar item
  const renderSidebarItem = (item: SidebarItem, index: number) => {
    const isItemActive = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded =
      item.isOpen !== undefined
        ? item.isOpen
        : expandedItems[item.title] || false;

    // For items with children (collapsible items)
    if (hasChildren) {
      return (
        <li key={index}>
          <Collapsible className="w-full">
            <CollapsibleTrigger className="w-full">
              <button
                className={`
                  flex items-center gap-3 px-4 py-2 mx-2 rounded-md transition-colors w-full
                  ${
                    isItemActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <div
                  className={`${isCollapsed ? "mx-auto" : ""} text-gray-500`}
                >
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <>
                    <span className="truncate flex-grow text-right">
                      {item.title}
                    </span>
                    {item.endIcon && (
                      <span className="ml-auto">{item.endIcon}</span>
                    )}
                  </>
                )}
              </button>
            </CollapsibleTrigger>

            {!isCollapsed && (
              <CollapsibleContent>
                <ul className="mt-1 mr-6 space-y-1">
                  {item.children?.map((child, childIndex) => (
                    <li key={`${index}-${childIndex}`}>
                      <Link
                        onClick={() => isMobile && toggleSidebar}
                        href={child.path || "#"}
                        className={`
                          flex items-center gap-3 px-4 py-2 mx-2 rounded-md transition-colors
                          ${
                            isActive(child.path)
                              ? "bg-gray-100 text-gray-900 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="text-gray-500">{child.icon}</div>
                        <span className="truncate">{child.title}</span>

                        {child.badge && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/15 text-primary ml-auto">
                            {child.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            )}
          </Collapsible>
        </li>
      );
    }

    // For regular items with links
    return (
      <li key={index}>
        <Link
          onClick={() => isMobile && toggleSidebar}
          href={item.path || "#"}
          className={`
            flex items-center gap-3 px-4 py-3 mx-2 rounded-md transition-colors
            ${
              isItemActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }
            ${isCollapsed ? "justify-center" : ""}
          `}
          title={isCollapsed ? item.title : undefined}
        >
          <div className={`${isCollapsed ? "mx-auto" : ""} text-gray-500`}>
            {item.icon}
          </div>

          {!isCollapsed && <span className={`truncate`}>{item.title}</span>}

          {!isCollapsed && item.badge && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/15 text-primary ml-auto">
              {item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Toggle button for mobile */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-40 p-2 rounded-md bg-white border border-gray-200 ${
          position === "left" ? "left-4" : "right-4"
        } top-5 md:hidden transition-all duration-300 hover:bg-gray-50 active:scale-95`}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Main sidebar */}
      <aside
        className={`
          fixed top-0 bottom-0 bg-white border-gray-200 
          transition-all duration-300 ease-in-out z-50
          ${
            isOpen
              ? "translate-x-0"
              : position === "left"
              ? "-translate-x-full"
              : "translate-x-full"
          }
          ${position === "left" ? "left-0 border-r" : "right-0 border-l"}
          ${isMobile ? "shadow-xl w-[85%] max-w-[300px]" : ""}
          ${direction === "rtl" ? "rtl" : "ltr"}
          ${isCollapsed && !isMobile ? "w-20" : "w-64"}
          ${className}
        `}
        dir={direction}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          {header ? (
            header
          ) : (
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {logo && <div className="flex-shrink-0">{logo}</div>}
                  {!isCollapsed && title && (
                    <h2 className="text-xl font-semibold">{title}</h2>
                  )}
                </div>
                <div className="flex items-center">
                  {collapsible && !isMobile && (
                    <button
                      onClick={toggleCollapse}
                      className="p-1 bg-white rounded-full hover:bg-gray-100 mr-1 transition-colors"
                      aria-label={
                        isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                      }
                    >
                      {isCollapsed ? (
                        direction === "rtl" ? (
                          <ChevronLeft size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )
                      ) : direction === "rtl" ? (
                        <ChevronRight size={18} />
                      ) : (
                        <ChevronLeft size={18} />
                      )}
                    </button>
                  )}
                  {isMobile && (
                    <button
                      onClick={toggleSidebar}
                      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                      aria-label="Close sidebar"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* User info if provided */}
              {userInfo && !isCollapsed && (
                <div className="mt-4 flex items-center gap-3">
                  {userInfo.avatar && (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={userInfo.avatar || "/placeholder.svg"}
                        alt={userInfo.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    {userInfo.name && (
                      <p className="font-medium">{userInfo.name}</p>
                    )}
                    {userInfo.role && (
                      <p className="text-sm text-gray-500">{userInfo.role}</p>
                    )}
                  </div>
                </div>
              )}
              {userInfo && isCollapsed && userInfo.avatar && (
                <div className="mt-4 flex justify-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={userInfo.avatar || "/placeholder.svg"}
                      alt={userInfo.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <ScrollArea dir="rtl">
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
              <ul className="space-y-1">
                {items.map((item, index) => renderSidebarItem(item, index))}
              </ul>
            </nav>
          </ScrollArea>

          {/* Footer */}
          {footer && (
            <div
              className={`p-4 border-t mt-auto ${
                isCollapsed ? "text-center" : ""
              }`}
            >
              {isCollapsed
                ? React.Children.map(
                    React.Children.toArray(React.isValidElement(footer)),
                    (child) => {
                      if (
                        React.isValidElement(child) &&
                        typeof child.type !== "string"
                      ) {
                        return child;
                      }
                      return null;
                    }
                  )?.[0]
                : footer}
            </div>
          )}
        </div>
      </aside>

      {/* Main content wrapper - adjusted based on sidebar state */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? position === "left"
                ? isCollapsed && !isMobile
                  ? "md:ml-20"
                  : "md:ml-64"
                : isCollapsed && !isMobile
                ? "md:mr-20"
                : "md:mr-64"
              : ""
          }
        `}
      />
    </>
  );
};

export default ReusableSidebar;
