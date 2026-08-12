-- PostgreSQL Migration Script for ecommerce_db.sql
-- Generated automatically for Alpha Jewels

-- Drop existing tables if needed or truncate to keep schema clean
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS productimages CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  category_id INT UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  category_name VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Products Table matching ecommerce_db.sql exact schema
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_id INT UNIQUE,
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  stock_quantity INT DEFAULT 10,
  stock INT DEFAULT 10,
  weight VARCHAR(50),
  material VARCHAR(100),
  purity VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  metal_type VARCHAR(50) DEFAULT 'Gold',
  gold_purity VARCHAR(50) DEFAULT '22K',
  diamond_details VARCHAR(255) DEFAULT 'VS1 / G-H Color',
  stone_details VARCHAR(255) DEFAULT 'Natural Diamond',
  certificate_number VARCHAR(100),
  sku VARCHAR(100),
  discount DECIMAL(5, 2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INT,
  image_url TEXT NOT NULL,
  is_primary INT DEFAULT 1
);

-- Create ProductImages Synonym Table for compatibility
CREATE TABLE IF NOT EXISTS productimages (
  image_id SERIAL PRIMARY KEY,
  product_id INT,
  image_url TEXT NOT NULL,
  is_thumbnail BOOLEAN DEFAULT TRUE
);


