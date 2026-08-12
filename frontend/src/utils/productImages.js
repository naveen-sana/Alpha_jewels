// Utility to resolve live database image URLs directly from the API response object.
// STRICT REQUIREMENT: No mock arrays, no hardcoded image maps, no name-matching overrides.

export const getProductImage = (product) => {
  if (!product) return null;

  const rawUrl = product.imageUrl1 || product.imageUrl || product.image_url || product.image || product.img;
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().length > 0 && rawUrl.trim().startsWith('http')) {
    return rawUrl.trim();
  }

  return null;
};

export default getProductImage;
