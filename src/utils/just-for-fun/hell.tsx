/**
 * Utility functions for text formatting, calculations,
 * and input validation used throughout the application.
 */

/**
 * Formats text by capitalizing the first letter of each word
 * and trimming excess whitespace.
 * 
 * @param text - The input string to format
 * @returns The formatted string
 */
export const formatText = (text: string): string => {
  if (!text) return "";
  
  return text
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Calculates the total sum of an array of numbers
 * with an optional discount applied.
 * 
 * @param numbers - Array of numbers to sum
 * @param discount - Optional discount to apply (0-1)
 * @returns The calculated total
 */
export const calculateTotal = (numbers: number[], discount?: number): number => {
  if (numbers.length === 0) return 0;
  
  const sum = numbers.reduce((total, num) => total + num, 0);
  
  if (discount && discount > 0 && discount < 1) {
    return sum * (1 - discount);
  }
  
  return sum;
};

/**
 * Validates user input based on specified validation type.
 * 
 * @param input - The user input to validate
 * @param type - The type of validation to perform
 * @returns Boolean indicating if the input is valid
 * @throws Error for unknown validation types
 */
export const validateInput = (input: string, type: string): boolean => {
  switch (type) {
    case "email":
      // Simple email validation regex
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    
    case "password":
      // Password must be at least 8 chars with at least one uppercase, lowercase, number, and special char
      return input.length >= 8 && 
             /[A-Z]/.test(input) && 
             /[a-z]/.test(input) && 
             /[0-9]/.test(input) && 
             /[^A-Za-z0-9]/.test(input);
    
    default:
      throw new Error("Unknown validation type");
  }
};
