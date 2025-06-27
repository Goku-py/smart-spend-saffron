import React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet-async';

interface HelmetProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  children?: React.ReactNode;
}

// Enhanced Helmet component with better error handling and type safety
export const Helmet: React.FC<HelmetProps> = ({
  title = 'Smart Spend - Personal Finance Management',
  description = 'Smart Spend helps you manage your personal finances, track expenses, and achieve your financial goals.',
  keywords = ['finance', 'budget', 'expenses', 'savings', 'money management'],
  image = '/og-image.png',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  children
}) => {
  // Validate children to ensure they are valid React elements
  const validChildren = React.Children.toArray(children).filter(child => 
    React.isValidElement(child)
  );

  return (
    <ReactHelmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Smart Spend" />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Additional Children */}
      {validChildren}
    </ReactHelmet>
  );
};

// Export default for backward compatibility
export default Helmet;