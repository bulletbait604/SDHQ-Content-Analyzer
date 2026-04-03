'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Activity, TrendingUp, Eye, Download, Search } from 'lucide-react'

interface UserActivity {
  id: string;
  username: string;
  email: string;
  displayName: string;
  freeTagGenerator: number;
  aiTagGenerator: number;
  clipAnalysis: number;
  contentAnalysis: number;
  lastActive: string;
  createdAt: string;
}

interface UsageStats {
  totalUsers: number;
  totalFreeTagGenerator: number;
  totalAiTagGenerator: number;
  totalClipAnalysis: number;
  totalContentAnalysis: number;
  activeUsers: number;
}

interface AdminDashboardProps {
  user: any;
  language: string;
}

export default function AdminDashboard({ user, language }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserActivity[]>([])
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (user?.username === 'bulletbait604') {
      fetchUserActivity()
    }
  }, [user])

  const fetchUserActivity = async () => {
    try {
      setLoading(true)
      // In a real implementation, you'd use proper authentication
      const response = await fetch('/api/user-activity', {
        headers: {
          'Authorization': 'admin' // Simple auth for now
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error('Error fetching user activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTotalUsage = (user: UserActivity) => {
    return user.freeTagGenerator + user.aiTagGenerator + user.clipAnalysis + user.contentAnalysis
  }

  const exportData = () => {
    const csvContent = [
      ['Username', 'Email', 'Display Name', 'Free Tag Generator', 'AI Tag Generator', 'Clip Analysis', 'Content Analysis', 'Total Usage', 'Last Active', 'Created At'],
      ...filteredUsers.map(user => [
        user.username,
        user.email,
        user.displayName,
        user.freeTagGenerator.toString(),
        user.aiTagGenerator.toString(),
        user.clipAnalysis.toString(),
        user.contentAnalysis.toString(),
        getTotalUsage(user).toString(),
        formatDate(user.lastActive),
        formatDate(user.createdAt)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-activity-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (user?.username !== 'bulletbait604') {
    return (
      <div className="text-center py-16">
        <Eye className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
        <p className="text-gray-300">Admin access required</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-purple-400 flex items-center gap-2">
          <Users className="w-8 h-8" />
          User Activity Dashboard
        </h2>
        <div className="flex gap-2">
          <Button onClick={exportData} className="bg-green-600 hover:bg-green-500">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={fetchUserActivity} className="bg-blue-600 hover:bg-blue-500">
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-black/50 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{stats.totalUsers}</div>
              <div className="text-xs text-gray-400">Total Users</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 border-green-500/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{stats.activeUsers}</div>
              <div className="text-xs text-gray-400">Active (24h)</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <Badge className="bg-yellow-600 text-white">Free</Badge>
              <div className="text-2xl font-bold text-yellow-400">{stats.totalFreeTagGenerator}</div>
              <div className="text-xs text-gray-400">Tag Generator</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Badge className="bg-purple-600 text-white">AI</Badge>
              <div className="text-2xl font-bold text-purple-400">{stats.totalAiTagGenerator}</div>
              <div className="text-xs text-gray-400">AI Tag Gen</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 border-pink-500/30">
            <CardContent className="p-4 text-center">
              <Badge className="bg-pink-600 text-white">Clip</Badge>
              <div className="text-2xl font-bold text-pink-400">{stats.totalClipAnalysis}</div>
              <div className="text-xs text-gray-400">Clip Analysis</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 border-cyan-500/30">
            <CardContent className="p-4 text-center">
              <Badge className="bg-cyan-600 text-white">Content</Badge>
              <div className="text-2xl font-bold text-cyan-400">{stats.totalContentAnalysis}</div>
              <div className="text-xs text-gray-400">Content Analysis</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Toggle */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by username, email, or display name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-500/50 rounded text-white placeholder-gray-400"
            />
          </div>
        </div>
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="outline"
          className="border-gray-500/50 text-gray-300 hover:bg-gray-800"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
      </div>

      {/* User List */}
      <Card className="bg-black/50 border-gray-500/30">
        <CardHeader>
          <CardTitle className="text-gray-300">
            User Activity ({filteredUsers.length} users)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No users found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{user.displayName}</span>
                        <span className="text-gray-400">@{user.username}</span>
                        <span className="text-gray-500 text-sm">{user.email}</span>
                      </div>
                      
                      {showDetails && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <Badge className="bg-yellow-600 text-white mb-1">Free Tag</Badge>
                            <div className="text-yellow-400">{user.freeTagGenerator}</div>
                          </div>
                          <div>
                            <Badge className="bg-purple-600 text-white mb-1">AI Tag</Badge>
                            <div className="text-purple-400">{user.aiTagGenerator}</div>
                          </div>
                          <div>
                            <Badge className="bg-pink-600 text-white mb-1">Clip</Badge>
                            <div className="text-pink-400">{user.clipAnalysis}</div>
                          </div>
                          <div>
                            <Badge className="bg-cyan-600 text-white mb-1">Content</Badge>
                            <div className="text-cyan-400">{user.contentAnalysis}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>Total Usage: {getTotalUsage(user)}</span>
                        <span>Last Active: {formatDate(user.lastActive)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
