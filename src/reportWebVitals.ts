// Web Vitals reporting utility
// This file provides functionality to measure and report Core Web Vitals metrics
import { ReportHandler } from 'web-vitals';

// reportWebVitals function accepts an optional callback function to handle performance entries
// When provided with a valid callback, it imports and initializes all the web vitals metrics
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  // Only execute if a callback function is provided
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the web-vitals library to optimize bundle size
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Initialize each performance metric with the provided callback
      // CLS - Cumulative Layout Shift
      getCLS(onPerfEntry);
      // FID - First Input Delay
      getFID(onPerfEntry);
      // FCP - First Contentful Paint
      getFCP(onPerfEntry);
      // LCP - Largest Contentful Paint
      getLCP(onPerfEntry);
      // TTFB - Time to First Byte
      getTTFB(onPerfEntry);
    });
  }
};

// Export the reportWebVitals function for use in index.tsx
export default reportWebVitals;
