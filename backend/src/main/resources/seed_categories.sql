USE ecommerce_db;

INSERT IGNORE INTO categories (id, name, description, status) VALUES 
(1, 'Diamond', 'Luxury Diamond Collection', 'ACTIVE'),
(2, 'Gold', 'Royal Gold Collection', 'ACTIVE'),
(3, 'Platinum', 'Modern Platinum Collection', 'ACTIVE'),
(4, 'Silver', 'Fine Sterling Silver Collection', 'ACTIVE');

UPDATE products SET category_id = 1 WHERE id BETWEEN 111 AND 120;
UPDATE products SET category_id = 2 WHERE id BETWEEN 121 AND 130;
UPDATE products SET category_id = 3 WHERE id BETWEEN 131 AND 140;
UPDATE products SET category_id = 4 WHERE id BETWEEN 141 AND 150;
