// Database schema for user activity tracking
export interface UserActivity {
  id: string;
  username: string;
  email: string;
  displayName: string;
  freeTagGenerator: number;
  aiTagGenerator: number;
  clipAnalysis: number;
  contentAnalysis: number;
  lastActive: string;
  createdAt: string;
}

export interface UsageLog {
  id: string;
  userId: string;
  feature: 'freeTagGenerator' | 'aiTagGenerator' | 'clipAnalysis' | 'contentAnalysis';
  timestamp: string;
}

// Database operations
class UserActivityDB {
  private static instance: UserActivityDB;
  private users: Map<string, UserActivity> = new Map();
  private logs: UsageLog[] = [];
  private readonly STORAGE_KEY = 'sdhq_user_activity';

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): UserActivityDB {
    if (!UserActivityDB.instance) {
      UserActivityDB.instance = new UserActivityDB();
    }
    return UserActivityDB.instance;
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          this.users = new Map(data.users || []);
          this.logs = data.logs || [];
        } catch (error) {
          console.error('Error loading user activity data:', error);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      const data = {
        users: Array.from(this.users.entries()),
        logs: this.logs
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  }

  getOrCreateUser(user: any): UserActivity {
    const key = `${user.username}_${user.email}`;
    if (!this.users.has(key)) {
      const newUser: UserActivity = {
        id: key,
        username: user.username,
        email: user.email || '',
        displayName: user.display_name,
        freeTagGenerator: 0,
        aiTagGenerator: 0,
        clipAnalysis: 0,
        contentAnalysis: 0,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      this.users.set(key, newUser);
      this.saveToStorage();
    }
    return this.users.get(key)!;
  }

  trackUsage(userId: string, feature: 'freeTagGenerator' | 'aiTagGenerator' | 'clipAnalysis' | 'contentAnalysis') {
    const user = this.users.get(userId);
    if (user) {
      user[feature]++;
      user.lastActive = new Date().toISOString();
      
      const log: UsageLog = {
        id: `${Date.now()}_${Math.random()}`,
        userId,
        feature,
        timestamp: new Date().toISOString()
      };
      
      this.logs.push(log);
      this.saveToStorage();
    }
  }

  getAllUsers(): UserActivity[] {
    return Array.from(this.users.values());
  }

  getUserActivity(username: string): UserActivity | undefined {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  getUsageStats() {
    const users = this.getAllUsers();
    return {
      totalUsers: users.length,
      totalFreeTagGenerator: users.reduce((sum, u) => sum + u.freeTagGenerator, 0),
      totalAiTagGenerator: users.reduce((sum, u) => sum + u.aiTagGenerator, 0),
      totalClipAnalysis: users.reduce((sum, u) => sum + u.clipAnalysis, 0),
      totalContentAnalysis: users.reduce((sum, u) => sum + u.contentAnalysis, 0),
      activeUsers: users.filter(u => {
        const lastActive = new Date(u.lastActive);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return lastActive > dayAgo;
      }).length
    };
  }
}

export const userActivityDB = UserActivityDB.getInstance();
