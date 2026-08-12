-- PostgreSQL Dump Schema & Data for Alpha Jewels
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    category_id VARCHAR(100),
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    category_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY,
    product_id INT UNIQUE,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 10,
    weight VARCHAR(50),
    material VARCHAR(100),
    purity VARCHAR(50),
    is_active INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metal_type VARCHAR(100),
    gold_purity VARCHAR(50),
    diamond_details VARCHAR(255),
    stone_details VARCHAR(255),
    certificate_number VARCHAR(100),
    sku VARCHAR(100),
    discount NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    stock INT DEFAULT 10
);

CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INT,
    image_url TEXT NOT NULL,
    is_primary INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS productimages (
    id SERIAL PRIMARY KEY,
    product_id INT,
    image_url TEXT NOT NULL,
    is_thumbnail BOOLEAN DEFAULT TRUE
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_product_images_pid ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_productimages_pid ON productimages(product_id);

-- Insert Categories
INSERT INTO categories (id, category_id, name, created_at, image_url, status, category_name) VALUES 
(1,'Diamond','Diamond','2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE','Diamond'),
(2,'Gold','Gold','2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE','Gold'),
(3,'Platinum','Platinum','2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE','Platinum'),
(4,'Silver','Silver','2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE','Silver')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_name = EXCLUDED.category_name;

-- Insert Products from local MySQL Server 8.0 Workbench database
INSERT INTO products (id, category_id, name, description, price, stock_quantity, weight, material, purity, is_active, created_at, metal_type, gold_purity, diamond_details, stone_details, certificate_number, sku, discount, status, stock) VALUES 
(111,1,'Nury Chevron Ring','Nury Chevron Ring',7914.29,5,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',5),
(112,1,'The trina ring','beautifuly designed Trina',9642.86,5,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',5),
(113,1,'Ozo stud earing','Handmade Ozo earrings for women',7743.29,7,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',7),
(114,1,'Nuray earings','N-shaped Rings with pure gold',9287.00,7,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',7),
(115,1,'Mazikeen Necklace','Mazi-Queen Royal look Necklace',12785.71,6,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',6),
(116,1,'ryck princess','The ryck Princess Necklace',14285.57,6,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',6),
(117,1,'Bracelite','The Aelric Bracelet',9000.00,8,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(118,1,'resilent Bracelet','The Chain-typed Bracelet',9200.00,8,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(119,1,'Line Bangles','Royal elegent Bangles for women',9571.43,4,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(120,1,'Set Bangles','The Bazel-Set Bangles',10000.00,4,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(121,2,'Spiral Ring','Classic Spiral Gold Ring',9000.00,6,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',6),
(122,2,'leaf design Ring','Elegant Leaf Design Gold Ring',6600.00,6,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',6),
(123,2,'Stud Earrings','Temple Gold Stud Earrings',8800.00,4,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(124,2,'Mahroosh Diamond Necklace','Indriya Necklace by Aditya Birla',9285.71,8,'50g','Diamond','22K',1,'2026-07-27 17:05:09','Diamond','22K','VS1 / G-H Color','Natural Diamond','CERT-460634','SKU-124',2.00,'ACTIVE',8),
(125,2,' Lakshmi Temple Necklace','Beautifully designed Necklace',11111.00,3,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(126,2,'Lakshmi Gold Necklace','Wonderfully designed Necklace',12698.29,3,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(127,2,'Gold Beaded Bracelet','Handicrafted Bracelet for Women',9162.40,2,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',2),
(128,2,'Textured Gold Bracelet','Men Stylish and elogant look Bracelet',7712.40,8,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(131,3,'Vidh Platinum Solitire','Best Ring for men',9004.20,8,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(132,3,'Elegant floral Ring','Elegant floral Platinum Ring',9391.57,8,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(133,3,'Swirl Stud Earrings','Circular Earrings',6650.80,7,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',7),
(134,3,'Floral Stud Earrings','Flower Stud Earrings',6509.20,7,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',7),
(135,3,'Emerald Drop Platinum Necklece','Wonderfully Crafted Necklace for Women',12842.71,1,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',1),
(136,3,'Solitaire Platinum Pendant Necklace','Looking Gorgeous',12556.86,1,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',1),
(137,3,'Start Motif Platinum Bracelet','Start Bracelet',9353.57,3,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(138,3,'Floral Two-Tone Platinum Bracelet','Floral Two-Tone Platinum Bracelet',8124.86,3,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(139,3,'Start- Motif Platinum Bangles','Floral Two-Tone Platinum Bracelet',9353.86,4,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(140,3,'Eternity Platinum Bangle','Premium Bangles',7807.86,5,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',5),
(141,4,'Meris Textured Band Ring','Wonderful Silverplated Ring',6666.40,8,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(142,4,'Butterfly Ring','Adjustable silver Butterfly Ring',4542.40,8,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',8),
(143,4,'Dangler Earrings','Silver Flower Dangler Earrings',4917.80,9,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',9),
(144,4,'Ossum Earrings','Beautiful Eearings for Women',5517.20,9,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',9),
(145,4,'Wisdom Sterling Silver Necklace',' Infinite Wisdom Sterling Silver Necklace',9164.20,4,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(146,4,'GargiStone Necklace','Beautifully Crafted Stone Necklace',9305.00,4,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(147,4,'Flexi Bracelet','Fleur Flexi Bracelet in Silver',7936.29,3,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(148,4,'Chain Bracelet','Clara Womens Evil Eye Bracelet',7048.20,3,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',3),
(149,4,'Rewa Bangles','Beautiful Rewa Bangles',8503.20,4,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond','CERT-1786032118416','SKU-149-5255',0.00,'ACTIVE',4),
(150,4,'Sterling Bangles','Beautiful Sterling Bangles',7912.80,4,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',4),
(151,1,'Royal Diamond Choker','Exquisite Royal Choker',12000.00,3,'45g','Diamond','22K',1,'2026-07-27 17:05:09','Diamond','22K','VVS1 / D-F Color','Natural Diamond','CERT-789123','SKU-789123',5.00,'ACTIVE',3),
(155,2,'Neckpice Necklace','Beautifully crafted necklace for women',7886.00,10,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond','CERT-169134','SKU-6182',12.00,'ACTIVE',10),
(156,2,'Long Necklace','Antique Gold Necklace for women',7896.00,9,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond','CERT-998416','SKU-4784',5.00,'ACTIVE',9),
(157,2,'Antique Jumkas','Gold Plated One Gram Gold Antique Jhumkas',5632.00,10,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond','CERT-254490','SKU-3203',1.00,'ACTIVE',10),
(158,2,'Kemp-green Lakshmi Vankii','Antique gold tone kemp-green lakshmi peacock elephant nakshi 1 vankii',7986.00,10,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond','CERT-150187','SKU-2972',2.00,'ACTIVE',10),
(159,1,'Stoned Diamond Necklace','Beautiful stoned Necklace for women',9889.00,10,'10g','Gold','22K',1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond','CERT-895133','SKU-8443',-9.00,'ACTIVE',10),
(160,1,'Stoned Ring','A Beautiful Diamond Ring Stands in a Store Window. Stock Photo - Image of anniversary, bride',9563.00,10,'10g','Diamond','22K',1,'2026-07-27 17:05:09','Diamond','22K','VS1 / G-H Color','Natural Diamond','CERT-692581','SKU-4340',-15.00,'ACTIVE',10),
(161,3,'Rose Gold paltinum Necklace','Rose Gold paltinum Necklace',6548.00,10,'10g','Platinum','22K',1,'2026-07-27 17:05:09','Platinum','22K','VS1 / G-H Color','Natural Diamond','CERT-196220','SKU-8479',1.00,'ACTIVE',10),
(162,3,'Square Piece-Set Neckalce','Square Piece Step Necklace',6541.00,10,'10g','Platinum','22K',1,'2026-07-27 17:05:09','Platinum','22K','VS1 / G-H Color','Natural Diamond','CERT-888718','SKU-6208',2.00,'ACTIVE',10),
(163,4,'Ghungroo Jwellery Set','Ghungroo Studded Filigree Work Silver Plated Antique Jewellery Set',5469.00,10,'10g','Silver','22K',1,'2026-07-27 17:05:09','Silver','22K','VS1 / G-H Color','Natural Diamond','CERT-665227','SKU-7933',2.00,'ACTIVE',10),
(164,4,'Navaratri Jewellery','Silver Necklace, Navratri Jewellery',4589.00,10,'10g','Silver','22K',1,'2026-07-27 17:05:09','Silver','22K','VS1 / G-H Color','Natural Diamond','CERT-498819','SKU-3580',2.00,'ACTIVE',10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO product_images (id, product_id, image_url, is_primary) VALUES 
(1,111,'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476',1),
(2,112,'https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792',1),
(3,113,'https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435',1),
(4,114,'https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167',1),
(5,115,'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171',1),
(6,116,'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402',1),
(7,117,'https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778',1),
(8,118,'https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366',1),
(9,119,'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553',1),
(10,120,'https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034',1),
(11,121,'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg',1),
(12,122,'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg',1),
(13,123,'https://ik.imagekit.io/StringstackNaveen/earrings.jpg',1),
(15,125,'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif',1),
(16,126,'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg',1),
(17,127,'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp',1),
(18,128,'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif',1),
(21,131,'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp',1),
(22,132,'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp',1),
(23,133,'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg',1),
(24,134,'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp',1),
(25,135,'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp',1),
(26,136,'https://ik.imagekit.io/StringstackNaveen/necklace1.jpeg',1),
(27,137,'https://ik.imagekit.io/StringstackNaveen/bracelet.jpg',1),
(28,138,'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg',1),
(29,139,'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp',1),
(30,140,'https://ik.imagekit.io/StringstackNaveen/platinum%20bangle.jpg',1),
(31,141,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp',1),
(32,142,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp',1),
(33,143,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp',1),
(34,144,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp',1),
(35,145,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp',1),
(36,146,'https://ik.imagekit.io/StringstackNaveen/silver%20necklace.webp',1),
(37,147,'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet.jpg',1),
(38,148,'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet2.jpg',1),
(41,124,'https://ik.imagekit.io/StringstackNaveen/earings2.jpg',1),
(42,151,'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',1),
(49,149,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxvNTouHpMaDkVQE0EBj9ACaFYTpdnjHseaPqkPxpqLQ&s=10',1),
(50,155,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFjFl-t7B2tgiTFxwu0DjLM06_sGl06qvLn9_ZQj29gg&s=10',1),
(51,156,'https://cpimg.tistatic.com/07549410/b/4/Antique-Gold-Long-Necklace.jpg',1),
(52,157,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUGXcUrPc96aQ0Bkex6Iz88U2rtbIhTsRHaKhuIvqvBgfiiWOgJ680coY&s=10',1),
(53,158,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsSouth25K9Qof9iRlt-NmhGjWBoWjbnY4NX8fYX1ElA&s=10',1),
(54,159,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeg4gTnQNB8QwFa2NabGCY6GIyuk-O5YgHPh0lWk89FQ&s=10',1),
(55,160,'https://thumbs.dreamstime.com/b/beautiful-diamond-ring-stands-store-window-306068234.jpg',1),
(56,161,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsGuP29OiLm3h8E4bWxCr_6IkP3o_Pn86YyBk_3tqsAw&s=10',1),
(57,162,'https://5.imimg.com/data5/SELLER/Default/2025/12/566237565/GW/XI/IP/103582308/platinum-jewelry-500x500.jpg',1),
(58,163,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtETkKAxYb9cdrBBVOBDlQMWvWmvMdaWGq2OvoOOXWbtVwR4zmQVLEPh8b&s=10',1),
(59,164,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_jhWvKIVjAe9n7QaDN6uMFMb_IPmbINqHvMHp7p9A9z2K_GiGMpDIiz8&s=10',1)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;

INSERT INTO productimages (id, product_id, image_url, is_thumbnail) VALUES 
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE),
(undefined,undefined,'undefined',TRUE)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;

UPDATE products SET price = 7914.29, stock = 5, name = 'Nury Chevron Ring' WHERE id = 111;
UPDATE products SET price = 9642.86, stock = 5, name = 'The trina ring' WHERE id = 112;
UPDATE products SET price = 7743.29, stock = 7, name = 'Ozo stud earing' WHERE id = 113;
UPDATE products SET price = 9287.00, stock = 7, name = 'Nuray earings' WHERE id = 114;
UPDATE products SET price = 12785.71, stock = 6, name = 'Mazikeen Necklace' WHERE id = 115;
UPDATE products SET price = 14285.57, stock = 6, name = 'ryck princess' WHERE id = 116;
UPDATE products SET price = 9000.00, stock = 8, name = 'Bracelite' WHERE id = 117;
UPDATE products SET price = 9200.00, stock = 8, name = 'resilent Bracelet' WHERE id = 118;
UPDATE products SET price = 9571.43, stock = 4, name = 'Line Bangles' WHERE id = 119;
UPDATE products SET price = 10000.00, stock = 4, name = 'Set Bangles' WHERE id = 120;
UPDATE products SET price = 9000.00, stock = 6, name = 'Spiral Ring' WHERE id = 121;
UPDATE products SET price = 6600.00, stock = 6, name = 'leaf design Ring' WHERE id = 122;
UPDATE products SET price = 8800.00, stock = 4, name = 'Stud Earrings' WHERE id = 123;
UPDATE products SET price = 9285.71, stock = 8, name = 'Mahroosh Diamond Necklace' WHERE id = 124;
UPDATE products SET price = 11111.00, stock = 3, name = ' Lakshmi Temple Necklace' WHERE id = 125;
UPDATE products SET price = 12698.29, stock = 3, name = 'Lakshmi Gold Necklace' WHERE id = 126;
UPDATE products SET price = 9162.40, stock = 2, name = 'Gold Beaded Bracelet' WHERE id = 127;
UPDATE products SET price = 7712.40, stock = 8, name = 'Textured Gold Bracelet' WHERE id = 128;
UPDATE products SET price = 9004.20, stock = 8, name = 'Vidh Platinum Solitire' WHERE id = 131;
UPDATE products SET price = 9391.57, stock = 8, name = 'Elegant floral Ring' WHERE id = 132;
UPDATE products SET price = 6650.80, stock = 7, name = 'Swirl Stud Earrings' WHERE id = 133;
UPDATE products SET price = 6509.20, stock = 7, name = 'Floral Stud Earrings' WHERE id = 134;
UPDATE products SET price = 12842.71, stock = 1, name = 'Emerald Drop Platinum Necklece' WHERE id = 135;
UPDATE products SET price = 12556.86, stock = 1, name = 'Solitaire Platinum Pendant Necklace' WHERE id = 136;
UPDATE products SET price = 9353.57, stock = 3, name = 'Start Motif Platinum Bracelet' WHERE id = 137;
UPDATE products SET price = 8124.86, stock = 3, name = 'Floral Two-Tone Platinum Bracelet' WHERE id = 138;
UPDATE products SET price = 9353.86, stock = 4, name = 'Start- Motif Platinum Bangles' WHERE id = 139;
UPDATE products SET price = 7807.86, stock = 5, name = 'Eternity Platinum Bangle' WHERE id = 140;
UPDATE products SET price = 6666.40, stock = 8, name = 'Meris Textured Band Ring' WHERE id = 141;
UPDATE products SET price = 4542.40, stock = 8, name = 'Butterfly Ring' WHERE id = 142;
UPDATE products SET price = 4917.80, stock = 9, name = 'Dangler Earrings' WHERE id = 143;
UPDATE products SET price = 5517.20, stock = 9, name = 'Ossum Earrings' WHERE id = 144;
UPDATE products SET price = 9164.20, stock = 4, name = 'Wisdom Sterling Silver Necklace' WHERE id = 145;
UPDATE products SET price = 9305.00, stock = 4, name = 'GargiStone Necklace' WHERE id = 146;
UPDATE products SET price = 7936.29, stock = 3, name = 'Flexi Bracelet' WHERE id = 147;
UPDATE products SET price = 7048.20, stock = 3, name = 'Chain Bracelet' WHERE id = 148;
UPDATE products SET price = 8503.20, stock = 4, name = 'Rewa Bangles' WHERE id = 149;
UPDATE products SET price = 7912.80, stock = 4, name = 'Sterling Bangles' WHERE id = 150;
UPDATE products SET price = 12000.00, stock = 3, name = 'Royal Diamond Choker' WHERE id = 151;
UPDATE products SET price = 7886.00, stock = 10, name = 'Neckpice Necklace' WHERE id = 155;
UPDATE products SET price = 7896.00, stock = 9, name = 'Long Necklace' WHERE id = 156;
UPDATE products SET price = 5632.00, stock = 10, name = 'Antique Jumkas' WHERE id = 157;
UPDATE products SET price = 7986.00, stock = 10, name = 'Kemp-green Lakshmi Vankii' WHERE id = 158;
UPDATE products SET price = 9889.00, stock = 10, name = 'Stoned Diamond Necklace' WHERE id = 159;
UPDATE products SET price = 9563.00, stock = 10, name = 'Stoned Ring' WHERE id = 160;
UPDATE products SET price = 6548.00, stock = 10, name = 'Rose Gold paltinum Necklace' WHERE id = 161;
UPDATE products SET price = 6541.00, stock = 10, name = 'Square Piece-Set Neckalce' WHERE id = 162;
UPDATE products SET price = 5469.00, stock = 10, name = 'Ghungroo Jwellery Set' WHERE id = 163;
UPDATE products SET price = 4589.00, stock = 10, name = 'Navaratri Jewellery' WHERE id = 164;
