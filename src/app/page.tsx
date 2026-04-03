'use client'

import { useState, useEffect, SyntheticEvent } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-proper'
import { Label } from '@/components/ui/label-simple'
import { Badge } from '@/components/ui/badge'
import { KickAuth } from '@/components/KickAuth'
import { ClipAnalysis } from '@/components/ClipAnalysis'
import { Settings as SettingsComponent } from '@/components/Settings'
import { Footer } from '@/components/Footer'
import { translations, Language } from '@/lib/translations'
import SubscribersManager from '@/lib/subscribers'

import { 
  Upload, 
  Play, 
  Settings, 
  FileText, 
  Hash, 
  Search, 
  Clock, 
  RefreshCw,
  Lock,
  CheckCircle,
  ExternalLink,
  Star,
  TrendingUp,
  Video,
  Link,
  Zap,
  Crown
} from 'lucide-react'
import UpgradePage from '@/components/UpgradePage'
import AdminDashboard from '@/components/AdminDashboard'
import AlgorithmCarousel from '@/components/AlgorithmCarousel'
import AlgorithmDetailsModal from '@/components/AlgorithmDetailsModal'
import { algorithmAnalyzer } from '@/lib/algorithmAnalyzer'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [hasPremium, setHasPremium] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('algorithm-info')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<any>(null)
  const [algorithms, setAlgorithms] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Translation helper
  const t = (key: keyof typeof translations.en) => translations[language][key] || translations.en[key]

  useEffect(() => {
    setMounted(true)
    
    // Apply theme
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      } else {
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
      }
    }

    // Check for existing session
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
      const storedLanguage = localStorage.getItem('language') as Language | null
      
      if (storedTheme) {
        setTheme(storedTheme)
      }
      
      if (storedLanguage) {
        setLanguage(storedLanguage as Language)
      }
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          console.log('🔄 Loading stored user:', parsedUser)
          setUser(parsedUser)
          
          // Use SubscribersManager instead of PremiumAccess
          const subscribersManager = SubscribersManager.getInstance()
          const isSub = subscribersManager.isSubscriber(parsedUser.username)
          console.log('🔍 Initial premium status:', {
            username: parsedUser.username,
            isSubscriber: isSub
          })
          setHasPremium(isSub)
        } catch (error) {
          console.error('❌ Error loading stored user:', error)
        }
      }

      // Load algorithms
      const allAlgorithms = algorithmAnalyzer.getAllAlgorithms()
      console.log('🔄 Loading algorithms:', allAlgorithms.length)
      
      // Fallback to static data if algorithm analyzer fails
      if (allAlgorithms.length === 0) {
        console.log('🔄 Using fallback algorithms')
        const fallbackAlgorithms = [
          {
            id: 'tiktok',
            name: 'TikTok',
            platform: 'tiktok',
            logo: 'https://cdn-icons-png.flaticon.com/512/3046/3046124.png',
            primaryColor: '#000000',
            secondaryColor: '#FF0050',
            description: 'TikTok uses a sophisticated recommendation algorithm that analyzes user behavior, video completion rates, and engagement patterns to serve personalized content.',
            howItWorks: [
              'Analyzes user watch time and completion rates',
              'Tracks engagement (likes, comments, shares, saves)',
              'Monitors user interaction patterns and preferences',
              'Evaluates video performance within first 1-2 hours',
              'Considers trending sounds and effects usage'
            ],
            bestSetup: [
              'Vertical 9:16 aspect ratio (1080x1920)',
              'Duration 15-60 seconds for optimal reach',
              'High energy content in first 3 seconds',
              'Use trending sounds and effects',
              'Clear, engaging captions and hashtags'
            ],
            tipsAndTricks: [
              'Hook viewers in first 3 seconds with strong opening',
              'Post during peak hours (7-10 PM local time)',
              'Use 3-5 relevant hashtags including trending ones',
              'Engage with comments within first hour',
              'Create content around trending challenges and sounds',
              'Maintain consistent posting schedule',
              'Use text overlays and closed captions'
            ],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'instagram',
            name: 'Instagram',
            platform: 'instagram',
            logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
            primaryColor: '#E4405F',
            secondaryColor: '#F58529',
            description: 'Instagram\'s algorithm prioritizes content that generates meaningful interactions, with recent changes favoring original content and authentic engagement.',
            howItWorks: [
              'Analyzes engagement patterns and user relationships',
              'Tracks saves, shares, and comment quality',
              'Evaluates content relevance to user interests',
              'Monitors time spent on posts and stories',
              'Considers account authority and niche expertise'
            ],
            bestSetup: [
              'Square 1:1 for feed posts (1080x1080)',
              'Vertical 4:5 for stories and reels (1080x1350)',
              'High-quality images and videos',
              'Compelling captions with 2-3 sentences',
              'Strategic use of 10-30 relevant hashtags'
            ],
            tipsAndTricks: [
              'Post consistently 2-3 times per day',
              'Use Instagram Stories for daily engagement',
              'Leverage Reels for maximum reach',
              'Engage with followers within 30 minutes',
              'Use location tags and user tags strategically',
              'Create carousel posts for higher engagement',
              'Analyze insights for optimal posting times'
            ],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'youtube-shorts',
            name: 'YouTube Shorts',
            platform: 'youtube-shorts',
            logo: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
            primaryColor: '#FF0000',
            secondaryColor: '#282828',
            description: 'YouTube Shorts algorithm focuses on watch time, engagement velocity, and viewer retention to promote content that keeps users watching.',
            howItWorks: [
              'Analyzes watch time and completion rates',
              'Tracks likes, comments, and shares velocity',
              'Evaluates viewer retention patterns',
              'Considers click-through rates to main content',
              'Monitors subscriber conversion from Shorts'
            ],
            bestSetup: [
              'Vertical 9:16 aspect ratio (1080x1920)',
              'Duration under 60 seconds',
              'High energy content throughout',
              'Clear, engaging thumbnails',
              'Compelling titles and descriptions'
            ],
            tipsAndTricks: [
              'Start with strong hook in first 2 seconds',
              'Use trending music and sounds',
              'Create series to encourage binge-watching',
              'Engage with comments quickly',
              'Use end screens to promote main channel',
              'Post 2-3 Shorts daily for consistency',
              'Analyze YouTube Analytics for insights'
            ],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'youtube-16-9',
            name: 'YouTube (16:9)',
            platform: 'youtube-16-9',
            logo: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
            primaryColor: '#FF0000',
            secondaryColor: '#282828',
            description: 'YouTube\'s main algorithm optimizes for watch time, session duration, and user satisfaction to recommend content that keeps viewers engaged.',
            howItWorks: [
              'Analyzes total watch time and session duration',
              'Tracks click-through rates and engagement',
              'Evaluates viewer satisfaction signals',
              'Considers video performance over time',
              'Monitors subscriber growth and retention'
            ],
            bestSetup: [
              'Horizontal 16:9 aspect ratio (1920x1080)',
              'Duration 8-15 minutes for optimal performance',
              'High-quality 4K content when possible',
              'Engaging thumbnails with clear text',
              'SEO-optimized titles and descriptions'
            ],
            tipsAndTricks: [
              'Create compelling thumbnails that stand out',
              'Use keywords in titles and descriptions',
              'Include timestamps for longer videos',
              'Encourage likes, comments, and subscriptions',
              'Create playlists to increase session time',
              'Post consistently at optimal times',
              'Analyze YouTube Studio analytics regularly'
            ],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'facebook-reels',
            name: 'Facebook Reels',
            platform: 'facebook-reels',
            logo: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
            primaryColor: '#1877F2',
            secondaryColor: '#42B883',
            description: 'Facebook Reels algorithm prioritizes content that generates meaningful interactions and keeps users engaged with the platform.',
            howItWorks: [
              'Analyzes engagement patterns and user interests',
              'Tracks shares, comments, and reactions',
              'Evaluates content relevance to social circles',
              'Monitors watch time and completion rates',
              'Considers trending topics and formats'
            ],
            bestSetup: [
              'Vertical 9:16 aspect ratio (1080x1920)',
              'Duration 15-30 seconds for optimal reach',
              'High-quality video and audio',
              'Engaging captions and text overlays',
              'Strategic use of trending music'
            ],
            tipsAndTricks: [
              'Use trending sounds and effects',
              'Create content for specific audiences',
              'Post during peak engagement hours',
              'Engage with comments and messages',
              'Share to Facebook Stories for additional reach',
              'Use relevant hashtags and location tags',
              'Analyze Facebook Insights regularly'
            ],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'twitter',
            name: 'Twitter/X',
            platform: 'twitter',
            logo: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
            primaryColor: '#000000',
            secondaryColor: '#1DA1F2',
            description: 'Twitter\'s algorithm prioritizes recent, relevant content that generates engagement and keeps users actively participating in conversations.',
            howItWorks: [
              'Analyzes engagement velocity and reach',
              'Tracks retweets, likes, and replies',
              'Evaluates content relevance and timing',
              'Considers user relationships and interests',
              'Monitors trending topics and hashtags'
            ],
            bestSetup: [
              'Optimal tweet length under 280 characters',
              'High-quality images and videos',
              'Strategic use of 2-3 relevant hashtags',
              'Compelling opening to encourage engagement',
              'Thread format for longer content'
            ],
            tipsAndTricks: [
              'Post during peak engagement hours',
              'Use relevant trending hashtags',
              'Engage with replies and mentions quickly',
              'Create threads for detailed content',
              'Use polls and questions for engagement',
              'Share visual content regularly',
              'Analyze Twitter Analytics for insights'
            ],
            lastUpdated: new Date().toISOString()
          }
        ]
        setAlgorithms(fallbackAlgorithms)
      } else {
        setAlgorithms(allAlgorithms)
      }
      
      // Update algorithms with AI on component mount
      algorithmAnalyzer.updateAlgorithmsWithAI()
    }
  }, [])

  // Listen for subscriber list updates from Settings component
  useEffect(() => {
    const handleSubscriberListUpdated = (event: CustomEvent) => {
      console.log('📢 Received subscriberListUpdated event:', event.detail)
      
      if (user) {
        // Re-check the current user's premium status
        const subscribersManager = SubscribersManager.getInstance()
        const isSub = subscribersManager.isSubscriber(user.username)
        console.log('🔄 Updated premium status:', {
          username: user.username,
          wasPremium: hasPremium,
          isNowPremium: isSub
        })
        
        // Update the premium status if it changed
        if (hasPremium !== isSub) {
          setHasPremium(isSub)
          console.log('✅ Premium status updated in UI')
        }
      }
    }

    // Add event listener
    window.addEventListener('subscriberListUpdated', handleSubscriberListUpdated as EventListener)
    
    // Cleanup
    return () => {
      window.removeEventListener('subscriberListUpdated', handleSubscriberListUpdated as EventListener)
    }
  }, [user, hasPremium])

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
    
    // Apply theme immediately
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    }
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage)
    }
  }

  const handleUserChange = (newUser: any) => {
    setUser(newUser)
    if (newUser) {
      // Check premium status when user logs in
      const subscribersManager = SubscribersManager.getInstance()
      const isSub = subscribersManager.isSubscriber(newUser.username)
      setHasPremium(isSub)
    } else {
      setHasPremium(false)
    }
  }

  const handleSelectAlgorithm = (algorithm: any) => {
    setSelectedAlgorithm(algorithm)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAlgorithm(null)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  // Tab categories for reference
const freemiumTabs = ['algorithm-info', 'tag-generator-free']
const premiumTabs = ['clip-analysis', 'tag-generator', 'content-analysis']

return (
    <div className="min-h-screen bg-black text-white">
      {/* User Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-8">
          {/* Left side - User info and Settings */}
          <div className="flex items-center gap-2">
            {user && (
              <>
                <img 
                  src={user.profile_image_url} 
                  alt={user.display_name}
                  className="w-10 h-10 rounded-full border-2 border-green-500"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-green-400 font-semibold">{user.display_name}</p>
                    {hasPremium ? (
                      <Badge className="bg-purple-600 text-white text-xs">Subscribed</Badge>
                    ) : (
                      <>
                        <Badge className="bg-gray-600 text-white text-xs">Free User</Badge>
                        <Button
                          onClick={() => setActiveTab('upgrade')}
                          className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs ml-2"
                        >
                          Upgrade
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right side - Settings and Logout when logged in */}
          <div className="flex items-center gap-2">
            {user && (
              <>
                <Button
                  onClick={() => {
                    setActiveTab('settings')
                  }}
                  className="bg-gray-600 hover:bg-gray-500 text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t('settings')}
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem('kickUser')
                    setUser(null)
                    setHasPremium(false)
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Message for Free Users */}
      {user && !hasPremium && (
        <div className="container mx-auto px-4 mb-2">
          <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-2 text-center">
            <p className="text-yellow-300 text-xs font-medium">
              Free User - Please Subscribe To Bulletbait604 to Unlock Premium Features
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <div className="flex flex-col items-center justify-center mb-4">
            <img 
              src="https://i.ibb.co/rG8Fz6m5/SDHQ-12-3-2023.png" 
              alt="SDHQ Content Optimizer"
              className="h-32 w-auto mb-2"
              onLoad={() => console.log('✅ Logo loaded successfully')}
              onError={(e: SyntheticEvent<HTMLImageElement>) => {
                console.log('❌ Logo failed to load:', e)
                // Fallback to a placeholder if image fails
                const target = e.target as HTMLImageElement
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%236633'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3ESDHQ%3C/text%3E%3C/svg%3E"
              }}
            />
            <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {t('appTitle')}
            </h1>
            <p className="text-center text-gray-400 mb-4">
              {t('appDescription')}
            </p>
          </div>
          
          {/* KICK Login Option */}
          {!user && (
            <div className="text-center mt-8">
              <KickAuth onUserChange={handleUserChange} />
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="algorithm-info" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t('algorithmInfo')}
            </TabsTrigger>
            <TabsTrigger value="tag-generator-free" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              {t('tagGeneratorFree')}
            </TabsTrigger>
            <TabsTrigger 
              value="clip-analysis" 
              className="flex items-center gap-2"
              disabled={!hasPremium}
            >
              <Video className="w-4 h-4" />
              {t('clipAnalysis')} {t('premium')}
            </TabsTrigger>
            <TabsTrigger 
              value="tag-generator" 
              className="flex items-center gap-2"
              disabled={!hasPremium}
            >
              <Hash className="w-4 h-4" />
              {t('tagGenerator')} {t('premium')}
            </TabsTrigger>
            <TabsTrigger 
              value="content-analysis" 
              className="flex items-center gap-2"
              disabled={!hasPremium}
            >
              <FileText className="w-4 h-4" />
              {t('contentAnalysis')} {t('premium')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="algorithm-info" className="mt-6">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Social Media Algorithm Analysis
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                  AI-powered insights into TikTok, Instagram, YouTube, Facebook Reels, and Twitter algorithms to maximize your content reach and engagement
                </p>
              </div>

              {/* Debug Info */}
              <div className="text-center text-gray-400 text-sm">
                <p>Algorithms loaded: {algorithms.length}</p>
                <p>Mounted: {mounted ? 'Yes' : 'No'}</p>
              </div>

              {/* Algorithm Carousel */}
              {algorithms.length > 0 ? (
                <AlgorithmCarousel 
                  algorithms={algorithms}
                  onSelectAlgorithm={handleSelectAlgorithm}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading algorithm data...</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tag-generator-free" className="mt-6">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('tagGeneratorFree')}</h2>
              <p className="text-gray-300 mb-8">{t('comingSoon')}</p>
              <div className="max-w-md mx-auto">
                <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-600 rounded mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clip-analysis" className="mt-6">
            {hasPremium ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">{t('clipAnalysis')}</h2>
                <p className="text-gray-300 mb-8">{t('comingSoon')}</p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-600 rounded mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded mb-4 w-3/4"></div>
                      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">{t('clipAnalysis')}</h2>
                <p className="text-gray-300 mb-8">{t('upgradeToPremium')}</p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                    <div className="text-center">
                      <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <p className="text-yellow-400 font-semibold">{t('subscriberOnly')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tag-generator" className="mt-6">
            {hasPremium ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">{t('tagGenerator')}</h2>
                <p className="text-gray-300 mb-8">{t('comingSoon')}</p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-600 rounded mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded mb-4 w-3/4"></div>
                      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">{t('tagGenerator')}</h2>
                <p className="text-gray-300 mb-8">{t('upgradeToPremium')}</p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                    <div className="text-center">
                      <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <p className="text-yellow-400 font-semibold">{t('subscriberOnly')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content-analysis" className="mt-6">
            {hasPremium ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">{t('contentAnalysis')}</h2>
                <p className="text-gray-300 mb-8">{t('comingSoon')}</p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-600 rounded mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded mb-4 w-3/4"></div>
                      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">{t('contentAnalysis')}</h2>
                <p className="text-gray-300 mb-8">{t('upgradeToPremium')}</p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                    <div className="text-center">
                      <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <p className="text-yellow-400 font-semibold">{t('subscriberOnly')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            {user ? (
              <SettingsComponent user={user} language={language} onLanguageChange={handleLanguageChange} setActiveTab={setActiveTab} />
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-400 mb-2">{t('settings')}</h2>
                <p className="text-gray-300">Please log in to access settings</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upgrade" className="mt-6">
            <UpgradePage user={user} language={language} onLanguageChange={handleLanguageChange} />
          </TabsContent>

          <TabsContent value="admin-dashboard" className="mt-6">
            {user && user.username === 'bulletbait604' ? (
              <AdminDashboard user={user} language={language} />
            ) : (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
                <p className="text-gray-300">Admin access required</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Footer language={language} />
      </div>

      {/* Algorithm Details Modal */}
      <AlgorithmDetailsModal 
        algorithm={selectedAlgorithm}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
