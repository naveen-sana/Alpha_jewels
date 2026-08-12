package com.jewellery.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            seedTablesAndProducts();
        } catch (Exception e) {
            System.err.println("DatabaseSeeder error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Integer getOrCreateCategoryId(String catName) {
        try {
            List<Integer> list = jdbcTemplate.queryForList("SELECT COALESCE(category_id, id) FROM categories WHERE LOWER(category_name) = LOWER(?) OR LOWER(name) = LOWER(?) LIMIT 1", Integer.class, catName, catName);
            if (list != null && !list.isEmpty() && list.get(0) != null) {
                return list.get(0);
            }
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.update("INSERT INTO categories (category_name, name, description, status) VALUES (?, ?, ?, 'ACTIVE')", catName, catName, catName + " collection");
            List<Integer> list = jdbcTemplate.queryForList("SELECT COALESCE(category_id, id) FROM categories WHERE LOWER(category_name) = LOWER(?) OR LOWER(name) = LOWER(?) LIMIT 1", Integer.class, catName, catName);
            if (list != null && !list.isEmpty() && list.get(0) != null) {
                return list.get(0);
            }
        } catch (Exception ignored) {}

        return 1;
    }

    private void seedTablesAndProducts() {
        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS categories (" +
                    "category_id SERIAL PRIMARY KEY, " +
                    "category_name VARCHAR(100) NOT NULL UNIQUE, " +
                    "name VARCHAR(100), " +
                    "description TEXT, " +
                    "image_url VARCHAR(500), " +
                    "status VARCHAR(20) DEFAULT 'ACTIVE'" +
                    ")");
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS products (" +
                    "product_id SERIAL PRIMARY KEY, " +
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
                    "status VARCHAR(20) DEFAULT 'ACTIVE'" +
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

        // Product array definition: {Name, CategoryName, Description, Price, Stock, ImageURL}
        Object[][] products = {
            {"Nury Chevron Ring", "Diamond", "Nury Chevron Ring", 55400.00, 10, "https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476"},
            {"The Trina Ring", "Diamond", "Beautifully Designed Trina", 67500.00, 10, "https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792"},
            {"Ozo Stud Earring", "Diamond", "Handmade Ozo Earrings for Women", 54203.00, 10, "https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435"},
            {"Nuray Earrings", "Diamond", "N-Shaped Earrings", 65009.00, 10, "https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167"},
            {"Mazikeen Necklace", "Diamond", "Mazi-Queen Royal Look Necklace", 89500.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171"},
            {"Ryck Princess Necklace", "Diamond", "The Ryck Princess Necklace", 99999.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402"},
            {"Aelric Bracelet", "Diamond", "The Aelric Bracelet", 45000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778"},
            {"Resilient Bracelet", "Diamond", "The Chain-Type Bracelet", 46000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366"},
            {"Line Bangles", "Diamond", "Royal Elegant Bangles for Women", 67000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553"},
            {"Set Bangles", "Diamond", "The Bazel Set Bangles", 70000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034"},
            {"Spiral Ring", "Gold", "Classic Spiral Gold Ring", 45000.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg"},
            {"Leaf Design Ring", "Gold", "Elegant Leaf Design Gold Ring", 33000.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg"},
            {"Stud Earrings", "Gold", "Temple Gold Stud Earrings", 44000.00, 10, "https://ik.imagekit.io/StringstackNaveen/earrings.jpg"},
            {"Jhumka Earrings", "Gold", "Gold Jhumka Earrings", 36411.00, 10, "https://ik.imagekit.io/StringstackNaveen/earings2.jpg"},
            {"Lakshmi Temple Necklace", "Gold", "Beautifully Designed Necklace", 77777.00, 10, "https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif"},
            {"Lakshmi Gold Necklace", "Gold", "Wonderfully Designed Necklace", 88888.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace2.jpg"},
            {"Gold Beaded Bracelet", "Gold", "Handcrafted Bracelet for Women", 45812.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelite1.webp"},
            {"Textured Gold Bracelet", "Gold", "Stylish Gold Bracelet for Men", 38562.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif"},
            {"Floral Bangle Set", "Gold", "Wonderfully Crafted Bangles", 65481.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangles-1.webp"},
            {"Designer Gold Bangles", "Gold", "Beautifully Crafted Bangles", 65874.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle2.jpg"},
            {"Vidh Platinum Solitaire", "Platinum", "Best Ring for Men", 45021.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp"},
            {"Elegant Floral Ring", "Platinum", "Elegant Floral Platinum Ring", 65741.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp"},
            {"Swirl Stud Earrings", "Platinum", "Circular Platinum Earrings", 33254.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg"},
            {"Floral Stud Earrings", "Platinum", "Flower Platinum Stud Earrings", 32546.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp"},
            {"Emerald Drop Platinum Necklace", "Platinum", "Wonderfully Crafted Necklace for Women", 89899.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp"},
            {"Solitaire Platinum Pendant Necklace", "Platinum", "Looking Gorgeous", 87898.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp"},
            {"Star Motif Platinum Bracelet", "Platinum", "Star Motif Platinum Bracelet", 65475.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp"},
            {"Floral Two-Tone Platinum Bracelet", "Platinum", "Floral Two-Tone Platinum Bracelet", 56874.00, 10, "https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg"},
            {"Star Motif Platinum Bangles", "Platinum", "Premium Platinum Bangles", 65477.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp"},
            {"Eternity Platinum Bangle", "Platinum", "Premium Platinum Bangle", 54655.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/BANG%203.webp"},
            {"Meris Textured Band Ring", "Silver", "Wonderful Silver Plated Ring", 33332.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp"},
            {"Butterfly Ring", "Silver", "Adjustable Silver Butterfly Ring", 22712.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp"},
            {"Dangler Earrings", "Silver", "Silver Flower Dangler Earrings", 24589.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp"},
            {"Ossum Earrings", "Silver", "Beautiful Earrings for Women", 27586.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp"},
            {"Wisdom Sterling Silver Necklace", "Silver", "Infinite Wisdom Sterling Silver Necklace", 45821.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp"},
            {"Gargi Stone Necklace", "Silver", "Beautifully Crafted Stone Necklace", 46525.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp"},
            {"Flexi Bracelet", "Silver", "Fleur Flexi Bracelet in Silver", 55554.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp"},
            {"Chain Bracelet", "Silver", "Clara Women's Evil Eye Bracelet", 35241.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp"},
            {"Rewa Bangles", "Silver", "Rounded Rewa Silver Bangles", 42516.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp"},
            {"Sterling Bangles", "Silver", "Sterling Silver Unique Bangles for Women", 39564.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp"},
            // MySQL WorkBench items from user screenshot:
            {"Antique Jumkas", "Gold", "Gold Plated One Gram Gold Antique Jumkas", 5632.00, 10, "https://ik.imagekit.io/StringstackNaveen/earings2.jpg"},
            {"Kemp-green Lakshmi Necklace", "Gold", "Antique gold tone kemp-green lakshmi necklace", 7986.00, 10, "https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif"},
            {"Stoned Diamond Necklace", "Diamond", "Beautiful stoned Necklace for women", 9889.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171"},
            {"Stoned Ring", "Diamond", "A Beautiful Diamond Ring Stands in solitaire", 9563.00, 10, "https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476"},
            {"Rose Gold Platinum Set", "Platinum", "Rose Gold Platinum Collection", 6548.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp"},
            {"Square Piece-Set Necklace", "Platinum", "Square Piece Step Necklace", 6541.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp"},
            {"Ghungroo Jewellery Set", "Silver", "Ghungroo Studded Filigree Work Silver Set", 5469.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp"},
            {"Navaratri Jewellery", "Silver", "Silver Necklace, Navratri Jewellery", 4589.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp"}
        };

        for (Object[] p : products) {
            String name = (String) p[0];
            String catName = (String) p[1];
            String desc = (String) p[2];
            double priceDouble = (Double) p[3];
            BigDecimal price = BigDecimal.valueOf(priceDouble);
            int stock = (Integer) p[4];
            String imgUrl = (String) p[5];

            Integer catId = getOrCreateCategoryId(catName);

            try {
                List<Integer> existing = jdbcTemplate.queryForList("SELECT COALESCE(product_id, id) FROM products WHERE LOWER(name) = LOWER(?)", Integer.class, name);

                if (existing.isEmpty()) {
                    jdbcTemplate.update(
                            "INSERT INTO products (name, category_id, description, price, stock, status) VALUES (?, ?, ?, ?, ?, 'ACTIVE')",
                            name, catId, desc, price, stock
                    );
                } else {
                    jdbcTemplate.update(
                            "UPDATE products SET category_id = ?, description = ?, price = ?, stock = ? WHERE LOWER(name) = LOWER(?)",
                            catId, desc, price, stock, name
                    );
                }

                Integer pId = null;
                List<Integer> updatedList = jdbcTemplate.queryForList("SELECT COALESCE(product_id, id) FROM products WHERE LOWER(name) = LOWER(?) LIMIT 1", Integer.class, name);
                if (!updatedList.isEmpty()) {
                    pId = updatedList.get(0);
                }

                if (pId != null) {
                    try {
                        jdbcTemplate.update("INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", pId, imgUrl);
                    } catch (Exception ignored) {}

                    try {
                        jdbcTemplate.update("INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)", pId, imgUrl);
                    } catch (Exception ignored) {}
                }

            } catch (Exception e) {
                System.err.println("Error inserting product " + name + ": " + e.getMessage());
            }
        }
    }
}
