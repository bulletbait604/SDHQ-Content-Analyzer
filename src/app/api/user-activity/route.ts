import { NextRequest, NextResponse } from 'next/server';
import { userActivityDB } from '@/lib/userActivityDB';

// GET endpoint for admin to view user activity
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    // Check if user is admin (you'll need to implement proper authentication)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !isAdmin(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (username) {
      const userActivity = userActivityDB.getUserActivity(username);
      if (!userActivity) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(userActivity);
    }

    // Return all users and stats
    const users = userActivityDB.getAllUsers();
    const stats = userActivityDB.getUsageStats();
    
    return NextResponse.json({
      users,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST endpoint to track usage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, feature } = body;

    if (!userId || !feature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['freeTagGenerator', 'aiTagGenerator', 'clipAnalysis', 'contentAnalysis'].includes(feature)) {
      return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
    }

    userActivityDB.trackUsage(userId, feature);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to check if user is admin
function isAdmin(authHeader: string): boolean {
  // This is a simple check - you should implement proper JWT/session validation
  // For now, we'll check if the user is bulletbait604
  try {
    const token = authHeader.replace('Bearer ', '');
    // In a real implementation, you'd decode and validate the JWT
    // For now, we'll use a simple approach
    return token.includes('bulletbait604') || authHeader === 'admin';
  } catch {
    return false;
  }
}
