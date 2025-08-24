
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import SVGIcon from '@/components/ui/SVGIcon';
import Link from 'next/link';

export interface FactSheet {
  id: number;
  name?: string;
  image_path?: string;
  description?: string;
  creation_date?: string;
  completion?: number;
  creator_id?: number;
  data_group_id?: number;
}

interface FactSheetCardProps {
  factSheet: FactSheet;
  groupName?: string;
}

/**
 * A card component to display a summary of a fact sheet.
 */
export function FactSheetCard({ factSheet, groupName = '' }: FactSheetCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-md transition-transform hover:-translate-y-1 dark:bg-gray-800">
      <div className="relative h-48 w-full overflow-hidden rounded-lg">
        {factSheet.image_path && !imageError ? (
          <Image 
            src={factSheet.image_path} 
            alt={factSheet.name || 'Fact Sheet'} 
            fill 
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <SVGIcon
              src="/icons/icon-research.svg"
              className="h-12 w-12 text-gray-400"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4">
        <p className="text-sm font-medium">Fact Sheet</p>
        <p className="text-xs">{factSheet.creation_date ? new Date(factSheet.creation_date).toLocaleDateString() : 'N/A'}</p>
      </div>

      <h3 className="mt-1 text-xl font-bold">{factSheet.name || `Fact Sheet ${factSheet.id}`}</h3>
      <p className="mt-2 flex-grow text-sm line-clamp-3">{factSheet.description || 'No description available'}</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className="h-2 w-full flex-grow rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-brand-2"
              style={{ width: `${factSheet.completion || 20}%` }}
            />
          </div>
          <span className="text-sm font-semibold">{factSheet.completion || 20}%</span>
        </div>
        <div className="flex justify-end">
          <Link href={`/insights/${groupName === 'Personas' ? 'personas' : groupName}/${factSheet.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-brand-1 text-white hover:bg-brand-1/90"
            >
              <SVGIcon
                src="/icons/icon-home.svg"
                className="h-5 w-5 text-brand-2"
              />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
