import React from 'react';

interface HelmetProps {
  children: React.ReactNode;
}

// Simple Helmet-like component for meta tags
export const Helmet: React.FC<HelmetProps> = ({ children }) => {
  React.useEffect(() => {
    const elements: HTMLElement[] = [];
    
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const { type, props } = child;
        
        if (type === 'title') {
          document.title = props.children;
        } else if (type === 'meta') {
          const meta = document.createElement('meta');
          Object.keys(props).forEach(key => {
            meta.setAttribute(key, props[key]);
          });
          document.head.appendChild(meta);
          elements.push(meta);
        } else if (type === 'link') {
          const link = document.createElement('link');
          Object.keys(props).forEach(key => {
            link.setAttribute(key, props[key]);
          });
          document.head.appendChild(link);
          elements.push(link);
        }
      }
    });
    
    return () => {
      elements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, [children]);
  
  return null;
};