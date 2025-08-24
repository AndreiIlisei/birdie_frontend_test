'use client';
import React from 'react';
import { usePageHeader } from '@/contexts/PageHeaderContext';
import { cn } from '@/lib/utils';
import Breadcrumb from './Breadcrumb';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const NotificationDropdown = () => (
  <button className="w-9 h-9 flex items-center justify-center text-brand-1">
    <Bell size={18} />
  </button>
);

const UserDropdown = () => {
  const user = useAuth();
  
  // Handle case where user or user.staff might be undefined
  const userName = user?.staff?.name || 'U';
  const firstLetter = userName.charAt(0);
  
  return (
    <Link href="/settings" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
      <div className="flex items-center gap-2">
          {firstLetter}
      </div>
    </Link>
  );
};

export function Navbar() {
  const { navbarStyle } = usePageHeader();

  return (
    <div
      className={cn(
        'flex w-full transition-colors duration-300',
        navbarStyle === 'solid' && 'bg-transparent',
        navbarStyle === 'transparent' && 'bg-transparent',
        navbarStyle === 'brand-5' && 'bg-brand-5'
      )}
    >
      <div className="flex flex-grow items-center justify-between py-3 px-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-4"><Breadcrumb /></div>
        <div className="flex items-center gap-3">
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </div>
  );
}
