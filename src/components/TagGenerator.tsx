'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Copy, Hash, TrendingUp, Target, Zap, RefreshCw, Download } from 'lucide-react'

interface TagData {
  tag: string
  category: string
  popularity: number
  trending: boolean
  platform: string[]
  lastUpdated: string
}

interface GeneratedTag {
  tag: string
  relevance: number
  category: string
  trending: boolean
}

interface TrendingTagsDatabase {
  [platform: string]: {
    tags: TagData[]
    lastUpdated: string
    weeklyTrends: string[]
  }
}

export default function TagGenerator() {
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('')
  const [tagCount, setTagCount] = useState([10])
  const [generatedTags, setGeneratedTags] = useState<GeneratedTag[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedTags, setCopiedTags] = useState<string[]>([])
  const [trendingDatabase, setTrendingDatabase] = useState<TrendingTagsDatabase | null>(null)
  const [lastDatabaseUpdate, setLastDatabaseUpdate] = useState<string>('')

  // Initialize trending tags database
  useEffect(() => {
    initializeTrendingDatabase()
    scheduleWeeklyUpdates()
  }, [])

  const initializeTrendingDatabase = () => {
    const database: TrendingTagsDatabase = {
      tiktok: {
        tags: [
          { tag: 'fyp', category: 'discovery', popularity: 95, trending: true, platform: ['tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'foryou', category: 'discovery', popularity: 92, trending: true, platform: ['tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'viral', category: 'viral', popularity: 88, trending: true, platform: ['tiktok', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'trending', category: 'trending', popularity: 85, trending: true, platform: ['tiktok', 'twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'dance', category: 'entertainment', popularity: 82, trending: false, platform: ['tiktok', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'comedy', category: 'entertainment', popularity: 78, trending: false, platform: ['tiktok', 'youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'music', category: 'entertainment', popularity: 75, trending: false, platform: ['tiktok', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'art', category: 'creative', popularity: 70, trending: false, platform: ['tiktok', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'cooking', category: 'lifestyle', popularity: 68, trending: false, platform: ['tiktok', 'youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'fitness', category: 'lifestyle', popularity: 72, trending: false, platform: ['tiktok', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'tech', category: 'technology', popularity: 65, trending: false, platform: ['tiktok', 'youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'gaming', category: 'entertainment', popularity: 80, trending: false, platform: ['tiktok', 'youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'fashion', category: 'lifestyle', popularity: 74, trending: false, platform: ['tiktok', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'beauty', category: 'lifestyle', popularity: 76, trending: false, platform: ['tiktok', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'travel', category: 'lifestyle', popularity: 69, trending: false, platform: ['tiktok', 'instagram'], lastUpdated: new Date().toISOString() },
        ],
        lastUpdated: new Date().toISOString(),
        weeklyTrends: ['fyp', 'viral', 'trending', 'dance', 'comedy']
      },
      instagram: {
        tags: [
          { tag: 'instagood', category: 'general', popularity: 90, trending: true, platform: ['instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'photooftheday', category: 'general', popularity: 85, trending: false, platform: ['instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'fashion', category: 'lifestyle', popularity: 82, trending: false, platform: ['instagram', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'beautiful', category: 'aesthetic', popularity: 78, trending: false, platform: ['instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'happy', category: 'emotion', popularity: 75, trending: false, platform: ['instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'cute', category: 'aesthetic', popularity: 73, trending: false, platform: ['instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'followme', category: 'engagement', popularity: 70, trending: false, platform: ['instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'like4like', category: 'engagement', popularity: 68, trending: false, platform: ['instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'art', category: 'creative', popularity: 72, trending: false, platform: ['instagram', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'nature', category: 'lifestyle', popularity: 76, trending: false, platform: ['instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'food', category: 'lifestyle', popularity: 74, trending: false, platform: ['instagram', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'love', category: 'emotion', popularity: 80, trending: false, platform: ['instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'style', category: 'fashion', popularity: 71, trending: false, platform: ['instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'fitness', category: 'lifestyle', popularity: 73, trending: false, platform: ['instagram', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'travel', category: 'lifestyle', popularity: 77, trending: false, platform: ['instagram', 'tiktok'], lastUpdated: new Date().toISOString() },
        ],
        lastUpdated: new Date().toISOString(),
        weeklyTrends: ['instagood', 'fashion', 'beautiful', 'love', 'travel']
      },
      youtube: {
        tags: [
          { tag: 'youtube', category: 'platform', popularity: 95, trending: true, platform: ['youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'video', category: 'general', popularity: 85, trending: false, platform: ['youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'viral', category: 'viral', popularity: 88, trending: true, platform: ['youtube', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'trending', category: 'trending', popularity: 82, trending: true, platform: ['youtube', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'music', category: 'entertainment', popularity: 78, trending: false, platform: ['youtube', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'gaming', category: 'entertainment', popularity: 84, trending: false, platform: ['youtube', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'tutorial', category: 'educational', popularity: 76, trending: false, platform: ['youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'review', category: 'review', popularity: 74, trending: false, platform: ['youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'funny', category: 'entertainment', popularity: 80, trending: false, platform: ['youtube', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'tech', category: 'technology', popularity: 70, trending: false, platform: ['youtube', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'cooking', category: 'lifestyle', popularity: 72, trending: false, platform: ['youtube', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'fitness', category: 'lifestyle', popularity: 68, trending: false, platform: ['youtube', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'vlog', category: 'lifestyle', popularity: 75, trending: false, platform: ['youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'howto', category: 'educational', popularity: 73, trending: false, platform: ['youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'asmr', category: 'entertainment', popularity: 71, trending: false, platform: ['youtube'], lastUpdated: new Date().toISOString() },
        ],
        lastUpdated: new Date().toISOString(),
        weeklyTrends: ['youtube', 'viral', 'trending', 'gaming', 'music']
      },
      twitter: {
        tags: [
          { tag: 'trending', category: 'trending', popularity: 92, trending: true, platform: ['twitter', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'viral', category: 'viral', popularity: 88, trending: true, platform: ['twitter', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'news', category: 'information', popularity: 85, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'tech', category: 'technology', popularity: 78, trending: false, platform: ['twitter', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'breaking', category: 'news', popularity: 82, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'ai', category: 'technology', popularity: 80, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'crypto', category: 'finance', popularity: 75, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'startup', category: 'business', popularity: 72, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'marketing', category: 'business', popularity: 70, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'design', category: 'creative', popularity: 68, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'innovation', category: 'technology', popularity: 74, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'fintech', category: 'finance', popularity: 71, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'web3', category: 'technology', popularity: 69, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'nft', category: 'technology', popularity: 67, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'metaverse', category: 'technology', popularity: 65, trending: false, platform: ['twitter'], lastUpdated: new Date().toISOString() },
        ],
        lastUpdated: new Date().toISOString(),
        weeklyTrends: ['trending', 'viral', 'tech', 'ai', 'breaking']
      },
      facebook: {
        tags: [
          { tag: 'facebook', category: 'platform', popularity: 90, trending: true, platform: ['facebook'], lastUpdated: new Date().toISOString() },
          { tag: 'social', category: 'general', popularity: 82, trending: false, platform: ['facebook'], lastUpdated: new Date().toISOString() },
          { tag: 'viral', category: 'viral', popularity: 85, trending: true, platform: ['facebook', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'trending', category: 'trending', popularity: 78, trending: false, platform: ['facebook', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'news', category: 'information', popularity: 80, trending: false, platform: ['facebook', 'twitter'], lastUpdated: new Date().toISOString() },
          { tag: 'video', category: 'general', popularity: 76, trending: false, platform: ['facebook', 'youtube'], lastUpdated: new Date().toISOString() },
          { tag: 'music', category: 'entertainment', popularity: 74, trending: false, platform: ['facebook', 'tiktok'], lastUpdated: new Date().toISOString() },
          { tag: 'food', category: 'lifestyle', popularity: 72, trending: false, platform: ['facebook', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'travel', category: 'lifestyle', popularity: 75, trending: false, platform: ['facebook', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'family', category: 'lifestyle', popularity: 78, trending: false, platform: ['facebook'], lastUpdated: new Date().toISOString() },
          { tag: 'friends', category: 'lifestyle', popularity: 76, trending: false, platform: ['facebook'], lastUpdated: new Date().toISOString() },
          { tag: 'celebration', category: 'lifestyle', popularity: 73, trending: false, platform: ['facebook'], lastUpdated: new Date().toISOString() },
          { tag: 'lifestyle', category: 'lifestyle', popularity: 71, trending: false, platform: ['facebook', 'instagram'], lastUpdated: new Date().toISOString() },
          { tag: 'community', category: 'general', popularity: 74, trending: false, platform: ['facebook'], lastUpdated: new Date().toISOString() },
          { tag: 'inspiration', category: 'motivation', popularity: 70, trending: false, platform: ['facebook'], lastUpdated: new Date().toISOString() },
        ],
        lastUpdated: new Date().toISOString(),
        weeklyTrends: ['facebook', 'viral', 'social', 'video', 'lifestyle']
      }
    }

    setTrendingDatabase(database)
    setLastDatabaseUpdate(new Date().toISOString())
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sdhq_trending_tags', JSON.stringify(database))
    }
  }

  const scheduleWeeklyUpdates = () => {
    // Schedule weekly updates for trending tags
    const updateTrendingTags = () => {
      console.log('🔄 Updating trending tags database...')
      // In a real implementation, this would call an API to get current trending data
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
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500))

      const platformTags = trendingDatabase?.[platform]?.tags || []
      const weeklyTrends = trendingDatabase?.[platform]?.weeklyTrends || []
      
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
      const selectedTags = sortedTags.slice(0, tagCount[0])
      
      setGeneratedTags(selectedTags)
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
      'platform': 'bg-black'
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
          Generate optimized tags for your content using AI-powered trending analysis and platform-specific algorithms
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

          {/* Tag Count Slider */}
          <div className="space-y-2">
            <Label className="text-gray-300">Number of Tags: {tagCount[0]}</Label>
            <Slider
              value={tagCount}
              onValueChange={setTagCount}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>10</span>
              <span>20</span>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateTags}
            disabled={!title || !platform || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Tags...
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
            Trending Database
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
                {trendingDatabase ? Object.values(trendingDatabase).reduce((acc, platform) => acc + platform.tags.length, 0) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Next Update:</span>
              <span className="text-gray-400">
                {lastDatabaseUpdate ? new Date(new Date(lastDatabaseUpdate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
