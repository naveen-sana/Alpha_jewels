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
        int count = 0;

        try {
            org.springframework.core.io.Resource resource = new org.springframework.core.io.ClassPathResource("ecommerce_db_mysql.sql");
            if (resource.exists()) {
                byte[] bytes = resource.getInputStream().readAllBytes();
                String sql = new String(bytes, java.nio.charset.StandardCharsets.UTF_8);
                String[] statements = sql.split(";");
                for (String stmt : statements) {
                    String trimmed = stmt.trim();
                    if (!trimmed.isEmpty()) {
                        try {
                            jdbcTemplate.execute(trimmed);
                            count++;
                        } catch (Exception e) {
                            logs.add("Exec error: " + e.getMessage());
                        }
                    }
                }
                logs.add("ecommerce_db_mysql.sql executed successfully!");
            }
        } catch (Exception e) {
            logs.add("Seed migration error: " + e.getMessage());
        }

        Integer totalProducts = 0;
        try { totalProducts = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products", Integer.class); } catch (Exception ignored) {}

        response.put("statementsExecuted", count);
        response.put("totalProductsInDb", totalProducts);
        response.put("logs", logs);
        return ResponseEntity.ok(response);
    }

    private void ensureProductTablesExist() {
        try {
            Integer prodCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products", Integer.class);
            if (prodCount != null && prodCount > 0) {
                return;
            }
        } catch (Exception ignored) {}

        executeQuietly("CREATE TABLE IF NOT EXISTS categories (" +
                "category_id INT AUTO_INCREMENT PRIMARY KEY, " +
                "category_name VARCHAR(100) NOT NULL UNIQUE, " +
                "description TEXT, " +
                "image_url VARCHAR(500), " +
                "status VARCHAR(20) DEFAULT 'ACTIVE')");

        executeQuietly("CREATE TABLE IF NOT EXISTS products (" +
                "product_id INT AUTO_INCREMENT PRIMARY KEY, " +
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
                "image_id INT AUTO_INCREMENT PRIMARY KEY, " +
                "product_id INT NOT NULL, " +
                "image_url TEXT NOT NULL, " +
                "is_thumbnail BOOLEAN DEFAULT TRUE)");

        executeQuietly("CREATE TABLE IF NOT EXISTS product_images (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "product_id INT NOT NULL, " +
                "image_url TEXT NOT NULL, " +
                "is_primary INT DEFAULT 1)");

        seedAllProducts();
    }

    private void seedAllProducts() {
        // Ensure Categories exist
        for (int i = 1; i <= 10; i++) {
            String catName = i == 1 ? "Diamond" : i == 2 ? "Gold" : i == 3 ? "Platinum" : i == 4 ? "Silver" : "Collection " + i;
            try {
                jdbcTemplate.update("INSERT IGNORE INTO categories (category_id, category_name, description, status) VALUES (?, ?, ?, 'ACTIVE')", i, catName, catName + " Collection");
            } catch (Exception ignored) {}
        }

        Object[][] products = {
            {"Nury Chevron Ring", 1, "Nury Chevron Ring", 7914.29, 5, "https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476"},
            {"The trina ring", 1, "beautifuly designed Trina", 9642.86, 5, "https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792"},
            {"Ozo stud earing", 1, "Handmade Ozo earrings for women", 7743.29, 7, "https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435"},
            {"Nuray earings", 1, "N-shaped Rings with pure gold", 9287.00, 7, "https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167"},
            {"Mazikeen Necklace", 1, "Mazi-Queen Royal look Necklace", 12785.71, 6, "https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171"},
            {"ryck princess", 1, "The ryck Princess Necklace", 14285.57, 6, "https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402"},
            {"Bracelite", 1, "The Aelric Bracelet", 9000.00, 8, "https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778"},
            {"resilent Bracelet", 1, "The Chain-typed Bracelet", 9200.00, 8, "https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366"},
            {"Line Bangles", 1, "Royal elegent Bangles for women", 9571.43, 4, "https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553"},
            {"Set Bangles", 1, "The Bazel-Set Bangles", 10000.00, 4, "https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034"},
            {"Spiral Ring", 2, "Classic Spiral Gold Ring", 9000.00, 6, "https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg"},
            {"leaf design Ring", 2, "Elegant Leaf Design Gold Ring", 6600.00, 6, "https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg"},
            {"Stud Earrings", 2, "Temple Gold Stud Earrings", 8800.00, 4, "https://ik.imagekit.io/StringstackNaveen/earrings.jpg"},
            {"Mahroosh Diamond Necklace", 2, "Indriya Necklace by Aditya Birla", 9285.71, 8, "https://ik.imagekit.io/StringstackNaveen/earings2.jpg"},
            {"Lakshmi Temple Necklace", 2, "Beautifully designed Necklace", 11111.00, 3, "https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif"},
            {"Lakshmi Gold Necklace", 2, "Wonderfully designed Necklace", 12698.29, 3, "https://ik.imagekit.io/StringstackNaveen/necklace2.jpg"},
            {"Gold Beaded Bracelet", 2, "Handicrafted Bracelet for Women", 9162.40, 2, "https://ik.imagekit.io/StringstackNaveen/bracelite1.webp"},
            {"Textured Gold Bracelet", 2, "Men Stylish and elogant look Bracelet", 7712.40, 8, "https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif"},
            {"Vidh Platinum Solitire", 3, "Best Ring for men", 9004.20, 8, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp"},
            {"Elegant floral Ring", 3, "Elegant floral Platinum Ring", 9391.57, 8, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp"},
            {"Swirl Stud Earrings", 3, "Circular Earrings", 6650.80, 7, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg"},
            {"Floral Stud Earrings", 3, "Flower Stud Earrings", 6509.20, 7, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp"},
            {"Emerald Drop Platinum Necklece", 3, "Wonderfully Crafted Necklace for Women", 12842.71, 1, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp"},
            {"Solitaire Platinum Pendant Necklace", 3, "Looking Gorgeous", 12556.86, 1, "https://ik.imagekit.io/StringstackNaveen/necklace1.jpeg"},
            {"Start Motif Platinum Bracelet", 3, "Start Bracelet", 9353.57, 3, "https://ik.imagekit.io/StringstackNaveen/bracelet.jpg"},
            {"Floral Two-Tone Platinum Bracelet", 3, "Floral Two-Tone Platinum Bracelet", 8124.86, 3, "https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg"},
            {"Start- Motif Platinum Bangles", 3, "Floral Two-Tone Platinum Bracelet", 9353.86, 4, "https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp"},
            {"Eternity Platinum Bangle", 3, "Premium Bangles", 7807.86, 5, "https://ik.imagekit.io/StringstackNaveen/platinum%20bangle.jpg"},
            {"Meris Textured Band Ring", 4, "Wonderful Silverplated Ring", 6666.40, 8, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp"},
            {"Butterfly Ring", 4, "Adjustable silver Butterfly Ring", 4542.40, 8, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp"},
            {"Dangler Earrings", 4, "Silver Flower Dangler Earrings", 4917.80, 9, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp"},
            {"Ossum Earrings", 4, "Beautiful Eearings for Women", 5517.20, 9, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp"},
            {"Wisdom Sterling Silver Necklace", 4, "Infinite Wisdom Sterling Silver Necklace", 9164.20, 4, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp"},
            {"GargiStone Necklace", 4, "Beautifully Crafted Stone Necklace", 9305.00, 4, "https://ik.imagekit.io/StringstackNaveen/silver%20necklace.webp"},
            {"Flexi Bracelet", 4, "Fleur Flexi Bracelet in Silver", 7936.29, 3, "https://ik.imagekit.io/StringstackNaveen/silver%20bracelet.jpg"},
            {"Chain Bracelet", 4, "Clara Womens Evil Eye Bracelet", 7048.20, 3, "https://ik.imagekit.io/StringstackNaveen/silver%20bracelet2.jpg"},
            {"Rewa Bangles", 4, "Beautiful Rewa Bangles", 8503.20, 4, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9YMAAiAP8Uiwp_GbwO9XgT9wWc24H6BSgivkQi0-68Q&s=10"},
            {"Sterling Bangles", 4, "Beautiful Sterling Bangles", 7912.80, 4, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp"},
            {"Royal Diamond Choker", 4, "Exquisite Royal Choker", 12000.00, 3, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {"Neckpice Necklace", 2, "Beautifully crafted necklace for women", 7886.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171"},
            {"Long Necklace", 2, "Antique Gold Necklace for women", 7896.00, 9, "https://cpimg.tistatic.com/07549410/b/4/Antique-Gold-Long-Necklace.jpg"},
            {"Antique Jumkas", 2, "Gold Plated One Gram Gold Antique Jhumkas", 5632.00, 10, "https://ik.imagekit.io/StringstackNaveen/earrings.jpg"},
            {"Kemp-green Lakshmi Vankii", 2, "Antique gold tone kemp-green lakshmi peacock elephant nakshi 1 vankii", 7986.00, 10, "https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553"},
            {"Stoned Diamond Necklace", 1, "Beautiful stoned Necklace for women", 9889.00, 10, "https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402"},
            {"Stoned Ring", 1, "A Beautiful Diamond Ring Stands in a Store Window. Stock Photo - Image of anniversary, bride", 9563.00, 10, "https://thumbs.dreamstime.com/b/beautiful-diamond-ring-stands-store-window-306068234.jpg"},
            {"Rose Gold paltinum Necklace", 3, "Rose Gold paltinum Necklace", 6548.00, 10, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp"},
            {"Square Piece-Set Neckalce", 3, "Square Piece Step Necklace", 6541.00, 10, "https://5.imimg.com/data5/SELLER/Default/2025/12/566237565/GW/XI/IP/103582308/platinum-jewelry-500x500.jpg"},
            {"Ghungroo Jwellery Set", 4, "Ghungroo Studded Filigree Work Silver Plated Antique Jewellery Set", 5469.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp"},
            {"Navaratri Jewellery", 4, "Silver Necklace, Navratri Jewellery", 4589.00, 10, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp"}
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
                        jdbcTemplate.update("INSERT INTO products (name, category_id, description, price, stock, status) VALUES (?, ?, ?, ?, ?, 'ACTIVE')", name, catId, desc, price, stock);
                    } catch (Exception ex) {
                        try {
                            jdbcTemplate.update("INSERT INTO products (name, description, price, stock, status) VALUES (?, ?, ?, ?, 'ACTIVE')", name, desc, price, stock);
                        } catch (Exception ignored) {}
                    }
                }
            } else {
                try {
                    jdbcTemplate.update("UPDATE products SET price = ?, description = ?, stock = ?, category_id = ? WHERE LOWER(name) = LOWER(?)", price, desc, stock, catId, name);
                } catch (Exception ignored) {}
            }

            try {
                List<Integer> pIds = jdbcTemplate.queryForList("SELECT COALESCE(product_id, id) FROM products WHERE LOWER(name) = LOWER(?) LIMIT 1", Integer.class, name);
                if (pIds != null && !pIds.isEmpty()) {
                    int pid = pIds.get(0);
                    try {
                        jdbcTemplate.update("INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1) ON CONFLICT DO NOTHING", pid, imgUrl);
                    } catch (Exception ignored) {}
                    try {
                        jdbcTemplate.update("INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, true) ON CONFLICT DO NOTHING", pid, imgUrl);
                    } catch (Exception ignored) {}
                }
            } catch (Exception ignored) {}

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

    private static final List<Map<String, Object>> STATIC_CATALOG = new ArrayList<>();

    public static List<Map<String, Object>> getStaticCatalog() {
        return new ArrayList<>(STATIC_CATALOG);
    }

        static {
        Object[][] products = {
            {111, "Nury Chevron Ring", "Diamond", "Nury Chevron Ring", 7914.29, 5, "https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476"},
            {112, "The trina ring", "Diamond", "beautifuly designed Trina", 9642.86, 5, "https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792"},
            {113, "Ozo stud earing", "Diamond", "Handmade Ozo earrings for women", 7743.29, 7, "https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435"},
            {114, "Nuray earings", "Diamond", "N-shaped Rings with pure gold", 9287.00, 7, "https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167"},
            {115, "Mazikeen Necklace", "Diamond", "Mazi-Queen Royal look Necklace", 12785.71, 6, "https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171"},
            {116, "ryck princess", "Diamond", "The ryck Princess Necklace", 14285.57, 6, "https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402"},
            {117, "Bracelite", "Diamond", "The Aelric Bracelet", 9000.00, 8, "https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778"},
            {118, "resilent Bracelet", "Diamond", "The Chain-typed Bracelet", 9200.00, 8, "https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366"},
            {119, "Line Bangles", "Diamond", "Royal elegent Bangles for women", 9571.43, 4, "https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553"},
            {120, "Set Bangles", "Diamond", "The Bazel-Set Bangles", 10000.00, 4, "https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034"},
            {121, "Spiral Ring", "Gold", "Classic Spiral Gold Ring", 9000.00, 6, "https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg"},
            {122, "leaf design Ring", "Gold", "Elegant Leaf Design Gold Ring", 6600.00, 6, "https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg"},
            {123, "Stud Earrings", "Gold", "Temple Gold Stud Earrings", 8800.00, 4, "https://ik.imagekit.io/StringstackNaveen/earrings.jpg"},
            {124, "Mahroosh Diamond Necklace", "Gold", "Indriya Necklace by Aditya Birla", 9285.71, 8, "https://ik.imagekit.io/StringstackNaveen/earings2.jpg"},
            {125, "Lakshmi Temple Necklace", "Gold", "Beautifully designed Necklace", 11111.00, 3, "https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif"},
            {126, "Lakshmi Gold Necklace", "Gold", "Wonderfully designed Necklace", 12698.29, 3, "https://ik.imagekit.io/StringstackNaveen/necklace2.jpg"},
            {127, "Gold Beaded Bracelet", "Gold", "Handicrafted Bracelet for Women", 9162.40, 2, "https://ik.imagekit.io/StringstackNaveen/bracelite1.webp"},
            {128, "Textured Gold Bracelet", "Gold", "Men Stylish and elogant look Bracelet", 7712.40, 8, "https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif"},
            {131, "Vidh Platinum Solitire", "Platinum", "Best Ring for men", 9004.20, 8, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp"},
            {132, "Elegant floral Ring", "Platinum", "Elegant floral Platinum Ring", 9391.57, 8, "https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp"},
            {133, "Swirl Stud Earrings", "Platinum", "Circular Earrings", 6650.80, 7, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg"},
            {134, "Floral Stud Earrings", "Platinum", "Flower Stud Earrings", 6509.20, 7, "https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp"},
            {135, "Emerald Drop Platinum Necklece", "Platinum", "Wonderfully Crafted Necklace for Women", 12842.71, 1, "https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp"},
            {136, "Solitaire Platinum Pendant Necklace", "Platinum", "Looking Gorgeous", 12556.86, 1, "https://ik.imagekit.io/StringstackNaveen/necklace1.jpeg"},
            {137, "Start Motif Platinum Bracelet", "Platinum", "Start Bracelet", 9353.57, 3, "https://ik.imagekit.io/StringstackNaveen/bracelet.jpg"},
            {138, "Floral Two-Tone Platinum Bracelet", "Platinum", "Floral Two-Tone Platinum Bracelet", 8124.86, 3, "https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg"},
            {139, "Start- Motif Platinum Bangles", "Platinum", "Floral Two-Tone Platinum Bracelet", 9353.86, 4, "https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp"},
            {140, "Eternity Platinum Bangle", "Platinum", "Premium Bangles", 7807.86, 5, "https://ik.imagekit.io/StringstackNaveen/platinum%20bangle.jpg"},
            {141, "Meris Textured Band Ring", "Silver", "Wonderful Silverplated Ring", 6666.40, 8, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp"},
            {142, "Butterfly Ring", "Silver", "Adjustable silver Butterfly Ring", 4542.40, 8, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp"},
            {143, "Dangler Earrings", "Silver", "Silver Flower Dangler Earrings", 4917.80, 9, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp"},
            {144, "Ossum Earrings", "Silver", "Beautiful Eearings for Women", 5517.20, 9, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp"},
            {145, "Wisdom Sterling Silver Necklace", "Silver", "Infinite Wisdom Sterling Silver Necklace", 9164.20, 4, "https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp"},
            {146, "GargiStone Necklace", "Silver", "Beautifully Crafted Stone Necklace", 9305.00, 4, "https://ik.imagekit.io/StringstackNaveen/silver%20necklace.webp"},
            {147, "Flexi Bracelet", "Silver", "Fleur Flexi Bracelet in Silver", 7936.29, 3, "https://ik.imagekit.io/StringstackNaveen/silver%20bracelet.jpg"},
            {148, "Chain Bracelet", "Silver", "Clara Womens Evil Eye Bracelet", 7048.20, 3, "https://ik.imagekit.io/StringstackNaveen/silver%20bracelet2.jpg"},
            {149, "Rewa Bangles", "Silver", "Beautiful Rewa Bangles", 8503.20, 4, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9YMAAiAP8Uiwp_GbwO9XgT9wWc24H6BSgivkQi0-68Q&s=10"},
            {150, "Sterling Bangles", "Silver", "Beautiful Sterling Bangles", 7912.80, 4, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShdMQkjEY7G9wrlmOl3__dJt9t-inszs1zqJUOBfRdbw&s=10"},
            {151, "Royal Diamond Choker", "Silver", "Exquisite Royal Choker", 12000.00, 3, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
            {155, "Neckpice Necklace", "Gold", "Beautifully crafted necklace for women", 7886.00, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFjFl-t7B2tgiTFxwu0DjLM06_sGl06qvLn9_ZQj29gg&s=10"},
            {156, "Long Necklace", "Gold", "Antique Gold Necklace for women", 7896.00, 9, "https://cpimg.tistatic.com/07549410/b/4/Antique-Gold-Long-Necklace.jpg"},
            {157, "Antique Jumkas", "Gold", "Gold Plated One Gram Gold Antique Jhumkas", 5632.00, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdiBUpbrYocMfqi1w24arPLNCCBYo40aIoSL1188DgDg&s=10"},
            {158, "Kemp-green Lakshmi Vankii", "Gold", "Antique gold tone kemp-green lakshmi peacock elephant nakshi 1 vankii", 7986.00, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsSouth25K9Qof9iRlt-NmhGjWBoWjbnY4NX8fYX1ElA&s=10"},
            {159, "Stoned Diamond Necklace", "Diamond", "Beautiful stoned Necklace for women", 9889.00, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6d0N4u3iGzboB1LFphrbsfB_5MefYDLT7dlfYm5DsQ&s=10"},
            {160, "Stoned Ring", "Diamond", "A Beautiful Diamond Ring Stands in a Store Window. Stock Photo - Image of anniversary, bride", 9563.00, 10, "https://thumbs.dreamstime.com/b/beautiful-diamond-ring-stands-store-window-306068234.jpg"},
            {161, "Rose Gold paltinum Necklace", "Platinum", "Rose Gold paltinum Necklace", 6548.00, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX6xc0k7rmQDM1AvOkFy4_khegDZGnR2hwdB_Ggxdn7Q&s=10"},
            {162, "Square Piece-Set Neckalce", "Platinum", "Square Piece Step Necklace", 6541.00, 10, "https://5.imimg.com/data5/SELLER/Default/2025/12/566237565/GW/XI/IP/103582308/platinum-jewelry-500x500.jpg"},
            {163, "Ghungroo Jwellery Set", "Silver", "Ghungroo Studded Filigree Work Silver Plated Antique Jewellery Set", 5469.00, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2bAPHTgkvRdef7qg-qdlIUXhMG-pjIty0vlpr9_Crmg&s=10"},
            {164, "Navaratri Jewellery", "Silver", "Silver Necklace, Navratri Jewellery", 4589.00, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZu21IJaJTklggWAzm5Q_NAb-w5tDP7MO40NVeccKUZw&s=10"}
        };

        for (Object[] p : products) {
            int id = (Integer) p[0];
            String name = (String) p[1];
            String catName = (String) p[2];
            String desc = (String) p[3];
            double priceDouble = (Double) p[4];
            BigDecimal price = BigDecimal.valueOf(priceDouble);
            int stock = (Integer) p[5];
            String imgUrl = (String) p[6];

            Map<String, Object> item = new HashMap<>();
            item.put("id", id);
            item.put("productId", id);
            item.put("name", name);
            item.put("categoryName", catName);
            item.put("category", catName);
            item.put("description", desc);
            item.put("price", price);
            item.put("stock", stock);
            item.put("imageUrl", imgUrl);
            item.put("status", "ACTIVE");
            STATIC_CATALOG.add(item);
        }
    }

    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getPublicProducts(@RequestParam(value = "category", required = false) String category) {
        String sql = "SELECT p.product_id as id, p.product_id, p.name, p.description, p.price, " +
                "COALESCE(p.stock, 10) as stock, COALESCE(p.stock, 10) as stock_quantity, " +
                "COALESCE(c.category_name, 'Diamond') as categoryName, COALESCE(c.category_name, 'Diamond') as category, " +
                "COALESCE(" +
                "  (SELECT pi.image_url FROM productimages pi WHERE pi.product_id = p.product_id LIMIT 1), " +
                "  (SELECT img.image_url FROM product_images img WHERE img.product_id = p.product_id LIMIT 1) " +
                ") as imageUrl " +
                "FROM products p " +
                "LEFT JOIN categories c ON p.category_id = c.category_id " +
                "WHERE COALESCE(p.status, 'ACTIVE') = 'ACTIVE' " +
                "ORDER BY p.product_id ASC";

        List<Map<String, Object>> resultList = new ArrayList<>();
        try {
            List<Map<String, Object>> dbProducts = jdbcTemplate.queryForList(sql);
            if (!dbProducts.isEmpty()) {
                resultList = dbProducts;
            } else {
                resultList = STATIC_CATALOG;
            }
        } catch (Exception e) {
            e.printStackTrace();
            resultList = STATIC_CATALOG;
        }

        if (category != null && !category.trim().isEmpty() && !category.trim().equalsIgnoreCase("all")) {
            List<Map<String, Object>> filtered = new ArrayList<>();
            for (Map<String, Object> item : resultList) {
                String cat = (String) item.get("categoryName");
                if (cat != null && cat.equalsIgnoreCase(category.trim())) {
                    filtered.add(item);
                }
            }
            return ResponseEntity.ok()
                    .header("Cache-Control", "no-cache, no-store, must-revalidate")
                    .body(filtered);
        }

        return ResponseEntity.ok()
                .header("Cache-Control", "no-cache, no-store, must-revalidate")
                .body(resultList);
    }

    private void ensureCartTableExists() {
        executeQuietly("CREATE TABLE IF NOT EXISTS cart_items (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
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
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.ok(Map.of("count", 0));
        }
        String email = auth.getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.ok(Map.of("count", 0));
        }
        try {
            Integer count = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(quantity), 0) FROM cart_items WHERE user_id = ?", Integer.class, userId);
            return ResponseEntity.ok(Map.of("count", count != null ? count : 0));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("count", 0));
        }
    }

    @GetMapping("/cart/items")
    public ResponseEntity<?> getCartItems() {
        ensureCartTableExists();
        ensureProductTablesExist();
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        String email = auth.getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        try {
            String sql = "SELECT c.id, COALESCE(c.product_id, 0) as \"productId\", c.quantity, " +
                         "COALESCE(p.name, CONCAT('Jewellery Item #', c.product_id)) as name, " +
                         "COALESCE(p.price, 0.00) as price, " +
                         "COALESCE(pi.image_url, pii.image_url, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e') as \"imageUrl\" " +
                         "FROM cart_items c " +
                         "LEFT JOIN products p ON (c.product_id = p.id OR c.product_id = p.product_id) " +
                         "LEFT JOIN (SELECT product_id, MAX(image_url) as image_url FROM product_images GROUP BY product_id) pi ON (p.id = pi.product_id OR p.product_id = pi.product_id) " +
                         "LEFT JOIN (SELECT product_id, MAX(image_url) as image_url FROM productimages GROUP BY product_id) pii ON (p.id = pii.product_id OR p.product_id = pii.product_id) " +
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
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.badRequest().body("User not found");
        }
        String email = auth.getPrincipal().toString();
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
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.badRequest().body("User not found");
        }
        String email = auth.getPrincipal().toString();
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
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.badRequest().body("User not found");
        }
        String email = auth.getPrincipal().toString();
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
