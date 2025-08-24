'use client';
import { usePageHeader } from '@/contexts/PageHeaderContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Bell } from 'lucide-react'; // Placeholder icons
import Breadcrumb from './Breadcrumb';

// Placeholder components
const NotificationDropdown = () => (
  <button className="w-9 h-9 flex items-center justify-center border rounded-lg">
    <Bell size={18} />
  </button>
);


export function Navbar() {
  const { toggleMobileSidebar } = useSidebar();
  const { actions } = usePageHeader();

  return (
    <header className="sticky top-0 z-30 flex w-full bg-white border-b">
      <div className="flex flex-grow items-center justify-between py-3 px-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            aria-controls="sidebar"
            onClick={toggleMobileSidebar}
            className="z-50 block rounded-lg border border-gray-200 bg-white p-2 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M3.33334 5H16.6667V6.66667H3.33334V5ZM3.33334 9.16667H16.6667V10.8333H3.33334V9.16667ZM3.33334 13.3333H16.6667V15H3.33334V13.3333Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
          <div className="hidden lg:block">
            <Breadcrumb />
          </div>
        </div>
        <div className="flex items-center gap-3 2xsm:gap-4">
          {actions}
          <div className="h-8 w-px bg-gray-200 hidden sm:block" />
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
}
