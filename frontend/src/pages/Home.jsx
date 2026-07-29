import { Link } from 'react-router-dom'
import { Sparkles, Shield, Truck, Award, ArrowRight } from 'lucide-react'
import Button from '../components/Button'

const features = [
  { icon: Sparkles, title: 'Handcrafted Excellence', text: 'Every piece is meticulously crafted by master artisans.' },
  { icon: Shield, title: 'Certified Authenticity', text: 'BIS hallmarked gold and certified diamonds guaranteed.' },
  { icon: Truck, title: 'Insured Delivery', text: 'Secure, fully insured shipping to your doorstep.' },
  { icon: Award, title: 'Lifetime Service', text: 'Complimentary cleaning and maintenance for life.' },
]

const Home = () => {
  return (
    <div className="home-page bg-cream-soft">
      {/* Hero Section Banner - Huge, Luxury Aesthetic */}
      <section className="hero-section luxury-hero-fullscreen">
        <div className="hero-overlay" />
        <div className="container hero-content text-center text-md-start">
          <span className="hero-badge animate-fade-up">Exclusive Haute Joaillerie</span>
          <h1 className="hero-title animate-fade-up delay-1 font-serif">
            Discover Timeless <br />
            <span className="text-gold">Elegance & Gold</span>
          </h1>
          <p className="hero-subtitle animate-fade-up delay-2">
            Explore our curated catalog of diamond solitaire rings, heritage gold necklaces, and modern platinum bands. Crafted for moments that last forever.
          </p>
          <div className="animate-fade-up delay-3 mt-4">
            <Link to="/register" className="btn btn-gold btn-lg px-5 py-3 text-black fw-bold shadow-lg">
              Explore Our Collection <ArrowRight size={18} className="ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Large Featured Collections Grid (Attractive, Big Jewelry Images) */}
      <section className="section-padding py-5.5">
        <div className="container">
          <div className="text-center mb-5 mt-4">
            <span className="text-gold font-serif fs-5 fw-semibold letter-spacing-1">THE CATALOGUE</span>
            <h2 className="section-title fs-1 mt-2">Curated Collections</h2>
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
                  <Link to="/register" className="collection-link-arrow">
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
                  <Link to="/register" className="collection-link-arrow">
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
                  <Link to="/register" className="collection-link-arrow">
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
                  <Link to="/register" className="collection-link-arrow">
                    Discover Collection <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Alpha Section */}
      <section className="section-padding bg-black text-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title text-gold">Why Choose Alpha</h2>
            <p className="section-subtitle text-muted">Luxury you can trust, beauty you can wear</p>
          </div>

          <div className="row g-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div className="col-md-6 col-lg-3" key={title}>
                <div className="feature-card h-100 bg-luxury-dark border-gold-soft">
                  <div className="feature-icon">
                    <Icon size={28} />
                  </div>
                  <h5 className="text-white">{title}</h5>
                  <p className="text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Starting Call To Action */}
      <section className="cta-section section-padding text-center">
        <div className="container">
          <h2 className="section-title mb-3 font-serif">Begin Your Journey</h2>
          <p className="section-subtitle mb-4 text-muted">
            Join Alpha Jewels today and unlock exclusive collections, customization, and member benefits.
          </p>
          <Link to="/register">
            <Button variant="gold" className="px-5 py-3 text-black fw-bold">Get Started</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
