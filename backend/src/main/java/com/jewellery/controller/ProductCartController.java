package com.jewellery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProductCartController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private void executeQuietly(String sql, Object... params) {
        try {
            if (params != null && params.length > 0) {
                jdbcTemplate.update(sql, params);
            } else {
                jdbcTemplate.execute(sql);
            }
        } catch (Exception ignored) {}
    }

    @GetMapping("/seed-database-now")
    public ResponseEntity<Map<String, Object>> seedNow() {
        Map<String, Object> response = new HashMap<>();
        List<String> logs = new ArrayList<>();
        int insertedCount = 0;

        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS categories (" +
                    "category_id SERIAL PRIMARY KEY, " +
                    "category_name VARCHAR(100) NOT NULL UNIQUE, " +
                    "description TEXT, " +
                    "image_url VARCHAR(500), " +
                    "status VARCHAR(20) DEFAULT 'ACTIVE')");
            logs.add("Table categories ensured");
        } catch (Exception e) { logs.add("Categories error: " + e.getMessage()); }

        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS products (" +
                    "product_id SERIAL PRIMARY KEY, " +
                    "name VARCHAR(255) NOT NULL, " +
                    "category_id INT, " +
                    "description TEXT, " +
                    "price DECIMAL(12, 2) NOT NULL DEFAULT 0.00, " +
                    "discount DECIMAL(5, 2) DEFAULT 0.00, " +
                    "stock INT DEFAULT 10, " +
                    "weight VARCHAR(50) DEFAULT '10g', " +
                    "metal_type VARCHAR(50) DEFAULT 'Gold', " +
                    "gold_purity VARCHAR(50) DEFAULT '22K', " +
                    "diamond_details VARCHAR(255) DEFAULT 'VS1 / G-H Color', " +
                    "stone_details VARCHAR(255) DEFAULT 'Natural Diamond', " +
                    "certificate_number VARCHAR(100), " +
                    "sku VARCHAR(100), " +
                    "status VARCHAR(20) DEFAULT 'ACTIVE')");
            logs.add("Table products ensured");
        } catch (Exception e) { logs.add("Products error: " + e.getMessage()); }

        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS productimages (" +
                    "image_id SERIAL PRIMARY KEY, " +
                    "product_id INT NOT NULL, " +
                    "image_url TEXT NOT NULL, " +
                    "is_thumbnail BOOLEAN DEFAULT TRUE)");
            logs.add("Table productimages ensured");
        } catch (Exception e) { logs.add("Productimages error: " + e.getMessage()); }

        try {
            jdbcTemplate.execute("INSERT INTO categories (category_id, category_name, name, status) VALUES " +
                    "(1, 'Diamond', 'Diamond', 'ACTIVE'), " +
                    "(2, 'Gold', 'Gold', 'ACTIVE'), " +
                    "(3, 'Platinum', 'Platinum', 'ACTIVE'), " +
                    "(4, 'Silver', 'Silver', 'ACTIVE') " +
                    "ON CONFLICT DO NOTHING");
            logs.add("Categories seeded");
        } catch (Exception e) { logs.add("Categories seed error: " + e.getMessage()); }

        Object[][] products = {
            {"Nury Chevron Ring", 1, "Nury Chevron Ring", 55400.00, 10, "https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476"},
            {"The Trina Ring", 1, "Beautifully Designed Trina", 67500.00, 10, "https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792"},
            {"Ozo Stud Earring", 1, "Handmade Ozo Earrings for Women", 54203.00, 10, "https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435"},
            {"Nuray Earrings", 1, "N-Shaped Earrings", 65009.00, 10, "https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167"},
            {"Mazikeen Necklace", 1, "Mazi-Queen Royal Look Necklace", 89500.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171"},
            {"Ryck Princess Necklace", 1, "The Ryck Princess Necklace", 99999.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402"},
            {"Aelric Bracelet", 1, "The Aelric Bracelet", 45000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778"},
            {"Resilient Bracelet", 1, "The Chain-Type Bracelet", 46000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366"},
            {"Line Bangles", 1, "Royal Elegant Bangles for Women", 67000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553"},
            {"Set Bangles", 1, "The Bazel Set Bangles", 70000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034"},
            {"Spiral Ring", 2, "Classic Spiral Gold Ring", 45000.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg"},
            {"Leaf Design Ring", 2, "Elegant Leaf Design Gold Ring", 33000.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg"},
            {"Stud Earrings", 2, "Temple Gold Stud Earrings", 44000.00, 10, "https://ik.imagekit.io/StringstackNaveen/earrings.jpg"},
            {"Jhumka Earrings", 2, "Gold Jhumka Earrings", 36411.00, 10, "https://ik.imagekit.io/StringstackNaveen/earings2.jpg"},
            {"Lakshmi Temple Necklace", 2, "Beautifully Designed Necklace", 77777.00, 10, "https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif"},
            {"Lakshmi Gold Necklace", 2, "Wonderfully Designed Necklace", 88888.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace2.jpg"},
            {"Gold Beaded Bracelet", 2, "Handcrafted Bracelet for Women", 45812.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelite1.webp"},
            {"Textured Gold Bracelet", 2, "Stylish Gold Bracelet for Men", 38562.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif"},
            {"Floral Bangle Set", 2, "Wonderfully Crafted Bangles", 65481.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangles-1.webp"},
            {"Designer Gold Bangles", 2, "Beautifully Crafted Bangles", 65874.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle2.jpg"},
            {"Vidh Platinum Solitaire", 3, "Best Ring for Men", 45021.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp"},
            {"Elegant Floral Ring", 3, "Elegant Floral Platinum Ring", 65741.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp"},
            {"Swirl Stud Earrings", 3, "Circular Platinum Earrings", 33254.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg"},
            {"Floral Stud Earrings", 3, "Flower Platinum Stud Earrings", 32546.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp"},
            {"Emerald Drop Platinum Necklace", 3, "Wonderfully Crafted Necklace for Women", 89899.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp"},
            {"Solitaire Platinum Pendant Necklace", 3, "Looking Gorgeous", 87898.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp"},
            {"Star Motif Platinum Bracelet", 3, "Star Motif Platinum Bracelet", 65475.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp"},
            {"Floral Two-Tone Platinum Bracelet", 3, "Floral Two-Tone Platinum Bracelet", 56874.00, 10, "https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg"},
            {"Star Motif Platinum Bangles", 3, "Premium Platinum Bangles", 65477.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp"},
            {"Eternity Platinum Bangle", 3, "Premium Platinum Bangle", 54655.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/BANG%203.webp"},
            {"Meris Textured Band Ring", 4, "Wonderful Silver Plated Ring", 33332.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp"},
            {"Butterfly Ring", 4, "Adjustable Silver Butterfly Ring", 22712.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp"},
            {"Dangler Earrings", 4, "Silver Flower Dangler Earrings", 24589.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp"},
            {"Ossum Earrings", 4, "Beautiful Earrings for Women", 27586.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp"},
            {"Wisdom Sterling Silver Necklace", 4, "Infinite Wisdom Sterling Silver Necklace", 45821.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp"},
            {"Gargi Stone Necklace", 4, "Beautifully Crafted Stone Necklace", 46525.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp"},
            {"Flexi Bracelet", 4, "Fleur Flexi Bracelet in Silver", 55554.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp"},
            {"Chain Bracelet", 4, "Clara Women's Evil Eye Bracelet", 35241.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp"},
            {"Rewa Bangles", 4, "Rounded Rewa Silver Bangles", 42516.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp"},
            {"Sterling Bangles", 4, "Sterling Silver Unique Bangles for Women", 39564.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp"},
            {"Antique Jumkas", 2, "Gold Plated One Gram Gold Antique Jumkas", 5632.00, 10, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"},
            {"Kemp-green Lakshmi Necklace", 2, "Antique gold tone kemp-green lakshmi necklace", 7986.00, 10, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {"Stoned Diamond Necklace", 1, "Beautiful stoned Necklace for women", 9889.00, 10, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {"Stoned Ring", 1, "A Beautiful Diamond Ring Stands in solitaire", 9563.00, 10, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"},
            {"Rose Gold Platinum Set", 3, "Rose Gold Platinum Collection", 6548.00, 10, "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80"},
            {"Square Piece-Set Necklace", 3, "Square Piece Step Necklace", 6541.00, 10, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {"Ghungroo Jewellery Set", 4, "Ghungroo Studded Filigree Work Silver Set", 5469.00, 10, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"},
            {"Navaratri Jewellery", 4, "Silver Necklace, Navratri Jewellery", 4589.00, 10, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"}
        };

        for (Object[] p : products) {
            String name = (String) p[0];
            int catId = (Integer) p[1];
            String desc = (String) p[2];
            double priceDouble = (Double) p[3];
            BigDecimal price = BigDecimal.valueOf(priceDouble);
            int stock = (Integer) p[4];
            String imgUrl = (String) p[5];

            try {
                int count = jdbcTemplate.update(
                        "INSERT INTO products (name, category_id, description, price, stock, status) VALUES (?, ?, ?, ?, ?, 'ACTIVE')",
                        name, catId, desc, price, stock
                );
                insertedCount += count;
            } catch (Exception e) {
                logs.add("Insert error for " + name + ": " + e.getMessage());
            }
        }

        Integer totalProducts = 0;
        try { totalProducts = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products", Integer.class); } catch (Exception ignored) {}

        response.put("insertedCount", insertedCount);
        response.put("totalProductsInDb", totalProducts);
        response.put("logs", logs);
        return ResponseEntity.ok(response);
    }

    private void ensureProductTablesExist() {
        executeQuietly("CREATE TABLE IF NOT EXISTS categories (" +
                "category_id SERIAL PRIMARY KEY, " +
                "category_name VARCHAR(100) NOT NULL UNIQUE, " +
                "description TEXT, " +
                "image_url VARCHAR(500), " +
                "status VARCHAR(20) DEFAULT 'ACTIVE')");

        executeQuietly("CREATE TABLE IF NOT EXISTS products (" +
                "product_id SERIAL PRIMARY KEY, " +
                "name VARCHAR(255) NOT NULL, " +
                "category_id INT, " +
                "description TEXT, " +
                "price DECIMAL(12, 2) NOT NULL DEFAULT 0.00, " +
                "discount DECIMAL(5, 2) DEFAULT 0.00, " +
                "stock INT DEFAULT 10, " +
                "weight DECIMAL(8, 2), " +
                "metal_type VARCHAR(50), " +
                "gold_purity VARCHAR(50) DEFAULT '22K', " +
                "diamond_details VARCHAR(255) DEFAULT 'VS1 / G-H Color', " +
                "stone_details VARCHAR(255) DEFAULT 'Natural Diamond', " +
                "certificate_number VARCHAR(100), " +
                "sku VARCHAR(100), " +
                "status VARCHAR(20) DEFAULT 'ACTIVE')");

        executeQuietly("CREATE TABLE IF NOT EXISTS productimages (" +
                "image_id SERIAL PRIMARY KEY, " +
                "product_id INT NOT NULL, " +
                "image_url TEXT NOT NULL, " +
                "is_thumbnail BOOLEAN DEFAULT TRUE)");

        executeQuietly("CREATE TABLE IF NOT EXISTS product_images (" +
                "id SERIAL PRIMARY KEY, " +
                "product_id INT NOT NULL, " +
                "image_url TEXT NOT NULL, " +
                "is_primary INT DEFAULT 1)");

        executeQuietly("ALTER TABLE categories ADD COLUMN IF NOT EXISTS category_name VARCHAR(100)");
        executeQuietly("ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INT");
        executeQuietly("ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT");
        executeQuietly("ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(12, 2) DEFAULT 0.00");
        executeQuietly("ALTER TABLE products ADD COLUMN IF NOT EXISTS discount DECIMAL(5, 2) DEFAULT 0.00");
        executeQuietly("ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 10");
        executeQuietly("ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE'");

        seedAllProducts();
    }

    private void seedAllProducts() {
        // Ensure Categories 1..10 exist to satisfy foreign key constraints
        for (int i = 1; i <= 10; i++) {
            String catName = i == 1 ? "Diamond" : i == 2 ? "Gold" : i == 3 ? "Platinum" : i == 4 ? "Silver" : "Collection " + i;
            try {
                jdbcTemplate.update("INSERT INTO categories (category_id, category_name, name, description, status) VALUES (?, ?, ?, ?, 'ACTIVE') ON CONFLICT DO NOTHING",
                        i, catName, catName, catName + " Collection");
            } catch (Exception e) {
                try {
                    jdbcTemplate.update("INSERT INTO categories (id, category_name, name, description, status) VALUES (?, ?, ?, ?, 'ACTIVE') ON CONFLICT DO NOTHING",
                            i, catName, catName, catName + " Collection");
                } catch (Exception ignored) {}
            }
        }

        Integer defaultCatId = 1;
        try {
            List<Integer> validCats = jdbcTemplate.queryForList("SELECT COALESCE(category_id, id) FROM categories LIMIT 1", Integer.class);
            if (!validCats.isEmpty() && validCats.get(0) != null) {
                defaultCatId = validCats.get(0);
            }
        } catch (Exception ignored) {}

        Object[][] products = {
            {"Nury Chevron Ring", 1, "Nury Chevron Ring", 55400.00, 10, "https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476"},
            {"The Trina Ring", 1, "Beautifully Designed Trina", 67500.00, 10, "https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792"},
            {"Ozo Stud Earring", 1, "Handmade Ozo Earrings for Women", 54203.00, 10, "https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435"},
            {"Nuray Earrings", 1, "N-Shaped Earrings", 65009.00, 10, "https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167"},
            {"Mazikeen Necklace", 1, "Mazi-Queen Royal Look Necklace", 89500.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171"},
            {"Ryck Princess Necklace", 1, "The Ryck Princess Necklace", 99999.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402"},
            {"Aelric Bracelet", 1, "The Aelric Bracelet", 45000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778"},
            {"Resilient Bracelet", 1, "The Chain-Type Bracelet", 46000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366"},
            {"Line Bangles", 1, "Royal Elegant Bangles for Women", 67000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553"},
            {"Set Bangles", 1, "The Bazel Set Bangles", 70000.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034"},
            {"Spiral Ring", 2, "Classic Spiral Gold Ring", 45000.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg"},
            {"Leaf Design Ring", 2, "Elegant Leaf Design Gold Ring", 33000.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg"},
            {"Stud Earrings", 2, "Temple Gold Stud Earrings", 44000.00, 10, "https://ik.imagekit.io/StringstackNaveen/earrings.jpg"},
            {"Jhumka Earrings", 2, "Gold Jhumka Earrings", 36411.00, 10, "https://ik.imagekit.io/StringstackNaveen/earings2.jpg"},
            {"Lakshmi Temple Necklace", 2, "Beautifully Designed Necklace", 77777.00, 10, "https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif"},
            {"Lakshmi Gold Necklace", 2, "Wonderfully Designed Necklace", 88888.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace2.jpg"},
            {"Gold Beaded Bracelet", 2, "Handcrafted Bracelet for Women", 45812.00, 10, "https://ik.imagekit.io/StringstackNaveen/bracelite1.webp"},
            {"Textured Gold Bracelet", 2, "Stylish Gold Bracelet for Men", 38562.00, 10, "https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif"},
            {"Floral Bangle Set", 2, "Wonderfully Crafted Bangles", 65481.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangles-1.webp"},
            {"Designer Gold Bangles", 2, "Beautifully Crafted Bangles", 65874.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle2.jpg"},
            {"Vidh Platinum Solitaire", 3, "Best Ring for Men", 45021.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp"},
            {"Elegant Floral Ring", 3, "Elegant Floral Platinum Ring", 65741.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp"},
            {"Swirl Stud Earrings", 3, "Circular Platinum Earrings", 33254.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg"},
            {"Floral Stud Earrings", 3, "Flower Platinum Stud Earrings", 32546.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp"},
            {"Emerald Drop Platinum Necklace", 3, "Wonderfully Crafted Necklace for Women", 89899.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp"},
            {"Solitaire Platinum Pendant Necklace", 3, "Looking Gorgeous", 87898.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp"},
            {"Star Motif Platinum Bracelet", 3, "Star Motif Platinum Bracelet", 65475.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp"},
            {"Floral Two-Tone Platinum Bracelet", 3, "Floral Two-Tone Platinum Bracelet", 56874.00, 10, "https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg"},
            {"Star Motif Platinum Bangles", 3, "Premium Platinum Bangles", 65477.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp"},
            {"Eternity Platinum Bangle", 3, "Premium Platinum Bangle", 54655.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/BANG%203.webp"},
            {"Meris Textured Band Ring", 4, "Wonderful Silver Plated Ring", 33332.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp"},
            {"Butterfly Ring", 4, "Adjustable Silver Butterfly Ring", 22712.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp"},
            {"Dangler Earrings", 4, "Silver Flower Dangler Earrings", 24589.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp"},
            {"Ossum Earrings", 4, "Beautiful Earrings for Women", 27586.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp"},
            {"Wisdom Sterling Silver Necklace", 4, "Infinite Wisdom Sterling Silver Necklace", 45821.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp"},
            {"Gargi Stone Necklace", 4, "Beautifully Crafted Stone Necklace", 46525.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp"},
            {"Flexi Bracelet", 4, "Fleur Flexi Bracelet in Silver", 55554.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp"},
            {"Chain Bracelet", 4, "Clara Women's Evil Eye Bracelet", 35241.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp"},
            {"Rewa Bangles", 4, "Rounded Rewa Silver Bangles", 42516.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp"},
            {"Sterling Bangles", 4, "Sterling Silver Unique Bangles for Women", 39564.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp"},
            {"Antique Jumkas", 2, "Gold Plated One Gram Gold Antique Jumkas", 5632.00, 10, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"},
            {"Kemp-green Lakshmi Necklace", 2, "Antique gold tone kemp-green lakshmi necklace", 7986.00, 10, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {"Stoned Diamond Necklace", 1, "Beautiful stoned Necklace for women", 9889.00, 10, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {"Stoned Ring", 1, "A Beautiful Diamond Ring Stands in solitaire", 9563.00, 10, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"},
            {"Rose Gold Platinum Set", 3, "Rose Gold Platinum Collection", 6548.00, 10, "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80"},
            {"Square Piece-Set Necklace", 3, "Square Piece Step Necklace", 6541.00, 10, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {"Ghungroo Jewellery Set", 4, "Ghungroo Studded Filigree Work Silver Set", 5469.00, 10, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"},
            {"Navaratri Jewellery", 4, "Silver Necklace, Navratri Jewellery", 4589.00, 10, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"}
        };

        for (Object[] p : products) {
            String name = (String) p[0];
            int catId = (Integer) p[1];
            String desc = (String) p[2];
            double priceDouble = (Double) p[3];
            BigDecimal price = BigDecimal.valueOf(priceDouble);
            int stock = (Integer) p[4];
            String imgUrl = (String) p[5];

            List<Integer> existing = null;
            try {
                existing = jdbcTemplate.queryForList("SELECT COALESCE(product_id, id) FROM products WHERE LOWER(name) = LOWER(?) LIMIT 1", Integer.class, name);
            } catch (Exception ignored) {}

            if (existing == null || existing.isEmpty()) {
                try {
                    jdbcTemplate.update("INSERT INTO products (name, category_id, description, price, stock, status) VALUES (?, ?, ?, ?, ?, 'ACTIVE')", name, catId, desc, price, stock);
                } catch (Exception e) {
                    try {
                        jdbcTemplate.update("INSERT INTO products (name, category_id, description, price, stock, status) VALUES (?, ?, ?, ?, ?, 'ACTIVE')", name, defaultCatId, desc, price, stock);
                    } catch (Exception ex) {
                        try {
                            jdbcTemplate.update("INSERT INTO products (name, description, price, stock, status) VALUES (?, ?, ?, ?, 'ACTIVE')", name, desc, price, stock);
                        } catch (Exception ignored) {}
                    }
                }
            }

            try {
                List<Integer> pIds = jdbcTemplate.queryForList("SELECT COALESCE(product_id, id) FROM products WHERE LOWER(name) = LOWER(?) LIMIT 1", Integer.class, name);
                if (!pIds.isEmpty() && pIds.get(0) != null) {
                    Integer pId = pIds.get(0);
                    executeQuietly("INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", pId, imgUrl);
                    executeQuietly("INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)", pId, imgUrl);
                }
            } catch (Exception ignored) {}
        }
    }

    @RequestMapping(value = {"/products", "/products/all"}, method = {RequestMethod.GET, RequestMethod.POST})
    public List<Map<String, Object>> getProducts(@RequestParam(required = false) String category) {
        ensureProductTablesExist();
        try {
            List<Map<String, Object>> list = jdbcTemplate.queryForList("SELECT * FROM products");
            if (list == null || list.isEmpty()) {
                return new ArrayList<>();
            }
            List<Map<String, Object>> result = new ArrayList<>();
            for (Map<String, Object> row : list) {
                Map<String, Object> map = new HashMap<>(row);
                Object pId = row.get("product_id") != null ? row.get("product_id") : row.get("id");
                map.put("id", pId);
                map.put("productId", pId);

                // Fetch Category Name
                Object catId = row.get("category_id");
                String catName = "Diamond";
                if (catId != null) {
                    try {
                        List<String> catList = jdbcTemplate.queryForList("SELECT COALESCE(category_name, name) FROM categories WHERE category_id = ? OR id = ? LIMIT 1", String.class, catId, catId);
                        if (!catList.isEmpty() && catList.get(0) != null) {
                            catName = catList.get(0);
                        }
                    } catch (Exception ignored) {}
                }
                map.put("categoryName", catName);
                map.put("category", catName);

                // Fetch Image URL
                String imgUrl = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80";
                if (pId != null) {
                    try {
                        List<String> imgs = jdbcTemplate.queryForList("SELECT image_url FROM productimages WHERE product_id = ? AND image_url IS NOT NULL LIMIT 1", String.class, pId);
                        if (imgs.isEmpty()) {
                            imgs = jdbcTemplate.queryForList("SELECT image_url FROM product_images WHERE product_id = ? AND image_url IS NOT NULL LIMIT 1", String.class, pId);
                        }
                        if (!imgs.isEmpty() && imgs.get(0) != null && !imgs.get(0).trim().isEmpty()) {
                            imgUrl = imgs.get(0).trim();
                        }
                    } catch (Exception ignored) {}
                }
                map.put("imageUrl", imgUrl);

                if (category == null || category.trim().isEmpty() || category.equalsIgnoreCase("All") || catName.equalsIgnoreCase(category.trim())) {
                    result.add(map);
                }
            }
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private void ensureCartTableExists() {
        executeQuietly("CREATE TABLE IF NOT EXISTS cart_items (" +
                "id SERIAL PRIMARY KEY, " +
                "user_id BIGINT NOT NULL, " +
                "product_id BIGINT NOT NULL, " +
                "quantity INT NOT NULL DEFAULT 1)");
    }

    private Long getUserIdByEmail(String email) {
        try {
            return jdbcTemplate.queryForObject("SELECT id FROM users WHERE email = ?", Long.class, email);
        } catch (Exception e) {
            try {
                return jdbcTemplate.queryForObject("SELECT id FROM \"user\" WHERE email = ?", Long.class, email);
            } catch (Exception ex) {
                return null;
            }
        }
    }

    @GetMapping("/cart/items/count")
    public ResponseEntity<Map<String, Object>> getCartItemCount() {
        ensureCartTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("count", 0);
            return ResponseEntity.ok(err);
        }
        try {
            Integer count = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(quantity), 0) FROM cart_items WHERE user_id = ?", Integer.class, userId);
            Map<String, Object> res = new HashMap<>();
            res.put("count", count != null ? count : 0);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, Object> res = new HashMap<>();
            res.put("count", 0);
            return ResponseEntity.ok(res);
        }
    }

    @GetMapping("/cart/items")
    public ResponseEntity<?> getCartItems() {
        ensureCartTableExists();
        ensureProductTablesExist();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        try {
            String sql = "SELECT c.id, c.product_id as \"productId\", c.quantity, p.name, p.price, " +
                         "COALESCE(pi.image_url, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e') as \"imageUrl\" " +
                         "FROM cart_items c " +
                         "JOIN products p ON (c.product_id = p.product_id OR c.product_id = p.id) " +
                         "LEFT JOIN productimages pi ON (p.product_id = pi.product_id OR p.id = pi.product_id) " +
                         "WHERE c.user_id = ?";
            List<Map<String, Object>> items = jdbcTemplate.queryForList(sql, userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @PostMapping("/cart/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> request) {
        ensureCartTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = request.get("quantity") != null ? Integer.valueOf(request.get("quantity").toString()) : 1;

        try {
            List<Map<String, Object>> existing = jdbcTemplate.queryForList("SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?", userId, productId);
            if (!existing.isEmpty()) {
                Long cartId = Long.valueOf(existing.get(0).get("id").toString());
                int newQty = Integer.parseInt(existing.get(0).get("quantity").toString()) + quantity;
                executeQuietly("UPDATE cart_items SET quantity = ? WHERE id = ?", newQty, cartId);
            } else {
                executeQuietly("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)", userId, productId, quantity);
            }
            return ResponseEntity.ok(Map.of("message", "Product added to cart"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding to cart: " + e.getMessage());
        }
    }

    @PutMapping("/cart/update")
    public ResponseEntity<?> updateCartQuantity(@RequestBody Map<String, Object> request) {
        ensureCartTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) return ResponseEntity.badRequest().body("User not found");

        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = request.get("quantity") != null ? Integer.valueOf(request.get("quantity").toString()) : null;
        String action = request.get("action") != null ? request.get("action").toString() : null;

        try {
            if (quantity != null) {
                executeQuietly("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?", quantity, userId, productId);
            } else if ("increase".equalsIgnoreCase(action)) {
                executeQuietly("UPDATE cart_items SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?", userId, productId);
            } else if ("decrease".equalsIgnoreCase(action)) {
                executeQuietly("UPDATE cart_items SET quantity = GREATEST(1, quantity - 1) WHERE user_id = ? AND product_id = ?", userId, productId);
            }
            return ResponseEntity.ok(Map.of("message", "Cart updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/cart/delete/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId) {
        ensureCartTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) return ResponseEntity.badRequest().body("User not found");

        try {
            executeQuietly("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", userId, productId);
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error removing item: " + e.getMessage());
        }
    }
}
