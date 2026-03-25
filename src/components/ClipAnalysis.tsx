'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { 
  Lock,
  Star,
  RefreshCw,
  Zap
} from 'lucide-react'
import { analyzeContentWithDeepSeek } from '@/lib/deepseek'
import { GeminiService } from '@/lib/gemini'
import SubscribersManager from '@/lib/subscribers'
import TikTokMetadataService from '@/lib/tiktok-metadata'
import YouTubeMetadataService, { YouTubeMetadata } from '@/lib/youtube-metadata'

interface AnalysisResult {
  clipTitle: string
  titleSuggestions: string[]
  clipDescription: string
  descriptionSuggestions: string[]
  tags: string[]
  tagSuggestions: string[]
  editingTips: string[]
  algorithmInsights: string[]
  algorithmResearch: string
  trendingOpportunities: string
  engagementTriggers: string[]
  performancePrediction: string
  editRecommendations: string[]
  algorithmInformation: string
  aiAnalysis?: {
    metadataUsed: boolean
    deepSeekUsed: boolean
    geminiUsed: boolean
    totalInsights: number
    totalTagSuggestions: number
  }
  isTikTok?: boolean
}

const platforms = [
  { value: 'TikTok', label: '🎵 TikTok' },
  { value: 'YouTube', label: '📺 YouTube' },
  { value: 'Instagram', label: '📷 Instagram' },
  { value: 'Twitter', label: '🐦 Twitter/X' },
  { value: 'Facebook', label: '📘 Facebook' }
]

