import Image from 'next/image';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useModal } from '@/contexts/ModalContext';
import { AddItemModal } from './AddItemModal';
import { EditItemModal } from './EditItemModal';

export interface CardItem {
  title: string;
  description: string;
  fieldId?: number; // data_group_field_id for editing field
  valueId?: number; // id of fact_sheet_value for deleting
  aiTooltip?: string;
  sourceTooltip?: string;
  badgeType?: 'AI' | 'FA' | 'HU' | 'SY';
  badgeText?: string;
  badgeColor?: string;
}

interface CardSectionProps {
  title: string;
  items: CardItem[];
  status?: 'accepted' | 'pending';
  groupId: number;
  factSheetId: number;
  onItemAdded?: (groupId: number, newItem: { id: number; name: string; value: string; ai_generated: boolean; validation_date: string; creation_date: string; data_group_field_id: number; fact_sheet_id: number; sources: unknown[] }) => void;
  onItemDeleted?: (groupId: number, fieldId: number) => void;
}

interface SolutionsSpecificProps {
  factSheetValues: Array<{
    id: number;
    name: string;
    value: string;
    ai_generated: boolean;
    data_group_field_id: number;
    fact_sheet_id: number;
    data_group_field: {
      id: number;
      name: string;
      description: string;
      prompt: string;
      field_type: string;
      data_group_id: number;
    };
  }>;
  onFieldUpdate?: (groupId: number, fieldId: number, updatedTitle: string, updatedDescription: string) => void;
  onRefreshData?: () => void;
  onItemDeleted?: (groupId: number, fieldId: number) => void;
}

