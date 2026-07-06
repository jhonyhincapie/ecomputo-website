import { HeroSection } from '@/components/home/HeroSection'
import { CategoriesGrid } from '@/components/home/CategoriesGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { TrustSection } from '@/components/home/TrustSection'
import { WhatsAppBanner } from '@/components/home/WhatsAppBanner'

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <FeaturedProducts />
      <TrustSection />
      <WhatsAppBanner />
    </>
  )
}
