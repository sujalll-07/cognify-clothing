import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-black text-cognify-olive/20 tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-cognify-white mb-4">Page Not Found</h2>
      <p className="text-cognify-gray max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">Return to Home</Link>
    </div>
  );
}
