-- Clean Truncate and Reseed Script for Render PostgreSQL
-- Deletes ALL legacy mock/test products so database contains 100% ONLY MySQL Workbench items!
DELETE FROM productimages;
DELETE FROM product_images;
DELETE FROM products;

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
    product_id INT,
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

INSERT INTO categories (id, category_id, name, created_at, image_url, status, category_name) VALUES 
(1,'Diamond','Diamond','2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE','Diamond'),
(2,'Gold','Gold','2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE','Gold'),
(3,'Platinum','Platinum','2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE','Platinum'),
(4,'Silver','Silver','2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE','Silver')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_name = EXCLUDED.category_name;

INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (111, 111, 1, 'Nury Chevron Ring', 'Nury Chevron Ring', 7914.29, 5, 5, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (111, 'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (111, 'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (112, 112, 1, 'The trina ring', 'beautifuly designed Trina', 9642.86, 5, 5, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (112, 'https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (112, 'https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (113, 113, 1, 'Ozo stud earing', 'Handmade Ozo earrings for women', 7743.29, 7, 7, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (113, 'https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (113, 'https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (114, 114, 1, 'Nuray earings', 'N-shaped Rings with pure gold', 9287, 7, 7, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (114, 'https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (114, 'https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (115, 115, 1, 'Mazikeen Necklace', 'Mazi-Queen Royal look Necklace', 12785.71, 6, 6, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (115, 'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (115, 'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (116, 116, 1, 'ryck princess', 'The ryck Princess Necklace', 14285.57, 6, 6, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (116, 'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (116, 'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (117, 117, 1, 'Bracelite', 'The Aelric Bracelet', 9000, 8, 8, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (117, 'https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (117, 'https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (118, 118, 1, 'resilent Bracelet', 'The Chain-typed Bracelet', 9200, 8, 8, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (118, 'https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (118, 'https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (119, 119, 1, 'Line Bangles', 'Royal elegent Bangles for women', 9571.43, 4, 4, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (119, 'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (119, 'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (120, 120, 1, 'Set Bangles', 'The Bazel-Set Bangles', 10000, 4, 4, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (120, 'https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (120, 'https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (121, 121, 2, 'Spiral Ring', 'Classic Spiral Gold Ring', 9000, 6, 6, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (121, 'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (121, 'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (122, 122, 2, 'leaf design Ring', 'Elegant Leaf Design Gold Ring', 6600, 6, 6, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (122, 'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (122, 'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (123, 123, 2, 'Stud Earrings', 'Temple Gold Stud Earrings', 8800, 4, 4, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (123, 'https://ik.imagekit.io/StringstackNaveen/earrings.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (123, 'https://ik.imagekit.io/StringstackNaveen/earrings.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (124, 124, 2, 'Mahroosh Diamond Necklace', 'Indriya Necklace by Aditya Birla', 9285.71, 8, 8, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (124, 'https://ik.imagekit.io/StringstackNaveen/earings2.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (124, 'https://ik.imagekit.io/StringstackNaveen/earings2.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (125, 125, 2, 'Lakshmi Temple Necklace', 'Beautifully designed Necklace', 11111, 3, 3, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (125, 'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (125, 'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (126, 126, 2, 'Lakshmi Gold Necklace', 'Wonderfully designed Necklace', 12698.29, 3, 3, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (126, 'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (126, 'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (127, 127, 2, 'Gold Beaded Bracelet', 'Handicrafted Bracelet for Women', 9162.4, 2, 2, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (127, 'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (127, 'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (128, 128, 2, 'Textured Gold Bracelet', 'Men Stylish and elogant look Bracelet', 7712.4, 8, 8, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (128, 'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (128, 'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (131, 131, 3, 'Vidh Platinum Solitire', 'Best Ring for men', 9004.2, 8, 8, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (131, 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (131, 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (132, 132, 3, 'Elegant floral Ring', 'Elegant floral Platinum Ring', 9391.57, 8, 8, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (132, 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (132, 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (133, 133, 3, 'Swirl Stud Earrings', 'Circular Earrings', 6650.8, 7, 7, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (133, 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (133, 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (134, 134, 3, 'Floral Stud Earrings', 'Flower Stud Earrings', 6509.2, 7, 7, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (134, 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (134, 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (135, 135, 3, 'Emerald Drop Platinum Necklece', 'Wonderfully Crafted Necklace for Women', 12842.71, 1, 1, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (135, 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (135, 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (136, 136, 3, 'Solitaire Platinum Pendant Necklace', 'Looking Gorgeous', 12556.86, 1, 1, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (136, 'https://ik.imagekit.io/StringstackNaveen/necklace1.jpeg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (136, 'https://ik.imagekit.io/StringstackNaveen/necklace1.jpeg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (137, 137, 3, 'Start Motif Platinum Bracelet', 'Start Bracelet', 9353.57, 3, 3, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (137, 'https://ik.imagekit.io/StringstackNaveen/bracelet.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (137, 'https://ik.imagekit.io/StringstackNaveen/bracelet.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (138, 138, 3, 'Floral Two-Tone Platinum Bracelet', 'Floral Two-Tone Platinum Bracelet', 8124.86, 3, 3, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (138, 'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (138, 'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (139, 139, 3, 'Start- Motif Platinum Bangles', 'Floral Two-Tone Platinum Bracelet', 9353.86, 4, 4, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (139, 'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (139, 'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (140, 140, 3, 'Eternity Platinum Bangle', 'Premium Bangles', 7807.86, 5, 5, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (140, 'https://ik.imagekit.io/StringstackNaveen/platinum%20bangle.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (140, 'https://ik.imagekit.io/StringstackNaveen/platinum%20bangle.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (141, 141, 4, 'Meris Textured Band Ring', 'Wonderful Silverplated Ring', 6666.4, 8, 8, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (141, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (141, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (142, 142, 4, 'Butterfly Ring', 'Adjustable silver Butterfly Ring', 4542.4, 8, 8, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (142, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (142, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (143, 143, 4, 'Dangler Earrings', 'Silver Flower Dangler Earrings', 4917.8, 9, 9, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (143, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (143, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (144, 144, 4, 'Ossum Earrings', 'Beautiful Eearings for Women', 5517.2, 9, 9, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (144, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (144, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (145, 145, 4, 'Wisdom Sterling Silver Necklace', 'Infinite Wisdom Sterling Silver Necklace', 9164.2, 4, 4, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (145, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (145, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (146, 146, 4, 'GargiStone Necklace', 'Beautifully Crafted Stone Necklace', 9305, 4, 4, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (146, 'https://ik.imagekit.io/StringstackNaveen/silver%20necklace.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (146, 'https://ik.imagekit.io/StringstackNaveen/silver%20necklace.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (147, 147, 4, 'Flexi Bracelet', 'Fleur Flexi Bracelet in Silver', 7936.29, 3, 3, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (147, 'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (147, 'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (148, 148, 4, 'Chain Bracelet', 'Clara Womens Evil Eye Bracelet', 7048.2, 3, 3, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (148, 'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet2.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (148, 'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet2.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (149, 149, 4, 'Rewa Bangles', 'Beautiful Rewa Bangles', 8503.2, 4, 4, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (149, 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=600&q=80', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (149, 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=600&q=80', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (150, 150, 4, 'Sterling Bangles', 'Beautiful Sterling Bangles', 7912.8, 4, 4, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (150, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (150, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (151, 151, 4, 'Royal Diamond Choker', 'Exquisite Royal Choker', 12000, 3, 3, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (151, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (151, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (155, 155, 2, 'Neckpice Necklace', 'Beautifully crafted necklace for women', 7886, 10, 10, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (155, 'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (155, 'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (156, 156, 2, 'Long Necklace', 'Antique Gold Necklace for women', 7896, 9, 9, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (156, 'https://cpimg.tistatic.com/07549410/b/4/Antique-Gold-Long-Necklace.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (156, 'https://cpimg.tistatic.com/07549410/b/4/Antique-Gold-Long-Necklace.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (157, 157, 2, 'Antique Jumkas', 'Gold Plated One Gram Gold Antique Jhumkas', 5632, 10, 10, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (157, 'https://ik.imagekit.io/StringstackNaveen/earrings.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (157, 'https://ik.imagekit.io/StringstackNaveen/earrings.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (158, 158, 2, 'Kemp-green Lakshmi Vankii', 'Antique gold tone kemp-green lakshmi peacock elephant nakshi 1 vankii', 7986, 10, 10, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (158, 'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (158, 'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (159, 159, 1, 'Stoned Diamond Necklace', 'Beautiful stoned Necklace for women', 9889, 10, 10, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (159, 'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (159, 'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (160, 160, 1, 'Stoned Ring', 'A Beautiful Diamond Ring Stands in a Store Window. Stock Photo - Image of anniversary, bride', 9563, 10, 10, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (160, 'https://thumbs.dreamstime.com/b/beautiful-diamond-ring-stands-store-window-306068234.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (160, 'https://thumbs.dreamstime.com/b/beautiful-diamond-ring-stands-store-window-306068234.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (161, 161, 3, 'Rose Gold paltinum Necklace', 'Rose Gold paltinum Necklace', 6548, 10, 10, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (161, 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (161, 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (162, 162, 3, 'Square Piece-Set Neckalce', 'Square Piece Step Necklace', 6541, 10, 10, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (162, 'https://5.imimg.com/data5/SELLER/Default/2025/12/566237565/GW/XI/IP/103582308/platinum-jewelry-500x500.jpg', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (162, 'https://5.imimg.com/data5/SELLER/Default/2025/12/566237565/GW/XI/IP/103582308/platinum-jewelry-500x500.jpg', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (163, 163, 4, 'Ghungroo Jwellery Set', 'Ghungroo Studded Filigree Work Silver Plated Antique Jewellery Set', 5469, 10, 10, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (163, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (163, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp', TRUE);
INSERT INTO products (id, product_id, category_id, name, description, price, stock, stock_quantity, status) VALUES (164, 164, 4, 'Navaratri Jewellery', 'Silver Necklace, Navratri Jewellery', 4589, 10, 10, 'ACTIVE') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description, category_id = EXCLUDED.category_id, stock = EXCLUDED.stock, stock_quantity = EXCLUDED.stock_quantity;
INSERT INTO product_images (product_id, image_url, is_primary) VALUES (164, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp', 1);
INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (164, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp', TRUE);
