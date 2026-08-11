package com.jewellery.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            seedCategories();
            seedProductsAndImages();
        } catch (Exception e) {
            System.err.println("DatabaseSeeder error: " + e.getMessage());
        }
    }

    private void seedCategories() {
        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS categories (" +
                    "category_id SERIAL PRIMARY KEY, " +
                    "id INT, " +
                    "category_name VARCHAR(100) NOT NULL UNIQUE, " +
                    "name VARCHAR(100), " +
                    "description TEXT, " +
                    "image_url VARCHAR(500), " +
                    "status VARCHAR(20) DEFAULT 'ACTIVE', " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                    ")");
        } catch (Exception ignored) {}

        try {
            String[] cats = {"Diamond", "Gold", "Platinum", "Silver", "Bridal"};
            for (int i = 0; i < cats.length; i++) {
                String cat = cats[i];
                int catId = i + 1;
                try {
                    jdbcTemplate.update(
                            "INSERT INTO categories (category_id, id, category_name, name, description, image_url, status) " +
                            "VALUES (?, ?, ?, ?, ?, 'https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80', 'ACTIVE') " +
                            "ON CONFLICT DO NOTHING",
                            catId, catId, cat, cat, cat + " luxury jewellery collection"
                    );
                } catch (Exception ignored) {}
            }
        } catch (Exception ignored) {}
    }

    private void seedProductsAndImages() {
        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS products (" +
                    "product_id SERIAL PRIMARY KEY, " +
                    "id INT, " +
                    "name VARCHAR(255) NOT NULL, " +
                    "category_id INT, " +
                    "description TEXT, " +
                    "price DECIMAL(12, 2) NOT NULL DEFAULT 0.00, " +
                    "discount DECIMAL(5, 2) DEFAULT 0.00, " +
                    "stock INT NOT NULL DEFAULT 10, " +
                    "weight VARCHAR(50) DEFAULT '10g', " +
                    "metal_type VARCHAR(50) DEFAULT 'Gold', " +
                    "gold_purity VARCHAR(50) DEFAULT '22K', " +
                    "diamond_details VARCHAR(255) DEFAULT 'VS1 / G-H Color', " +
                    "stone_details VARCHAR(255) DEFAULT 'Natural Diamond', " +
                    "certificate_number VARCHAR(100), " +
                    "sku VARCHAR(100), " +
                    "status VARCHAR(20) DEFAULT 'ACTIVE', " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                    ")");
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS productimages (" +
                    "image_id SERIAL PRIMARY KEY, " +
                    "product_id INT NOT NULL, " +
                    "image_url TEXT, " +
                    "is_thumbnail BOOLEAN DEFAULT TRUE" +
                    ")");
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS product_images (" +
                    "id SERIAL PRIMARY KEY, " +
                    "product_id INT NOT NULL, " +
                    "image_url TEXT, " +
                    "is_primary INT DEFAULT 1" +
                    ")");
        } catch (Exception ignored) {}

        // Product array definition
        Object[][] products = {
            // ID, Name, CategoryID, Description, Price, Stock, ImageURL
            {111, "Nury Chevron Ring", 1, "Nury Chevron Ring", 55400.00, 10, "https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476"},
            {112, "The Trina Ring", 1, "Beautifully Designed Trina", 67500.00, 10, "https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792"},
            {113, "Ozo Stud Earring", 1, "Handmade Ozo Earrings for Women", 54203.00, 10, "https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435"},
            {114, "Nuray Earrings", 1, "N-Shaped Earrings", 65009.00, 10, "https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167"},
            {115, "Mazikeen Necklace", 1, "Mazi-Queen Royal Look Necklace", 89500.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171"},
            {116, "Ryck Princess Necklace", 1, "The Ryck Princess Necklace", 99999.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402"},
            {117, "Aelric Bracelet", 1, "The Aelric Bracelet", 45000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778"},
            {118, "Resilient Bracelet", 1, "The Chain-Type Bracelet", 46000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366"},
            {119, "Line Bangles", 1, "Royal Elegant Bangles for Women", 67000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553"},
            {120, "Set Bangles", 1, "The Bazel Set Bangles", 70000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034"},
            {121, "Spiral Ring", 2, "Classic Spiral Gold Ring", 45000.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg"},
            {122, "Leaf Design Ring", 2, "Elegant Leaf Design Gold Ring", 33000.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg"},
            {123, "Stud Earrings", 2, "Temple Gold Stud Earrings", 44000.00, 10, "https://ik.imagekit.io/StringstackNaveen/earrings.jpg"},
            {124, "Jhumka Earrings", 2, "Gold Jhumka Earrings", 36411.00, 10, "https://ik.imagekit.io/StringstackNaveen/earings2.jpg"},
            {125, "Lakshmi Temple Necklace", 2, "Beautifully Designed Necklace", 77777.00, 10, "https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif"},
            {126, "Lakshmi Gold Necklace", 2, "Wonderfully Designed Necklace", 88888.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace2.jpg"},
            {127, "Gold Beaded Bracelet", 2, "Handcrafted Bracelet for Women", 45812.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelite1.webp"},
            {128, "Textured Gold Bracelet", 2, "Stylish Gold Bracelet for Men", 38562.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif"},
            {129, "Floral Bangle Set", 2, "Wonderfully Crafted Bangles", 65481.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangles-1.webp"},
            {130, "Designer Gold Bangles", 2, "Beautifully Crafted Bangles", 65874.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle2.jpg"},
            {131, "Vidh Platinum Solitaire", 3, "Best Ring for Men", 45021.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp"},
            {132, "Elegant Floral Ring", 3, "Elegant Floral Platinum Ring", 65741.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp"},
            {133, "Swirl Stud Earrings", 3, "Circular Platinum Earrings", 33254.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg"},
            {134, "Floral Stud Earrings", 3, "Flower Platinum Stud Earrings", 32546.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp"},
            {135, "Emerald Drop Platinum Necklace", 3, "Wonderfully Crafted Necklace for Women", 89899.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp"},
            {136, "Solitaire Platinum Pendant Necklace", 3, "Looking Gorgeous", 87898.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp"},
            {137, "Star Motif Platinum Bracelet", 3, "Star Motif Platinum Bracelet", 65475.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp"},
            {138, "Floral Two-Tone Platinum Bracelet", 3, "Floral Two-Tone Platinum Bracelet", 56874.00, 10, "https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg"},
            {139, "Star Motif Platinum Bangles", 3, "Premium Platinum Bangles", 65477.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp"},
            {140, "Eternity Platinum Bangle", 3, "Premium Platinum Bangle", 54655.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/BANG%203.webp"},
            {141, "Meris Textured Band Ring", 4, "Wonderful Silver Plated Ring", 33332.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp"},
            {142, "Butterfly Ring", 4, "Adjustable Silver Butterfly Ring", 22712.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp"},
            {143, "Dangler Earrings", 4, "Silver Flower Dangler Earrings", 24589.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp"},
            {144, "Ossum Earrings", 4, "Beautiful Earrings for Women", 27586.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp"},
            {145, "Wisdom Sterling Silver Necklace", 4, "Infinite Wisdom Sterling Silver Necklace", 45821.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp"},
            {146, "Gargi Stone Necklace", 4, "Beautifully Crafted Stone Necklace", 46525.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp"},
            {147, "Flexi Bracelet", 4, "Fleur Flexi Bracelet in Silver", 55554.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp"},
            {148, "Chain Bracelet", 4, "Clara Women's Evil Eye Bracelet", 35241.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp"},
            {149, "Rewa Bangles", 4, "Rounded Rewa Silver Bangles", 42516.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp"},
            {150, "Sterling Bangles", 4, "Sterling Silver Unique Bangles for Women", 39564.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp"},
            // WorkBench items:
            {157, "Antique Jumkas", 2, "Gold Plated One Gram Gold Antique Jumkas", 5632.00, 10, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"},
            {158, "Kemp-green Lakshmi Necklace", 2, "Antique gold tone kemp-green lakshmi necklace", 7986.00, 10, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {159, "Stoned Diamond Necklace", 1, "Beautiful stoned Necklace for women", 9889.00, 10, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {160, "Stoned Ring", 1, "A Beautiful Diamond Ring Stands in solitaire", 9563.00, 10, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"},
            {161, "Rose Gold Platinum Set", 3, "Rose Gold Platinum Collection", 6548.00, 10, "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80"},
            {162, "Square Piece-Set Necklace", 3, "Square Piece Step Necklace", 6541.00, 10, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {163, "Ghungroo Jewellery Set", 4, "Ghungroo Studded Filigree Work Silver Set", 5469.00, 10, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"},
            {164, "Navaratri Jewellery", 4, "Silver Necklace, Navratri Jewellery", 4589.00, 10, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"}
        };

        for (Object[] p : products) {
            int pId = (Integer) p[0];
            String name = (String) p[1];
            int catId = (Integer) p[2];
            String desc = (String) p[3];
            double price = (Double) p[4];
            int stock = (Integer) p[5];
            String imgUrl = (String) p[6];

            try {
                // Upsert product
                Integer existingCount = 0;
                try { existingCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products WHERE product_id = ? OR id = ?", Integer.class, pId, pId); } catch (Exception ignored) {}
                if (existingCount == null || existingCount == 0) {
                    jdbcTemplate.update(
                            "INSERT INTO products (product_id, id, name, category_id, description, price, stock, status) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')",
                            pId, pId, name, catId, desc, price, stock
                    );
                } else {
                    jdbcTemplate.update(
                            "UPDATE products SET name = ?, category_id = ?, description = ?, price = ?, stock = ? WHERE product_id = ? OR id = ?",
                            name, catId, desc, price, stock, pId, pId
                    );
                }

                // Upsert image
                try {
                    jdbcTemplate.update(
                            "INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)",
                            pId, imgUrl
                    );
                } catch (Exception ignored) {}

                try {
                    jdbcTemplate.update(
                            "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)",
                            pId, imgUrl
                    );
                } catch (Exception ignored) {}

            } catch (Exception ignored) {}
        }
    }
}
