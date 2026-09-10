import React, { ReactNode } from "react";
import Header from "./header";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserProfile?: boolean;
  headerClassName?: string;
  contentClassName?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  showSearch = true,
  showNotifications = true,
  showUserProfile = true,
  headerClassName,
  contentClassName = "",
}) => {
  return (
    <div className="app-canvas flex h-full flex-col">
      <Header
        title={title}
        showSearch={showSearch}
        showNotifications={showNotifications}
        showUserProfile={showUserProfile}
        className={headerClassName}
      />

      <div
        className={`flex-1 overflow-auto p-4 text-slate-900 sm:p-6 dark:text-white ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageLayout;