import { AppBar} from '../components/AppBar'
import { FeatureCard } from '../components/FeatureCard'
import { FeaturesGrid } from '../components/FeaturesGrid'
import { HeroSection } from '../components/HeroSection'
import { GuideComp } from '../components/GuideComp'
import { FooterComp } from '../components/FooterComp'

export function LandingPage() {
  

  return (
    <>
     <div className='bg-gray-900'>
     
      
<AppBar/>
<HeroSection/>
<FeaturesGrid />
<GuideComp/>
<FooterComp/>
    </div>
    </>
  )
}

