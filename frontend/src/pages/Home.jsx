import { Link } from 'react-router-dom'
import { Sparkles, Shield, Truck, Award, ArrowRight, Eye } from 'lucide-react'
import Button from '../components/Button'
import JewelryMotionReel from '../components/JewelryMotionReel'
import LuxuryJewelryHero from '../components/LuxuryJewelryHero'

const features = [
  { icon: Sparkles, title: 'Handcrafted Excellence', text: 'Every piece is meticulously crafted by master artisans.' },
  { icon: Shield, title: 'Certified Authenticity', text: 'BIS hallmarked gold and certified diamonds guaranteed.' },
  { icon: Truck, title: 'Insured Delivery', text: 'Secure, fully insured shipping to your doorstep.' },
  { icon: Award, title: 'Lifetime Service', text: 'Complimentary cleaning and maintenance for life.' },
]

const Home = () => {
  return (
    <div className="home-page bg-cream-soft">
      {/* Top Hero Section: Luxury Model Gold Necklace Background Banner */}
      <LuxuryJewelryHero />


      {/* Interactive Slow-Motion Jewelry Motion Reel Section */}
      <section className="jewelry-video-section py-5">
        <div className="container py-4">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill border border-gold bg-white shadow-sm mb-2">
              <Eye size={16} className="text-gold-dark" />
              <span className="text-gold-dark text-uppercase tracking-widest small fw-bold">4K Ultra HD Craftsmanship</span>
            </div>
            <h2 className="display-4 font-serif text-black mb-2">
              Jewelry Craftsmanship in <span className="text-gold-dark font-italic">Slow Motion</span>
            </h2>
            <p className="text-muted max-width-md mx-auto fs-5" style={{ maxWidth: '680px' }}>
              Control slow motion playback speed (0.25x - 1.0x) and experience the sparkling fire of solitaire diamonds and pure 22K gold.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <JewelryMotionReel />
            </div>
          </div>
        </div>
      </section>

      {/* Large Featured Collections Grid (Attractive, Big Jewelry Images) */}
      <section className="section-padding py-5.5">
        <div className="container">
          <div className="text-center mb-5 mt-4">
            <span className="text-gold-dark font-serif fs-5 fw-semibold letter-spacing-1">THE CATALOGUE</span>
            <h2 className="section-title fs-1 mt-2 text-black">Curated Collections</h2>
            <p className="section-subtitle text-muted max-width-md mx-auto">
              Explore our four iconic categories, each defined by unparalleled craftsmanship and precious materials.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Diamond Collection */}
            <div className="col-md-6 col-lg-6">
              <div className="collection-luxury-banner">
                <img 
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200" 
                  alt="Diamond Collection" 
                  className="collection-banner-img"
                />
                <div className="collection-banner-overlay" />
                <div className="collection-banner-content">
                  <span className="collection-meta">Solitaires & Rings</span>
                  <h3 className="collection-title">The Diamond Suite</h3>
                  <p className="collection-desc">Dazzling diamonds selected for maximum fire, clarity, and brilliance.</p>
                  <Link to="/shop?category=Diamond" className="collection-link-arrow">
                    Discover Collection <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Gold Collection */}
            <div className="col-md-6 col-lg-6">
              <div className="collection-luxury-banner">
                <img 
                  src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200" 
                  alt="Gold Collection" 
                  className="collection-banner-img"
                />
                <div className="collection-banner-overlay" />
                <div className="collection-banner-content">
                  <span className="collection-meta">22K Heritage Artistry</span>
                  <h3 className="collection-title">Royal Gold</h3>
                  <p className="collection-desc">Pure gold crafted with heritage-rich filigree, temples, and antique finishes.</p>
                  <Link to="/shop?category=Gold" className="collection-link-arrow">
                    Discover Collection <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Platinum Collection */}
            <div className="col-md-6 col-lg-6">
              <div className="collection-luxury-banner">
                <img 
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200" 
                  alt="Platinum Collection" 
                  className="collection-banner-img"
                />
                <div className="collection-banner-overlay" />
                <div className="collection-banner-content">
                  <span className="collection-meta">Contemporary & Rare</span>
                  <h3 className="collection-title">Platinum Class</h3>
                  <p className="collection-desc">Modern, understated elegance designed for daily luxury and eternal bonds.</p>
                  <Link to="/shop?category=Platinum" className="collection-link-arrow">
                    Discover Collection <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Silver Collection */}
            <div className="col-md-6 col-lg-6">
              <div className="collection-luxury-banner">
                <img 
                  src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200" 
                  alt="Silver Collection" 
                  className="collection-banner-img"
                />
                <div className="collection-banner-overlay" />
                <div className="collection-banner-content">
                  <span className="collection-meta">Sterling Craft</span>
                  <h3 className="collection-title">Fine Silver</h3>
                  <p className="collection-desc">Delicate, hand-finished silver pieces capturing clean light and charm.</p>
                  <Link to="/shop?category=Silver" className="collection-link-arrow">
                    Discover Collection <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Alpha Section (Light Champagne Theme) */}
      <section className="section-padding bg-cream-soft border-top border-bottom border-gold-soft text-black">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title text-gold-dark">Why Choose Alpha</h2>
            <p className="section-subtitle text-muted">Luxury you can trust, beauty you can wear</p>
          </div>

          <div className="row g-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div className="col-md-6 col-lg-3" key={title}>
                <div className="feature-card h-100 bg-white border-gold-soft shadow-sm rounded-4 p-4 text-center">
                  <div className="feature-icon mb-3 p-3 bg-cream rounded-circle d-inline-block">
                    <Icon size={28} className="text-gold-dark" />
                  </div>
                  <h5 className="text-black fw-bold font-serif mb-2">{title}</h5>
                  <p className="text-muted small mb-0">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Starting Call To Action */}
      <section className="cta-section section-padding text-center bg-white">
        <div className="container">
          <h2 className="section-title mb-3 font-serif text-black">Begin Your Journey</h2>
          <p className="section-subtitle mb-4 text-muted">
            Join Alpha Jewels today and unlock exclusive collections, customization, and member benefits.
          </p>
          <Link to="/shop">
            <Button variant="gold" className="px-5 py-3 text-black fw-bold">Get Started</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
