'use client'

import React, { useState, useEffect } from 'react'
import { Save, Upload, Eye, Edit, Trash2, Plus, DollarSign, Image, FileText, Settings } from 'lucide-react'

interface ContentItem {
  id: string
  type: 'camp' | 'pricing' | 'hero' | 'feature'
  title: string
  description: string
  price?: string
  image?: string
  content: any
  isActive: boolean
  updatedAt: string
}

export default function AdminContentManagement() {
  const [activeTab, setActiveTab] = useState<'camps' | 'pricing' | 'hero' | 'features'>('camps')
  const [content, setContent] = useState<ContentItem[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<ContentItem | null>(null)
  const [uploading, setUploading] = useState(false)

  // Initialize with current content
  useEffect(() => {
    loadContent()
  }, [activeTab])

  const loadContent = () => {
    // Load existing content based on active tab
    const mockContent: ContentItem[] = [
      {
        id: '1',
        type: 'camp',
        title: 'Merida Summer Elite Camp',
        description: 'Elite football training in beautiful Merida with professional coaches and GAR analysis',
        price: '$899',
        image: '/camps/merida-summer.jpg',
        content: {
          location: 'Merida, Mexico',
          dates: 'July 15-20, 2025',
          features: [
            'Professional GAR video analysis',
            'Elite coaching from D1 staff',
            'USA Football membership included',
            'Action Network recruiting profile'
          ],
          maxParticipants: 32,
          category: 'ELITE'
        },
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'camp',
        title: 'Merida Winter Skills Camp',
        description: 'Intensive skills development camp with personalized coaching',
        price: '$699',
        image: '/camps/merida-winter.jpg',
        content: {
          location: 'Merida, Mexico',
          dates: 'December 20-23, 2025',
          features: [
            'Intensive skills development',
            'Position-specific training',
            'Mental performance coaching',
            'Nutrition and wellness sessions'
          ],
          maxParticipants: 24,
          category: 'SKILLS'
        },
        isActive: true,
        updatedAt: new Date().toISOString()
      }
    ]
    setContent(mockContent.filter(item => item.type === activeTab.slice(0, -1) as any))
  }

  const handleEdit = (item: ContentItem) => {
    setEditing(item.id)
    setEditForm({ ...item })
  }

  const handleSave = async () => {
    if (!editForm) return

    try {
      // Save to database/API
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        setContent(content.map(item => 
          item.id === editForm.id ? editForm : item
        ))
        setEditing(null)
        setEditForm(null)
        alert('Content updated successfully!')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save content')
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!editForm) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', 'content')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const { url } = await response.json()
        setEditForm({ ...editForm, image: url })
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const renderCampEditor = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Camp Title</label>
          <input
            type="text"
            value={editForm?.title || ''}
            onChange={(e) => setEditForm(editForm ? { ...editForm, title: e.target.value } : null)}
            className="form-input"
            placeholder="Enter camp title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Price</label>
          <input
            type="text"
            value={editForm?.price || ''}
            onChange={(e) => setEditForm(editForm ? { ...editForm, price: e.target.value } : null)}
            className="form-input"
            placeholder="$999"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <textarea
          value={editForm?.description || ''}
          onChange={(e) => setEditForm(editForm ? { ...editForm, description: e.target.value } : null)}
          className="form-input"
          rows={3}
          placeholder="Enter camp description"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
          <input
            type="text"
            value={editForm?.content?.location || ''}
            onChange={(e) => setEditForm(editForm ? { 
              ...editForm, 
              content: { ...editForm.content, location: e.target.value }
            } : null)}
            className="form-input"
            placeholder="Merida, Mexico"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Dates</label>
          <input
            type="text"
            value={editForm?.content?.dates || ''}
            onChange={(e) => setEditForm(editForm ? { 
              ...editForm, 
              content: { ...editForm.content, dates: e.target.value }
            } : null)}
            className="form-input"
            placeholder="July 15-20, 2025"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Features (one per line)</label>
        <textarea
          value={editForm?.content?.features?.join('\n') || ''}
          onChange={(e) => setEditForm(editForm ? { 
            ...editForm, 
            content: { ...editForm.content, features: e.target.value.split('\n').filter(f => f.trim()) }
          } : null)}
          className="form-input"
          rows={6}
          placeholder="Professional GAR video analysis&#10;Elite coaching from D1 staff&#10;USA Football membership included"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Max Participants</label>
          <input
            type="number"
            value={editForm?.content?.maxParticipants || ''}
            onChange={(e) => setEditForm(editForm ? { 
              ...editForm, 
              content: { ...editForm.content, maxParticipants: parseInt(e.target.value) }
            } : null)}
            className="form-input"
            placeholder="32"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
          <select
            value={editForm?.content?.category || ''}
            onChange={(e) => setEditForm(editForm ? { 
              ...editForm, 
              content: { ...editForm.content, category: e.target.value }
            } : null)}
            className="form-input"
          >
            <option value="ELITE">ELITE</option>
            <option value="SKILLS">SKILLS</option>
            <option value="TRAINING">TRAINING</option>
            <option value="CAMP">CAMP</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Camp Image</label>
        <div className="space-y-4">
          {editForm?.image && (
            <div className="relative">
              <img
                src={editForm.image}
                alt="Camp image"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file)
            }}
            className="form-input"
            disabled={uploading}
          />
          {uploading && <div className="text-blue-400">Uploading image...</div>}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen hero-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold neon-text mb-2">Content Management</h1>
          <p className="text-slate-400">Manage website content, pricing, and images</p>
        </div>

        {/* Tabs */}
        <div className="hero-bg neon-border rounded-xl p-6 mb-8">
          <div className="flex gap-4 mb-6">
            {[
              { id: 'camps', label: 'Camps & Events', icon: Settings },
              { id: 'pricing', label: 'Pricing Plans', icon: DollarSign },
              { id: 'hero', label: 'Hero Section', icon: Image },
              { id: 'features', label: 'Features', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="grid gap-6 mb-8">
          {content.map(item => (
            <div key={item.id} className="hero-bg neon-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                  {item.price && (
                    <div className="text-2xl font-bold text-blue-400 mt-2">{item.price}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setContent(content.map(c => 
                      c.id === item.id ? { ...c, isActive: !c.isActive } : c
                    ))}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      item.isActive
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                    }`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {item.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
              
              {item.image && (
                <div className="mt-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editing && editForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="hero-bg neon-border rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Edit {editForm.title}</h2>
                <button
                  onClick={() => {
                    setEditing(null)
                    setEditForm(null)
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {activeTab === 'camps' && renderCampEditor()}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSave}
                  className="btn-primary px-6 py-3"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(null)
                    setEditForm(null)
                  }}
                  className="btn-secondary px-6 py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}