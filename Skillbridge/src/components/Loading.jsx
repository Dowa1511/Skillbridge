import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

const LoadingPage = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <LoadingSpinner size="xl" className="text-blue-600 mx-auto mb-4" />
        <p className="text-lg text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

const LoadingCard = ({ message = 'Loading...' }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <LoadingSpinner size="lg" className="text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

const LoadingButton = ({ loading, children, className = '', ...props }) => {
  return (
    <button
      disabled={loading}
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};

export { LoadingSpinner, LoadingPage, LoadingCard, LoadingButton };