'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Search, Filter, Star } from 'lucide-react'
import VerificationBadge from '@/components/VerificationBadge'

interface User {
  id: string
  username: string
  email: string
  name: string
  sport?: string
  position?: string
  isVerified?: boolean
  garScore?: number
  createdAt: string
  lastLogin?: string
  role: string
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all')
  const [currentAdmin, setCurrentAdmin] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
    getCurrentAdmin()
  }, [])

  const getCurrentAdmin = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const admin = await response.json()
        if (admin.role === 'admin') {
          setCurrentAdmin(admin.id)
        }
      }
    } catch (error) {
      console.error('Failed to get admin info:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyUser = async (userId: string, verify: boolean) => {
    if (!currentAdmin) {
      alert('Admin authentication required')
      return
    }

    try {
      const response = await fetch('/api/verify-user', {
        method: verify ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, adminId: currentAdmin })
      })

      if (response.ok) {
        const result = await response.json()
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isVerified: verify }
            : user
        ))
        alert(result.message)
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Verification failed:', error)
      alert('Failed to update verification status')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterVerified === 'all' || 
                         (filterVerified === 'verified' && user.isVerified) ||
                         (filterVerified === 'unverified' && !user.isVerified)
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen hero-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-pulse-slow neon-text text-xl">Loading users...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold neon-text mb-2">User Management</h1>
          <p className="text-slate-400">Manage user verification and account status</p>
        </div>

        {/* Controls */}
        <div className="hero-bg neon-border rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value as any)}
                className="form-input pl-10 pr-8"
              >
                <option value="all">All Users</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="hero-bg neon-border rounded-xl p-6">
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <div className="text-slate-400">Total Users</div>
          </div>
          <div className="hero-bg neon-border rounded-xl p-6">
            <div className="text-2xl font-bold neon-text">{users.filter(u => u.isVerified).length}</div>
            <div className="text-slate-400">Verified Users</div>
          </div>
          <div className="hero-bg neon-border rounded-xl p-6">
            <div className="text-2xl font-bold text-yellow-400">{users.filter(u => !u.isVerified).length}</div>
            <div className="text-slate-400">Pending Verification</div>
          </div>
        </div>

        {/* User List */}
        <div className="hero-bg neon-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="text-left p-4 text-slate-300 font-medium">User</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Sport</th>
                  <th className="text-left p-4 text-slate-300 font-medium">GAR Score</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white flex items-center gap-2">
                            {user.username}
                            {user.isVerified && <VerificationBadge isVerified={true} size="sm" />}
                          </div>
                          <div className="text-sm text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{user.sport || '-'}</div>
                      <div className="text-sm text-slate-400">{user.position || ''}</div>
                    </td>
                    <td className="p-4">
                      {user.garScore ? (
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${user.garScore >= 8 ? 'neon-text' : user.garScore >= 6 ? 'text-blue-400' : user.garScore >= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {user.garScore.toFixed(1)}
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  user.garScore && user.garScore >= star * 2
                                    ? user.garScore >= 8 
                                      ? 'text-cyan-400 neon-glow fill-current' 
                                      : 'text-blue-400 fill-current'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">No analysis</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        user.isVerified 
                          ? 'bg-green-900/30 text-green-400 border border-green-700' 
                          : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                      }`}>
                        {user.isVerified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {user.isVerified ? (
                          <button
                            onClick={() => handleVerifyUser(user.id, false)}
                            className="btn-danger text-xs px-3 py-1"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyUser(user.id, true)}
                            className="btn-primary text-xs px-3 py-1"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400">No users found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}