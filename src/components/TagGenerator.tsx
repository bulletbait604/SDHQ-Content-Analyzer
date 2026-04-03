'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Hash, TrendingUp, Target, Zap, RefreshCw, Download } from 'lucide-react'
import { generateComprehensiveTagDatabase, getPlatformTags, getTrendingTags, TrendingTagsDatabase, TagData } from '@/lib/tagDatabase'

interface GeneratedTag {
  tag: string
  relevance: number
  category: string
  trending: boolean
}

const TAG_COUNT_OPTIONS = [
  { value: '5', label: '5 Tags' },
  { value: '10', label: '10 Tags' },
  { value: '15', label: '15 Tags' },
  { value: '20', label: '20 Tags' },
  { value: '25', label: '25 Tags' },
  { value: '30', label: '30 Tags' },
  { value: '40', label: '40 Tags' },
  { value: '50', label: '50 Tags' },
  { value: '75', label: '75 Tags' },
  { value: '100', label: '100 Tags' }
]

export default function TagGenerator() {
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('')
  const [tagCount, setTagCount] = useState('10')
  const [generatedTags, setGeneratedTags] = useState<GeneratedTag[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedTags, setCopiedTags] = useState<string[]>([])
  const [trendingDatabase, setTrendingDatabase] = useState<TrendingTagsDatabase | null>(null)
  const [lastDatabaseUpdate, setLastDatabaseUpdate] = useState<string>('')
  const [databaseLoading, setDatabaseLoading] = useState(true)

  // Initialize comprehensive trending tags database
  useEffect(() => {
    initializeTrendingDatabase()
    scheduleWeeklyUpdates()
  }, [])

  const initializeTrendingDatabase = () => {
    setDatabaseLoading(true)
    console.log('🔄 Initializing comprehensive tag database (100,000 tags per platform)...')
    
    // Generate comprehensive database
    const database = generateComprehensiveTagDatabase()
    
    setTrendingDatabase(database)
    setLastDatabaseUpdate(new Date().toISOString())
    setDatabaseLoading(false)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sdhq_comprehensive_tags', JSON.stringify(database))
    }
    
    console.log('✅ Comprehensive tag database initialized:')
    console.log(`📊 TikTok: ${database.tiktok.tags.length} tags`)
    console.log(`📊 Instagram: ${database.instagram.tags.length} tags`)
    console.log(`📊 YouTube: ${database.youtube.tags.length} tags`)
    console.log(`📊 Twitter: ${database.twitter.tags.length} tags`)
    console.log(`📊 Facebook: ${database.facebook.tags.length} tags`)
    console.log(`📊 Total: ${Object.values(database).reduce((acc, platform) => acc + platform.tags.length, 0)} tags`)
  }

  const scheduleWeeklyUpdates = () => {
    // Schedule weekly updates for trending tags
    const updateTrendingTags = () => {
      console.log('🔄 Updating comprehensive trending tags database...')
      initializeTrendingDatabase()
      
      // Schedule next update
      setTimeout(updateTrendingTags, 7 * 24 * 60 * 60 * 1000) // 7 days
    }

    // Start the weekly update cycle
    setTimeout(updateTrendingTags, 7 * 24 * 60 * 60 * 1000) // First update in 7 days
  }

  const generateTags = async () => {
    if (!title || !platform) {
      alert('Please enter a title and select a platform')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate AI processing with larger dataset
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Get platform-specific tags from comprehensive database
      const platformTags = getPlatformTags(trendingDatabase!, platform)
      const weeklyTrends = getTrendingTags(trendingDatabase!, platform)
      
      console.log(`🔍 Analyzing ${platformTags.length} tags for ${platform}...`)
      
      // Extract keywords from title
      const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 2)
      
      // Calculate relevance scores
      const scoredTags: GeneratedTag[] = platformTags.map(tagData => {
        let relevance = tagData.popularity
        
        // Boost relevance for trending tags
        if (tagData.trending) {
          relevance += 15
        }
        
        // Boost relevance for weekly trends
        if (weeklyTrends.includes(tagData.tag)) {
          relevance += 10
        }
        
        // Boost relevance for title matches
        const titleMatch = titleWords.some(word => 
          tagData.tag.includes(word) || word.includes(tagData.tag)
        )
        if (titleMatch) {
          relevance += 20
        }
        
        // Platform-specific logic
        if (platform === 'tiktok' && tagData.category === 'discovery') {
          relevance += 10
        } else if (platform === 'instagram' && tagData.category === 'aesthetic') {
          relevance += 10
        } else if (platform === 'youtube' && tagData.category === 'educational') {
          relevance += 10
        } else if (platform === 'twitter' && tagData.category === 'news') {
          relevance += 10
        } else if (platform === 'facebook' && tagData.category === 'community') {
          relevance += 10
        }
        
        return {
          tag: tagData.tag,
          relevance: Math.min(relevance, 100),
          category: tagData.category,
          trending: tagData.trending
        }
      })
      
      // Sort by relevance and take top tags
      const sortedTags = scoredTags.sort((a, b) => b.relevance - a.relevance)
      const selectedTags = sortedTags.slice(0, parseInt(tagCount))
      
      setGeneratedTags(selectedTags)
      console.log(`✅ Generated ${selectedTags.length} optimized tags for ${platform}`)
    } catch (error) {
      console.error('Error generating tags:', error)
      alert('Error generating tags. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyTags = (tag: string) => {
    navigator.clipboard.writeText(tag)
    setCopiedTags([...copiedTags, tag])
    setTimeout(() => {
      setCopiedTags(copiedTags.filter(t => t !== tag))
    }, 2000)
  }

  const copyAllTags = () => {
    const tagsString = generatedTags.map(t => `#${t.tag}`).join(' ')
    navigator.clipboard.writeText(tagsString)
    setCopiedTags([...generatedTags.map(t => t.tag)])
    setTimeout(() => {
      setCopiedTags([])
    }, 2000)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'discovery': 'bg-blue-500',
      'viral': 'bg-red-500',
      'trending': 'bg-orange-500',
      'entertainment': 'bg-purple-500',
      'creative': 'bg-pink-500',
      'lifestyle': 'bg-green-500',
      'technology': 'bg-cyan-500',
      'general': 'bg-gray-500',
      'aesthetic': 'bg-indigo-500',
      'emotion': 'bg-yellow-500',
      'engagement': 'bg-teal-500',
      'educational': 'bg-blue-600',
      'review': 'bg-orange-600',
      'information': 'bg-blue-700',
      'news': 'bg-red-600',
      'business': 'bg-gray-600',
      'finance': 'bg-green-600',
      'motivation': 'bg-purple-600',
      'platform': 'bg-black',
      'gaming': 'bg-purple-700',
      'music': 'bg-pink-600',
      'dance': 'bg-orange-700',
      'comedy': 'bg-yellow-600',
      'art': 'bg-indigo-600',
      'cooking': 'bg-green-700',
      'fitness': 'bg-cyan-600',
      'fashion': 'bg-pink-700',
      'beauty': 'bg-purple-800',
      'travel': 'bg-blue-800',
      'food': 'bg-orange-800',
      'family': 'bg-red-700',
      'friends': 'bg-yellow-700',
      'celebration': 'bg-green-800',
      'community': 'bg-teal-600'
    }
    return colors[category] || 'bg-gray-500'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          AI Tag Generator
        </h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Generate optimized tags for your content using AI-powered analysis of 100,000+ trending tags per platform
        </p>
      </div>

      {/* Input Section */}
      <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="w-5 h-5 text-blue-400" />
            Content Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">Clip Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your clip title..."
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Platform Selection */}
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-gray-300">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tag Count Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="tagCount" className="text-gray-300">Number of Tags</Label>
            <Select value={tagCount} onValueChange={setTagCount}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select number of tags" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {TAG_COUNT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateTags}
            disabled={!title || !platform || isGenerating || databaseLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Tags...
              </>
            ) : databaseLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Loading Database...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Tags
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Tags */}
      {generatedTags.length > 0 && (
        <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Hash className="w-5 h-5 text-green-400" />
                Generated Tags
              </CardTitle>
              <Button
                onClick={copyAllTags}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Tags Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatedTags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getCategoryColor(tag.category)} text-white text-xs`}
                      >
                        {tag.category}
                      </Badge>
                      {tag.trending && (
                        <TrendingUp className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-white font-medium">#{tag.tag}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{tag.relevance}%</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyTags(tag.tag)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags Output */}
              <div className="mt-6">
                <Label className="text-gray-300 mb-2 block">Copy & Paste Tags:</Label>
                <Textarea
                  value={generatedTags.map(t => `#${t.tag}`).join(' ')}
                  readOnly
                  className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                  <div className="text-2xl font-bold text-blue-400">{generatedTags.length}</div>
                  <div className="text-sm text-gray-400">Total Tags</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                  <div className="text-2xl font-bold text-red-400">
                    {generatedTags.filter(t => t.trending).length}
                  </div>
                  <div className="text-sm text-gray-400">Trending Tags</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round(generatedTags.reduce((acc, t) => acc + t.relevance, 0) / generatedTags.length)}%
                  </div>
                  <div className="text-sm text-gray-400">Avg Relevance</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Info */}
      <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Trending Tag Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Last Updated:</span>
              <span className="text-gray-400">
                {lastDatabaseUpdate ? new Date(lastDatabaseUpdate).toLocaleDateString() : 'Never'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Tags in Database:</span>
              <span className="text-gray-400">
                {trendingDatabase ? Object.values(trendingDatabase).reduce((acc, platform) => acc + platform.tags.length, 0).toLocaleString() : '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Next Update:</span>
              <span className="text-gray-400">
                {lastDatabaseUpdate ? new Date(new Date(lastDatabaseUpdate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
            {trendingDatabase && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-600">
                  <div className="text-lg font-bold text-pink-400">{trendingDatabase.tiktok.tags.length.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">TikTok Tags</div>
                </div>
                <div className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-600">
                  <div className="text-lg font-bold text-orange-400">{trendingDatabase.instagram.tags.length.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Instagram Tags</div>
                </div>
                <div className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-600">
                  <div className="text-lg font-bold text-red-400">{trendingDatabase.youtube.tags.length.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">YouTube Tags</div>
                </div>
                <div className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-600">
                  <div className="text-lg font-bold text-blue-400">{trendingDatabase.twitter.tags.length.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Twitter Tags</div>
                </div>
                <div className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-600">
                  <div className="text-lg font-bold text-green-400">{trendingDatabase.facebook.tags.length.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Facebook Tags</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
