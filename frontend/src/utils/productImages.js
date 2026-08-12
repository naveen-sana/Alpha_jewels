// Utility to resolve live database image URLs with dynamic fallbacks

const DEFAULT_IMAGES = {
  Diamond: 'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476',
  Gold: 'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg',
  Platinum: 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp',
  Silver: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp',
};

const PRODUCT_SPECIFIC_IMAGES = {
  // Diamond Collection
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

  // Gold Collection
  121: 'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg',
  122: 'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg',
  123: 'https://ik.imagekit.io/StringstackNaveen/earrings.jpg',
  124: 'https://ik.imagekit.io/StringstackNaveen/earings2.jpg',
  125: 'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif',
  126: 'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg',
  127: 'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp',
  128: 'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif',

  // Platinum Collection
  131: 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp',
  132: 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp',
  133: 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg',
  134: 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp',
  135: 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp',
  136: 'https://ik.imagekit.io/StringstackNaveen/necklace1.jpeg',
  137: 'https://ik.imagekit.io/StringstackNaveen/bracelet.jpg',
  138: 'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg',
  139: 'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp',
  140: 'https://ik.imagekit.io/StringstackNaveen/platinum%20bangle.jpg',

  // Silver Collection
  141: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp',
  142: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp',
  143: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp',
  144: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp',
  145: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp',
  146: 'https://ik.imagekit.io/StringstackNaveen/silver%20necklace.webp',
  147: 'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet.jpg',
  148: 'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet2.jpg',
  149: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxvNTouHpMaDkVQE0EBj9ACaFYTpdnjHseaPqkPxpqLQ&s=10',

  // Extra MySQL Workbench items
  151: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
  155: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFjFl-t7B2tgiTFxwu0DjLM06_sGl06qvLn9_ZQj29gg&s=10',
  156: 'https://cpimg.tistatic.com/07549410/b/4/Antique-Gold-Long-Necklace.jpg',
  157: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUGXcUrPc96aQ0Bkex6Iz88U2rtbIhTsRHaKhuIvqvBgfiiWOgJ680coY&s=10',
  158: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsSouth25K9Qof9iRlt-NmhGjWBoWjbnY4NX8fYX1ElA&s=10',
  159: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeg4gTnQNB8QwFa2NabGCY6GIyuk-O5YgHPh0lWk89FQ&s=10',
  160: 'https://thumbs.dreamstime.com/b/beautiful-diamond-ring-stands-store-window-306068234.jpg',
  161: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsGuP29OiLm3h8E4bWxCr_6IkP3o_Pn86YyBk_3tqsAw&s=10',
  162: 'https://5.imimg.com/data5/SELLER/Default/2025/12/566237565/GW/XI/IP/103582308/platinum-jewelry-500x500.jpg',
  163: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtETkKAxYb9cdrBBVOBDlQMWvWmvMdaWGq2OvoOOXWbtVwR4zmQVLEPh8b&s=10',
  164: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_jhWvKIVjAe9n7QaDN6uMFMb_IPmbINqHvMHp7p9A9z2K_GiGMpDIiz8&s=10',
};

export const getProductImage = (product) => {
  if (!product) return DEFAULT_IMAGES.Diamond;
  
  // 1. ALWAYS PRIORITIZE LIVE DATABASE URL FROM MYSQL (product.imageUrl / product.image_url)
  const dbImg = product.imageUrl || product.image_url;
  if (dbImg && typeof dbImg === 'string' && dbImg.trim().startsWith('http') && !dbImg.includes('unsplash.com')) {
    return dbImg.trim();
  }

  // 2. Fallback to product-specific map if database image is missing
  const pid = Number(product.id || product.productId || product.product_id);
  if (pid && PRODUCT_SPECIFIC_IMAGES[pid]) {
    return PRODUCT_SPECIFIC_IMAGES[pid];
  }

  // 3. Fallback by Category Name
  const cat = product.categoryName || product.category || 'Diamond';
  return DEFAULT_IMAGES[cat] || DEFAULT_IMAGES.Diamond;
};

export default getProductImage;
