"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { SolutionsSpecific } from '../../_components/SolutionsSpecific';
import Image from 'next/image';
import { getFactSheet } from '@/services/insights.service';
import { FactSheetResponse } from '@/types';
// Components removed - MarketTrendInfoSection not implemented

interface MarketTrendDetailPageProps {
  params: Promise<{
    id: string;
    'alias-group': string;
  }>;
}

export default function MarketTrendDetailPage({ params }: MarketTrendDetailPageProps) {
  
  // Unwrap params với React.use()
  const unwrappedParams = use(params);
  // const trendData = marketTrendsData[1];
  
  // Extract dataGroupName from URL path
  const dataGroupName = unwrappedParams['alias-group'] ? decodeURIComponent(unwrappedParams['alias-group']) : 'Data Group';
  
  // Thêm biến mới để lấy dữ liệu từ API detail factSheet
  const [factSheetData, setFactSheetData] = useState<FactSheetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch fact sheet data từ API
  const fetchFactSheetData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFactSheet(parseInt(unwrappedParams.id));
      
      // Kiểm tra nếu values không có dữ liệu hoặc rỗng
      if (!data.values || data.values.length === 0) {
        console.log('Fact sheet values is empty, using empty array...');
        setFactSheetData({
          ...data,
          values: []
        });
      } else {
        setFactSheetData(data);
      }
    } catch (err) {
      console.error('Error fetching fact sheet:', err);
      setFactSheetData(null);
    } finally {
      setLoading(false);
    }
  }, [unwrappedParams.id]);

  useEffect(() => {
    fetchFactSheetData();
  }, [unwrappedParams.id, fetchFactSheetData]);

  

  if (loading) {
    return (
      <div className="bg-brand-5 min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  // Nếu không tìm thấy market trend
  if (error || !factSheetData) {
    return (
      <div className="p-6 bg-[#faf7fa] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Market Trend not found'}</h1>
            <Link href="/insights/market-trends" className="text-blue-600 hover:text-blue-800">
              ← Back to Market Trends
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-5 min-h-screen">
      <div className="">
        {/* Market Trend Content */}
        <div className="overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Market Trend Title & Description */}
            <div className="lg:w-1/3 p-8">
              <div className="space-y-6">
                                 {/* Market Trend Name */}
                 <div>
                   <h3 className='text-md font-medium text-brand-1'> {dataGroupName} </h3>
                   <h2 className="text-2xl text-semibold font-bold text-brand-1">{factSheetData.name}</h2>
                   <br/>
                   <h3 className='text-md font-medium text-brand-1'> Description </h3>
                   <p className="text-sm text-semibold text-brand-1">{factSheetData.description}</p>
                 </div>
              </div>
            </div>

             <div className="lg:w-2/3 p-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 
                 <div className="space-y-6">

                   {/* <MarketTrendInfoSection 
                     title="Category relevance:" 
                     items={trendData.categoryRelevance} 
                   /> 

                   <MarketTrendInfoSection 
                     title="Industry relevance:" 
                     items={trendData.industryRelevance} 
                   /> 

                   <MarketTrendInfoSection 
                     title="Sub-industry relevance:" 
                     items={trendData.subIndustryRelevance} 
                   /> 

                   <MarketTrendInfoSection 
                     title="Geographic relevance:" 
                     items={trendData.geographicRelevance} 
                   />

                   <MarketTrendInfoSection 
                     title="Trend drivers:" 
                     items={trendData.trendDrivers} 
                   /> */}
                 </div>

                 <div className="space-y-6">
                   {/* <MarketTrendInfoSection 
                     title="Regulatory impact:" 
                     items={trendData.regulatoryImpact} 
                   />

                   <MarketTrendInfoSection 
                     title="Technology influence:" 
                     items={trendData.technologyInfluence} 
                   />

                   <MarketTrendInfoSection 
                     title="Sustainability implications:" 
                     items={trendData.sustainabilityImplications} 
                   />

                   <MarketTrendInfoSection 
                     title="Typical response by ICPs:" 
                     items={trendData.typicalResponseByICPs} 
                   /> */}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

             {/* Solutions Specific Section */}
       {factSheetData && factSheetData.values && (
         <SolutionsSpecific 
           factSheetValues={factSheetData.values}
           onFieldUpdate={(groupId: number, fieldId: number, updatedTitle: string, updatedDescription: string) => {
             // Update local state
             setFactSheetData(prevData => {
               if (!prevData) return prevData;
               
               return {
                 ...prevData,
                 values: prevData.values.map(value => {
                   if (value.data_group_field_id === fieldId) {
                     return {
                       ...value,
                       name: updatedTitle,
                       value: updatedDescription
                     };
                   }
                   return value;
                 })
               };
             });
           }}
           onRefreshData={() => {
             console.log('Refreshing fact sheet data...');
             // Re-fetch data from API to get the latest data including new items
             fetchFactSheetData();
           }}
         />
       )}

      {/* Status Summary Footer */}
      <div className="p-6 bg-system-5">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between">
            {/* Left side - Persona Fabricator */}
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-brand-1">Persona</h3>
                <p className="text-sm text-brand-1">Fabricator</p>
              </div>
            </div>
            
            {/* Right side - Status Summary Bar */}
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
              {/* Resolve conflicts */}
              <div className="flex items-center gap-2">
                <Image src="/icon-waring.svg" alt="Warning" width={16} height={16} />
                <span className="text-sm text-gray-700">Resolve conflicts (23)</span>
              </div>
              
              {/* Missing data */}
              <div className="flex items-center gap-2">
                <Image src="/icon-missing.svg" alt="Missing" width={16} height={16} />
                <span className="text-sm text-gray-700">Missing data (41)</span>
              </div>
              
              {/* Validate */}
              <div className="flex items-center gap-2 bg-brand-1 rounded-md px-3 py-1">
                <Image 
                  src="/icon-checked.svg" 
                  alt="Validate" 
                  width={16} 
                  height={16} 
                  style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(15%) saturate(1000%) hue-rotate(300deg) brightness(95%) contrast(95%)' }}
                />
                <span className="text-sm text-white">Validate (23)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 