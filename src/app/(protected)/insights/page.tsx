"use client";

import { InsightCard } from "./_components/InsightCard";
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BottomFade } from './_components/BottomFade';
import { listDataGroups, listFactSheets } from '@/services/insights.service';
import { DataGroupResponse } from '@/types';

interface DataGroupWithType extends DataGroupResponse {
  displayType?: 'logo' | 'image' | 'list' | 'count';
  threshold?: number;
  imageUrl?: string;
  count?: number;
}

export default function InsightsPage() {
  const [dataGroups, setDataGroups] = useState<DataGroupWithType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse image_path to determine display type
  const parseImagePath = (imagePath?: string): { type: 'logo' | 'image' | 'list' | 'count', threshold: number, imageUrl: string } => {
    if (!imagePath) {
      return { type: 'image', threshold: 0, imageUrl: '' };
    }

    const parts = imagePath.split('|');
    if (parts.length >= 3) {
      const type = parts[0] as 'logo' | 'image' | 'list' | 'count';
      const threshold = parseInt(parts[1]) || 0;
      const imageUrl = parts[2];
      return { type, threshold, imageUrl };
    }

    return { type: 'image', threshold: 0, imageUrl: imagePath };
  };

  // Get data groups count for a specific group
  const getDataGroupsCount = async (groupId: number): Promise<number> => {
    try {
      // TODO: Replace with real API call to get fact sheets count
      const response = await listFactSheets(0, 1000, groupId);
      return response?.length || 0;
    } catch (error) {
      console.error('Error fetching data groups count:', error);
      return 0;
    }
  };

  // Load data groups from insights service (now using mock data)
  useEffect(() => {
    const fetchDataGroups = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with real API call
        // const response = await listDataGroups(0, 100);
        const response = await listDataGroups(0, 100);
        
        if (response && response.length > 0) {
          // Process each data group to determine display type
          const processedGroups = await Promise.all(
            response.map(async (group) => {
              const { type, threshold, imageUrl } = parseImagePath(group.image_path);
              
              let displayType = type;
              let count = 0;
              
              // For list and count types, check the threshold
              if (type === 'list' || type === 'count') {
                count = await getDataGroupsCount(group.id);
                if (type === 'list') {
                  displayType = count > threshold ? 'list' : 'image';
                } else if (type === 'count') {
                  displayType = count > threshold ? 'count' : 'image';
                }
              }
              
              return {
                ...group,
                displayType,
                threshold,
                imageUrl,
                count
              };
            })
          );
          
          setDataGroups(processedGroups);
        } else {
          setDataGroups([]);
        }
      } catch (err) {
        console.error('Error fetching data groups:', err);
        setError('Failed to load data groups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataGroups();
  }, []);

  // Render card based on display type
  const renderCard = (group: DataGroupWithType) => {
    const { displayType, imageUrl, name, description, id } = group;
    
    const commonFooter = (
      <div className="flex justify-between items-end">
        <span className={`text-xs ${displayType === 'logo' ? 'text-white/80' : 'text-gray-400'}`}>Last updated 1 week ago</span>
        <Link href={`/insights/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, ' '))}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-1 transition-transform hover:scale-110">
          <ArrowUpRight size={20} className='text-brand-2' />
        </Link>
      </div>
    );

    switch (displayType) {
      case 'logo':
        return (
          <InsightCard
            key={id}
            title={name}
            description={description || ''}
            bgColor="bg-brand-2"
            backgroundImage={imageUrl}
            footer={commonFooter}
          />
        );

      case 'count':
        return (
          <InsightCard
            key={id}
            title={name}
            description={description || ''}
            footer={commonFooter}
          >
            <div className="flex-1 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-9xl font-extrabold text-brand-1">{group.count || 0}</span>
                <span className="text-sm text-gray-500 mt-2">Items</span>
              </div>
            </div>
          </InsightCard>
        );

      case 'image':
        return (
          <InsightCard
            key={id}
            title={name}
            description={description || ''}
            footer={commonFooter}
          >
            <div className="flex-1 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full">
        
                  <Image 
                    src="/world.svg" 
                    alt={name} 
                    width={600} 
                    height={300} 
                    className="w-full h-auto max-w-full" 
                  />
              </div>
            </div>
          </InsightCard>
        );

      case 'list':
        return (
          <InsightCard
            key={id}
            title={name}
            description={description || ''}
            footer={commonFooter}
          >
            <div className="flex flex-col gap-2 w-full overflow-y-auto relative" style={{height: "calc(100% - 20px)"}}>
              {/* Show actual count or placeholder if no data */}
              {group.count && group.count > 0 ? (
                Array.from({ length: Math.min(group.count, 5) }, (_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg px-3 py-3 text-xs font-medium bg-gray-100 text-brand-1">
                    <span className="font-semibold mr-2">Item {i + 1}</span>
                    <span className="flex-1 text-left font-light">Data item {i + 1}</span>
                    <span className="ml-2 bg-white rounded px-2 py-1 text-[12px] font-bold border border-gray-200">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-500 text-sm">No items available</span>
                </div>
              )}
            </div>
            {group.count && group.count > 5 && <BottomFade height={120} style={{ bottom: 80 }} />}
          </InsightCard>
        );

      default:
        return (
          <InsightCard
            key={id}
            title={name}
            description={description || ''}
            footer={commonFooter}
          >
            <div className="flex-1 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-9xl font-extrabold text-brand-1">{group.count || 0}</span>
                <span className="text-sm text-gray-500 mt-2">Items</span>
              </div>
            </div>
          </InsightCard>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-brand-25 flex flex-col" style={{height: "calc(100vh - 80px)"}}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-2 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-brand-25 flex flex-col" style={{height: "calc(100vh - 80px)"}}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-brand-2 text-white rounded-md hover:bg-brand-1"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-brand-25 flex flex-col" style={{height: "calc(100vh - 80px)"}}>
      <div
        className="flex-1 grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6"
        style={{ gridAutoRows: '1fr' }}
      >
        {dataGroups.length > 0 ? (
          dataGroups.map((group) => renderCard(group))
        ) : (
          <div className="col-span-full flex items-center justify-center">
            <p className="text-gray-500">No data groups available.</p>
          </div>
        )}
      </div>
    </div>
  );
}