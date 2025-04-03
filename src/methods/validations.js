import Product from '../../models/Product.js';

/**
 * Checks the existence of a product by its ID.
 *
 * @param {string} productId - The ID of the product.
 * @returns {Promise<boolean>} A promise that resolves to true if the product exists, false otherwise.
 */
export const doesProductExistById = async (productId) => {
    try {
        const product = await Product.findById(productId);
        return !!product;
    } catch (error) {
        return false;
    }
};


/**
 * Check if a product exists and get its quantity.
 *
 * @function
 * @async
 * @param {string} productId - The ID of the product to check.
 * @returns {Object} - Object containing a boolean 'exists' indicating if the product exists
 *                    and 'quantity' with the product quantity if it exists.
 */
export const checkProductExistsAndGetQuantity = async (productId) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            return { exists: false, quantity: 0 };
        }
        return { exists: true, quantity: product.quantity };
    } catch (error) {
        return { exists: false, quantity: 0 };
    }
};
