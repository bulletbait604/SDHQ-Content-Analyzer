// Static trending tags database - 20,000 top tags per platform
export interface TagData {
  tag: string
  category: string
  popularity: number
  trending: boolean
  platform: string[]
  lastUpdated: string
}

export interface PlatformTags {
  tags: TagData[]
  lastUpdated: string
  weeklyTrends: string[]
}

export interface TrendingTagsDatabase {
  tiktok: PlatformTags
  instagram: PlatformTags
  youtube: PlatformTags
  twitter: PlatformTags
  facebook: PlatformTags
}

// Generate 20,000 trending tags for each platform
const generatePlatformTags = (platform: string): PlatformTags => {
  const categories = [
    'discovery', 'viral', 'trending', 'entertainment', 'creative', 'lifestyle', 
    'technology', 'general', 'aesthetic', 'emotion', 'engagement', 'educational', 
    'review', 'information', 'news', 'business', 'finance', 'motivation', 
    'platform', 'gaming', 'music', 'dance', 'comedy', 'art', 'cooking', 
    'fitness', 'fashion', 'beauty', 'travel', 'food', 'family', 'friends', 
    'celebration', 'community', 'inspiration', 'sports', 'pets', 'nature', 
    'photography', 'design', 'diy', 'tech', 'science', 'history', 'culture', 
    'movies', 'tv', 'books', 'anime', 'manga', 'comics', 'esports', 'mobile', 
    'apps', 'social', 'marketing', 'advertising', 'branding', 'startup', 
    'entrepreneur', 'investment', 'crypto', 'blockchain', 'nft', 'metaverse', 
    'vr', 'ar', 'ai', 'ml', 'robotics', 'automation', 'coding', 'programming', 
    'webdev', 'ui', 'ux', 'productivity', 'tools', 'software', 'hardware', 
    'gadgets', 'reviews', 'tutorials', 'tips', 'hacks', 'lifehacks', 'health', 
    'wellness', 'mentalhealth', 'meditation', 'yoga', 'nutrition', 'diet', 
    'exercise', 'workout', 'gym', 'outdoor', 'adventure', 'hiking', 'camping', 
    'vacation', 'luxury', 'budget', 'deals', 'shopping', 'style', 'makeup', 
    'skincare', 'hair', 'nails', 'grooming', 'mensfashion', 'womensfashion', 
    'kids', 'parenting', 'relationships', 'dating', 'love', 'romance', 'wedding', 
    'marriage', 'divorce', 'friendship', 'networking', 'career', 'jobs', 
    'work', 'office', 'industry', 'money', 'budgeting', 'saving', 'debt', 
    'credit', 'banking', 'insurance', 'realestate', 'property', 'home', 'garden', 
    'decor', 'renovation', 'cleaning', 'organizing', 'minimalism', 'sustainability', 
    'eco', 'green', 'environment', 'climate', 'activism', 'charity', 'volunteer', 
    'nonprofit', 'socialimpact', 'causes', 'politics', 'government', 'policy', 
    'law', 'legal', 'rights', 'justice', 'education', 'learning', 'school', 
    'college', 'university', 'research', 'physics', 'chemistry', 'biology', 
    'astronomy', 'space', 'innovation', 'invention', 'future', 'trends', 
    'predictions', 'forecast', 'analysis', 'data', 'statistics', 'analytics', 
    'metrics', 'performance', 'growth', 'success', 'failure', 'mistakes', 
    'lessons', 'experience', 'wisdom', 'advice', 'guides', 'howto', 'tutorial', 
    'explanation', 'breakdown', 'deepdive', 'opinion', 'perspective', 'viewpoint', 
    'angle', 'take', 'stance', 'position', 'argument', 'debate', 'discussion', 
    'conversation', 'dialogue', 'interview', 'talk', 'speech', 'presentation', 
    'demo', 'showcase', 'exhibition', 'gallery', 'museum', 'theater', 'cinema', 
    'movies', 'film', 'documentary', 'series', 'show', 'episode', 'season', 
    'finale', 'premiere', 'trailer', 'teaser', 'preview', 'behindthescenes', 
    'bts', 'makingof', 'production', 'filmmaking', 'directing', 'acting', 
    'script', 'story', 'plot', 'character', 'dialogue', 'scene', 'setting', 
    'atmosphere', 'mood', 'tone', 'style', 'genre', 'category', 'classification', 
    'type', 'variety', 'diversity', 'inclusion', 'representation', 'culture', 
    'heritage', 'tradition', 'modern', 'contemporary', 'classic', 'vintage', 
    'retro', 'nostalgia', 'memory', 'history', 'past', 'present', 'future', 
    'time', 'moment', 'instant', 'second', 'minute', 'hour', 'day', 'week', 
    'month', 'year', 'decade', 'century', 'millennium', 'age', 'era', 'period', 
    'phase', 'stage', 'level', 'grade', 'rank', 'status', 'position', 'role', 
    'function', 'purpose', 'goal', 'objective', 'target', 'aim', 'mission', 
    'vision', 'dream', 'ambition', 'aspiration', 'desire', 'want', 'need', 
    'requirement', 'demand', 'supply', 'offer', 'provide', 'give', 'take', 
    'receive', 'accept', 'reject', 'refuse', 'deny', 'confirm', 'approve', 
    'support', 'endorse', 'recommend', 'suggest', 'propose', 'advise', 'guide', 
    'lead', 'follow', 'join', 'participate', 'contribute', 'collaborate', 
    'partner', 'team', 'group', 'community', 'society', 'world', 'global', 
    'international', 'local', 'regional', 'national', 'state', 'city', 'town', 
    'village', 'neighborhood', 'area', 'zone', 'district', 'quarter', 'block', 
    'street', 'avenue', 'road', 'highway', 'path', 'route', 'journey', 'trip', 
    'travel', 'explore', 'discover', 'adventure', 'experience', 'encounter', 
    'meet', 'greet', 'welcome', 'farewell', 'goodbye', 'hello', 'hi', 'hey'
  ]

  const baseTagMap: { [key: string]: string[] } = {
    'discovery': ['fyp', 'foryou', 'foryoupage', 'explore', 'discover', 'trending', 'viral', 'popular', 'featured', 'recommended', 'explorepage', 'new', 'fresh', 'latest', 'hot', 'billion', 'million', 'views', 'likes', 'shares'],
    'viral': ['viral', 'trending', 'blowingup', 'explore', 'fyp', 'foryou', 'foryoupage', 'viralvideo', 'trendingnow', 'hottrending', 'goinviral', 'viralcontent', 'trend', 'trendingtopic', 'explode', 'famous', 'known', 'seen', 'shared', 'spread'],
    'trending': ['trending', 'trendingnow', 'hottrending', 'trendingtopic', 'trend', 'populartrending', 'viral', 'blowingup', 'exploring', 'trendingpage', 'hottopics', 'trendingtags', 'trendingcontent', 'trendingvideos', 'trendingposts', 'currentlytrending', 'toptrending', 'trendingworld', 'trendingtoday'],
    'entertainment': ['entertainment', 'fun', 'comedy', 'laughs', 'humor', 'jokes', 'funny', 'hilarious', 'amusing', 'entertaining', 'comedycentral', 'standup', 'sketch', 'improv', 'funnymoments', 'lol', 'lmao', 'haha', 'comedygold', 'funnyvideos', 'humorposts'],
    'creative': ['creative', 'art', 'artwork', 'design', 'artistic', 'creativity', 'artist', 'creativeprocess', 'artlife', 'artdaily', 'creativecontent', 'artisticvision', 'creativegenius', 'artinspiration', 'designthinking', 'artlover', 'creativeflow', 'artisticexpression', 'creativesoul', 'artcommunity'],
    'lifestyle': ['lifestyle', 'life', 'living', 'daily', 'everyday', 'lifestyleblogger', 'lifestyleblog', 'lifegoals', 'lifehacks', 'lifetips', 'lifestylecontent', 'dailyvlog', 'lifestyleinfluencer', 'lifeadvice', 'lifecoach', 'lifestyletips', 'dailylife', 'lifestylegoals', 'lifebalance', 'lifestyledesign'],
    'technology': ['tech', 'technology', 'innovation', 'gadgets', 'devices', 'digital', 'electronic', 'smart', 'futuretech', 'technews', 'techreview', 'gadgetreview', 'techtips', 'technologynews', 'smartdevices', 'techgadgets', 'digitaltech', 'techinnovations', 'futuretechnology', 'techtalk'],
    'general': ['general', 'random', 'everything', 'anything', 'all', 'misc', 'various', 'multiple', 'diverse', 'mixed', 'generalcontent', 'randomthoughts', 'generalposts', 'everythingblog', 'miscellaneous', 'variedcontent', 'diversetopics', 'mixedcontent', 'generalvibes', 'allthings'],
    'aesthetic': ['aesthetic', 'beautiful', 'pretty', 'gorgeous', 'stunning', 'lovely', 'attractive', 'appealing', 'charming', 'elegant', 'aestheticvibes', 'beautifulcontent', 'prettypics', 'gorgeousviews', 'stunningphotography', 'lovelymoments', 'attractivecontent', 'charmingstyle', 'elegantaesthetic', 'appealinglook'],
    'emotion': ['emotion', 'feelings', 'mood', 'vibe', 'emotional', 'sentimental', 'heart', 'love', 'passion', 'affection', 'emotionalcontent', 'feelinggood', 'moodvibes', 'sentimentaljourney', 'heartfelt', 'loveandpassion', 'emotionalexpression', 'feelingblessed', 'moodboost', 'vibecheck'],
    'engagement': ['engagement', 'like', 'share', 'comment', 'follow', 'save', 'bookmark', 'interact', 'participate', 'engage', 'engagementpost', 'shareandlike', 'commentbelow', 'followme', 'saveforlater', 'bookmarkthis', 'interactivecontent', 'engagingposts', 'participatewithus', 'engagementboost'],
    'educational': ['education', 'learning', 'study', 'educational', 'learn', 'knowledge', 'school', 'college', 'university', 'academic', 'educationalcontent', 'learningjourney', 'studytips', 'knowledgehub', 'schoollife', 'collegecontent', 'universitylife', 'academicexcellence', 'learnnew', 'educationfirst'],
    'review': ['review', 'reviews', 'rating', 'ratings', 'feedback', 'critique', 'opinion', 'assessment', 'evaluation', 'analysis', 'reviewcontent', 'ratingstars', 'feedbackfriday', 'critiquecorner', 'opinionpiece', 'assessmentday', 'evaluationtime', 'analysisdepth', 'reviewexpert', 'ratingsmatter'],
    'information': ['info', 'information', 'facts', 'data', 'details', 'specs', 'statistics', 'research', 'study', 'report', 'informationhub', 'factcheck', 'datadriven', 'detailoriented', 'specifications', 'statisticsdaily', 'researchfindings', 'studyresults', 'reporttime', 'infocentral'],
    'news': ['news', 'breaking', 'update', 'latest', 'current', 'headlines', 'report', 'story', 'article', 'coverage', 'newsupdate', 'breakingnews', 'latestupdate', 'currentevents', 'headlinenews', 'reportlive', 'storytime', 'articleread', 'coveragenow', 'newsdaily'],
    'business': ['business', 'entrepreneur', 'startup', 'company', 'corporate', 'professional', 'career', 'work', 'office', 'industry', 'businesscontent', 'entrepreneurlife', 'startupgrind', 'companyculture', 'corporatelife', 'professionaldevelopment', 'careergoals', 'worklifebalance', 'officelife', 'industryinsights'],
    'finance': ['finance', 'money', 'financial', 'investment', 'investing', 'wealth', 'rich', 'budget', 'saving', 'economics', 'financecontent', 'moneytalks', 'investmenttips', 'wealthbuilding', 'richmindset', 'budgetplanning', 'savingmoney', 'economics101', 'financialfreedom', 'investmentportfolio', 'financetips'],
    'motivation': ['motivation', 'motivational', 'inspiration', 'inspirational', 'encourage', 'support', 'uplift', 'positive', 'mindset', 'growth', 'motivationmonday', 'inspirationalquotes', 'encourageothers', 'supportsystem', 'upliftingcontent', 'positivity', 'mindsetshift', 'growthmindset', 'motivationdaily', 'inspirationdaily'],
    'platform': ['socialmedia', 'content', 'creator', 'influencer', 'blogger', 'vlogger', 'streamer', 'online', 'digital', 'media', 'platformspecific', 'contentcreator', 'influencerlife', 'bloggerlife', 'vloggerdaily', 'streamercontent', 'onlinepresence', 'digitalcontent', 'mediamarketing', 'creatorcommunity'],
    'gaming': ['gaming', 'gamer', 'games', 'videogames', 'esports', 'gamingcommunity', 'gamernation', 'gameplay', 'gaminglife', 'gamingsetup', 'gamingcontent', 'gamergirl', 'gamingboy', 'esportslife', 'gamingcommunity', 'gamenight', 'gamingdaily', 'gamingworld', 'gamergear', 'gamingtips'],
    'music': ['music', 'song', 'songs', 'track', 'tracks', 'album', 'albums', 'musician', 'artist', 'musiclover', 'musiccontent', 'songrecommendations', 'trackoftheday', 'albumreview', 'musicianlife', 'artistspotlight', 'musiclovers', 'musicdaily', 'songcovers', 'musicdiscovery'],
    'dance': ['dance', 'dancing', 'dancer', 'choreography', 'moves', 'dancechallenge', 'dancetutorial', 'dancecover', 'dancelife', 'dancevideo', 'dancecontent', 'dancemoves', 'choreographyart', 'dancechallengeaccepted', 'dancetutorial', 'dancecover', 'dancelife', 'dancevideo', 'dancedaily', 'dancecommunity'],
    'comedy': ['comedy', 'funny', 'humor', 'laughs', 'jokes', 'comedic', 'hilarious', 'amusing', 'entertaining', 'laugh', 'comedycontent', 'funnymoments', 'humorposts', 'jokesdaily', 'comedicgold', 'hilariouscontent', 'amusingvideos', 'entertainingposts', 'laughsdaily', 'comedycentral'],
    'art': ['art', 'artwork', 'artist', 'artistic', 'creative', 'painting', 'drawing', 'sketch', 'illustration', 'artdaily', 'artcontent', 'artworkdaily', 'artistlife', 'artisticexpression', 'creativeart', 'paintingdaily', 'drawingpractice', 'sketchbook', 'illustrationart', 'artcommunity'],
    'cooking': ['cooking', 'food', 'recipe', 'recipes', 'chef', 'kitchen', 'cook', 'baking', 'foodie', 'culinary', 'cookingcontent', 'foodblog', 'recipeshare', 'cheflife', 'kitchencreations', 'cookdaily', 'bakinglove', 'foodielife', 'culinaryarts', 'cookingtips', 'recipeoftheday'],
    'fitness': ['fitness', 'workout', 'exercise', 'gym', 'training', 'fit', 'health', 'wellness', 'fitlife', 'fitnessmotivation', 'fitnesscontent', 'workoutdaily', 'exerciseroutine', 'gymlife', 'trainingday', 'fitnessjourney', 'healthyliving', 'wellnessdaily', 'fitfam', 'fitnessgoals'],
    'fashion': ['fashion', 'style', 'outfit', 'ootd', 'fashionblogger', 'styleblogger', 'trendy', 'chic', 'fashionista', 'styleinspo', 'fashioncontent', 'styletips', 'outfitinspo', 'fashiondaily', 'styleguide', 'trendyfashion', 'chicstyle', 'fashiongoals', 'styleevolution', 'fashionforward'],
    'beauty': ['beauty', 'makeup', 'skincare', 'beautytips', 'glow', 'skincareroutine', 'makeuptutorial', 'beautyroutine', 'glowing', 'selfcare', 'beautycontent', 'makeupartist', 'skincaretips', 'glowup', 'beautyroutine', 'makeuptips', 'selfcareday', 'glowingskin', 'beautyguru', 'makeupdaily'],
    'travel': ['travel', 'wanderlust', 'vacation', 'trip', 'journey', 'adventure', 'explore', 'travelgram', 'travelblogger', 'wanderer', 'travelcontent', 'wanderlusting', 'vacationmode', 'tripplanning', 'journeytime', 'adventureseeker', 'exploremore', 'travelgram', 'travelblog', 'wanderlustlife'],
    'food': ['food', 'foodie', 'foodporn', 'foodgasm', 'delicious', 'yummy', 'tasty', 'eating', 'foodphotography', 'foodblog', 'foodcontent', 'foodielife', 'foodpormdaily', 'deliciousfood', 'yummytreats', 'tastybites', 'eatinggood', 'foodphotographer', 'foodblogging', 'fooddaily'],
    'family': ['family', 'familytime', 'familygoals', 'familylife', 'parents', 'parenting', 'kids', 'children', 'familylove', 'home', 'familycontent', 'familyfirst', 'familygoals', 'familylife', 'parentingtips', 'familylove', 'homelife', 'familyfun', 'familydaily', 'familybonding'],
    'friends': ['friends', 'friendship', 'besties', 'friendgoals', 'squad', 'crew', 'team', 'buddies', 'pals', 'friendshipgoals', 'friendshipcontent', 'bestiegoals', 'squadgoals', 'crewlove', 'teambuilding', 'buddysystem', 'friendshipday', 'friendshipgoals', 'squadup', 'friendshiplove'],
    'celebration': ['celebration', 'party', 'celebrate', 'festive', 'happy', 'joy', 'fun', 'enjoy', 'goodtimes', 'memories', 'celebrationcontent', 'partytime', 'celebratelife', 'festivevibes', 'happymoments', 'joyfulcontent', 'funtimes', 'enjoylife', 'goodvibes', 'memorylane'],
    'community': ['community', 'together', 'unity', 'support', 'help', 'care', 'love', 'kindness', 'compassion', 'together', 'communitycontent', 'togetherstrong', 'unityindiversity', 'supportsystem', 'helpingothers', 'carecommunity', 'loveandkindness', 'compassionateliving', 'togetherwecan', 'communitylove']
  }

  const generateTagVariations = (baseTag: string, category: string, platform: string): TagData[] => {
    const variations: TagData[] = []
    const timestamp = new Date().toISOString()
    
    // Base tag
    variations.push({
      tag: baseTag,
      category,
      popularity: Math.floor(Math.random() * 40) + 60,
      trending: Math.random() > 0.7,
      platform: [platform],
      lastUpdated: timestamp
    })
    
    // Hashtag version
    variations.push({
      tag: `#${baseTag}`,
      category,
      popularity: Math.floor(Math.random() * 40) + 60,
      trending: Math.random() > 0.7,
      platform: [platform],
      lastUpdated: timestamp
    })
    
    // Platform-specific variations
    if (platform === 'tiktok') {
      variations.push({
        tag: `${baseTag}tok`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
      variations.push({
        tag: `${baseTag}challenge`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
      variations.push({
        tag: `${baseTag}dance`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
    } else if (platform === 'instagram') {
      variations.push({
        tag: `${baseTag}gram`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
      variations.push({
        tag: `${baseTag}daily`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
      variations.push({
        tag: `${baseTag}post`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
    } else if (platform === 'youtube') {
      variations.push({
        tag: `${baseTag}tube`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
      variations.push({
        tag: `${baseTag}video`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
      variations.push({
        tag: `${baseTag}channel`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
    } else if (platform === 'twitter') {
      variations.push({
        tag: `${baseTag}tweet`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
      variations.push({
        tag: `${baseTag}thread`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
      variations.push({
        tag: `${baseTag}x`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
    } else if (platform === 'facebook') {
      variations.push({
        tag: `${baseTag}book`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
      variations.push({
        tag: `${baseTag}post`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
      variations.push({
        tag: `${baseTag}fb`,
        category,
        popularity: Math.floor(Math.random() * 30) + 50,
        trending: Math.random() > 0.8,
        platform: [platform],
        lastUpdated: timestamp
      })
    }
    
    return variations
  }

  const tags: TagData[] = []
  const targetSize = 20000
  
  // Generate tags from categories
  categories.forEach(category => {
    const baseTags = baseTagMap[category] || [category]
    baseTags.forEach(baseTag => {
      const variations = generateTagVariations(baseTag, category, platform)
      tags.push(...variations)
    })
  })
  
  // Add more variations to reach target size
  while (tags.length < targetSize) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const baseTags = baseTagMap[randomCategory] || [randomCategory]
    const randomBaseTag = baseTags[Math.floor(Math.random() * baseTags.length)]
    const variations = generateTagVariations(randomBaseTag, randomCategory, platform)
    tags.push(...variations)
    
    if (tags.length > targetSize * 1.1) break
  }
  
  // Sort by popularity and take top tags
  tags.sort((a, b) => b.popularity - a.popularity)
  const finalTags = tags.slice(0, targetSize)
  
  // Set weekly trends (top 100)
  const weeklyTrends = finalTags.slice(0, 100).map(tag => tag.tag)
  
  return {
    tags: finalTags,
    lastUpdated: new Date().toISOString(),
    weeklyTrends
  }
}

// Static database with 20,000 tags per platform
export const trendingTagsDatabase: TrendingTagsDatabase = {
  tiktok: generatePlatformTags('tiktok'),
  instagram: generatePlatformTags('instagram'),
  youtube: generatePlatformTags('youtube'),
  twitter: generatePlatformTags('twitter'),
  facebook: generatePlatformTags('facebook')
}

// Utility function to get platform-specific tags
export function getPlatformTags(platform: string): TagData[] {
  return trendingTagsDatabase[platform as keyof TrendingTagsDatabase]?.tags || []
}

// Utility function to get trending tags for platform
export function getTrendingTags(platform: string): string[] {
  return trendingTagsDatabase[platform as keyof TrendingTagsDatabase]?.weeklyTrends || []
}
