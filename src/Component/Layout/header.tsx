import React, { useState } from 'react';
import Image from 'next/image';
import { IoNotifications } from 'react-icons/io5';
import { ChevronDown, Search as SearchIcon } from 'lucide-react';
import { useAuthUser } from '@/pages/utils/services/auth/useAuths';

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
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  
const { data: user } = useAuthUser();


  return (
    <header
      className={`sticky top-0 z-30 border-b border-white/10 bg-gradient-to-br from-neutral-950 via-gray-900 to-neutral-950 backdrop-blur-xl ${className}`}
    >
      <div className="flex min-h-[84px] items-center justify-between px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          {title && (
            <div className="space-y-1">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="truncate text-sm text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="ml-6 flex items-center gap-3">
          {showSearch && (
            <div className="hidden md:flex">
              <div className="relative w-[320px] lg:w-[380px]">
                <SearchIcon
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, tasks, team..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-gray-100 placeholder:text-gray-500 outline-none transition focus:border-blue-500/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          )}

          {showNotifications && (
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <IoNotifications size={19} />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-neutral-950" />
            </button>
          )}

          {showUserProfile && (
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
            >
              <Image
                src={user?.user.avatarUrl || '/anime.avif'}
                alt="User profile"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover object-top ring-1 ring-white/10"
              />

              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-gray-100">
                  {user?.user.fullName}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.user.role || "Tester"}
                </p>
              </div>

              <ChevronDown size={16} className="hidden text-gray-500 sm:block" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;