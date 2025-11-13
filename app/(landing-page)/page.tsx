"use client"

import React, { useEffect } from 'react'
import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-ten'
import HowItWorksSection from '@/components/how-it-works'
import TestimonialsSection from '@/components/testimonials'
import FaqSection from '@/components/faqs-section-two'
import { ScrollArea } from '@/components/ui/scroll-area'
import CallToActionSection from '@/components/call-to-action-two'
import FooterSection from '@/components/footer-four'
import PricingSection from '@/components/pricing'

const LandingPage = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark')
    }
  }, [])


  return (
    <>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FaqSection />
        <CallToActionSection />
        <FooterSection />
    </>
  )
}

export default LandingPage