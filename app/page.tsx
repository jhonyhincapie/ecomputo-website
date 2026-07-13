import { CommerceHeroSection } from '@/components/home/CommerceHeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { TrustSection } from '@/components/home/TrustSection'
import { WhatsAppBanner } from '@/components/home/WhatsAppBanner'

export default function Home() {
  return (
    <>
      <CommerceHeroSection />
      <FeaturedProducts />
      <TrustSection />
      <WhatsAppBanner />
    </>
  )
}
