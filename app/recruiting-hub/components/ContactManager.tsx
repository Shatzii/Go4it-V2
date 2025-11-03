'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, Calendar, Star, MapPin, Search, MessageSquare } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  title: string;
  schoolName: string;
  email: string;
  phone: string;
  sport: string;
  lastContactDate: string;
  interestLevel: 'high' | 'medium' | 'low';
  notes: string;
}

export default function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'Coach Smith',
      title: 'Head Coach',
      schoolName: 'University of Texas',
      email: 'coach.smith@ut.edu',
      phone: '(512) 555-0123',
      sport: 'Football',
      lastContactDate: '2024-01-15',
      interestLevel: 'high',
      notes: 'Expressed strong interest in visiting campus',
    },
    {
      id: 2,
      name: 'Coach Johnson',
      title: 'Recruiting Coordinator',
      schoolName: 'UCLA',
      email: 'johnson@ucla.edu',
      phone: '(310) 555-0456',
      sport: 'Basketball',
      lastContactDate: '2024-01-10',
      interestLevel: 'medium',
      notes: 'Waiting on transcript review',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterLevel === 'all' || contact.interestLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const getInterestColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-600/20 text-green-400 border-green-600';
      case 'medium': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600';
      case 'low': return 'bg-slate-600/20 text-slate-400 border-slate-600';
      default: return 'bg-slate-600/20 text-slate-400 border-slate-600';
    }
  };

  const getDaysSinceContact = (date: string) => {
    const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Manager</h2>
          <p className="text-slate-400 mt-1">Manage your recruiting contacts and relationships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts or schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500"
            />
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
          >
            <option value="all">All Interest Levels</option>
            <option value="high">High Interest</option>
            <option value="medium">Medium Interest</option>
            <option value="low">Low Interest</option>
          </select>
        </div>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredContacts.map((contact) => {
          const daysSince = getDaysSinceContact(contact.lastContactDate);
          return (
            <div
              key={contact.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{contact.name}</h3>
                  <p className="text-slate-400 text-sm">{contact.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <p className="text-slate-400 text-sm">{contact.schoolName}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getInterestColor(contact.interestLevel)}`}>
                  {contact.interestLevel.charAt(0).toUpperCase() + contact.interestLevel.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${contact.email}`} className="hover:text-blue-400 transition-colors">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href={`tel:${contact.phone}`} className="hover:text-blue-400 transition-colors">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Last contact: {daysSince} days ago
                  {daysSince > 14 && (
                    <span className="text-yellow-400 text-xs">(Follow up needed)</span>
                  )}
                </div>
              </div>

              {contact.notes && (
                <div className="bg-slate-900/50 border border-slate-700 rounded p-3 mb-4">
                  <p className="text-slate-300 text-sm">{contact.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Log Contact
                </button>
                <button
                  onClick={() => setEditingContact(contact)}
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No contacts found matching your criteria</p>
        </div>
      )}

      {/* TODO: Add modal for adding/editing contacts */}
    </div>
  );
}
