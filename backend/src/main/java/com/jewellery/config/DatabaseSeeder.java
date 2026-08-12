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
            {"Nury Chevron Ring", "Diamond", "Nury Chevron Ring", 7914.29, 5, "https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476"},
            {"The trina ring", "Diamond", "beautifuly designed Trina", 9642.86, 5, "https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792"},
            {"Ozo stud earing", "Diamond", "Handmade Ozo earrings for women", 7743.29, 7, "https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435"},
            {"Nuray earings", "Diamond", "N-shaped Rings with pure gold", 9287.00, 7, "https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167"},
            {"Mazikeen Necklace", "Diamond", "Mazi-Queen Royal look Necklace", 12785.71, 6, "https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171"},
            {"ryck princess", "Diamond", "The ryck Princess Necklace", 14285.57, 6, "https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402"},
            {"Bracelite", "Diamond", "The Aelric Bracelet", 9000.00, 8, "https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778"},
            {"resilent Bracelet", "Diamond", "The Chain-typed Bracelet", 9200.00, 8, "https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366"},
            {"Line Bangles", "Diamond", "Royal elegent Bangles for women", 9571.43, 4, "https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553"},
            {"Set Bangles", "Diamond", "The Bazel-Set Bangles", 10000.00, 4, "https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034"},
            {"Spiral Ring", "Gold", "Classic Spiral Gold Ring", 9000.00, 6, "https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg"},
            {"leaf design Ring", "Gold", "Elegant Leaf Design Gold Ring", 6600.00, 6, "https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg"},
            {"Stud Earrings", "Gold", "Temple Gold Stud Earrings", 8800.00, 4, "https://ik.imagekit.io/StringstackNaveen/earrings.jpg"},
            {"Mahroosh Diamond Necklace", "Gold", "Indriya Necklace by Aditya Birla", 9285.71, 8, "https://ik.imagekit.io/StringstackNaveen/earings2.jpg"},
            {"Lakshmi Temple Necklace", "Gold", "Beautifully designed Necklace", 11111.00, 3, "https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif"},
            {"Lakshmi Gold Necklace", "Gold", "Wonderfully designed Necklace", 12698.29, 3, "https://ik.imagekit.io/StringstackNaveen/necklace2.jpg"},
            {"Gold Beaded Bracelet", "Gold", "Handicrafted Bracelet for Women", 9162.40, 2, "https://ik.imagekit.io/StringstackNaveen/bracelite1.webp"},
            {"Textured Gold Bracelet", "Gold", "Men Stylish and elogant look Bracelet", 7712.40, 8, "https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif"},
            {"Vidh Platinum Solitire", "Platinum", "Best Ring for men", 9004.20, 8, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp"},
            {"Elegant floral Ring", "Platinum", "Elegant floral Platinum Ring", 9391.57, 8, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp"},
            {"Swirl Stud Earrings", "Platinum", "Circular Earrings", 6650.80, 7, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg"},
            {"Floral Stud Earrings", "Platinum", "Flower Stud Earrings", 6509.20, 7, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp"},
            {"Emerald Drop Platinum Necklece", "Platinum", "Wonderfully Crafted Necklace for Women", 12842.71, 1, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp"},
            {"Solitaire Platinum Pendant Necklace", "Platinum", "Looking Gorgeous", 12556.86, 1, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp"},
            {"Start Motif Platinum Bracelet", "Platinum", "Start Bracelet", 9353.57, 3, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp"},
            {"Floral Two-Tone Platinum Bracelet", "Platinum", "Floral Two-Tone Platinum Bracelet", 8124.86, 3, "https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg"},
            {"Start- Motif Platinum Bangles", "Platinum", "Floral Two-Tone Platinum Bracelet", 9353.86, 4, "https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp"},
            {"Eternity Platinum Bangle", "Platinum", "Premium Bangles", 7807.86, 5, "https://ik.imagekit.io/StringstackSanjana/Platinum/BANG%203.webp"},
            {"Meris Textured Band Ring", "Silver", "Wonderful Silverplated Ring", 6666.40, 8, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp"},
            {"Butterfly Ring", "Silver", "Adjustable silver Butterfly Ring", 4542.40, 8, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp"},
            {"Dangler Earrings", "Silver", "Silver Flower Dangler Earrings", 4917.80, 9, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp"},
            {"Ossum Earrings", "Silver", "Beautiful Eearings for Women", 5517.20, 9, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp"},
            {"Wisdom Sterling Silver Necklace", "Silver", "Infinite Wisdom Sterling Silver Necklace", 9164.20, 4, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp"},
            {"GargiStone Necklace", "Silver", "Beautifully Crafted Stone Necklace", 9305.00, 4, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp"},
            {"Flexi Bracelet", "Silver", "Fleur Flexi Bracelet in Silver", 7936.29, 3, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp"},
            {"Chain Bracelet", "Silver", "Clara Womens Evil Eye Bracelet", 7048.20, 3, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp"},
            {"Rewa Bangles", "Silver", "Beautiful Rewa Bangles", 8503.20, 4, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp"},
            {"Sterling Bangles", "Silver", "Beautiful Sterling Bangles", 7912.80, 4, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp"},
            {"Royal Diamond Choker", "Diamond", "Exquisite Royal Choker", 12000.00, 3, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {"Neckpice Necklace", "Gold", "Beautifully crafted necklace for women", 7886.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace2.jpg"},
            {"Long Necklace", "Gold", "Antique Gold Necklace for women", 7896.00, 9, "https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif"},
            {"Antique Jumkas", "Gold", "Gold Plated One Gram Gold Antique Jhumkas", 5632.00, 10, "https://ik.imagekit.io/StringstackNaveen/earings2.jpg"},
            {"Kemp-green Lakshmi Vankii", "Gold", "Antique gold tone kemp-green lakshmi peacock elephant nakshi 1 vankii", 7986.00, 10, "https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif"},
            {"Stoned Diamond Necklace", "Diamond", "Beautiful stoned Necklace for women", 9889.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171"},
            {"Stoned Ring", "Diamond", "A Beautiful Diamond Ring Stands in solitaire", 9563.00, 10, "https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476"},
            {"Rose Gold paltinum Necklace", "Platinum", "Rose Gold Platinum Collection", 6548.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp"},
            {"Square Piece-Set Neckalce", "Platinum", "Square Piece Step Necklace", 6541.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp"},
            {"Ghungroo Jwellery Set", "Silver", "Ghungroo Studded Filigree Work Silver Plated Antique Jewellery Set", 5469.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp"},
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
