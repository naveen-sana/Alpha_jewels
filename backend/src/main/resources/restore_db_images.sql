USE ecommerce_db;

-- Clear previous images to ensure exact ImageKit URLs
DELETE FROM product_images WHERE product_id BETWEEN 111 AND 150;
DELETE FROM productimages WHERE product_id BETWEEN 111 AND 150;

-- Diamond Collection (111-120) -> StringstackNaveen
INSERT INTO product_images (product_id, image_url) VALUES 
(111, 'https://ik.imagekit.io/StringstackNaveen/Image1.webp'),
(112, 'https://ik.imagekit.io/StringstackNaveen/image2.webp'),
(113, 'https://ik.imagekit.io/StringstackNaveen/image3.webp'),
(114, 'https://ik.imagekit.io/StringstackNaveen/image4.webp'),
(115, 'https://ik.imagekit.io/StringstackNaveen/image5.webp'),
(116, 'https://ik.imagekit.io/StringstackNaveen/image6.webp'),
(117, 'https://ik.imagekit.io/StringstackNaveen/image7.webp'),
(118, 'https://ik.imagekit.io/StringstackNaveen/image8.webp'),
(119, 'https://ik.imagekit.io/StringstackNaveen/image9.webp'),
(120, 'https://ik.imagekit.io/StringstackNaveen/image10.webp');

-- Gold Collection (121-130) -> StringstackSanjana
INSERT INTO product_images (product_id, image_url) VALUES 
(121, 'https://ik.imagekit.io/StringstackSanjana/goldImages/image1.webp'),
(122, 'https://ik.imagekit.io/StringstackSanjana/goldImages/image2.webp'),
(123, 'https://ik.imagekit.io/StringstackSanjana/goldImages/image3.webp'),
(124, 'https://ik.imagekit.io/StringstackSanjana/goldImages/image4.webp'),
(125, 'https://ik.imagekit.io/StringstackSanjana/goldImages/image5.webp'),
(126, 'https://ik.imagekit.io/StringstackSanjana/goldImages/image6.webp'),
(127, 'https://ik.imagekit.io/StringstackSanjana/goldImages/image7.webp'),
(128, 'https://ik.imagekit.io/StringstackSanjana/goldImages/image8.webp'),
(129, 'https://ik.imagekit.io/StringstackSanjana/goldImages/image9.webp'),
(130, 'https://ik.imagekit.io/StringstackSanjana/goldImages/image10.webp');

-- Platinum Collection (131-140) -> StringStackSavitri
INSERT INTO product_images (product_id, image_url) VALUES 
(131, 'https://ik.imagekit.io/StringStackSavitri/PlatinumImages/image1.webp'),
(132, 'https://ik.imagekit.io/StringStackSavitri/PlatinumImages/image2.webp'),
(133, 'https://ik.imagekit.io/StringStackSavitri/PlatinumImages/image3.webp'),
(134, 'https://ik.imagekit.io/StringStackSavitri/PlatinumImages/image4.webp'),
(135, 'https://ik.imagekit.io/StringStackSavitri/PlatinumImages/image5.webp'),
(136, 'https://ik.imagekit.io/StringStackSavitri/PlatinumImages/image6.webp'),
(137, 'https://ik.imagekit.io/StringStackSavitri/PlatinumImages/image7.webp'),
(138, 'https://ik.imagekit.io/StringStackSavitri/PlatinumImages/image8.webp'),
(139, 'https://ik.imagekit.io/StringStackSavitri/PlatinumImages/image9.webp'),
(140, 'https://ik.imagekit.io/StringStackSavitri/PlatinumImages/image10.webp');

-- Silver Collection (141-150) -> StringStackSavitri
INSERT INTO product_images (product_id, image_url) VALUES 
(141, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp'),
(142, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp'),
(143, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp'),
(144, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp'),
(145, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp'),
(146, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp'),
(147, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp'),
(148, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp'),
(149, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp'),
(150, 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp');

-- Mirror to productimages table as well
INSERT INTO productimages (product_id, image_url, is_thumbnail)
SELECT product_id, image_url, TRUE FROM product_images;
