import React from 'react';
import { Helmet } from './ui/helmet';

interface SEOWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  keywords?: string;
  ogImage?: string;
}

const SEOWrapper: React.FC<SEOWrapperProps> = ({ 
  title, 
  description, 
  children, 
  keywords,
  ogImage = '/og-image.jpg'
}) => {
  const fullTitle = `${title} | Smart Spend - AI Budget Tracker`;
  
  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords\" content={keywords} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Smart Spend Team" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      {children}
    </>
  );
};

export default SEOWrapper;