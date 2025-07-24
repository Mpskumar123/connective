import React, { useState, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, UserSquare2, ArrowLeft, Loader2, BookOpen, Rocket, Trophy, Users, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// ===== CONSTANTS =====
const branches = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Chemical',
  'Other'
];

const studyYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  },
  hover: {
    y: -10,
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

const formStepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

const formFieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 }
  }
};

// ===== UTILITY FUNCTIONS =====
const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
  return null;
};

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

// ===== COMPONENTS =====
const Features = () => (
  <div className="w-full grid grid-cols-2 gap-4 mt-6">
    <motion.div 
      variants={featureCardVariants}
      whileHover="hover"
      whileTap="tap"
      className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
    >
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
      >
        <BookOpen className="w-6 h-6 text-purple-600 mb-2" />
      </motion.div>
      <h3 className="font-semibold text-purple-900">Learn Together</h3>
      <p className="text-sm text-purple-700">Connect with peers and share knowledge</p>
    </motion.div>
    
    <motion.div 
      variants={featureCardVariants}
      whileHover="hover"
      whileTap="tap"
      className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100"
    >
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
      >
        <Rocket className="w-6 h-6 text-blue-600 mb-2" />
      </motion.div>
      <h3 className="font-semibold text-blue-900">Grow Skills</h3>
      <p className="text-sm text-blue-700">Access resources and workshops</p>
    </motion.div>
    
    <motion.div 
      variants={featureCardVariants}
      whileHover="hover"
      whileTap="tap"
      className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
    >
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
      >
        <Trophy className="w-6 h-6 text-green-600 mb-2" />
      </motion.div>
      <h3 className="font-semibold text-green-900">Get Opportunities</h3>
      <p className="text-sm text-green-700">Find internships and jobs</p>
    </motion.div>
    
    <motion.div 
      variants={featureCardVariants}
      whileHover="hover"
      whileTap="tap"
      className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100"
    >
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
      >
        <Users className="w-6 h-6 text-orange-600 mb-2" />
      </motion.div>
      <h3 className="font-semibold text-orange-900">Build Network</h3>
      <p className="text-sm text-orange-700">Connect with alumni and mentors</p>
    </motion.div>
  </div>
);

