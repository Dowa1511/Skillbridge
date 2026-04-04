import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { LoadingButton } from '../components/Loading';

function ForgotPassword() {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Mock API call - in real app, call backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success
      setEmailSent(true);
      success('Password reset link sent to your email!');
    } catch (err) {
      error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-12">
            {!emailSent ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-gray-600">
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <LoadingButton
                    loading={loading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Send Reset Link
                  </LoadingButton>
                </form>

                <div className="mt-8 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-8">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Click the link in the email to reset your password.
                </p>

                <div className="bg-blue-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-blue-900 mb-2">Didn't receive the email?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• Make sure the email address is correct</li>
                    <li>• Wait a few minutes and try again</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setEmailSent(false)}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                  >
                    Send Another Email
                  </button>

                  <Link
                    to="/login"
                    className="inline-block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;