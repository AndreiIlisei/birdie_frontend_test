'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { listDataGroups, listFactSheets } from '@/services/insights.service';
import { DataGroupResponse, FactSheetResponse } from '@/types';
import { FactSheetCard } from '../_components/FactSheetCard';

export default function AliasGroupPage() {

  
  const [dataGroup, setDataGroup] = useState<DataGroupResponse | null>(null);
  const [factSheets, setFactSheets] = useState<FactSheetResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedParams = useParams();
  
  const aliasGroup = resolvedParams['alias-group'] as string;


  useEffect(() => {
    const fetchDataGroupAndFactSheets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch data groups and find the one matching the alias
        const response = await listDataGroups(0, 100); // Get all data groups
        const foundGroup = response.find(group => {
          // Decode the URL-encoded alias group for comparison

          const decodedAliasGroup = decodeURIComponent(aliasGroup);
          console.log(aliasGroup,decodedAliasGroup)
          
          // Check if alias matches the name (converted to kebab-case)
          const groupAlias = group.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          const urlAlias = aliasGroup.toLowerCase();
          const decodedUrlAlias = decodedAliasGroup.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          
          // Check multiple matching strategies
          return (
            groupAlias === urlAlias || 
            groupAlias === decodedUrlAlias ||
            group.name.toLowerCase() === decodedAliasGroup.toLowerCase() ||
            group.id.toString() === aliasGroup ||
            group.id.toString() === decodedAliasGroup
          );
        });
        
        if (foundGroup) {
          setDataGroup(foundGroup);
          
          // Fetch fact sheets for this data group
          try {
            const factSheetsResponse = await listFactSheets(0, 100, foundGroup.id);
            setFactSheets(factSheetsResponse.items);
            console.log('Fact sheets for data group:', foundGroup.id, factSheetsResponse);
          } catch (factSheetsError) {
            console.error('Error fetching fact sheets:', factSheetsError);
            // Don't set error for fact sheets, just log it
          }
        } else {
          setError('Data group not found');
        }
      } catch (err) {
        console.error('Error fetching data group:', err);
        setError('Failed to load data group. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (aliasGroup) {
      fetchDataGroupAndFactSheets();
    }
  }, [aliasGroup]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-10 text-gray-500">Loading data group...</div>
      </div>
    );
  }

  if (error || !dataGroup) {
    return (
      <div className="p-8">
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error || 'Data group not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-brand-2 text-white rounded-md hover:bg-brand-1"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="py-10 text-center text-gray-500">Loading data group...</div>;
    }
    if (factSheets.length === 0) {
      return <div className="py-10 text-center text-gray-500">No &quot;{dataGroup.name}&quot; found.</div>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {factSheets.map((factSheet) => (
          <FactSheetCard key={factSheet.id} factSheet={factSheet} groupName={dataGroup.name} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium">{dataGroup.name}</h1>
        <p className="mt-2 max-w-2xl ">
          {dataGroup.description}
        </p>
      </div>
      {renderContent()}
    </div>
  );
} 