function CardSection({ title, items, status, groupId, factSheetId, onFieldUpdate, onRefreshData, onItemAdded }: CardSectionProps & {
  onFieldUpdate?: (groupId: number, fieldId: number, updatedTitle: string, updatedDescription: string) => void;
  onRefreshData?: () => void;
  onItemAdded?: (groupId: number, newItem: { id: number; name: string; value: string; ai_generated: boolean; validation_date: string; creation_date: string; data_group_field_id: number; fact_sheet_id: number; sources: unknown[] }) => void;
  onItemDeleted?: (groupId: number, fieldId: number) => void;
}) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [showModal, setShowModal] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<'accepted' | 'pending'>(status || 'accepted');
  const { openModal } = useModal();

  // Calculate current status based on checked items
  const allItemsApplied = items.length > 0 && Object.keys(checkedItems).length === items.length && Object.values(checkedItems).every(Boolean);
  const finalStatus = currentStatus === 'pending' && allItemsApplied ? 'accepted' : currentStatus;

  const handleCheckboxClick = (index: number) => {
    if (!checkedItems[index]) {
      setShowModal(index);
    } else {
      setCheckedItems(prev => ({
        ...prev,
        [index]: false
      }));
    }
  };

  const handleConfirmApply = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: true
    }));
    setShowModal(null);
  };

  const handleCancelApply = () => {
    setShowModal(null);
  };

  const handleStatusToggle = () => {
    setCurrentStatus(prev => prev === 'accepted' ? 'pending' : 'accepted');
  };

  const handleEditItem = (item: CardItem, groupId: number) => {
    if (!item.fieldId) {
      console.error('Field ID not found for item:', item);
      alert('Cannot edit this field. Field ID is missing.');
      return;
    }

    openModal(
      <EditItemModal
        title={item.title}
        description={item.description}
        groupId={groupId}
        valueId={item.valueId!}
        onSave={async (updatedTitle: string, updatedDescription: string) => {
          try {
            // Update local state
            if (onFieldUpdate && item.fieldId) {
              onFieldUpdate(groupId, item.fieldId, updatedTitle, updatedDescription);
            }
          } catch (error) {
            console.error('Error updating fact sheet value:', error);
          }
        }}
        onSuccess={() => {
          // Refresh the data to show the updated item
          if (onRefreshData) {
            onRefreshData();
          }
        }}
        onDelete={() => {
          // Refresh the data after deleting the item
          if (onRefreshData) {
            onRefreshData();
          }
        }}
      />
    );
  };

  const getBadgeConfig = (item: CardItem) => {
    const badgeType = item.badgeType || 'AI';
    const badgeText = item.badgeText || badgeType;

    // Default color mapping
    let badgeColor = 'bg-brand-3'; // Default pink for AI
    let badgeColor2 = 'text-brand-1'; // Default pink for AI
    if (badgeType !== 'AI') {
      badgeColor = 'bg-gray-500';
      badgeColor2 = 'text-white';
    }

    // Override with custom color if provided
    if (item.badgeColor) {
      badgeColor = item.badgeColor;
    }

    return { badgeText, badgeColor, badgeColor2 };
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <div className='relative rounded-md bg-system-5 p-2 cursor-pointer hover:bg-gray-100' onClick={handleStatusToggle}>
            {finalStatus === 'accepted' ? (
              <Image src="/icon-checked.svg" alt="Accepted" width={16} height={16} className="text-gray-600" />
            ) : (
              <Image src="/icon-refresh.svg" alt="Pending" width={16} height={16} className="text-gray-600" />
            )}
          </div>
          <div className='relative rounded-md bg-system-5 p-2 hover:bg-brand-2 group'>
            <Image src="/icon-comment.svg" alt="Comment" width={16} height={16} className="text-gray-600 group-hover:hidden" />
            <Image src="/icon-comment-ol.svg" alt="Comment" width={16} height={16} className="text-gray-600 hidden group-hover:block" />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3 pt-4">
        {items.map((item, index) => {
          const { badgeText, badgeColor, badgeColor2 } = getBadgeConfig(item);

          return (
            <div key={index} className="rounded-lg p-2 shadow-sm relative bg-system-5 overflow-visible">
              <div className="grid grid-cols-10 gap-2 overflow-visible">
                {/* Left Column - 30% */}
                <div className="col-span-3 p-1">
                  <h4 className="font-bold text-brand-1">
                    {item.title}
                    {checkedItems[index] && (
                      <span className="ml-2 text-xs text-gray-500">(Applied)</span>
                    )}
                  </h4>
                </div>
                {/* Right Column - 70% */}
                <div className={`bg-white rounded-lg p-2 ${finalStatus === 'pending' ? 'col-span-6' : 'col-span-7'}`}>
                  <div className="flex items-start justify-between h-20">
                    <div className="flex-1 pr-2 overflow-y-auto max-h-full">
                      <div
                        className="text-sm text-brand-1 leading-relaxed cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        onClick={() => handleEditItem(item, groupId)}
                      >
                        {item.description}
                        {checkedItems[index] && (
                          <span className="ml-2 text-xs text-gray-500">(Applied)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 w-16">
                      {/* Badge with Tooltip */}
                      <div className="group relative">
                        <div className={`w-5 h-5 ${badgeColor} rounded-md flex items-center justify-center cursor-help`}>
                          <span className={`text-xs font-bold ${badgeColor2}`}>{badgeText}</span>
                        </div>
                        {item.aiTooltip && (
                          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-brand-1 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[9999] whitespace-nowrap max-w-xs">
                            {item.aiTooltip}
                            <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-brand-1"></div>
                          </div>
                        )}
                      </div>

                      {/* Data Source Icon with Tooltip */}
                      <div className="group relative hover:rounded-md hover:bg-system-5 p-1">
                        <Image src="/icon-source.svg" alt="Source" width={16} height={16} className="cursor-help" />
                        {item.sourceTooltip && (
                          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-brand-1 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[9999] whitespace-nowrap max-w-xs">
                            {item.sourceTooltip}
                            <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-brand-1"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Checkbox Column - Always present but conditionally visible */}
                <div className="col-span-1 flex justify-center">
                  {finalStatus === 'pending' && (
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="group relative cursor-pointer"
                        onClick={() => handleCheckboxClick(index)}
                      >
                        <Image
                          src={checkedItems[index] ? "/icon-checked.svg" : "/icon-checked-dis.svg"}
                          alt="Check"
                          width={16}
                          height={16}
                          className="text-gray-600 hover:opacity-80 transition-opacity duration-200"
                        />
                      </div>


                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-1 border-gray-200 pb-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Title</span>
          <div className="flex items-center gap-2">
            <div className='rounded-md bg-system-5 p-2'>
              <Image src="/icon-checked.svg" alt="Checked" width={16} height={16} className="text-gray-600" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div
                className='rounded-md bg-system-5 p-2 cursor-pointer hover:bg-gray-100 transition-colors'
                key={i}
                onClick={() => openModal(
                  <AddItemModal
                    groupId={groupId}
                    groupTitle={title}
                    factSheetId={factSheetId}
                    onSuccess={(newItem) => {
                      // Call onItemAdded callback if provided
                      if (onItemAdded && newItem) {
                        onItemAdded(groupId, newItem);
                      }

                      // Also refresh data from parent component
                      if (onRefreshData) {
                        onRefreshData();
                      }
                    }}
                  />
                )}
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      {showModal !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Apply</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to apply this item?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelApply}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmApply(showModal)}
                className="px-4 py-2 bg-brand-1 text-white rounded-md hover:bg-brand-2 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to map fact sheet group to card items
function mapValuesToCardItems(values: Array<{
  id: number;
  name: string;
  value: string;
  ai_generated: boolean;
  data_group_field_id: number;
  data_group_field: {
    id: number;
    name: string;
    description: string;
    prompt: string;
    field_type: string;
    data_group_id: number;
  };
}>): CardItem[] {
  return values.map((value) => ({
    title: value.name,
    description: value.value,
    fieldId: value.data_group_field_id, // data_group_field_id for editing field
    valueId: value.id,                  // id of fact_sheet_value for deleting
    badgeType: value.ai_generated ? 'AI' : 'HU' as const,
    badgeText: value.ai_generated ? 'AI' : 'HU',
    badgeColor: value.ai_generated ? 'bg-brand-3' : 'bg-gray-500',
    aiTooltip: value.ai_generated ? `AI Generated: ${value.data_group_field.name}` : `Human Generated: ${value.data_group_field.name}`,
    sourceTooltip: `Field: ${value.data_group_field.name}`
  }));
}

export function SolutionsSpecific({ factSheetValues, onFieldUpdate, onRefreshData, onItemDeleted }: SolutionsSpecificProps) {
  // Group values by data_group_field to create sections
  const groupedValues = factSheetValues.reduce((acc, value) => {
    const fieldName = value.data_group_field.name;
    if (!acc[fieldName]) {
      acc[fieldName] = {
        id: value.data_group_field.id,
        name: fieldName,
        description: value.data_group_field.description,
        factSheetId: value.fact_sheet_id,
        values: []
      };
    }
    acc[fieldName].values.push(value);
    return acc;
  }, {} as Record<string, { id: number; name: string; description: string; factSheetId: number; values: typeof factSheetValues }>);

  const fieldGroups = Object.values(groupedValues);

  // Split field groups into 2 columns
  const leftColumnGroups = fieldGroups.filter((_, index) => index % 2 === 0);
  const rightColumnGroups = fieldGroups.filter((_, index) => index % 2 === 1);

  return (
    <div className="mt-8 p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {leftColumnGroups.map((group) => (
            <CardSection
              key={group.id}
              title={group.name}
              items={mapValuesToCardItems(group.values)}
              status="accepted"
              groupId={group.id}
              factSheetId={group.factSheetId}
              onFieldUpdate={onFieldUpdate}
              onRefreshData={onRefreshData}
              onItemAdded={
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (_groupId, _newItem) => {
                  // Refresh data from parent component to show new item
                  if (onRefreshData) {
                    onRefreshData();
                  }
                }}
              onItemDeleted={(groupId, fieldId) => {
                if (onItemDeleted) {
                  onItemDeleted(groupId, fieldId);
                }
              }}
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {rightColumnGroups.map((group) => (
            <CardSection
              key={group.id}
              title={group.name}
              items={mapValuesToCardItems(group.values)}
              status="accepted"
              groupId={group.id}
              factSheetId={group.factSheetId}
              onFieldUpdate={onFieldUpdate}
              onRefreshData={onRefreshData}
              onItemAdded={
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (_groupId, _newItem) => {
                  // Refresh data from parent component to show new item
                  if (onRefreshData) {
                    onRefreshData();
                  }
                }}
              onItemDeleted={(groupId, fieldId) => {
                if (onItemDeleted) {
                  onItemDeleted(groupId, fieldId);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
