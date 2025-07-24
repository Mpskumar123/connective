import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Loader2, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    { test: /.{8,}/, text: 'At least 8 characters' },
    { test: /[A-Z]/, text: 'One uppercase letter' },
    { test: /[a-z]/, text: 'One lowercase letter' },
    { test: /\d/, text: 'One number' },
    { test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, text: 'One special character' },
  ];

  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
      <div className="space-y-1">
        {requirements.map((req, index) => {
          const meets = req.test.test(password);
          return (
            <div key={index} className={`flex items-center text-xs ${meets ? 'text-green-600' : 'text-gray-400'}`}>
              {meets ? <CheckCircle className="w-3 h-3 mr-2" /> : <XCircle className="w-3 h-3 mr-2" />}
              {req.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PasswordField = ({ label, name, value, error, showPassword, toggleShowPassword, onChange, onBlur, placeholder }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 pl-12 pr-12 rounded-lg border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
        } focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500`}
        placeholder={placeholder}
      />
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    {error && (
      <p className="mt-2 text-sm text-red-600">{error}</p>
    )}
  </div>
);

const PasswordResetForm = () => {
  const { token } = useParams(); // Get token from URL parameters
  const navigate = useNavigate(); // For navigation
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Token verification states
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Mock backend URL - replace with your actual backend URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    // Only verify token if it exists
    if (token) {
      verifyResetToken();
    } else {
      setTokenValid(false);
      setErrors({ token: 'No reset token provided' });
      setIsVerifying(false);
    }
  }, [token]);

  const verifyResetToken = async () => {
    setIsVerifying(true);
    try {
      // Mock API call - replace with actual endpoint
      const response = await fetch(`${BACKEND_URL}/api/users/verify-reset-token/${token}`);
      const data = await response.json();
      
      if (response.ok && data.valid) {
        setTokenValid(true);
        setUserEmail(data.email || 'user@example.com');
      } else {
        setTokenValid(false);
        setErrors({ token: data.message || 'Invalid or expired token' });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setTokenValid(false);
      setErrors({ token: 'Error verifying reset token. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must meet all requirements';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetSuccess(true);
      } else {
        setErrors({ submit: data.message || 'Password reset failed. Please try again.' });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Loading state during token verification
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Reset Link</h2>
          <p className="text-gray-600">Please wait while we verify your password reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            {errors.token || 'This password reset link is invalid or has expired. Please request a new one.'}
          </p>
          <button
            onClick={handleBackToLogin}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You can now login with your new password.
          </p>
          <button
            onClick={handleBackToLogin}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  // Password reset form
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Reset Your Password
          </h2>
          <p className="text-gray-600">Enter your new password for</p>
          <p className="text-indigo-600 font-medium">{userEmail}</p>
        </div>

        <div className="space-y-6">
          <PasswordField
            label="New Password"
            name="password"
            value={formData.password}
            error={errors.password}
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
            onChange={handleInputChange}
            placeholder="Enter your new password"
          />

          {formData.password && (
            <PasswordStrengthIndicator password={formData.password} />
          )}

          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            showPassword={showConfirmPassword}
            toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            onChange={handleInputChange}
            placeholder="Confirm your new password"
          />

          {errors.submit && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors text-sm flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;