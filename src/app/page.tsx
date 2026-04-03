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
      setAlgorithms(allAlgorithms)
      
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
