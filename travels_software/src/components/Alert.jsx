import React from 'react';
import PropTypes from 'prop-types';

export const Alert = ({ children, type, onClose }) => {
  const alertType = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onClose();
    }
  };

  return (
    <div
      className={`p-4 ${alertType} text-white rounded-md shadow-lg flex items-center justify-between`}
    >
      <div className="flex items-center space-x-2">
        <AlertDescription>{children}</AlertDescription>
      </div>
      <button
        onClick={onClose}
        onKeyPress={handleKeyPress}
        className="bg-white text-gray-800 rounded-md px-3 py-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        OK
      </button>
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['error', 'success']).isRequired,
  onClose: PropTypes.func.isRequired,
};

export const AlertDescription = ({ children }) => {
  return <p className="text-white text-sm">{children}</p>;
};

AlertDescription.propTypes = {
  children: PropTypes.node.isRequired,
};