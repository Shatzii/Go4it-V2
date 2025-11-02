'use client';

import { useState } from 'react';
import { Mail, Phone, MessageSquare, Video, User, Calendar, Plus, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Communication {
  id: number;
  type: string;
  subject?: string;
  content?: string;
  direction: string;
  communicationDate: string;
  contactId?: number;
  contactName?: string;
}

interface CommunicationLogProps {
  communications: Communication[];
  onAddCommunication: (comm: Partial<Communication>) => void;
}

const COMM_TYPES = [
  { id: 'email', label: 'Email', icon: Mail, color: 'text-blue-400' },
  { id: 'phone', label: 'Phone', icon: Phone, color: 'text-green-400' },
  { id: 'text', label: 'Text', icon: MessageSquare, color: 'text-purple-400' },
  { id: 'video-call', label: 'Video Call', icon: Video, color: 'text-red-400' },
  { id: 'in-person', label: 'In Person', icon: User, color: 'text-yellow-400' },
];

export default function CommunicationLog({ communications = [], onAddCommunication }: CommunicationLogProps) {
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [newComm, setNewComm] = useState({
    type: 'email',
    subject: '',
    content: '',
    direction: 'outbound',
    communicationDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCommunication(newComm);
    setNewComm({ type: 'email', subject: '', content: '', direction: 'outbound', communicationDate: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const filteredComms = filterType === 'all' 
    ? communications 
    : communications.filter(c => c.type === filterType);

  const sortedComms = [...filteredComms].sort((a, b) => 
    new Date(b.communicationDate).getTime() - new Date(a.communicationDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Communication Log</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Communication
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          All ({communications.length})
        </button>
        {COMM_TYPES.map(type => {
          const count = communications.filter(c => c.type === type.id).length;
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                filterType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {type.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select
                value={newComm.type}
                onChange={(e) => setNewComm({ ...newComm, type: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              >
                {COMM_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Direction</label>
              <select
                value={newComm.direction}
                onChange={(e) => setNewComm({ ...newComm, direction: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              >
                <option value="outbound">Outbound (I sent)</option>
                <option value="inbound">Inbound (I received)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
              <input
                type="date"
                required
                value={newComm.communicationDate}
                onChange={(e) => setNewComm({ ...newComm, communicationDate: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
              <input
                type="text"
                value={newComm.subject}
                onChange={(e) => setNewComm({ ...newComm, subject: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                placeholder="Quick summary..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
              <textarea
                value={newComm.content}
                onChange={(e) => setNewComm({ ...newComm, content: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                rows={4}
                placeholder="What was discussed..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Communications List */}
      {sortedComms.length > 0 ? (
        <div className="space-y-3">
          {sortedComms.map(comm => {
            const commType = COMM_TYPES.find(t => t.id === comm.type);
            const Icon = commType?.icon || Mail;
            
            return (
              <div key={comm.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-slate-900 ${commType?.color || 'text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{comm.subject || commType?.label}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(comm.communicationDate), 'MMM d, yyyy')}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            comm.direction === 'inbound'
                              ? 'bg-green-600/20 text-green-400'
                              : 'bg-blue-600/20 text-blue-400'
                          }`}>
                            {comm.direction === 'inbound' ? '← Received' : '→ Sent'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {comm.content && (
                      <p className="text-sm text-slate-300 line-clamp-2">{comm.content}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700">
          <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No communications logged yet</p>
        </div>
      )}
    </div>
  );
}
