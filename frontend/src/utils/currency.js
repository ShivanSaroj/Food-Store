// Currency conversion utilities

// Exchange rate: 1 USD = 83 INR (approximate)
export const USD_TO_INR_RATE = 83;

/**
 * Convert USD to INR
 * @param {number} usdAmount - Amount in USD
 * @returns {number} Amount in INR
 */
export const convertUSDToINR = (usdAmount) => {
    return usdAmount * USD_TO_INR_RATE;
};

/**
 * Convert INR to USD
 * @param {number} inrAmount - Amount in INR
 * @returns {number} Amount in USD
 */
export const convertINRToUSD = (inrAmount) => {
    return inrAmount / USD_TO_INR_RATE;
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code ('USD' or 'INR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
    if (currency === 'USD') {
        return `$${amount.toFixed(2)}`;
    } else if (currency === 'INR') {
        return `₹${amount.toFixed(2)}`;
    }
    return amount.toFixed(2);
};

/**
 * Format dual currency display (USD with INR equivalent)
 * @param {number} usdAmount - Amount in USD
 * @returns {string} Formatted string showing both currencies
 */
export const formatDualCurrency = (usdAmount) => {
    const inrAmount = convertUSDToINR(usdAmount);
    return `${formatCurrency(usdAmount, 'USD')} (${formatCurrency(inrAmount, 'INR')})`;
};
