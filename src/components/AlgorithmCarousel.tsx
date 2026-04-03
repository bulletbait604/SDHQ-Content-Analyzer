'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Zap, Eye, Heart, Share2, MessageCircle } from 'lucide-react'
import { SocialMediaAlgorithm } from '@/lib/algorithmAnalyzer'

interface AlgorithmCarouselProps {
  algorithms: SocialMediaAlgorithm[]
  onSelectAlgorithm: (algorithm: SocialMediaAlgorithm) => void
}

export default function AlgorithmCarousel({ algorithms, onSelectAlgorithm }: AlgorithmCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false) // Disabled by default

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % algorithms.length)
    }, 5000) // Auto-advance every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, algorithms.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + algorithms.length) % algorithms.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % algorithms.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const currentAlgorithm = algorithms[currentIndex]

  if (!currentAlgorithm) return null

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {algorithms.map((algorithm, index) => (
            <div key={algorithm.id} className="w-full flex-shrink-0 px-4">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-8 border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center p-3"
                      style={{ 
                        background: `linear-gradient(135deg, ${algorithm.primaryColor}20, ${algorithm.secondaryColor}20)`,
                        border: `2px solid ${algorithm.primaryColor}`
                      }}
                    >
                      <img 
                        src={algorithm.logo} 
                        alt={algorithm.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='white'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='8'%3E${algorithm.name.charAt(0)}%3C/text%3E%3C/svg%3E`
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">{algorithm.name}</h3>
                      <div className="text-sm text-gray-400 mb-2">
                        Algorithm Type: {algorithm.platform === 'tiktok' ? 'For You Page' : 
                                       algorithm.platform === 'instagram' ? 'Feed & Stories' :
                                       algorithm.platform === 'youtube-shorts' ? 'Shorts Shelf' :
                                       algorithm.platform === 'youtube-16-9' ? 'Recommendation Engine' :
                                       algorithm.platform === 'facebook-reels' ? 'Reels Feed' :
                                       algorithm.platform === 'twitter' ? 'Timeline' : 'Smart Feed'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last Updated: {new Date(algorithm.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      Updated {new Date(algorithm.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Algorithm Overview */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-600">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    How It Works
                  </h4>
                  <div className="space-y-2">
                    {algorithm.howItWorks.slice(0, 3).map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {algorithm.description}
                </p>

                {/* Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {algorithm.tipsAndTricks.slice(0, 4).map((tip, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => onSelectAlgorithm(algorithm)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View All Tips
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Analysis
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <Button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black/90 text-white rounded-full p-2 backdrop-blur-sm border border-gray-600"
        size="sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black/90 text-white rounded-full p-2 backdrop-blur-sm border border-gray-600"
        size="sm"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Auto-play Toggle */}
      <Button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute bottom-4 right-4 bg-black/80 hover:bg-black/90 text-white rounded-full px-3 py-1 text-xs backdrop-blur-sm border border-gray-600"
        size="sm"
      >
        {isAutoPlaying ? 'Pause' : 'Play'}
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {algorithms.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