-- Insert Categories
INSERT INTO categories (id, category_id, name, created_at, image_url, status, category_name) VALUES (1,'Diamond',NULL,'2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE',NULL),(2,'Gold',NULL,'2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE',NULL),(3,'Platinum',NULL,'2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE',NULL),(4,'Silver',NULL,'2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE',NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_name = EXCLUDED.name;

-- Insert Products with exact names and correct prices
INSERT INTO products (id, category_id, name, description, price, stock_quantity, weight, material, purity, is_active, created_at, metal_type, gold_purity, diamond_details, stone_details, certificate_number, sku, discount, status, stock) VALUES 
(111,1,'Nury Chevron Ring','Nury Chevron Ring',7914.29,5,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',5),
(112,1,'The trina ring','beautifuly designed Trina',9642.86,5,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',5),
(113,1,'Ozo stud earing','Handmade Ozo earrings for women',7743.29,7,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',7),
(114,1,'Nuray earings','N-shaped Rings with pure gold',9287.00,7,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',7),
(115,1,'Mazikeen Necklace','Mazi-Queen Royal look Necklace',12785.71,6,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',6),
(116,1,'ryck princess','The ryck Princess Necklace',14285.57,6,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',6),
(117,1,'Bracelite','The Aelric Bracelet',9000.00,8,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(118,1,'resilent Bracelet','The Chain-typed Bracelet',9200.00,8,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(119,1,'Line Bangles','Royal elegent Bangles for women',9571.43,4,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(120,1,'Set Bangles','The Bazel-Set Bangles',10000.00,4,NULL,'Diamond',NULL,1,'2026-07-27 17:30:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(151,1,'Royal Diamond Choker','Exquisite Royal Choker',12000.00,3,NULL,'Diamond',NULL,1,'2026-07-27 17:30:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(159,1,'Stoned Diamond Necklace','Beautiful stoned Necklace for women',9889.00,10,NULL,'Diamond',NULL,1,'2026-07-27 17:30:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),
(160,1,'Stoned Ring','A Beautiful Diamond Ring Stands in solitaire',9563.00,10,NULL,'Diamond',NULL,1,'2026-07-27 17:30:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),

(121,2,'Spiral Ring','Classic Spiral Gold Ring',9000.00,6,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',6),
(122,2,'leaf design Ring','Elegant Leaf Design Gold Ring',6600.00,6,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',6),
(123,2,'Stud Earrings','Temple Gold Stud Earrings',8800.00,4,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(124,2,'Mahroosh Diamond Necklace','Indriya Necklace by Aditya Birla',9285.71,8,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(125,2,'Lakshmi Temple Necklace','Beautifully designed Necklace',11111.00,3,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(126,2,'Lakshmi Gold Necklace','Wonderfully designed Necklace',12698.29,3,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(127,2,'Gold Beaded Bracelet','Handicrafted Bracelet for Women',9162.40,2,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',2),
(128,2,'Textured Gold Bracelet','Men Stylish and elogant look Bracelet',7712.40,8,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(155,2,'Neckpice Necklace','Beautifully crafted necklace for women',7886.00,10,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),
(156,2,'Long Necklace','Antique Gold Necklace for women',7896.00,9,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',9),
(157,2,'Antique Jumkas','Gold Plated One Gram Gold Antique Jhumkas',5632.00,10,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),
(158,2,'Kemp-green Lakshmi Vankii','Antique gold tone kemp-green lakshmi peacock elephant nakshi 1 vankii',7986.00,10,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),

(131,3,'Vidh Platinum Solitire','Best Ring for men',9004.20,8,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(132,3,'Elegant floral Ring','Elegant floral Platinum Ring',9391.57,8,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(133,3,'Swirl Stud Earrings','Circular Earrings',6650.80,7,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',7),
(134,3,'Floral Stud Earrings','Flower Stud Earrings',6509.20,7,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',7),
(135,3,'Emerald Drop Platinum Necklece','Wonderfully Crafted Necklace for Women',12842.71,1,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',1),
(136,3,'Solitaire Platinum Pendant Necklace','Looking Gorgeous',12556.86,1,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',1),
(137,3,'Start Motif Platinum Bracelet','Start Bracelet',9353.57,3,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(138,3,'Floral Two-Tone Platinum Bracelet','Floral Two-Tone Platinum Bracelet',8124.86,3,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(139,3,'Start- Motif Platinum Bangles','Floral Two-Tone Platinum Bracelet',9353.86,4,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(140,3,'Eternity Platinum Bangle','Premium Bangles',7807.86,5,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',5),
(161,3,'Rose Gold paltinum Necklace','Rose Gold Platinum Collection',6548.00,10,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),
(162,3,'Square Piece-Set Neckalce','Square Piece Step Necklace',6541.00,10,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),

(141,4,'Meris Textured Band Ring','Wonderful Silverplated Ring',6666.40,8,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(142,4,'Butterfly Ring','Adjustable silver Butterfly Ring',4542.40,8,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(143,4,'Dangler Earrings','Silver Flower Dangler Earrings',4917.80,9,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',9),
(144,4,'Ossum Earrings','Beautiful Eearings for Women',5517.20,9,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',9),
(145,4,'Wisdom Sterling Silver Necklace','Infinite Wisdom Sterling Silver Necklace',9164.20,4,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(146,4,'GargiStone Necklace','Beautifully Crafted Stone Necklace',9305.00,4,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(147,4,'Flexi Bracelet','Fleur Flexi Bracelet in Silver',7936.29,3,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(148,4,'Chain Bracelet','Clara Womens Evil Eye Bracelet',7048.20,3,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(149,4,'Rewa Bangles','Beautiful Rewa Bangles',8503.20,4,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(150,4,'Sterling Bangles','Beautiful Sterling Bangles',7912.80,4,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(163,4,'Ghungroo Jwellery Set','Ghungroo Studded Filigree Work Silver Plated Antique Jewellery Set',5469.00,10,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),
(164,4,'Navaratri Jewellery','Silver Necklace, Navratri Jewellery',4589.00,10,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock, name = EXCLUDED.name, category_id = EXCLUDED.category_id;

-- Insert Product Images
INSERT INTO product_images (id, product_id, image_url, is_primary) VALUES (1,111,'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476',1),(2,112,'https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792',1),(3,113,'https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435',1),(4,114,'https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167',1),(5,115,'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171',1),(6,116,'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402',1),(7,117,'https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778',1),(8,118,'https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366',1),(9,119,'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553',1),(10,120,'https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034',1),(11,121,'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg',1),(12,122,'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg',1),(13,123,'https://ik.imagekit.io/StringstackNaveen/earrings.jpg',1),(14,124,'https://ik.imagekit.io/StringstackNaveen/earings2.jpg',1),(15,125,'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif',1),(16,126,'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg',1),(17,127,'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp',1),(18,128,'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif',1),(19,129,'https://ik.imagekit.io/StringstackNaveen/bangles-1.webp',1),(20,130,'https://ik.imagekit.io/StringstackNaveen/bangle2.jpg',1),(21,131,'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp',1),(22,132,'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp',1),(23,133,'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg',1),(24,134,'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp',1),(25,135,'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp',1),(26,136,'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp',1),(27,137,'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp',1),(28,138,'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg',1),(29,139,'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp',1),(30,140,'https://ik.imagekit.io/StringstackSanjana/Platinum/BANG%203.webp',1),(31,141,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp',1),(32,142,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp',1),(33,143,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp',1),(34,144,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp',1),(35,145,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp',1),(36,146,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp',1),(37,147,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp',1),(38,148,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp',1),(39,149,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp',1),(40,150,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp',1)
ON CONFLICT DO NOTHING;

INSERT INTO productimages (image_id, product_id, image_url, is_thumbnail) VALUES (1,111,'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476', TRUE),(2,112,'https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792', TRUE),(3,113,'https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435', TRUE),(4,114,'https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167', TRUE),(5,115,'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171', TRUE),(6,116,'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402', TRUE),(7,117,'https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778', TRUE),(8,118,'https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366', TRUE),(9,119,'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553', TRUE),(10,120,'https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034', TRUE),(11,121,'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg', TRUE),(12,122,'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg', TRUE),(13,123,'https://ik.imagekit.io/StringstackNaveen/earrings.jpg', TRUE),(14,124,'https://ik.imagekit.io/StringstackNaveen/earings2.jpg', TRUE),(15,125,'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif', TRUE),(16,126,'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg', TRUE),(17,127,'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp', TRUE),(18,128,'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif', TRUE),(19,129,'https://ik.imagekit.io/StringstackNaveen/bangles-1.webp', TRUE),(20,130,'https://ik.imagekit.io/StringstackNaveen/bangle2.jpg', TRUE),(21,131,'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp', TRUE),(22,132,'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp', TRUE),(23,133,'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg', TRUE),(24,134,'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp', TRUE),(25,135,'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp', TRUE),(26,136,'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp', TRUE),(27,137,'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp', TRUE),(28,138,'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg', TRUE),(29,139,'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp', TRUE),(30,140,'https://ik.imagekit.io/StringstackSanjana/Platinum/BANG%203.webp', TRUE),(31,141,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp', TRUE),(32,142,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp', TRUE),(33,143,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp', TRUE),(34,144,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp', TRUE),(35,145,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp', TRUE),(36,146,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp', TRUE),(37,147,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp', TRUE),(38,148,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp', TRUE),(39,149,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp', TRUE),(40,150,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp', TRUE)
ON CONFLICT DO NOTHING;

UPDATE products SET product_id = id WHERE product_id IS NULL;
UPDATE categories SET category_id = id WHERE category_id IS NULL;
UPDATE categories SET category_name = name WHERE category_name IS NULL;

-- Price, Stock and Category Synchronization
UPDATE products SET price = 7914.29, stock = 5, stock_quantity = 5, category_id = 1 WHERE LOWER(name) LIKE '%nury chevron%';
UPDATE products SET price = 9642.86, stock = 5, stock_quantity = 5, category_id = 1 WHERE LOWER(name) LIKE '%trina ring%';
UPDATE products SET price = 7743.29, stock = 7, stock_quantity = 7, category_id = 1 WHERE LOWER(name) LIKE '%ozo stud%';
UPDATE products SET price = 9287.00, stock = 7, stock_quantity = 7, category_id = 1 WHERE LOWER(name) LIKE '%nuray%';
UPDATE products SET price = 12785.71, stock = 6, stock_quantity = 6, category_id = 1 WHERE LOWER(name) LIKE '%mazikeen%';
UPDATE products SET price = 14285.57, stock = 6, stock_quantity = 6, category_id = 1 WHERE LOWER(name) LIKE '%ryck princess%';
UPDATE products SET price = 9000.00, stock = 8, stock_quantity = 8, category_id = 1 WHERE LOWER(name) LIKE '%aelric%' OR LOWER(name) LIKE '%bracelite%';
UPDATE products SET price = 9200.00, stock = 8, stock_quantity = 8, category_id = 1 WHERE LOWER(name) LIKE '%resilent%' OR LOWER(name) LIKE '%resilient%';
UPDATE products SET price = 9571.43, stock = 4, stock_quantity = 4, category_id = 1 WHERE LOWER(name) LIKE '%line bangles%';
UPDATE products SET price = 10000.00, stock = 4, stock_quantity = 4, category_id = 1 WHERE LOWER(name) LIKE '%set bangles%';

UPDATE products SET price = 9000.00, stock = 6, stock_quantity = 6, category_id = 2 WHERE LOWER(name) LIKE '%spiral ring%';
UPDATE products SET price = 6600.00, stock = 6, stock_quantity = 6, category_id = 2 WHERE LOWER(name) LIKE '%leaf design%';
UPDATE products SET price = 8800.00, stock = 4, stock_quantity = 4, category_id = 2 WHERE LOWER(name) LIKE '%stud earrings%';
UPDATE products SET price = 9285.71, stock = 8, stock_quantity = 8, category_id = 2 WHERE LOWER(name) LIKE '%mahroosh%' OR LOWER(name) LIKE '%jhumka%';
UPDATE products SET price = 11111.00, stock = 3, stock_quantity = 3, category_id = 2 WHERE LOWER(name) LIKE '%lakshmi temple%';
UPDATE products SET price = 12698.29, stock = 3, stock_quantity = 3, category_id = 2 WHERE LOWER(name) LIKE '%lakshmi gold%';
UPDATE products SET price = 9162.40, stock = 2, stock_quantity = 2, category_id = 2 WHERE LOWER(name) LIKE '%gold beaded%';
UPDATE products SET price = 7712.40, stock = 8, stock_quantity = 8, category_id = 2 WHERE LOWER(name) LIKE '%textured gold%';
UPDATE products SET price = 65481.00, stock = 5, stock_quantity = 5, category_id = 2 WHERE LOWER(name) LIKE '%floral bangle%';
UPDATE products SET price = 65874.00, stock = 5, stock_quantity = 5, category_id = 2 WHERE LOWER(name) LIKE '%designer gold%';

UPDATE products SET price = 9004.20, stock = 8, stock_quantity = 8, category_id = 3 WHERE LOWER(name) LIKE '%vidh platinum%';
UPDATE products SET price = 9391.57, stock = 8, stock_quantity = 8, category_id = 3 WHERE LOWER(name) LIKE '%elegant floral%';
UPDATE products SET price = 6650.80, stock = 7, stock_quantity = 7, category_id = 3 WHERE LOWER(name) LIKE '%swirl stud%';
UPDATE products SET price = 6509.20, stock = 7, stock_quantity = 7, category_id = 3 WHERE LOWER(name) LIKE '%floral stud%';
UPDATE products SET price = 12842.71, stock = 1, stock_quantity = 1, category_id = 3 WHERE LOWER(name) LIKE '%emerald drop%';
UPDATE products SET price = 12556.86, stock = 1, stock_quantity = 1, category_id = 3 WHERE LOWER(name) LIKE '%solitaire platinum pendant%';
UPDATE products SET price = 9353.57, stock = 3, stock_quantity = 3, category_id = 3 WHERE LOWER(name) LIKE '%star motif platinum bracelet%';
UPDATE products SET price = 8124.86, stock = 3, stock_quantity = 3, category_id = 3 WHERE LOWER(name) LIKE '%floral two-tone%';
UPDATE products SET price = 9353.86, stock = 4, stock_quantity = 4, category_id = 3 WHERE LOWER(name) LIKE '%star- motif platinum bangles%' OR LOWER(name) LIKE '%star motif platinum bangles%';
UPDATE products SET price = 7807.86, stock = 5, stock_quantity = 5, category_id = 3 WHERE LOWER(name) LIKE '%eternity platinum%';

UPDATE products SET price = 6666.40, stock = 8, stock_quantity = 8, category_id = 4 WHERE LOWER(name) LIKE '%meris textured%';
UPDATE products SET price = 4542.40, stock = 8, stock_quantity = 8, category_id = 4 WHERE LOWER(name) LIKE '%butterfly ring%';
UPDATE products SET price = 4917.80, stock = 9, stock_quantity = 9, category_id = 4 WHERE LOWER(name) LIKE '%dangler earrings%';
UPDATE products SET price = 5517.20, stock = 9, stock_quantity = 9, category_id = 4 WHERE LOWER(name) LIKE '%ossum earrings%';
UPDATE products SET price = 9164.20, stock = 4, stock_quantity = 4, category_id = 4 WHERE LOWER(name) LIKE '%wisdom sterling%';
UPDATE products SET price = 9305.00, stock = 4, stock_quantity = 4, category_id = 4 WHERE LOWER(name) LIKE '%gargistone%' OR LOWER(name) LIKE '%gargi stone%';
UPDATE products SET price = 7936.29, stock = 3, stock_quantity = 3, category_id = 4 WHERE LOWER(name) LIKE '%flexi bracelet%';
UPDATE products SET price = 7048.20, stock = 3, stock_quantity = 3, category_id = 4 WHERE LOWER(name) LIKE '%chain bracelet%';
UPDATE products SET price = 8503.20, stock = 4, stock_quantity = 4, category_id = 4 WHERE LOWER(name) LIKE '%rewa bangles%';
UPDATE products SET price = 7912.80, stock = 4, stock_quantity = 4, category_id = 4 WHERE LOWER(name) LIKE '%sterling bangles%';

UPDATE products SET price = 12000.00, stock = 3, stock_quantity = 3, category_id = 1 WHERE LOWER(name) LIKE '%royal diamond choker%';
UPDATE products SET price = 7886.00, stock = 10, stock_quantity = 10, category_id = 2 WHERE LOWER(name) LIKE '%neckpice%';
UPDATE products SET price = 7896.00, stock = 9, stock_quantity = 9, category_id = 2 WHERE LOWER(name) LIKE '%long necklace%';
UPDATE products SET price = 5632.00, stock = 10, stock_quantity = 10, category_id = 2 WHERE LOWER(name) LIKE '%antique jumkas%';
UPDATE products SET price = 7986.00, stock = 10, stock_quantity = 10, category_id = 2 WHERE LOWER(name) LIKE '%kemp-green%';
UPDATE products SET price = 9889.00, stock = 10, stock_quantity = 10, category_id = 1 WHERE LOWER(name) LIKE '%stoned diamond%';
UPDATE products SET price = 9563.00, stock = 10, stock_quantity = 10, category_id = 1 WHERE LOWER(name) LIKE '%stoned ring%';
UPDATE products SET price = 6548.00, stock = 10, stock_quantity = 10, category_id = 3 WHERE LOWER(name) LIKE '%rose gold%';
UPDATE products SET price = 6541.00, stock = 10, stock_quantity = 10, category_id = 3 WHERE LOWER(name) LIKE '%square piece%';
UPDATE products SET price = 5469.00, stock = 10, stock_quantity = 10, category_id = 4 WHERE LOWER(name) LIKE '%ghungroo%';
UPDATE products SET price = 4589.00, stock = 10, stock_quantity = 10, category_id = 4 WHERE LOWER(name) LIKE '%navaratri%';

