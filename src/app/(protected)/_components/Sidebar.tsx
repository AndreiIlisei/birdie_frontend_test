'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTenant } from '@/contexts/TenantContext';
import IconHome from '@/assets/icon-home.svg';
import IconInsight from '@/assets/icon-insight.svg';

const mainNavLinks = [
  {
    name: 'Home',
    href: '/insights',
    icon: <Image src={IconHome} alt={`home icon`} width={18} height={18} className='text-brand-1' />,
    isHomeLink: true, // Special flag to prevent active state
  },
  {
    name: 'Insights',
    href: '/insights',
    icon: <Image src={IconInsight} alt={`icon`} width={18} height={18} className='text-brand-1' />,
  },
];

export function Sidebar() {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const tenant = useTenant();

  const NavLink = ({ name, href, icon, isHomeLink }: { name: string; href: string; icon: React.ReactNode; isHomeLink?: boolean }) => {
    const isActive = pathname === href && !isHomeLink; 

    return (
      <li>
        <Link
          href={href}
          onClick={() => isMobileOpen && toggleMobileSidebar()}
          className={`group relative flex items-center gap-3 rounded-lg p-3 gap-x-3 font-medium transition-colors ${
            isActive ? 'bg-brand-3' : 'hover:bg-brand-2'
          }`}
        >
          {icon}
          <span className="whitespace-nowrap">{name}</span>
        </Link>
      </li>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-brand-4 bg-opacity-50 z-10 lg:hidden ${
          isMobileOpen ? 'block' : 'hidden'
        }`}
        onClick={toggleMobileSidebar}
      ></div>

      <aside
        className={`fixed bg-brand-5 top-0 left-0 z-50 flex h-screen px-4 w-36 flex-col overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-e gap-2 py-8">
          <Link href="/">
            <Image
              src={tenant.logo}
              alt={`${tenant.name} Logo`}
              width={72}
              height={18}
              className="h-[18px] w-auto"
              priority
            />
          </Link>
        </div>
        <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto py-4">
          <nav className="flex flex-1 flex-col justify-end">
             <ul className="flex flex-col gap-1.5">
                {mainNavLinks.map((link) => (
                  <NavLink key={link.name} name={link.name} href={link.href} icon={link.icon} isHomeLink={link.isHomeLink} />
                ))}
              </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
