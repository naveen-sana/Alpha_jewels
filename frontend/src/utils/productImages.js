// Utility to resolve exact database ImageKit images for products

const DEFAULT_IMAGES = {
  Diamond: 'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476',
  Gold: 'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg',
  Platinum: 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp',
  Silver: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp',
};

const PRODUCT_SPECIFIC_IMAGES = {
  // Diamond Collection (111 - 120) - StringstackNaveen
  111: 'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476',
  112: 'https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792',
  113: 'https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435',
  114: 'https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167',
  115: 'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171',
  116: 'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402',
  117: 'https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778',
  118: 'https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366',
  119: 'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553',
  120: 'https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034',

  // Gold Collection (121 - 130) - StringstackNaveen
  121: 'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg',
  122: 'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg',
  123: 'https://ik.imagekit.io/StringstackNaveen/earrings.jpg',
  124: 'https://ik.imagekit.io/StringstackNaveen/earings2.jpg',
  125: 'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif',
  126: 'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg',
  127: 'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp',
  128: 'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif',
  129: 'https://ik.imagekit.io/StringstackNaveen/bangles-1.webp',
  130: 'https://ik.imagekit.io/StringstackNaveen/bangle2.jpg',

  // Platinum Collection (131 - 140) - StringstackSanjana & StringstackNaveen
  131: 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp',
  132: 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp',
  133: 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg',
  134: 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp',
  135: 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp',
  136: 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp',
  137: 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp',
  138: 'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg',
  139: 'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp',
  140: 'https://ik.imagekit.io/StringstackSanjana/Platinum/BANG%203.webp',

  // Silver Collection (141 - 150) - StringStackSavitri
  141: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp',
  142: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp',
  143: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp',
  144: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp',
  145: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp',
  146: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp',
  147: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp',
  148: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp',
  149: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp',
  150: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp',
};

export const getProductImage = (product) => {
  if (!product) return DEFAULT_IMAGES.Diamond;
  
  // 1. Prioritize lookup by exact product ID from database
  const pid = Number(product.id || product.productId || product.product_id);
  if (pid && PRODUCT_SPECIFIC_IMAGES[pid]) {
    return PRODUCT_SPECIFIC_IMAGES[pid];
  }
  
  // 2. If API returns a valid ImageKit or custom image_url
  const img = product.imageUrl || product.image_url;
  if (img && typeof img === 'string' && img.trim() !== '' && !img.includes('unsplash.com')) {
    return img;
  }

  // 3. Fallback by Category Name
  const cat = product.categoryName || product.category || 'Diamond';
  return DEFAULT_IMAGES[cat] || DEFAULT_IMAGES.Diamond;
};

export default getProductImage;
