'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Star, Zap, Shield, Rocket, Sparkles } from 'lucide-react'
import { translations, Language } from '@/lib/translations'

interface UpgradePageProps {
  user: any
  language: Language
  onLanguageChange: (language: Language) => void
}

export default function UpgradePage({ user, language, onLanguageChange }: UpgradePageProps) {
  const t = (key: keyof typeof translations.en) => 
    translations[language][key] || translations.en[key]

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
            {t('subscribeToUpgrade')}
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Subscribe to Bulletbait604 on kick.com then type "SDHQVerify" in chat to activate
          </p>
        </div>

        {/* KICK Player Embed */}
        <div className="mb-12">
          <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Crown className="w-6 h-6" />
                Watch Bulletbait604 Live
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-video bg-black rounded-lg overflow-hidden max-w-2xl mx-auto">
                <iframe 
                  src={`https://player.kick.com/${user?.username || 'YOUR_USERNAME'}`}
                  height="480" 
                  width="640"
                  frameBorder="0" 
                  scrolling="no" 
                  allowFullScreen={true}
                  className="w-full h-full rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Step 1 */}
          <Card className="bg-black/50 border-green-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">1</div>
                Follow on Kick
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Go to <span className="text-green-400 font-semibold">kick.com</span> and follow <span className="text-green-400 font-semibold">@Bulletbait604</span>
              </p>
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-300 text-sm">
                  <span className="text-green-400">👆</span> Click the follow button on Bulletbait604's profile
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                Subscribe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Go to <span className="text-purple-400 font-semibold">kick.com</span> and follow <span className="text-purple-400 font-semibold">@Bulletbait604</span>
              </p>
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <a 
                  href="https://kick.com/bulletbait604/subscribe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 text-sm font-bold hover:text-purple-200 transition-colors block text-center"
                >
                  CLICK HERE TO SUBSCRIBE ON KICK
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step 3 */}
        <Card className="bg-black/50 border-yellow-500/30 backdrop-blur-sm mb-12">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">3</div>
              Activate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 mb-4">
              Type <span className="text-yellow-400 font-bold">SDHQVerify</span> in Bulletbait604's chat to activate your subscription
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-300 text-sm mb-2">
                <span className="text-yellow-400">⚡</span> May take up to 24 hours to activate
              </p>
              <p className="text-yellow-300 text-sm">
                <span className="text-yellow-400">🔄</span> Refresh this page after activation
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
            🚀 Unlock Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/50 border-green-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-green-400 font-semibold mb-2">Clip Analysis</h3>
                <p className="text-gray-300 text-sm">AI-powered content analysis with detailed insights</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-purple-400 font-semibold mb-2">AI Tag Generation</h3>
                <p className="text-gray-300 text-sm">Advanced tag generation with AI optimization</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-pink-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-pink-400 font-semibold mb-2">Content Analysis</h3>
                <p className="text-gray-300 text-sm">Deep content optimization and strategy</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-yellow-600 to-purple-600 border-yellow-400/50 p-8">
            <CardContent className="space-y-4">
              <Rocket className="w-16 h-16 text-yellow-300 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Upgrade?</h3>
              <p className="text-yellow-100 mb-6">
                Join thousands of creators optimizing their content with SDHQ Premium
              </p>
              <Button
                onClick={() => window.open(`https://kick.com/${user?.username || 'bulletbait604'}`, '_blank')}
                className="bg-white text-black hover:bg-gray-100 font-bold px-8 py-3 text-lg"
              >
                Go to Kick.com
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-500/10 rounded-full blur-lg animate-pulse delay-3000"></div>
        </div>
      </div>
    </div>
  )
}
