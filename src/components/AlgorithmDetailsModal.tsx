'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, CheckCircle, TrendingUp, Clock, Target, Zap, Eye } from 'lucide-react'
import { SocialMediaAlgorithm } from '@/lib/algorithmAnalyzer'

interface AlgorithmDetailsModalProps {
  algorithm: SocialMediaAlgorithm | null
  isOpen: boolean
  onClose: () => void
}

export default function AlgorithmDetailsModal({ algorithm, isOpen, onClose }: AlgorithmDetailsModalProps) {
  if (!algorithm || !isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center p-2"
              style={{ backgroundColor: `${algorithm.primaryColor}20` }}
            >
              <img 
                src={algorithm.logo} 
                alt={algorithm.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{algorithm.name}</h2>
              <Badge 
                className="text-xs mt-1"
                style={{ 
                  backgroundColor: algorithm.primaryColor,
                  color: '#ffffff'
                }}
              >
                Algorithm Analysis
              </Badge>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-gray-400 hover:text-white"
            size="sm"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Overview
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {algorithm.description}
            </p>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              How It Works
            </h3>
            <div className="space-y-3">
              {algorithm.howItWorks.map((point, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Best Setup */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Best Setup for Maximum Engagement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {algorithm.bestSetup.map((setup, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-purple-400 font-semibold">Setup Tip</span>
                  </div>
                  <p className="text-gray-300 text-sm">{setup}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips and Tricks */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Pro Tips & Tricks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {algorithm.tipsAndTricks.map((tip, index) => (
                <div key={index} className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-cyan-400 font-semibold">Expert Tip</span>
                  </div>
                  <p className="text-cyan-300 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis */}
          {algorithm.aiAnalysis && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                AI-Powered Insights
              </h3>
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-500/30">
                <p className="text-purple-300 leading-relaxed">
                  {algorithm.aiAnalysis}
                </p>
              </div>
            </div>
          )}

          {/* Weekly Insights */}
          {algorithm.weeklyInsights && algorithm.weeklyInsights.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                Latest Weekly Insights
              </h3>
              <div className="space-y-3">
                {algorithm.weeklyInsights.map((insight, index) => (
                  <div key={index} className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-green-400 font-semibold">Weekly Update</span>
                    </div>
                    <p className="text-green-300 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              Last updated: {new Date(algorithm.lastUpdated).toLocaleDateString()}
            </div>
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
