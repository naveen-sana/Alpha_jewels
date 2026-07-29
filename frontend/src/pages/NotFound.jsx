import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import Button from '../components/Button'

const NotFound = () => {
  return (
    <div className="not-found-page section-padding">
      <div className="container text-center">
        <div className="not-found-content animate-fade-up">
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">Page Not Found</h2>
          <p className="not-found-text">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/">
            <Button variant="gold" icon={Home}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
