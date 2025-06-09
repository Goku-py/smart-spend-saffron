import React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet-async';

interface HelmetProps {
  children: React.ReactNode;
}

// Enhanced Helmet component with better error handling and type safety
export const Helmet: React.FC<HelmetProps> = ({ children }) => {
  // Validate children to ensure they are valid React elements
  const validChildren = React.Children.toArray(children).filter(child => 
    React.isValidElement(child)
  );

  if (validChildren.length === 0) {
    console.warn('Helmet: No valid children provided');
    return null;
  }

  return (
    <ReactHelmet>
      {validChildren}
    </ReactHelmet>
  );
};

// Export default for backward compatibility
export default Helmet;