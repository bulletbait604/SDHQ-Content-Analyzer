// Custom Tag Selection Algorithm
// Research-based weekly trending analysis and intelligent tag selection

import { TagData } from '@/data/trendingTags'

export interface PlatformAlgorithm {
  name: string
  categoryWeights: { [category: string]: number }
  trendingBoost: number
  titleMatchWeight: number
  lengthPreference: 'short' | 'medium' | 'long'
  maxHashtags: number
  description: string
}

// Platform-specific algorithms based on research
export const platformAlgorithms: { [platform: string]: PlatformAlgorithm } = {
  tiktok: {
    name: 'TikTok Discovery Algorithm',
    categoryWeights: {
      'discovery': 10,      // fyp, foryou, explore
      'viral': 9,           // viral, trending, blowingup
      'entertainment': 8,    // dance, comedy, music
      'creative': 7,         // art, design, creative
      'lifestyle': 6,        // fitness, fashion, food
      'trending': 8,         // trending, hot, popular
      'engagement': 7,       // like, share, follow
      'emotion': 5,          // love, happy, funny
      'general': 3,         // general, random, misc
      'technology': 4,       // tech, gadgets, digital
      'business': 2,        // business, startup, work
      'educational': 3      // tutorial, learn, study
    },
    trendingBoost: 15,
    titleMatchWeight: 25,
    lengthPreference: 'short',
    maxHashtags: 5,
    description: 'Optimized for TikTok\'s discovery algorithm with emphasis on viral content and trending challenges'
  },
  instagram: {
    name: 'Instagram Engagement Algorithm',
    categoryWeights: {
      'aesthetic': 10,      // beautiful, pretty, stunning
      'lifestyle': 9,        // fashion, travel, food
      'creative': 8,         // art, design, photography
      'engagement': 7,       // like, share, follow
      'emotion': 6,          // love, happy, inspiration
      'beauty': 8,           // makeup, skincare, style
      'fashion': 7,          // ootd, style, trendy
      'travel': 6,           // wanderlust, vacation, explore
      'food': 5,             // foodie, delicious, yummy
      'fitness': 5,          // workout, gym, health
      'general': 3,          // general, daily, life
      'business': 2,         // business, entrepreneur, career
      'technology': 3        // tech, digital, smart
    },
    trendingBoost: 12,
    titleMatchWeight: 20,
    lengthPreference: 'medium',
    maxHashtags: 30,
    description: 'Focused on Instagram\'s visual and engagement-based algorithm with aesthetic and lifestyle content'
  },
  youtube: {
    name: 'YouTube Search Algorithm',
    categoryWeights: {
      'educational': 10,     // tutorial, howto, learn
      'entertainment': 9,    // gaming, comedy, music
      'technology': 8,       // tech, review, gadgets
      'information': 7,       // info, facts, data
      'review': 7,           // review, rating, feedback
      'lifestyle': 6,        // vlog, daily, life
      'business': 5,         // business, finance, career
      'creative': 5,         // art, design, creative
      'motivation': 4,       // motivation, inspiration
      'general': 3,          // general, random, misc
      'trending': 6,         // trending, viral, popular
      'news': 4              // news, current, updates
    },
    trendingBoost: 10,
    titleMatchWeight: 30,
    lengthPreference: 'long',
    maxHashtags: 15,
    description: 'Optimized for YouTube\'s search and discovery algorithm with focus on educational and informational content'
  },
  twitter: {
    name: 'Twitter Real-time Algorithm',
    categoryWeights: {
      'news': 10,            // news, breaking, current
      'trending': 9,         // trending, viral, hot
      'technology': 8,       // tech, ai, innovation
      'business': 7,         // business, startup, finance
      'information': 6,       // info, facts, data
      'engagement': 5,       // discussion, debate, conversation
      'entertainment': 4,    // entertainment, fun, comedy
      'sports': 5,           // sports, game, match
      'politics': 4,         // politics, government, policy
      'general': 3,          // general, random, misc
      'lifestyle': 2,        // lifestyle, daily, life
      'creative': 3          // creative, art, design
    },
    trendingBoost: 20,
    titleMatchWeight: 25,
    lengthPreference: 'short',
    maxHashtags: 3,
    description: 'Designed for Twitter\'s real-time trending algorithm with emphasis on news and timely content'
  },
  facebook: {
    name: 'Facebook Community Algorithm',
    categoryWeights: {
      'community': 10,       // community, together, unity
      'lifestyle': 9,        // family, friends, life
      'entertainment': 7,    // entertainment, fun, video
      'food': 6,             // food, cooking, recipe
      'travel': 5,           // travel, vacation, adventure
      'motivation': 5,       // motivation, inspiration
      'business': 4,         // business, work, career
      'general': 4,          // general, daily, life
      'creative': 3,         // creative, art, design
      'technology': 3,       // tech, digital, smart
      'news': 3,             // news, current, updates
      'engagement': 6        // share, like, comment
    },
    trendingBoost: 8,
    titleMatchWeight: 15,
    lengthPreference: 'medium',
    maxHashtags: 10,
    description: 'Optimized for Facebook\'s community and sharing algorithm with focus on lifestyle and social content'
  }
}

