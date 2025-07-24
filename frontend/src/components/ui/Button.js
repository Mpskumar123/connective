import React from 'react';

const Button = ({ children, onClick, className, variant = 'default' }) => {
  const baseClass = 'px-4 py-2 rounded-lg text-center transition';
  const variantClass = variant === 'outline'
    ? 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
    : 'bg-purple-600 text-white hover:bg-purple-700';

  return (
    <button onClick={onClick} className={`${baseClass} ${variantClass} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