const FormField = memo(({ label, name, type = 'text', register, errors, watch, setValue, options = null }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const value = watch(name);

  useEffect(() => {
    if (name === 'password' && value) {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  }, [value, name]);

  return (
    <motion.div 
      className="relative mb-6"
      variants={formFieldVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {options ? (
        <select
          {...register(name)}
          className={`w-full px-4 py-3 rounded-lg border ${errors[name] ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white`}
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            {...register(name)}
            className={`w-full px-4 py-3 rounded-lg border ${errors[name] ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
          />
          {type === 'password' && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
          )}
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {errors[name] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="flex items-center gap-1 absolute -bottom-5 left-0"
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">{errors[name]?.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {name === 'password' && value && (
        <motion.div 
          className="mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-1 mb-1">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                className={`h-1 flex-1 rounded-full ${index < passwordStrength ? 'bg-green-500' : 'bg-gray-200'}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>
          <motion.p 
            className={`text-xs ${passwordStrength < 3 ? 'text-red-500' : 'text-green-500'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {passwordStrength < 3 ? 'Password is weak' : 'Password is strong'}
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
});

// Fixed validation schema
const createValidationSchema = (userType) => {
  const baseSchema = yup.object().shape({
    firstName: yup
      .string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters')
      .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters'),
    
    lastName: yup
      .string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters'),
    
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email'),
    
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
    
    phone: yup
      .string()
      .required('Phone number is required')
      .matches(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        'Please enter a valid phone number'
      ),
  });

  if (userType === 'student') {
    return baseSchema.shape({
      university: yup.string().required('University name is required'),
      branch: yup.string().required('Branch is required').oneOf(branches, 'Please select a valid branch'),
      yearOfStudy: yup.string().required('Year of study is required'),
      studentId: yup.string().required('Student ID is required')
    });
  }

  if (userType === 'alumni') {
    return baseSchema.shape({
      graduationYear: yup
        .number()
        .required('Graduation year is required')
        .min(1950, 'Invalid graduation year')
        .max(new Date().getFullYear(), 'Graduation year cannot be in the future'),
      currentCompany: yup.string().required('Current company is required'),
      jobTitle: yup.string().required('Job title is required'),
      industry: yup.string().required('Industry is required')
    });
  }

  return baseSchema;
};

const FormStep1 = ({ register, errors, watch }) => (
  <motion.div
    variants={formStepVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="space-y-6"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <FormField
        label="First Name"
        name="firstName"
        register={register}
        errors={errors}
        watch={watch}
      />
      <FormField
        label="Last Name"
        name="lastName"
        register={register}
        errors={errors}
        watch={watch}
      />
    </div>
    <FormField
      label="Email"
      name="email"
      type="email"
      register={register}
      errors={errors}
      watch={watch}
    />
    <FormField
      label="Password"
      name="password"
      type="password"
      register={register}
      errors={errors}
      watch={watch}
    />
    <FormField
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      register={register}
      errors={errors}
      watch={watch}
    />
    <FormField
      label="Phone Number"
      name="phone"
      type="tel"
      register={register}
      errors={errors}
      watch={watch}
    />
  </motion.div>
);

const FormStep2Student = ({ register, errors, watch }) => (
  <motion.div
    variants={formStepVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="space-y-6"
  >
    <FormField
      label="University Name"
      name="university"
      register={register}
      errors={errors}
      watch={watch}
    />
    <FormField
      label="Branch"
      name="branch"
      register={register}
      errors={errors}
      watch={watch}
      options={branches}
    />
    <FormField
      label="Year of Study"
      name="yearOfStudy"
      register={register}
      errors={errors}
      watch={watch}
      options={studyYears}
    />
    <FormField
      label="Student ID"
      name="studentId"
      register={register}
      errors={errors}
      watch={watch}
    />
  </motion.div>
);

const FormStep2Alumni = ({ register, errors, watch }) => (
  <motion.div
    variants={formStepVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="space-y-6"
  >
    <FormField
      label="Graduation Year"
      name="graduationYear"
      type="number"
      register={register}
      errors={errors}
      watch={watch}
    />
    <FormField
      label="Current Company"
      name="currentCompany"
      register={register}
      errors={errors}
      watch={watch}
    />
    <FormField
      label="Job Title"
      name="jobTitle"
      register={register}
      errors={errors}
      watch={watch}
    />
    <FormField
      label="Industry"
      name="industry"
      register={register}
      errors={errors}
      watch={watch}
    />
  </motion.div>
);

const Signup = memo(() => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(createValidationSchema('')),
    mode: 'onChange',
    defaultValues: {
      userType: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      university: '',
      branch: '',
      yearOfStudy: '',
      studentId: '',
      graduationYear: '',
      currentCompany: '',
      jobTitle: '',
      industry: ''
    }
  });

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setValue('userType', type);
    // Reset form with new schema when user type changes
    reset({
      ...watch(),
      userType: type,
      university: '',
      branch: '',
      yearOfStudy: '',
      studentId: '',
      graduationYear: '',
      currentCompany: '',
      jobTitle: '',
      industry: ''
    });
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (step === 1) {
        const isValid = await trigger([
          'firstName',
          'lastName',
          'email',
          'password',
          'confirmPassword',
          'phone'
        ]);
        if (isValid) setStep(2);
        return;
      }

      // API call to register user
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const result = await response.json();
      localStorage.setItem('token', result.token);
      toast.success('Registration successful!');
      navigate(userType === 'student' ? '/dashboard' : '/alumni');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Left side info container - hidden on small screens */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex flex-col justify-center items-center text-white">
        <div className="max-w-md mx-auto">
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to ConnectYou
          </motion.h2>
          <motion.p 
            className="text-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Join our community of learners and achievers
          </motion.p>
          <Features />
        </div>
      </div>
      
      {/* Right side form container - full width on small screens */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 sm:p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          {!userType ? (
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl">
              <div className="text-center mb-8">
                <motion.h2 
                  className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Choose Account Type
                </motion.h2>
              </div>
              
              <div className="space-y-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserTypeChange('student')}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <GraduationCap className="w-6 h-6" />
                  <span className="text-lg">Continue as Student</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserTypeChange('alumni')}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <UserSquare2 className="w-6 h-6" />
                  <span className="text-lg">Continue as Alumni</span>
                </motion.button>
              </div>

              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={handleSignInClick}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl">
              <div className="text-center">
                <motion.h2 
                  className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {userType === 'student' ? 'Student Signup' : 'Alumni Signup'}
                </motion.h2>
                <motion.div 
                  className="mt-4 flex justify-center space-x-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div 
                    className={`h-2 w-16 rounded-full ${step === 1 ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'}`}
                  />
                  <div 
                    className={`h-2 w-16 rounded-full ${step === 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-200'}`}
                  />
                </motion.div>
              </div>

              <div className="space-y-6 mt-6">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <FormStep1 register={register} errors={errors} watch={watch} />
                  ) : userType === 'student' ? (
                    <FormStep2Student register={register} errors={errors} watch={watch} />
                  ) : (
                    <FormStep2Alumni register={register} errors={errors} watch={watch} />
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-6">
                {step === 2 && (
                  <motion.button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-6 py-3 ${step === 1 ? 'ml-auto' : ''} bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1`}
                  whileHover={!isLoading ? { scale: 1.05 } : {}}
                  whileTap={!isLoading ? { scale: 0.95 } : {}}
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {step === 2 ? "Create Account" : "Next Step"}
                </motion.button>
              </div>

              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
});

export default Signup;