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
  149: 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=600&q=80',

  // Extra MySQL Workbench items
  151: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
  155: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
  156: 'https://cpimg.tistatic.com/07549410/b/4/Antique-Gold-Long-Necklace.jpg',
  157: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
  158: 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=600&q=80',
  159: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
  160: 'https://thumbs.dreamstime.com/b/beautiful-diamond-ring-stands-store-window-306068234.jpg',
  161: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
  162: 'https://5.imimg.com/data5/SELLER/Default/2025/12/566237565/GW/XI/IP/103582308/platinum-jewelry-500x500.jpg',
  163: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
  164: 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=600&q=80',
};

const PRODUCT_NAME_IMAGES = {
  'nury chevron ring': 'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476',
  'the trina ring': 'https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792',
  'ozo stud earing': 'https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435',
  'nuray earings': 'https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167',
  'mazikeen necklace': 'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171',
  'ryck princess': 'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402',
  'bracelite': 'https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778',
  'resilent bracelet': 'https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366',
  'line bangles': 'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553',
  'set bangles': 'https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034',
  'spiral ring': 'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg',
  'leaf design ring': 'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg',
  'stud earrings': 'https://ik.imagekit.io/StringstackNaveen/earrings.jpg',
  'mahroosh diamond necklace': 'https://ik.imagekit.io/StringstackNaveen/earings2.jpg',
  'lakshmi temple necklace': 'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif',
  'lakshmi gold necklace': 'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg',
  'gold beaded bracelet': 'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp',
  'textured gold bracelet': 'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif',
  'vidh platinum solitire': 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp',
  'elegant floral ring': 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp',
  'swirl stud earrings': 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg',
  'floral stud earrings': 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp',
  'emerald drop platinum necklece': 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp',
  'solitaire platinum pendant necklace': 'https://ik.imagekit.io/StringstackNaveen/necklace1.jpeg',
  'start motif platinum bracelet': 'https://ik.imagekit.io/StringstackNaveen/bracelet.jpg',
  'floral two-tone platinum bracelet': 'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg',
  'start- motif platinum bangles': 'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp',
  'eternity platinum bangle': 'https://ik.imagekit.io/StringstackNaveen/platinum%20bangle.jpg',
  'meris textured band ring': 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp',
  'butterfly ring': 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp',
  'dangler earrings': 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp',
  'ossum earrings': 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp',
  'wisdom sterling silver necklace': 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp',
  'gargistone necklace': 'https://ik.imagekit.io/StringstackNaveen/silver%20necklace.webp',
  'flexi bracelet': 'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet.jpg',
  'chain bracelet': 'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet2.jpg',
  'rewa bangles': 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=600&q=80',
  'sterling bangles': 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp',
  'royal diamond choker': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
  'neckpice necklace': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
  'long necklace': 'https://cpimg.tistatic.com/07549410/b/4/Antique-Gold-Long-Necklace.jpg',
  'antique jumkas': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
  'kemp-green lakshmi vankii': 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=600&q=80',
  'kemp-green lakshmi necklace': 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=600&q=80',
  'stoned diamond necklace': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
  'stoned ring': 'https://thumbs.dreamstime.com/b/beautiful-diamond-ring-stands-store-window-306068234.jpg',
  'rose gold paltinum necklace': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
  'rose gold platinum set': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
  'square piece-set neckalce': 'https://5.imimg.com/data5/SELLER/Default/2025/12/566237565/GW/XI/IP/103582308/platinum-jewelry-500x500.jpg',
  'square piece-set necklace': 'https://5.imimg.com/data5/SELLER/Default/2025/12/566237565/GW/XI/IP/103582308/platinum-jewelry-500x500.jpg',
  'ghungroo jwellery set': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
  'ghungroo jewellery set': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
  'navaratri jewellery': 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=600&q=80'
};

export const getProductImage = (product) => {
  if (!product) return DEFAULT_IMAGES.Diamond;

  const dbImg = product.imageUrl || product.image_url || product.image;
  if (dbImg && typeof dbImg === 'string' && dbImg.trim().startsWith('http')) {
    return dbImg.trim();
  }

  const pid = Number(product.id || product.productId || product.product_id);
  if (pid && PRODUCT_SPECIFIC_IMAGES[pid]) {
    return PRODUCT_SPECIFIC_IMAGES[pid];
  }

  const pName = String(product.name || '').trim().toLowerCase();
  if (pName && PRODUCT_NAME_IMAGES[pName]) {
    return PRODUCT_NAME_IMAGES[pName];
  }
  for (const [key, url] of Object.entries(PRODUCT_NAME_IMAGES)) {
    if (pName && pName.trim() === key.trim()) {
      return url;
    }
  }

  const cat = product.categoryName || product.category || 'Diamond';
  return DEFAULT_IMAGES[cat] || DEFAULT_IMAGES.Diamond;
};

export default getProductImage;