function ClipAnalysis() {
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('YouTube')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [canAccessAnalysis, setCanAccessAnalysis] = useState(false)

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      const subscribersManager = SubscribersManager.getInstance()
      const activeSubscribers = subscribersManager.getSubscribers()
      const hasAccess = activeSubscribers.length > 0 || subscribersManager.isAdmin('bulletbait604')
      setCanAccessAnalysis(hasAccess)
    } catch (error) {
      console.error('❌ Access check failed:', error)
      setCanAccessAnalysis(false)
    }
  }

  const analyzeWithGemini = async (currentTitle: string, currentDescription: string, currentTags: string[], platform: string, isTikTok: boolean) => {
    try {
      console.log('🤖 Starting Gemini analysis...')
      const geminiService = GeminiService.getInstance()
      
      let geminiAnalysis
      if (isTikTok) {
        geminiAnalysis = await geminiService.analyzeTikTokContent(currentTitle, currentDescription, currentTags, platform)
      } else {
        geminiAnalysis = await geminiService.analyzeYouTubeContent(currentTitle, currentDescription, currentTags, platform)
      }
      
      if (geminiAnalysis) {
        return {
          titleSuggestions: geminiAnalysis.titleSuggestions || [],
          descriptionSuggestions: geminiAnalysis.descriptionSuggestions || [],
          tagSuggestions: geminiAnalysis.tagSuggestions || [],
          editingTips: geminiAnalysis.algorithmInsights || [],
          algorithmInsights: geminiAnalysis.algorithmInsights || [],
          algorithmResearch: geminiAnalysis.algorithmResearch || '',
          trendingOpportunities: geminiAnalysis.trendingOpportunities || '',
          engagementTriggers: geminiAnalysis.engagementTriggers || [],
          performancePrediction: geminiAnalysis.performancePrediction || '',
          editRecommendations: geminiAnalysis.editRecommendations || [],
          algorithmInformation: geminiAnalysis.algorithmInformation || '',
          aiUsed: 'gemini'
        }
      }
    } catch (error) {
      console.warn('🤖 Gemini failed, using DeepSeek:', error)
      return null
    }
  }

  const analyzeWithDeepSeekFallback = async (currentTitle: string, currentDescription: string, currentTags: string[], platform: string) => {
    try {
      console.log('🧠 Using DeepSeek fallback...')
      const deepseekAnalysis = await analyzeContentWithDeepSeek('video', platform, currentTitle, currentDescription, `Current tags: ${currentTags.join(', ')}`)
      
      if (deepseekAnalysis) {
        return {
          titleSuggestions: deepseekAnalysis.titleSuggestions || [],
          descriptionSuggestions: deepseekAnalysis.descriptionSuggestions || [],
          tagSuggestions: deepseekAnalysis.tagSuggestions || [],
          editingTips: deepseekAnalysis.editingTips || deepseekAnalysis.recommendations || [],
          algorithmInsights: deepseekAnalysis.algorithmInsights || [],
          algorithmResearch: deepseekAnalysis.algorithmResearch || '',
          trendingOpportunities: deepseekAnalysis.trendingOpportunities || '',
          engagementTriggers: deepseekAnalysis.engagementTriggers || [],
          performancePrediction: deepseekAnalysis.performancePrediction || '',
          editRecommendations: [],
          algorithmInformation: '',
          aiUsed: 'deepseek'
        }
      }
    } catch (error) {
      console.error('❌ DeepSeek failed:', error)
      return null
    }
  }

  const handleAnalyze = async () => {
    if (!canAccessAnalysis) {
      alert('Clip Analysis is a premium feature. Please subscribe to access.')
      return
    }

    if (!videoUrl.trim() || isAnalyzing) {
      return
    }

    setIsAnalyzing(true)
    setLoadingMessage('Extracting metadata...')

    try {
      let currentTitle = ''
      let currentDescription = ''
      let currentTags: string[] = []
      let tiktokMetadata = null
      let youtubeMetadata = null

      // Determine platform
      const isTikTok = videoUrl.includes('tiktok.com') || videoUrl.includes('vm.tiktok.com')
      console.log('🎵 Platform Detection:', { isTikTok, url: videoUrl })
      
      // Extract metadata
      setLoadingMessage('Extracting metadata from URL...')
      
      if (isTikTok) {
        console.log('🎵 Extracting TikTok metadata...')
        tiktokMetadata = await TikTokMetadataService.getInstance().getMetadata(videoUrl)
        console.log('🎵 TikTok Metadata:', tiktokMetadata)
        
        if (tiktokMetadata) {
          currentTitle = tiktokMetadata.title
          currentDescription = tiktokMetadata.video_description
          currentTags = tiktokMetadata.hashtags
        }
      } else {
        console.log('📺 Extracting YouTube metadata...')
        youtubeMetadata = await YouTubeMetadataService.getInstance().getMetadata(videoUrl)
        console.log('📺 YouTube Metadata:', youtubeMetadata)
        
        if (youtubeMetadata) {
          currentTitle = youtubeMetadata.title
          currentDescription = youtubeMetadata.description
          currentTags = youtubeMetadata.tags
        }
      }

      console.log('🏷️ Metadata Extraction Debug:', {
        platform: isTikTok ? 'TikTok' : 'YouTube',
        title: currentTitle,
        description: currentDescription,
        tags: currentTags,
        hasMetadata: !!(tiktokMetadata || youtubeMetadata)
      })

      // Create base analysis data
      const analysisData: AnalysisResult = {
        clipTitle: currentTitle,
        titleSuggestions: [],
        clipDescription: currentDescription,
        descriptionSuggestions: [],
        tags: currentTags,
        tagSuggestions: [],
        editingTips: [],
        algorithmInsights: [],
        algorithmResearch: '',
        trendingOpportunities: '',
        engagementTriggers: [],
        performancePrediction: '',
        editRecommendations: [],
        algorithmInformation: '',
        aiAnalysis: {
          metadataUsed: !!(youtubeMetadata || tiktokMetadata),
          deepSeekUsed: false,
          geminiUsed: false,
          totalInsights: 0,
          totalTagSuggestions: 0
        },
        isTikTok: isTikTok
      }

      // Try Gemini first, then DeepSeek fallback
      setLoadingMessage('Analyzing with AI...')
      let comprehensiveResult = null
      
      comprehensiveResult = await analyzeWithGemini(currentTitle, currentDescription, currentTags, selectedPlatform, isTikTok)
      
      if (!comprehensiveResult) {
        setLoadingMessage('Using fallback AI...')
        comprehensiveResult = await analyzeWithDeepSeekFallback(currentTitle, currentDescription, currentTags, selectedPlatform)
      }
      
      if (comprehensiveResult) {
        const updatedAnalysisData = {
          ...analysisData,
          titleSuggestions: comprehensiveResult.titleSuggestions || [],
          descriptionSuggestions: comprehensiveResult.descriptionSuggestions || [],
          tagSuggestions: comprehensiveResult.tagSuggestions || [],
          editingTips: comprehensiveResult.editingTips || [],
          algorithmInsights: comprehensiveResult.algorithmInsights || [],
          algorithmResearch: comprehensiveResult.algorithmResearch || '',
          trendingOpportunities: comprehensiveResult.trendingOpportunities || '',
          engagementTriggers: comprehensiveResult.engagementTriggers || [],
          performancePrediction: comprehensiveResult.performancePrediction || '',
          editRecommendations: comprehensiveResult.editRecommendations || [],
          algorithmInformation: comprehensiveResult.algorithmInformation || '',
          aiAnalysis: {
            metadataUsed: analysisData.aiAnalysis?.metadataUsed || false,
            deepSeekUsed: comprehensiveResult.aiUsed === 'deepseek',
            geminiUsed: comprehensiveResult.aiUsed === 'gemini',
            totalInsights: (comprehensiveResult.algorithmInsights?.length || 0) + (comprehensiveResult.editingTips?.length || 0),
            totalTagSuggestions: comprehensiveResult.tagSuggestions?.length || 0
          }
        }
        
        setAnalysisResult(updatedAnalysisData)
        console.log('✅ Analysis completed successfully')
      } else {
        console.error('❌ Both AI services failed')
        alert('Analysis failed. Please try again.')
      }
    } catch (error) {
      console.error('❌ Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
      setLoadingMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">🎬 Clip Analysis</h1>
          <p className="text-gray-400 mb-6">AI-powered content optimization with algorithm research</p>
        </div>

        {!canAccessAnalysis ? (
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Clip Analysis - Premium Feature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-lg mb-2">🔒 Premium Feature</p>
                <p>Clip Analysis with AI-powered optimization is available to premium users and subscribers only.</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>✨ <strong>Advanced AI Analysis</strong> - Gemini & DeepSeek powered</p>
                  <p>🎯 <strong>Algorithm Research</strong> - Platform-specific insights</p>
                  <p>📈 <strong>Optimization Suggestions</strong> - Titles, descriptions & tags</p>
                  <p>🔍 <strong>Copy-Paste Prevention</strong> - Always generates new content</p>
                  <p>⚡ <strong>Engagement Triggers</strong> - Platform-specific strategies</p>
                </div>
                <div className="mt-6 space-y-2">
                  <Button 
                    onClick={() => window.location.href = '/subscribe'}
                    className="w-full bg-green-600 hover:bg-green-500 text-black"
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">🎬 Clip Analysis</CardTitle>
              <CardDescription>
                Enter a video URL to analyze content with AI-powered optimization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-green-400">Video URL</Label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-black border border-green-500/50 rounded p-2 text-white placeholder:text-gray-400"
                  placeholder="https://youtube.com/watch?v=... or https://tiktok.com/@user/video/..."
                />
              </div>
              
              <div>
                <Label className="text-green-400">Platform You're Posting To</Label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full bg-black border border-green-500/50 rounded p-2 text-white"
                >
                  {platforms.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Button
                  onClick={handleAnalyze}
                  disabled={!videoUrl.trim() || isAnalyzing}
                  className="w-full bg-green-600 hover:bg-green-500 text-black"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {loadingMessage || 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Content
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {analysisResult && (
          <Card className="bg-black border-green-500/30 mt-8">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Analysis Results
                {analysisResult.aiAnalysis && (
                  <Badge className="ml-2" variant="secondary">
                    {analysisResult.aiAnalysis.geminiUsed ? 'Gemini AI' : 'DeepSeek AI'}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">📋 Original Content</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-gray-400 text-sm">Title</Label>
                      <p className="text-white bg-gray-900 p-2 rounded">{analysisResult.clipTitle || 'No title available'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Description</Label>
                      <p className="text-white bg-gray-900 p-2 rounded text-sm max-h-20 overflow-y-auto">
                        {analysisResult.clipDescription || 'No description available'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Tags</Label>
                      <div className="flex flex-wrap gap-1">
                        {(analysisResult.tags || []).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag || 'unknown tag'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-green-400 mb-4">🤖 AI Optimization Suggestions</h3>
                
                {analysisResult.titleSuggestions && analysisResult.titleSuggestions.length > 0 && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">📝 Title Suggestions</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {analysisResult.titleSuggestions.map((title, index) => (
                        <div key={index} className="bg-gray-900 p-3 rounded border border-green-500/30">
                          <p className="text-white text-sm">{title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.descriptionSuggestions && analysisResult.descriptionSuggestions.length > 0 && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">📝 Description Suggestions</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {analysisResult.descriptionSuggestions.map((description, index) => (
                        <div key={index} className="bg-gray-900 p-3 rounded border border-green-500/30">
                          <p className="text-white text-sm">{description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.tagSuggestions && analysisResult.tagSuggestions.length > 0 && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">🏷️ Tag Suggestions</Label>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.tagSuggestions.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.editingTips && analysisResult.editingTips.length > 0 && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">📝 Editing Tips</Label>
                    <div className="space-y-2">
                      {analysisResult.editingTips.map((tip, index) => (
                        <div key={index} className="bg-gray-900 p-3 rounded border border-green-500/30">
                          <p className="text-white text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.algorithmInformation && (
                  <div>
                    <Label className="text-green-400 text-sm mb-2">🔍 {selectedPlatform} Algorithm Information</Label>
                    <div className="bg-gray-900 p-4 rounded border border-green-500/30">
                      <p className="text-white text-sm whitespace-pre-wrap">{analysisResult.algorithmInformation}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisResult.algorithmInsights && analysisResult.algorithmInsights.length > 0 && (
                    <div>
                      <Label className="text-green-400 text-sm mb-2">💡 Algorithm Insights</Label>
                      <div className="space-y-1">
                        {analysisResult.algorithmInsights.map((insight, index) => (
                          <div key={index} className="bg-gray-900 p-2 rounded border border-green-500/30">
                            <p className="text-white text-xs">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.trendingOpportunities && (
                    <div>
                      <Label className="text-green-400 text-sm mb-2">📈 Trending Opportunities</Label>
                      <div className="bg-gray-900 p-3 rounded border border-green-500/30">
                        <p className="text-white text-sm">{analysisResult.trendingOpportunities}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisResult.engagementTriggers && analysisResult.engagementTriggers.length > 0 && (
                    <div>
                      <Label className="text-green-400 text-sm mb-2">⚡ Engagement Triggers</Label>
                      <div className="space-y-1">
                        {analysisResult.engagementTriggers.map((trigger, index) => (
                          <div key={index} className="bg-gray-900 p-2 rounded border border-green-500/30">
                            <p className="text-white text-xs">{trigger}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.performancePrediction && (
                    <div>
                      <Label className="text-green-400 text-sm mb-2">🎯 Performance Prediction</Label>
                      <div className="bg-gray-900 p-3 rounded border border-green-500/30">
                        <p className="text-white text-sm">{analysisResult.performancePrediction}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="text-center text-xs text-gray-400">
                    <p>Analysis powered by DeepSeek AI & Google AI</p>
                    <p className="mt-1">Research includes current algorithm trends</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ClipAnalysis
export { ClipAnalysis }
