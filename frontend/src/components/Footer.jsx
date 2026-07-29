import { Link } from 'react-router-dom'
import { Gem, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="luxury-footer mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Gem size={24} className="text-gold" />
              <span className="footer-brand">Alpha Jewels</span>
            </div>
            <p className="footer-text">
              Timeless elegance crafted in gold and diamonds. Your trusted destination
              for premium jewellery collections.
            </p>
          </div>

          <div className="col-md-4">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="footer-heading">Contact</h6>
            <ul className="footer-contact list-unstyled">
              <li><Mail size={16} /> hello@alphajewels.com</li>
              <li><Phone size={16} /> +91 98765 43210</li>
              <li><MapPin size={16} /> Banglore, India</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom text-center">
          <p className="mb-0">&copy; {year} Alpha Jewels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