// Weekly trending data (simulated - in real implementation, this would be updated weekly)
export interface WeeklyTrendingData {
  [platform: string]: {
    [category: string]: string[]
  }
}

// Simulated weekly trending data based on research
export const weeklyTrendingData: WeeklyTrendingData = {
  tiktok: {
    'discovery': ['fyp', 'foryou', 'foryoupage', 'explore', 'discover'],
    'viral': ['viral', 'trending', 'blowingup', 'goinviral', 'explode'],
    'entertainment': ['dance', 'comedy', 'music', 'funny', 'hilarious'],
    'creative': ['art', 'creative', 'artwork', 'design', 'artist'],
    'lifestyle': ['fitness', 'fashion', 'food', 'travel', 'daily'],
    'trending': ['trending', 'hot', 'popular', 'billion', 'million'],
    'engagement': ['like', 'share', 'follow', 'save', 'comment'],
    'emotion': ['love', 'happy', 'funny', 'cute', 'amazing']
  },
  instagram: {
    'aesthetic': ['beautiful', 'pretty', 'gorgeous', 'stunning', 'lovely'],
    'lifestyle': ['fashion', 'travel', 'food', 'fitness', 'daily'],
    'creative': ['art', 'photography', 'design', 'creative', 'artist'],
    'engagement': ['like', 'share', 'follow', 'save', 'comment'],
    'emotion': ['love', 'happy', 'inspiration', 'motivation', 'blessed'],
    'beauty': ['makeup', 'skincare', 'beauty', 'glow', 'style'],
    'fashion': ['ootd', 'fashion', 'style', 'trendy', 'chic'],
    'travel': ['wanderlust', 'travel', 'explore', 'adventure', 'vacation']
  },
  youtube: {
    'educational': ['tutorial', 'howto', 'learn', 'study', 'education'],
    'entertainment': ['gaming', 'comedy', 'music', 'entertainment', 'funny'],
    'technology': ['tech', 'review', 'gadgets', 'technology', 'digital'],
    'information': ['info', 'facts', 'data', 'research', 'study'],
    'review': ['review', 'rating', 'feedback', 'opinion', 'analysis'],
    'lifestyle': ['vlog', 'daily', 'life', 'lifestyle', 'journey'],
    'business': ['business', 'finance', 'career', 'money', 'investment']
  },
  twitter: {
    'news': ['news', 'breaking', 'current', 'updates', 'report'],
    'trending': ['trending', 'viral', 'hot', 'popular', 'trendingnow'],
    'technology': ['tech', 'ai', 'innovation', 'startup', 'technology'],
    'business': ['business', 'startup', 'finance', 'economy', 'market'],
    'information': ['info', 'facts', 'data', 'research', 'analysis'],
    'engagement': ['discussion', 'debate', 'conversation', 'talk', 'chat']
  },
  facebook: {
    'community': ['community', 'together', 'family', 'friends', 'unity'],
    'lifestyle': ['family', 'friends', 'life', 'daily', 'home'],
    'entertainment': ['entertainment', 'fun', 'video', 'music', 'comedy'],
    'food': ['food', 'cooking', 'recipe', 'delicious', 'yummy'],
    'travel': ['travel', 'vacation', 'adventure', 'explore', 'journey'],
    'motivation': ['motivation', 'inspiration', 'positive', 'encourage', 'support'],
    'engagement': ['share', 'like', 'comment', 'post', 'update']
  }
}

// Custom tag selection algorithm
export class CustomTagAlgorithm {
  private algorithm: PlatformAlgorithm
  private platform: string
  private weeklyTrends: WeeklyTrendingData

  constructor(platform: string) {
    this.platform = platform
    this.algorithm = platformAlgorithms[platform]
    this.weeklyTrends = weeklyTrendingData
  }

  // Analyze title and extract keywords
  private analyzeTitle(title: string): string[] {
    const words = title.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .split(/\s+/) // Split by whitespace
      .filter(word => word.length > 2) // Filter short words
      .filter(word => !this.isStopWord(word)) // Remove stop words
    
    // Also extract common phrases
    const phrases = this.extractPhrases(title.toLowerCase())
    
    return [...words, ...phrases]
  }

  // Check if word is a stop word
  private isStopWord(word: string): boolean {
    const stopWords = [
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
      'after', 'above', 'below', 'between', 'among', 'under', 'over', 'this',
      'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'a', 'an',
      'as', 'if', 'then', 'else', 'when', 'where', 'why', 'how', 'what',
      'which', 'who', 'whom', 'whose', 'i', 'you', 'he', 'she', 'it', 'we',
      'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her',
      'its', 'our', 'their'
    ]
    return stopWords.includes(word)
  }

