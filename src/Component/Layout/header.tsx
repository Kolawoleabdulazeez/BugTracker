import React, { useState } from "react";
import Image from "next/image";
import { IoNotifications } from "react-icons/io5";
import { ChevronDown, Search as SearchIcon } from "lucide-react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useAuthUser } from "@/services/auth/useAuths";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserProfile?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showSearch = true,
  showNotifications = true,
  showUserProfile = true,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: user } = useAuthUser();

  return (
    <header
      className={`glass-panel sticky top-0 z-30 border-b border-gray-200/60 dark:border-white/10 ${className}`}
    >
      <div className="flex min-h-[84px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          {title && (
            <div className="space-y-1">
              <h1 className="truncate ms-12 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="ml-4 flex items-center gap-2 sm:ml-6 sm:gap-3">


          <ThemeToggle />

          {showNotifications && (
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white/70 text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Notifications"
            >
              <IoNotifications size={19} />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-danger-500 ring-2 ring-white dark:ring-secondary-900" />
            </button>
          )}

          {showUserProfile && (
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white/70 px-3 py-2 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <Image
                src={user?.user.avatarUrl || "/anime.avif"}
                alt="User profile"
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 rounded-full object-cover object-top ring-1 ring-orange-500/30 dark:ring-orange-500/20"
              />

              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.user.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {"User"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className="hidden text-gray-400 sm:block dark:text-gray-500"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;