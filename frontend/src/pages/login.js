import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import './login.css';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  initial: { scale: 1 },
};

const FormField = memo(({ label, name, type, value, error, touched, icon: Icon, onChange, onBlur, toggleVisibility, showPassword }) => (
  <div className="relative mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <input
        type={name === 'password' && showPassword ? 'text' : type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 pl-10 ${
          name === 'password' ? 'pr-10' : ''
        } rounded-lg border ${error && touched ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2 focus:border-transparent transition-all duration-200`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      
      {name === 'password' && (
        <button 
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
    <AnimatePresence>
      {error && touched && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center mt-1"
        >
          <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    { test: /.{8,}/, text: 'At least 8 characters' },
    { test: /[A-Z]/, text: 'One uppercase letter' },
    { test: /[a-z]/, text: 'One lowercase letter' },
    { test: /\d/, text: 'One number' },
    { test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, text: 'One special character' },
  ];

  return (
    <div className="mt-2 space-y-1">
      {requirements.map((req, index) => {
        const meets = req.test.test(password);
        return (
          <div key={index} className={`flex items-center text-xs ${meets ? 'text-green-600' : 'text-gray-400'}`}>
            {meets ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
            {req.text}
          </div>
        );
      })}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [currentView, setCurrentView] = useState('login'); // login, forgot, reset
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    if (token) {
      setCurrentView('reset');
      verifyResetToken(token);
    }
  }, [token]);

  const verifyResetToken = async (resetToken) => {
    setIsVerifying(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/verify-reset-token/${resetToken}`);
      const data = await response.json();
      
      if (response.ok && data.valid) {
        setTokenValid(true);
        setUserEmail(data.email);
      } else {
        setTokenValid(false);
        setErrors({ token: data.message || 'Invalid or expired reset token' });
        toast.error(data.message || 'Invalid or expired reset token');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setTokenValid(false);
      setErrors({ token: 'Error verifying reset token. Please try again.' });
      toast.error('Error verifying reset token. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleNewPasswordVisibility = useCallback(() => {
    setShowNewPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const validateField = useCallback(
    (name) => {
      const newErrors = { ...errors };
      switch (name) {
        case 'email':
          if (!formData.email) newErrors.email = 'Email is required';
          else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
          else delete newErrors.email;
          break;
        case 'password':
          if (!formData.password) newErrors.password = 'Password is required';
          else delete newErrors.password;
          break;
        case 'newPassword':
          if (!formData.newPassword) {
            newErrors.newPassword = 'Password is required';
          } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must meet all requirements';
          } else {
            delete newErrors.newPassword;
          }
          break;
        case 'confirmPassword':
          if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
          } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          } else {
            delete newErrors.confirmPassword;
          }
          break;
        default:
          break;
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData, errors]
  );

  useEffect(() => {
    Object.keys(touched).forEach((field) => {
      if (touched[field]) {
        validateField(field);
      }
    });
  }, [formData, validateField, touched]);

  const validateLoginForm = useCallback(() => {
    const fieldsToValidate = ['email', 'password'];
    let isValid = true;
    fieldsToValidate.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });
    return isValid;
  }, [validateField]);

  const validateResetForm = useCallback(() => {
    const fieldsToValidate = ['newPassword', 'confirmPassword'];
    let isValid = true;
    fieldsToValidate.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });
    return isValid;
  }, [validateField]);

  const loginUser = async (userData) => {
    const response = await fetch(`${BACKEND_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
  };

  const sendForgotPasswordRequest = async (email) => {
    const response = await fetch(`${BACKEND_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send reset email');
    }

    return await response.json();
  };

  const resetPassword = async (passwordData) => {
    const response = await fetch(`${BACKEND_URL}/api/users/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Password reset failed');
    }

    return await response.json();
  };

  const handleLoginSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateLoginForm()) {
        toast.error('Please fix the errors in the form');
        return;
      }

      setIsLoading(true);
      try {
        const response = await loginUser(formData);

        if (response.token) {
          const { token, user } = response;

          localStorage.setItem('token', token);
          localStorage.setItem('userId', user.id);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userType', user.role);
          localStorage.setItem('userName', user.name);

          toast.success('Login successful!');
          
          setTimeout(() => {
            const redirectUrl = user.role === 'student' ? '/dashboard' : '/alumni';
            navigate(redirectUrl);
          }, 1000);
        }
      } catch (error) {
        setErrors({
          submit: error.message || 'Login failed. Please try again.',
        });
        toast.error(error.message || 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateLoginForm, navigate]
  );

  const handleForgotPassword = useCallback(async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email to reset the password' });
      setTouched({ email: true });
      toast.error('Please enter your email to reset the password');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Invalid email format' });
      setTouched({ email: true });
      toast.error('Invalid email format');
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      await sendForgotPasswordRequest(formData.email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to send reset email. Please try again.' });
      toast.error(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData.email]);

  const handleResetPasswordSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateResetForm()) {
        toast.error('Please fix the errors in the form');
        return;
      }

      setIsLoading(true);
      try {
        await resetPassword({
          password: formData.newPassword,
          confirmPassword: formData.confirmPassword
        });
        setResetSuccess(true);
        toast.success('Password reset successfully!');
      } catch (error) {
        setErrors({
          submit: error.message || 'Password reset failed. Please try again.',
        });
        toast.error(error.message || 'Password reset failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateResetForm, token]
  );

  if (currentView === 'reset') {
    if (isVerifying) {
      return (
        <div className="form-container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="form-section flex items-center justify-center"
          >
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-gray-600">Verifying reset token...</p>
            </div>
          </motion.div>
          <Toaster position="top-right" />
        </div>
      );
    }

    if (!tokenValid) {
      return (
        <div className="form-container">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="form-section">
            <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-6">{errors.token || 'This password reset link is invalid or has expired.'}</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </motion.div>
          <Toaster position="top-right" />
        </div>
      );
    }

    if (resetSuccess) {
      return (
        <div className="form-container">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="form-section">
            <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful</h2>
              <p className="text-gray-600 mb-6">Your password has been successfully reset. You can now login with your new password.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </motion.div>
          <Toaster position="top-right" />
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="info-section">
          <h2>Reset Your Password</h2>
          <p>Enter your new password below to complete the reset process.</p>
        </div>

        <motion.div initial="hidden" animate="visible" exit="exit" variants={containerVariants} className="form-section">
          <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Reset Password
              </h2>
              <p className="mt-2 text-gray-600">for {userEmail}</p>
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleResetPasswordSubmit} className="mt-8 space-y-6">
              <div className="relative mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 pl-10 pr-10 rounded-lg border ${
                      errors.newPassword && touched.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    } focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your new password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.newPassword && touched.newPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center mt-1"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                      <p className="text-sm text-red-600">{errors.newPassword}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {formData.newPassword && <PasswordStrengthIndicator password={formData.newPassword} />}
              </div>

              <div className="relative mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 pl-10 pr-10 rounded-lg border ${
                      errors.confirmPassword && touched.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    } focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="Confirm your new password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center mt-1"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-center"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Reset Password</>}
              </motion.button>

              <div className="text-center text-sm text-gray-600 mt-4">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </motion.form>
          </div>
        </motion.div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="info-section">
        <h2>Welcome Back!</h2>
        <p>Login to access your dashboard and stay connected.</p>
      </div>

      <motion.div initial="hidden" animate="visible" exit="exit" variants={containerVariants} className="form-section">
        <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sign In
            </h2>
            <p className="mt-2 text-gray-600">Sign in to continue your journey</p>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleLoginSubmit} className="mt-8 space-y-6">
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              error={errors.email}
              touched={touched.email}
              icon={Mail}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              error={errors.password}
              touched={touched.password}
              icon={Lock}
              onChange={handleInputChange}
              onBlur={handleBlur}
              toggleVisibility={togglePasswordVisibility}
              showPassword={showPassword}
            />

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Forgot password?
              </button>
            </div>

            <AnimatePresence>
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-center"
                >
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In</>}
            </motion.button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
              >
                Sign up
              </button>
            </div>
          </motion.form>
        </div>
      </motion.div>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '8px',
        },
        success: {
          style: {
            background: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444',
          },
        },
      }} />
    </div>
  );
};

export default Login;