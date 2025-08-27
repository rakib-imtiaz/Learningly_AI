'use client'

import { useState } from 'react'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Toaster } from 'sonner'
import { FadeContent } from '@/components/react-bits/fade-content'
import { SlideIn } from '@/components/react-bits/slide-in'
import ShinyText from '@/components/react-bits/shiny-text'
import { BookOpen, Brain, Sparkles, Shield, Users, Zap } from 'lucide-react'
import { SignInCard, SignUpCard } from '@/components/auth'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('signin')

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Transform any content into interactive study materials with advanced AI"
    },
    {
      icon: BookOpen,
      title: "Smart Document Analysis",
      description: "Upload PDFs, videos, and get instant summaries and insights"
    },
    {
      icon: Sparkles,
      title: "Personalized Experience",
      description: "Adaptive learning paths tailored specifically to your needs"
    }
  ]

  const trustIndicators = [
    { icon: Shield, label: "Secure & Private", color: "text-green-600" },
    { icon: Users, label: "50k+ Users", color: "text-blue-600" },
    { icon: Zap, label: "Fast Setup", color: "text-yellow-600" }
  ]

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden">
        <div className="w-full max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center min-h-[calc(100vh-8rem)]">
            
            {/* Left Panel - Brand & Features */}
            <div className="order-2 lg:order-1 space-y-6 lg:space-y-8 xl:space-y-12">
              <FadeContent delay={0.1}>
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <ShinyText 
                      text="Learningly AI" 
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900"
                      speed={4}
                    />
                  </div>
                  
                  <div className="space-y-3 lg:space-y-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                      Transform Your Learning
                      <br />
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        with AI
                      </span>
                    </h1>
                    
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-none lg:max-w-lg">
                      Join thousands of learners who are accelerating their education with our AI-powered platform.
                    </p>
                  </div>
                </div>
              </FadeContent>

              {/* Features */}
              <div className="space-y-4 lg:space-y-6">
                {features.map((feature, index) => (
                  <SlideIn key={index} direction="left" delay={0.2 + index * 0.1}>
                    <div className="flex items-start gap-3 lg:gap-4 group">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0">
                        <feature.icon className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-base lg:text-lg">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{feature.description}</p>
                      </div>
                    </div>
                  </SlideIn>
                ))}
              </div>

              {/* Trust Indicators */}
              <SlideIn direction="left" delay={0.6}>
                <div className="pt-4 lg:pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-4 lg:gap-6">
                    {trustIndicators.map((indicator, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <indicator.icon className={`h-4 w-4 lg:h-5 lg:w-5 ${indicator.color}`} />
                        <span className="text-xs lg:text-sm font-medium text-gray-700">{indicator.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SlideIn>
            </div>

            {/* Right Panel - Auth Forms */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm lg:max-w-md">
                <SlideIn direction="right" delay={0.1}>
                  <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100 p-6 lg:p-8 space-y-4 lg:space-y-6">
                    
                    {/* Tab Switcher */}
                    <div className="text-center space-y-3 lg:space-y-4">
                      <div className="flex bg-gray-100 rounded-2xl p-1">
                        <button
                          onClick={() => setActiveTab('signin')}
                          className={`flex-1 py-2.5 lg:py-3 px-4 lg:px-6 rounded-xl font-medium transition-all duration-200 text-sm lg:text-base ${
                            activeTab === 'signin'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => setActiveTab('signup')}
                          className={`flex-1 py-2.5 lg:py-3 px-4 lg:px-6 rounded-xl font-medium transition-all duration-200 text-sm lg:text-base ${
                            activeTab === 'signup'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>

                    {/* Auth Forms */}
                    <div className="relative">
                      {activeTab === 'signin' && (
                        <FadeContent delay={0.1}>
                          <SignInCard onSwitchToSignUp={() => setActiveTab('signup')} />
                        </FadeContent>
                      )}
                      
                      {activeTab === 'signup' && (
                        <FadeContent delay={0.1}>
                          <SignUpCard onSwitchToSignIn={() => setActiveTab('signin')} />
                        </FadeContent>
                      )}
                    </div>
                  </div>
                </SlideIn>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </AuthProvider>
  )
}
