import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useModal } from '@/contexts/ModalContext';

interface EditItemModalProps {
  title: string;
  description: string;
  groupId: number;
  valueId: number;
  onSave: (updatedTitle: string, updatedDescription: string) => Promise<void>;
  onSuccess?: () => void; // Callback khi update thành công
  onDelete?: () => void; // Callback khi delete thành công
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  title,
  description,
  onSave,
  onSuccess,
  onDelete,
}) => {
  const { closeModal } = useModal();
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editedTitle, editedDescription);
      
      // Call success callback to refresh data
      if (onSuccess) {
        onSuccess();
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving:', error);
      // Error is already handled in the onSave function
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);


      // Call delete callback to refresh data
      if (onDelete) {
        onDelete();
      }
      
      closeModal();
    } catch (error) {
      console.error('Error deleting fact sheet value:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold">Edit Field</h3>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-brand-1 focus:ring-brand-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 bg-white focus:border-brand-1 focus:ring-brand-1 dark:border-gray-600 dark:bg-gray-700"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                handleSave();
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
            size="icon" 
            className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-brand-1 text-white rounded-md hover:bg-brand-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
