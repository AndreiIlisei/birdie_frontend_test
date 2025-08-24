import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useModal } from '@/contexts/ModalContext';

interface AddItemModalProps {
  groupId: number; // This should be data_group_field_id
  groupTitle: string;
  factSheetId: number; // Add fact_sheet_id for creating fact sheet value
  onAdd?: (title: string, description: string, groupId: number) => void;
  onSuccess?: (newItem?: { id: number; name: string; value: string; ai_generated: boolean; validation_date: string; creation_date: string; data_group_field_id: number; fact_sheet_id: number; sources: unknown[] }) => void; 
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  groupId,
  groupTitle,
  onAdd,
}) => {
  const { closeModal } = useModal();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    try {
      setIsAdding(true);
      
      
      // Call the optional callback if provided
      if (onAdd) {
        await onAdd(newTitle.trim(), newDescription.trim(), groupId);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold">Add New Item</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeModal}
          className="-mt-2 -mr-2 h-8 w-8 rounded-full"
        >
          <X size={20} />
        </Button>
      </div>
      
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
          <input
            type="text"
            value={groupTitle}
            disabled
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-600"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter item title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-brand-1 focus:ring-brand-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <Textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter item description"
            rows={6}
            className="w-full border border-gray-300 bg-white focus:border-brand-1 focus:ring-brand-1 dark:border-gray-600 dark:bg-gray-700"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-2/20 px-2 py-1 text-xs font-semibold">
            AI
          </span>
          <Image src="/icons/icon-insight.svg" alt="Insight" width={20} height={20} className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={closeModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAdd}
            disabled={isAdding || !newTitle.trim() || !newDescription.trim()}
            className="px-4 py-2 bg-brand-1 text-white rounded-md hover:bg-brand-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : 'Add Item'}
          </Button>
        </div>
      </div>
    </div>
  );
};
