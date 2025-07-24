import React from 'react';

const Select = ({ options, value, onChange, className }) => {
  return (
    <select value={value} onChange={onChange} className={`border px-3 py-2 rounded-lg w-full ${className}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
