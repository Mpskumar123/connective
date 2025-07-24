import React, { useState } from "react";
import { XCircle, CheckCircle, AlertCircle, Info, X } from "lucide-react";

// Define alert types with corresponding colors & icons
const alertTypes = {
  success: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
  error: { bg: "bg-red-100", text: "text-red-800", icon: <XCircle className="w-5 h-5 text-red-600" /> },
  warning: { bg: "bg-yellow-100", text: "text-yellow-800", icon: <AlertCircle className="w-5 h-5 text-yellow-600" /> },
  info: { bg: "bg-blue-100", text: "text-blue-800", icon: <Info className="w-5 h-5 text-blue-600" /> },
};

const Alert = ({ type = "info", title, message, dismissible = true }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={`flex items-start p-4 rounded-lg shadow-md ${alertTypes[type].bg} ${alertTypes[type].text}`}>
      {/* Icon */}
      <div className="mr-3">{alertTypes[type].icon}</div>

      {/* Content */}
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>

      {/* Close Button */}
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="ml-4 text-gray-500 hover:text-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
