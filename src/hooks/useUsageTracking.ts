import { useEffect } from 'react'
import { userActivityDB } from '@/lib/userActivityDB'

export function useUsageTracking(user: any) {
  useEffect(() => {
    if (user) {
      // Get or create user in database
      userActivityDB.getOrCreateUser(user)
    }
  }, [user])

  const trackUsage = async (feature: 'freeTagGenerator' | 'aiTagGenerator' | 'clipAnalysis' | 'contentAnalysis') => {
    if (!user) return

    try {
      // Track locally
      const userRecord = userActivityDB.getOrCreateUser(user)
      userActivityDB.trackUsage(userRecord.id, feature)

      // Also track via API for persistence
      await fetch('/api/user-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userRecord.id,
          feature
        })
      })
    } catch (error) {
      console.error('Error tracking usage:', error)
    }
  }

  return { trackUsage }
}
