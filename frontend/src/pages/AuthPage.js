import React, { useState } from 'react';
import Signup from './Signup';
import Login from './login';
import './Signup.css'; // For diagonal styling
import './login.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);

  const togglePage = () => {
    setIsLogin((prev) => !prev); // Use functional update to ensure state is updated correctly
  };

  return (
    <div className={`form-container ${isLogin ? 'login' : 'signup'}`}>
      {isLogin ? <Login togglePage={togglePage} /> : <Signup togglePage={togglePage} />}
    </div>
  );
};

export default AuthPage;
