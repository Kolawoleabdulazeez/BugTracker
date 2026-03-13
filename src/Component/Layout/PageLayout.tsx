import React, { ReactNode } from 'react';
import Header from './header';

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
  contentClassName = '',
}) => {
  return (
    <div className="flex flex-col h-full ">
      {/* Header */}
      <Header
        title={title}
        showSearch={showSearch}
        showNotifications={showNotifications}
        showUserProfile={showUserProfile}
        className={headerClassName}
      />

      {/* Main Content */}
      <div className={`flex-1 overflow-auto p-6 bg-gray-50 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;