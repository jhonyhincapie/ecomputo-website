import { HeroSection } from '@/components/home/HeroSection'
import { CategoriesGrid } from '@/components/home/CategoriesGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { WhatsAppBanner } from '@/components/home/WhatsAppBanner'

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <FeaturedProducts />
      <WhatsAppBanner />
    </>
  )
}
