'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MapPin, Calendar, DollarSign, Award } from 'lucide-react';

const COLUMNS = [
  { id: 'interested', title: 'Interested', color: 'bg-slate-700' },
  { id: 'contacted', title: 'Contacted', color: 'bg-blue-600' },
  { id: 'visited', title: 'Visited', color: 'bg-purple-600' },
  { id: 'offered', title: 'Offered', color: 'bg-green-600' },
  { id: 'committed', title: 'Committed', color: 'bg-yellow-600' },
];

interface Offer {
  id: number;
  schoolId: number;
  schoolName: string;
  status: string;
  offerType?: string;
  scholarshipAmount?: string;
  visitDate?: string;
  notes?: string;
}

interface OfferTrackerProps {
  offers: Offer[];
  onUpdateStatus: (offerId: number, newStatus: string) => void;
}

export default function OfferTracker({ offers = [], onUpdateStatus }: OfferTrackerProps) {
  const [localOffers, setLocalOffers] = useState(offers);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const offerId = parseInt(active.id.toString());
    const newStatus = over.id.toString();

    setLocalOffers(prev =>
      prev.map(offer =>
        offer.id === offerId ? { ...offer, status: newStatus } : offer
      )
    );

    onUpdateStatus(offerId, newStatus);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Recruiting Pipeline</h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Add School
        </button>
      </div>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              offers={localOffers.filter(o => o.status === column.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function KanbanColumn({ column, offers }: { column: typeof COLUMNS[0], offers: Offer[] }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
        <h3 className="font-semibold text-white">{column.title}</h3>
        <span className="ml-auto text-sm text-slate-400">{offers.length}</span>
      </div>

      <SortableContext items={offers.map(o => o.id.toString())} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {offers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
          {offers.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              Drop schools here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: offer.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-900 border border-slate-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-blue-500 transition-colors"
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners}>
          <GripVertical className="w-4 h-4 text-slate-500 mt-1" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm mb-2 truncate">{offer.schoolName}</h4>
          
          {offer.offerType && (
            <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
              <Award className="w-3 h-3" />
              {offer.offerType}
            </div>
          )}

          {offer.scholarshipAmount && (
            <div className="flex items-center gap-1 text-xs text-green-400 mb-1">
              <DollarSign className="w-3 h-3" />
              ${offer.scholarshipAmount}
            </div>
          )}

          {offer.visitDate && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3 h-3" />
              {new Date(offer.visitDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
