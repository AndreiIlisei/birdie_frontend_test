'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);


  // Special handling for insights pages
  if (pathSegments[0] === 'insights') {
    return (
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li>
            <Link href="/insights" className="hover:text-brand-1 transition-colors">
              Insights
            </Link>
          </li>
          {pathSegments.length > 1 && (
            <>
              <li className="text-gray-400">
                <ChevronRight size={16} />
              </li>
              <li>
                <span className="text-brand-1 font-medium">
                  {decodeURIComponent(pathSegments[1])}
                </span>
              </li>
            </>
          )}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-gray-600">
        <li>
          <Link href="/" className="hover:text-brand-1 transition-colors">
            Home
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const decodedSegment = decodeURIComponent(segment);
          
          return (
            <React.Fragment key={href}>
              <li className="text-gray-400">
                <ChevronRight size={16} />
              </li>
              <li>
                {isLast ? (
                  <span className="text-brand-1 font-medium">{decodedSegment.charAt(0).toUpperCase() + decodedSegment.slice(1)}</span>
                ) : (
                  <Link href={href} className="hover:text-brand-1 transition-colors">
                    {decodedSegment.charAt(0).toUpperCase() + decodedSegment.slice(1)}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
