/**
 * Utility functions for token data and gas fee calculations
 */

// Constants for token types and gas limits
const DEFAULT_GAS_LIMIT = '300000';
const DEFAULT_UINT_TYPE = 'uint256';

/**
 * Configuration for supported tokens and their properties
 */
const tokenConfig = {
  ETH: {
    symbol: 'ETH',
    decimals: 18,
    gasMultiplier: 1,
  },
  // Add other tokens as needed
};

/**
 * Determines if a fee endpoint is available based on the given configuration
 * @param {Object} config - Configuration object
 * @returns {boolean} - True if no fee is required
 */
const isNoFeeEndpoint = (config) => {
  return !config.feeEndpoint || config.feeEndpoint === '';
};

/**
 * Gets the gas fees based on token type and deployment configuration
 * @param {string} tokenType - The type of token (e.g., 'ETH')
 * @param {Object} deploymentGas - Gas configuration for deployment
 * @param {string} uintType - The uint type, defaulting to 'uint256'
 * @returns {string} - The calculated gas fee
 */
const getGasFeesByType = (tokenType, deploymentGas = {}, uintType = DEFAULT_UINT_TYPE) => {
  // If no fee endpoint is specified, return zero gas fee
  if (isNoFeeEndpoint(deploymentGas)) {
    return '0';
  }

  // If no specific gas limit is provided for this uint type, use the default
  const gasLimit = (deploymentGas[uintType] || deploymentGas[DEFAULT_UINT_TYPE] || DEFAULT_GAS_LIMIT);
  
  // Calculate gas fee based on token type and gas limit
  const token = tokenConfig[tokenType] || tokenConfig.ETH;
  return (parseInt(gasLimit) * token.gasMultiplier).toString();
};

/**
 * Converts token amount to gas fees based on configuration
 * @param {Object} options - Conversion options
 * @param {string} options.amount - The amount to convert
 * @param {string} options.type - The uint type
 * @param {Object} options.deploymentGas - Gas configuration for deployment
 * @returns {string} - The converted gas fee
 */
const tokenGasConversion = (options = {}) => {
  const { amount, type = DEFAULT_UINT_TYPE, deploymentGas = {} } = options;
  
  // If no amount is provided, return zero
  if (!amount) {
    return '0';
  }
  
  // Determine token type from the amount object or default to ETH
  const tokenType = amount.tokenType || 'ETH';
  
  // Calculate gas fees based on token type and deployment configuration
  return getGasFeesByType(tokenType, deploymentGas, type);
};

/**
 * Formats a value based on token decimals
 * @param {string|number} value - The value to format
 * @param {string} tokenType - The type of token
 * @returns {string} - The formatted value
 */
const formatTokenValue = (value, tokenType = 'ETH') => {
  if (!value) return '0';
  
  const token = tokenConfig[tokenType] || tokenConfig.ETH;
  // Format value based on token decimals
  const valueAsNumber = parseFloat(value);
  return valueAsNumber.toFixed(token.decimals);
};

// Export utility functions
module.exports = {
  tokenGasConversion,
  getGasFeesByType,
  formatTokenValue,
  isNoFeeEndpoint,
  DEFAULT_UINT_TYPE,
  tokenConfig
};
