import { ReportHandler } from 'web-vitals';

/**
 * Collects and reports web vitals metrics
 * 
 * This function utilizes the web-vitals library to measure important 
 * performance metrics like CLS, FID, FCP, LCP, and TTFB.
 * 
 * @param onPerfEntry - Optional callback function to process performance metrics
 * 
 * Metrics collected:
 * - CLS (Cumulative Layout Shift): Measures visual stability
 * - FID (First Input Delay): Measures interactivity
 * - FCP (First Contentful Paint): Measures perceived load speed
 * - LCP (Largest Contentful Paint): Measures loading performance
 * - TTFB (Time to First Byte): Measures time to initial response
 */
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  // Only proceed if a valid callback function is provided
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the web-vitals library to minimize initial bundle size
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Register each metric with the provided callback
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;