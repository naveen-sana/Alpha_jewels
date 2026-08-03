import { Link } from 'react-router-dom'
import { Home, Package } from 'lucide-react'
import Button from '../components/Button'

const NotFound = () => {
  return (
    <div className="not-found-page section-padding py-5">
      <div className="container text-center">
        <div className="not-found-content animate-fade-up">
          <h1 className="not-found-code display-1 fw-bold text-gold">404</h1>
          <h2 className="not-found-title display-6 fw-bold mb-3">Page Not Found</h2>
          <p className="not-found-text text-muted mb-4">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/">
              <Button variant="gold" icon={Home}>
                Back to Home
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline-gold" icon={Package}>
                View Order History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
