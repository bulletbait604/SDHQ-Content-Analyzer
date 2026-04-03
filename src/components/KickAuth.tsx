'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn, LogOut } from 'lucide-react'
import { KickOAuth } from '@/lib/kick-oauth'

interface KickUser {
  id: string
  username: string
  display_name: string
  profile_image_url: string
  isSubscribed?: boolean
  subscriptionVerified?: boolean
  lastSubscriptionCheck?: string
}

interface KickAuthProps {
  onUserChange?: (user: KickUser | null) => void
}

export function KickAuth({ onUserChange }: KickAuthProps) {
  const [user, setUser] = useState<KickUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string | null>(null)

  const kickOAuth = new KickOAuth(
    process.env.NEXT_PUBLIC_KICK_CLIENT_ID || '',
    process.env.NEXT_PUBLIC_KICK_CLIENT_SECRET || ''
  )

  // Generate verification code for subscription check
  const generateVerificationCode = () => {
    const code = `VERIFY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    setVerificationCode(code)
    return code
  }

  // Check subscription status (simulated - in production this would connect to Kick chat)
  const checkSubscription = async () => {
    if (!user) return
    
    setIsCheckingSubscription(true)
    try {
      // Generate verification code
      const code = generateVerificationCode()
      
      // Store verification request
      const verificationRequest = {
        username: user.username,
        code: code,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
      
      // Store in localStorage (in production, this would be in a database)
      const pendingVerifications = JSON.parse(localStorage.getItem('pendingVerifications') || '[]')
      pendingVerifications.push(verificationRequest)
      localStorage.setItem('pendingVerifications', JSON.stringify(pendingVerifications))
      
      console.log(`🔍 Generated verification code for @${user.username}: ${code}`)
      console.log('📝 Instructions: Type this code in Bulletbait604\'s Kick chat to verify subscription')
      
    } catch (error) {
      console.error('Error checking subscription:', error)
      setError('Failed to check subscription status')
    } finally {
      setIsCheckingSubscription(false)
    }
  }

  // Simulate verification completion (in production, this would be triggered by chat listener)
  const simulateVerification = (isSubscribed: boolean) => {
    if (!user) return
    
    const updatedUser = {
      ...user,
      isSubscribed,
      subscriptionVerified: true,
      lastSubscriptionCheck: new Date().toISOString()
    }
    
    setUser(updatedUser)
    onUserChange?.(updatedUser)
    setVerificationCode(null)
    
    // Clear from pending verifications
    const pendingVerifications = JSON.parse(localStorage.getItem('pendingVerifications') || '[]')
    const filtered = pendingVerifications.filter((v: any) => v.username !== user.username)
    localStorage.setItem('pendingVerifications', JSON.stringify(filtered))
    
    console.log(`✅ Subscription verified for @${user.username}: ${isSubscribed ? 'SUBSCRIBED' : 'NOT SUBSCRIBED'}`)
  }

  // Check for pending verifications (simulation)
  useEffect(() => {
    if (!user) return
    
    const interval = setInterval(() => {
      const pendingVerifications = JSON.parse(localStorage.getItem('pendingVerifications') || '[]')
      const userVerification = pendingVerifications.find((v: any) => v.username === user.username)
      
      if (userVerification && userVerification.status === 'verified') {
        simulateVerification(userVerification.isSubscribed || false)
      }
    }, 5000) // Check every 5 seconds
    
    return () => clearInterval(interval)
  }, [user])

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)
    const authURL = await kickOAuth.getAuthURL(`${window.location.origin}/auth/kick/callback`)
    
    // Store return URL for OAuth callback
    sessionStorage.setItem('kickAuthReturn', window.location.pathname)
    window.location.href = authURL
  }

  const handleAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const authStatus = urlParams.get('auth')
    
    if (authStatus === 'success') {
      const authCode = urlParams.get('code') || localStorage.getItem('kickAuthCode')
      if (authCode) {
        const redirectUri = `${window.location.origin}/auth/kick/callback`
        await handleAuthSuccess(authCode, redirectUri)
        localStorage.removeItem('kickAuthCode')
        sessionStorage.removeItem('kickAuthReturn')
        window.history.replaceState({}, '', window.location.pathname)
      }
    } else if (authStatus === 'error') {
      const errorMsg = urlParams.get('error') || 'Authentication failed'
      setError(errorMsg)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  const handleAuthSuccess = async (code: string, redirectUri: string) => {
    try {
      console.log('🔐 Processing Kick OAuth callback...')
      
      // Exchange auth code for token
      const tokenResponse = await kickOAuth.exchangeCodeForToken(code, redirectUri)
      console.log('✅ Real Kick token received')
      
      // Get user info
      let userData;
      try {
        userData = await kickOAuth.getUserInfo(tokenResponse.access_token)
        console.log('✅ Got real user data:', userData.username)
      } catch (userError) {
        console.error('❌ Kick user API failed:', userError)
        
        // Ask user for their username since we can't get it from API
        const kickUsername = prompt(
          'Kick API is currently experiencing issues.\n\n' +
          'Please enter your exact Kick username (without @):\n\n' +
          'This is required to display your profile'
        );
        
        if (!kickUsername || kickUsername.trim() === '') {
          throw new Error('Username is required to continue')
        }
        
        // Clean and validate username
        const cleanUsername = kickUsername.replace('@', '').trim().toLowerCase()
        
        if (cleanUsername.length < 3) {
          throw new Error('Please enter a valid Kick username')
        }
        
        userData = {
          id: 'kick_user_' + cleanUsername,
          username: cleanUsername,
          display_name: kickUsername,
          profile_image_url: ''
        }
        
        console.log('👤 Using provided username:', userData)
      }
      
      // Store session
      localStorage.setItem('kickUser', JSON.stringify(userData))
      localStorage.setItem('kickAccessToken', tokenResponse.access_token)
      
      // Update state
      setUser(userData)
      onUserChange?.(userData)
      
      console.log(`🎉 Login complete! @${userData.username}`)
      
    } catch (error) {
      console.error('❌ Authentication failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to complete authentication')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear session (only runs on client side)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kickUser')
      localStorage.removeItem('kickAccessToken')
    }
    
    // Update state
    setUser(null)
    onUserChange?.(null)
    setError(null)
  }

  useEffect(() => {
    // Check for stored session on mount
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kickUser')
      const storedToken = localStorage.getItem('kickAccessToken')
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          onUserChange?.(userData)
          console.log(`📱 Restored session for @${userData.username}`)
        } catch (error) {
          console.error('Failed to parse stored user data:', error)
          localStorage.removeItem('kickUser')
          localStorage.removeItem('kickAccessToken')
        }
      }
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const authStatus = urlParams.get('auth')
    
    if (authStatus === 'success') {
      const authCode = urlParams.get('code') || localStorage.getItem('kickAuthCode')
      if (authCode) {
        const redirectUri = `${window.location.origin}/auth/kick/callback`
        handleAuthSuccess(authCode, redirectUri)
        localStorage.removeItem('kickAuthCode')
        sessionStorage.removeItem('kickAuthReturn')
        window.history.replaceState({}, '', window.location.pathname)
      }
    } else if (authStatus === 'error') {
      const errorMsg = urlParams.get('error') || 'Authentication failed'
      setError(errorMsg)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // If user is logged in, show profile with badges
  if (user) {
    return (
      <Card className="bg-black border border-cyan-500">
        <CardContent className="relative">
          {/* Logout button in top right corner */}
          <Button
            onClick={handleLogout}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
            size="sm"
          >
            <LogOut className="w-3 h-3 mr-1" />
            Logout
          </Button>
          
          {/* User info centered */}
          <div className="flex items-center gap-3 pr-20">
            <div className="text-center">
              <img 
                src={user.profile_image_url || 'https://via.placeholder.com/40'} 
                alt={user.display_name}
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="text-cyan-300 text-sm font-medium">Logged in as</div>
              <div className="text-white font-semibold">{user.display_name}</div>
              <div className="flex items-center gap-2 mt-1">
                {user.subscriptionVerified ? (
                  <span className={`text-xs px-2 py-1 rounded ${
                    user.isSubscribed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {user.isSubscribed ? '✓ Subscriber' : '✗ Not Subscribed'}
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded bg-yellow-500 text-black">
                    Subscription Unknown
                  </span>
                )}
                {user.lastSubscriptionCheck && (
                  <span className="text-xs text-gray-400">
                    Checked: {new Date(user.lastSubscriptionCheck).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Subscription verification section */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            {verificationCode ? (
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-sm text-gray-300 mb-2">
                    Type this code in <strong>Bulletbait604's Kick chat</strong> to verify subscription:
                  </div>
                  <div className="bg-gray-800 px-4 py-2 rounded border border-cyan-500">
                    <code className="text-cyan-400 font-mono text-lg">{verificationCode}</code>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => window.open('https://kick.com/bulletbait604', '_blank')}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Open Kick Chat
                  </Button>
                  <Button
                    onClick={checkSubscription}
                    disabled={isCheckingSubscription}
                    size="sm"
                    className="text-xs bg-cyan-500 text-black hover:bg-cyan-400"
                  >
                    {isCheckingSubscription ? 'Checking...' : 'Check Again'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {!user.subscriptionVerified && (
                  <Button
                    onClick={checkSubscription}
                    disabled={isCheckingSubscription}
                    size="sm"
                    className="bg-cyan-500 text-black hover:bg-cyan-400"
                  >
                    {isCheckingSubscription ? 'Checking...' : 'Verify Subscription'}
                  </Button>
                )}
                {user.subscriptionVerified && (
                  <Button
                    onClick={checkSubscription}
                    disabled={isCheckingSubscription}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    {isCheckingSubscription ? 'Checking...' : 'Recheck Subscription'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default login UI
  return (
    <div className="text-center">
      <p className="text-gray-300 mb-4">
        Login with KICK to access freemium features.
      </p>
      <Button
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-cyan-500 text-black hover:bg-cyan-400"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
            Connecting...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4 mr-2" />
            Login with Kick
          </>
        )}
      </Button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900 border border-red-500 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  )
}
