

/**
 * Formats a value based on the selector type.
 * @param {string} selectorName - The name of the selector (e.g., 'id', 'class', 'name', 'data-attribute').
 * @param {string} value - The value to be formatted.
 * @returns {string} The formatted selector.
 */
exports.getSelectors=function getFormattedSelector(selectorName, value) {
    switch (selectorName.toLowerCase()) {
        case 'id':
            return `#${value}`;
        case 'class':
            return `.${value}`;
        case 'name':
            return `[name="${value}"]`;
        case 'data-attribute':
            return `[data-${value}]`;
        case 'xpath'   :
        default:
            throw new Error(`Unsupported selector type: ${selectorName}`);
    }
}