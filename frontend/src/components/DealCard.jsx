import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DollarSign, Calendar, Edit2, Trash2 } from 'lucide-react';

export default function DealCard({ deal, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{deal.title}</h4>
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(deal);
            }}
            className="text-blue-600 hover:text-blue-800 p-1"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(deal._id);
            }}
            className="text-red-600 hover:text-red-800 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center text-green-600 mb-2">
        <DollarSign className="w-4 h-4 mr-1" />
        <span className="font-semibold">${deal.value?.toLocaleString()}</span>
      </div>
      {deal.expectedCloseDate && (
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
        </div>
      )}
      {deal.assignedTo && (
        <div className="mt-2 text-xs text-gray-600">
          Assigned to: {deal.assignedTo.name}
        </div>
      )}
    </div>
  );
}
