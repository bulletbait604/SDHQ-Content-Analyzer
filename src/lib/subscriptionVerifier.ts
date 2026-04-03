// Subscription verification system for Kick
// This simulates the chat listener for development/testing

export interface VerificationRequest {
  username: string
  code: string
  timestamp: string
  status: 'pending' | 'verified'
  isSubscribed?: boolean
}

// Simulate chat message detection
export function simulateChatMessage(message: string, username: string, isSubscriber: boolean) {
  console.log(`💬 [${username}]: ${message}`)
  
  // Check for verification code
  const verificationMatch = message.match(/VERIFY-([A-Z0-9]+)/)
  
  if (verificationMatch) {
    const code = `VERIFY-${verificationMatch[1]}`
    console.log(`🔍 Verification code detected: ${code} from ${username}`)
    
    // Get pending verifications
    const pendingVerifications = JSON.parse(localStorage.getItem('pendingVerifications') || '[]')
    const verificationRequest = pendingVerifications.find((v: any) => 
      v.code === code && v.username === username && v.status === 'pending'
    )
    
    if (verificationRequest) {
      console.log(`✅ Found verification request for ${username}`)
      
      // Update verification status
      verificationRequest.status = 'verified'
      verificationRequest.isSubscribed = isSubscriber
      
      // Save back to localStorage
      const updatedVerifications = pendingVerifications.map((v: any) => 
        v.code === code && v.username === username ? verificationRequest : v
      )
      localStorage.setItem('pendingVerifications', JSON.stringify(updatedVerifications))
      
      console.log(`🎉 Verification completed for ${username}: ${isSubscriber ? 'SUBSCRIBED' : 'NOT SUBSCRIBED'}`)
      
      return {
        success: true,
        username,
        isSubscribed: isSubscriber,
        code
      }
    } else {
      console.log(`❌ No pending verification found for code: ${code}`)
      return {
        success: false,
        error: 'No matching verification request found'
      }
    }
  }
  
  return null
}

// Test function to simulate a verification
export function testVerification(username: string, isSubscriber: boolean = true) {
  // Get pending verifications
  const pendingVerifications = JSON.parse(localStorage.getItem('pendingVerifications') || '[]')
  const userVerification = pendingVerifications.find((v: any) => 
    v.username === username && v.status === 'pending'
  )
  
  if (userVerification) {
    console.log(`🧪 Simulating verification for ${username}...`)
    return simulateChatMessage(userVerification.code, username, isSubscriber)
  } else {
    console.log(`❌ No pending verification for ${username}`)
    return {
      success: false,
      error: 'No pending verification found'
    }
  }
}

// Get all pending verifications
export function getPendingVerifications(): VerificationRequest[] {
  return JSON.parse(localStorage.getItem('pendingVerifications') || '[]')
    .filter((v: any) => v.status === 'pending')
}

// Clear all verifications (for testing)
export function clearVerifications() {
  localStorage.removeItem('pendingVerifications')
  console.log('🗑️ All verifications cleared')
}