  // Extract common phrases from title
  private extractPhrases(title: string): string[] {
    const phrases: string[] = []
    
    // Common two-word phrases
    const commonPhrases = [
      'how to', 'step by', 'day in', 'life of', 'best of', 'top 10',
      'how to make', 'how to do', 'easy way', 'quick guide', 'full video',
      'part 1', 'part 2', 'episode 1', 'season 1', 'new video', 'latest video',
      'tutorial video', 'review video', 'funny video', 'amazing video', 'cool video'
    ]
    
    commonPhrases.forEach(phrase => {
      if (title.includes(phrase)) {
        phrases.push(phrase.replace(/\s+/g, ''))
      }
    })
    
    return phrases
  }

  // Calculate tag relevance score
  private calculateTagScore(tag: TagData, titleKeywords: string[]): number {
    let score = 0
    
    // Base popularity score
    score += tag.popularity * 0.3
    
    // Category weight based on platform algorithm
    const categoryWeight = this.algorithm.categoryWeights[tag.category] || 1
    score += categoryWeight * 10
    
    // Title matching
    const tagLower = tag.tag.toLowerCase()
    const hashtagLower = tag.tag.startsWith('#') ? tag.tag.substring(1).toLowerCase() : tagLower
    
    // Exact match
    if (titleKeywords.some(keyword => keyword === tagLower || keyword === hashtagLower)) {
      score += this.algorithm.titleMatchWeight
    }
    
    // Partial match
    if (titleKeywords.some(keyword => 
      tagLower.includes(keyword) || 
      hashtagLower.includes(keyword) ||
      keyword.includes(tagLower) ||
      keyword.includes(hashtagLower)
    )) {
      score += this.algorithm.titleMatchWeight * 0.5
    }
    
    // Weekly trending boost
    const platformTrends = this.weeklyTrends[this.platform]
    if (platformTrends[tag.category]?.includes(tagLower)) {
      score += this.algorithm.trendingBoost
    }
    
    // Platform-specific tag boost
    if (this.isPlatformSpecificTag(tag.tag)) {
      score += 5
    }
    
    // Length preference
    const tagLength = tag.tag.length
    if (this.algorithm.lengthPreference === 'short' && tagLength <= 8) {
      score += 3
    } else if (this.algorithm.lengthPreference === 'medium' && tagLength >= 8 && tagLength <= 15) {
      score += 3
    } else if (this.algorithm.lengthPreference === 'long' && tagLength >= 15) {
      score += 3
    }
    
    // Trending status boost
    if (tag.trending) {
      score += 8
    }
    
    return score
  }

  // Check if tag is platform-specific
  private isPlatformSpecificTag(tag: string): boolean {
    const platformSuffixes = {
      tiktok: ['tok', 'challenge', 'dance'],
      instagram: ['gram', 'daily', 'post'],
      youtube: ['tube', 'video', 'channel'],
      twitter: ['tweet', 'thread', 'x'],
      facebook: ['book', 'post', 'fb']
    }
    
    const suffixes = platformSuffixes[this.platform as keyof typeof platformSuffixes] || []
    return suffixes.some(suffix => tag.toLowerCase().endsWith(suffix))
  }

  // Select best tags
  public selectTags(allTags: TagData[], title: string, count: number): TagData[] {
    const titleKeywords = this.analyzeTitle(title)
    
    // Calculate scores for all tags
    const scoredTags = allTags.map(tag => ({
      tag,
      score: this.calculateTagScore(tag, titleKeywords)
    }))
    
    // Sort by score (descending)
    scoredTags.sort((a, b) => b.score - a.score)
    
    // Apply diversity selection to avoid too many tags from same category
    const selectedTags: TagData[] = []
    const categoryCounts: { [category: string]: number } = {}
    
    for (const { tag } of scoredTags) {
      if (selectedTags.length >= count) break
      
      // Limit tags per category (max 30% of total count)
      const maxPerCategory = Math.ceil(count * 0.3)
      const currentCategoryCount = categoryCounts[tag.category] || 0
      
      if (currentCategoryCount < maxPerCategory) {
        selectedTags.push(tag)
        categoryCounts[tag.category] = currentCategoryCount + 1
      }
    }
    
    // If we still need more tags, fill from remaining highest scored
    if (selectedTags.length < count) {
      const remainingTags = scoredTags
        .filter(({ tag }) => !selectedTags.includes(tag))
        .slice(0, count - selectedTags.length)
        .map(({ tag }) => tag)
      
      selectedTags.push(...remainingTags)
    }
    
    return selectedTags.slice(0, count)
  }

  // Get algorithm info
  public getAlgorithmInfo(): PlatformAlgorithm {
    return this.algorithm
  }
}

// Main function to generate tags using custom algorithm
export function generateTagsWithCustomAlgorithm(
  allTags: TagData[],
  title: string,
  platform: string,
  count: number
): TagData[] {
  const algorithm = new CustomTagAlgorithm(platform)
  return algorithm.selectTags(allTags, title, count)
}
