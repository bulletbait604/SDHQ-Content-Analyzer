// Algorithm data structure and types
export interface SocialMediaAlgorithm {
  id: string
  name: string
  platform: 'tiktok' | 'instagram' | 'youtube-shorts' | 'youtube-16-9' | 'facebook-reels' | 'twitter'
  logo: string
  primaryColor: string
  secondaryColor: string
  description: string
  howItWorks: string[]
  bestSetup: string[]
  tipsAndTricks: string[]
  lastUpdated: string
  aiAnalysis?: string
  weeklyInsights?: string[]
}

export interface AlgorithmUpdate {
  id: string
  platform: string
  changes: string[]
  impact: string
  recommendations: string[]
  timestamp: string
}

// AI API integration for algorithm analysis
class AlgorithmAnalyzer {
  private static instance: AlgorithmAnalyzer
  private readonly STORAGE_KEY = 'sdhq_algorithm_data'
  private algorithms: Map<string, SocialMediaAlgorithm> = new Map()
  private lastUpdate: string = ''

  private constructor() {
    this.initializeAlgorithms()
    this.loadFromStorage()
  }

  static getInstance(): AlgorithmAnalyzer {
    if (!AlgorithmAnalyzer.instance) {
      AlgorithmAnalyzer.instance = new AlgorithmAnalyzer()
    }
    return AlgorithmAnalyzer.instance
  }

  private initializeAlgorithms() {
    const defaultAlgorithms: SocialMediaAlgorithm[] = [
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

    defaultAlgorithms.forEach(algo => {
      this.algorithms.set(algo.id, algo)
    })
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        try {
          const data = JSON.parse(stored)
          this.lastUpdate = data.lastUpdate || ''
          if (data.algorithms) {
            Object.entries(data.algorithms).forEach(([key, value]) => {
              this.algorithms.set(key, value as SocialMediaAlgorithm)
            })
          }
        } catch (error) {
          console.error('Error loading algorithm data:', error)
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      const data = {
        algorithms: Object.fromEntries(this.algorithms),
        lastUpdate: this.lastUpdate
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    }
  }

  async updateAlgorithmsWithAI() {
    try {
      // Check if we need to update (weekly)
      const lastUpdate = new Date(this.lastUpdate)
      const now = new Date()
      const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceUpdate < 7) {
        return // Don't update if less than a week has passed
      }

      // Use available AI API (DeepSeek or OpenAI)
      const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
      if (!apiKey) {
        console.warn('No AI API key found, using default algorithm data')
        return
      }

      const prompt = `
        Analyze the current state of social media algorithms for the following platforms:
        TikTok, Instagram, YouTube Shorts, YouTube 16:9, Facebook Reels, and Twitter/X.
        
        Provide insights on:
        1. Recent algorithm changes
        2. Current best practices
        3. Engagement optimization strategies
        4. Emerging trends and patterns
        
        Format as JSON with platform-specific insights.
      `

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      })

      if (response.ok) {
        const data = await response.json()
        const aiInsights = data.choices[0].message.content
        
        // Update algorithms with AI insights
        this.algorithms.forEach((algo, id) => {
          algo.aiAnalysis = aiInsights
          algo.weeklyInsights = this.parseAIInsights(aiInsights, algo.platform)
          algo.lastUpdated = new Date().toISOString()
        })

        this.lastUpdate = new Date().toISOString()
        this.saveToStorage()
      }
    } catch (error) {
      console.error('Error updating algorithms with AI:', error)
    }
  }

  private parseAIInsights(insights: string, platform: string): string[] {
    // Parse AI insights and extract platform-specific recommendations
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(insights)
      if (parsed[platform]?.recommendations) {
        return parsed[platform].recommendations
      }
      
      // If JSON doesn't work, try to extract from markdown/text
      const lines = insights.split('\n').filter(line => line.trim())
      const recommendations = lines
        .filter(line => 
          line.includes(platform) || 
          line.includes('recommend') || 
          line.includes('tip') ||
          line.includes('should') ||
          line.match(/^\d+\./) // Numbered lists
        )
        .slice(0, 4) // Take first 4 relevant lines
        .map(line => line.replace(/^\d+\.\s*/, '').trim()) // Remove numbering
      
      if (recommendations.length > 0) {
        return recommendations
      }
      
      // Fallback to manual parsing
      return [
        'Continue focusing on high-quality content',
        'Maintain consistent posting schedule',
        'Engage with your audience regularly',
        'Analyze performance metrics'
      ]
    } catch (error) {
      console.error('Error parsing AI insights:', error)
      // Return fallback recommendations
      return [
        'Focus on creating engaging content that resonates with your audience',
        'Post consistently during peak engagement hours',
        'Use relevant hashtags and trending topics',
        'Monitor analytics to optimize your strategy'
      ]
    }
  }

  getAlgorithm(platform: string): SocialMediaAlgorithm | undefined {
    return this.algorithms.get(platform)
  }

  getAllAlgorithms(): SocialMediaAlgorithm[] {
    return Array.from(this.algorithms.values())
  }

  getLastUpdateTime(): string {
    return this.lastUpdate
  }

  async forceUpdate() {
    await this.updateAlgorithmsWithAI()
  }
}

export const algorithmAnalyzer = AlgorithmAnalyzer.getInstance()
