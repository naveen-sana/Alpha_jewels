package com.jewellery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired(required = false)
    private PasswordEncoder passwordEncoder;

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
            java.math.BigDecimal price = java.math.BigDecimal.valueOf(priceDouble);
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

    // Helper method to ensure required database tables and columns exist
    @PostConstruct
    public void ensureTablesExist() {
        try {
            // Categories table
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS categories (" +
                        "category_id SERIAL PRIMARY KEY, " +
                        "category_name VARCHAR(100) NOT NULL UNIQUE, " +
                        "description TEXT, " +
                        "image_url VARCHAR(500), " +
                        "status VARCHAR(20) DEFAULT 'ACTIVE', " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                        ")");
            } catch (Exception ignored) {}

            // Seed default categories if empty
            try {
                Integer catCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM categories", Integer.class);
                if (catCount == null || catCount == 0) {
                    String[] defaultCats = {"Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Chains", "Pendants", "Anklets", "Collections"};
                    for (String cat : defaultCats) {
                        try {
                            jdbcTemplate.update("INSERT INTO categories (category_name, description, status) VALUES (?, ?, 'ACTIVE')",
                                    cat, cat + " luxury jewellery collection");
                        } catch (Exception ignored) {}
                    }
                }
            } catch (Exception ignored) {}

            // Products table
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
                        "sku VARCHAR(100) UNIQUE, " +
                        "status VARCHAR(20) DEFAULT 'ACTIVE', " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                        ")");
            } catch (Exception ignored) {}

            // Add missing columns to products table if existing table had fewer columns
            String[] columnsToAdd = {
                "ALTER TABLE products ADD COLUMN weight VARCHAR(50) DEFAULT '10g'",
                "ALTER TABLE products ADD COLUMN metal_type VARCHAR(50) DEFAULT 'Gold'",
                "ALTER TABLE products ADD COLUMN gold_purity VARCHAR(50) DEFAULT '22K'",
                "ALTER TABLE products ADD COLUMN diamond_details VARCHAR(255) DEFAULT 'VS1 / G-H Color'",
                "ALTER TABLE products ADD COLUMN stone_details VARCHAR(255) DEFAULT 'Natural Diamond'",
                "ALTER TABLE products ADD COLUMN certificate_number VARCHAR(100)",
                "ALTER TABLE products ADD COLUMN sku VARCHAR(100)",
                "ALTER TABLE products ADD COLUMN discount DECIMAL(5, 2) DEFAULT 0.00",
                "ALTER TABLE products ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE'"
            };
            for (String alterSql : columnsToAdd) {
                try { jdbcTemplate.execute(alterSql); } catch (Exception ignored) {}
            }

            // Product Images table
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS productimages (" +
                        "image_id SERIAL PRIMARY KEY, " +
                        "product_id INT NOT NULL, " +
                        "image_url TEXT NOT NULL, " +
                        "is_thumbnail BOOLEAN DEFAULT TRUE" +
                        ")");
            } catch (Exception ignored) {}

            // Orders table
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS orders (" +
                        "order_id VARCHAR(100) PRIMARY KEY, " +
                        "user_id BIGINT NOT NULL, " +
                        "total_amount DECIMAL(12, 2) NOT NULL, " +
                        "payment_method VARCHAR(50) DEFAULT 'Credit Card', " +
                        "payment_status VARCHAR(50) DEFAULT 'Paid', " +
                        "status VARCHAR(50) NOT NULL DEFAULT 'Delivered', " +
                        "shipping_address TEXT, " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                        ")");
            } catch (Exception ignored) {}

            String[] orderColsToAdd = {
                "ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Credit Card'",
                "ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'Paid'",
                "ALTER TABLE orders ADD COLUMN shipping_address TEXT"
            };
            for (String alterSql : orderColsToAdd) {
                try { jdbcTemplate.execute(alterSql); } catch (Exception ignored) {}
            }

            // Order Items table
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS order_items (" +
                        "id SERIAL PRIMARY KEY, " +
                        "order_id VARCHAR(100) NOT NULL, " +
                        "product_id BIGINT NOT NULL, " +
                        "quantity INT NOT NULL DEFAULT 1, " +
                        "price_per_unit DECIMAL(12, 2) NOT NULL, " +
                        "total_price DECIMAL(12, 2) NOT NULL" +
                        ")");
            } catch (Exception ignored) {}

            // Coupons table
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS coupons (" +
                        "coupon_id SERIAL PRIMARY KEY, " +
                        "code VARCHAR(50) NOT NULL UNIQUE, " +
                        "discount_percentage DECIMAL(5, 2) NOT NULL, " +
                        "min_spend DECIMAL(12, 2) DEFAULT 0.00, " +
                        "expiry_date VARCHAR(50), " +
                        "status VARCHAR(20) DEFAULT 'ACTIVE', " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                        ")");
            } catch (Exception ignored) {}

            // Reviews table
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS reviews (" +
                        "review_id SERIAL PRIMARY KEY, " +
                        "product_id INT, " +
                        "user_id BIGINT, " +
                        "customer_name VARCHAR(100), " +
                        "rating INT DEFAULT 5, " +
                        "comment TEXT, " +
                        "status VARCHAR(20) DEFAULT 'APPROVED', " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                        ")");
            } catch (Exception ignored) {}

            // Store Settings table
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS store_settings (" +
                        "setting_key VARCHAR(100) PRIMARY KEY, " +
                        "setting_value TEXT" +
                        ")");
            } catch (Exception ignored) {}

        } catch (Exception ignored) {}
    }

    // ==========================================
    // 1. DASHBOARD STATISTICS & ANALYTICS
    // ==========================================
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        ensureTablesExist();
        Map<String, Object> stats = new HashMap<>();

        try {
            // Product count
            Integer totalProducts = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products", Integer.class);
            // Category count
            Integer totalCategories = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM categories", Integer.class);
            // Customer & User count
            Integer totalUsers = 0;
            try {
                totalUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user", Integer.class);
            } catch (Exception e) {
                try {
                    totalUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
                } catch (Exception ignored) {}
            }
            Integer totalCustomers = totalUsers;

            // Orders count
            Integer pendingOrders = 0;
            Integer completedOrders = 0;
            try {
                pendingOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM orders WHERE status IN ('Pending', 'Confirmed', 'Packed', 'Shipped')", Integer.class);
                completedOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM orders WHERE status = 'Delivered'", Integer.class);
            } catch (Exception ignored) {}

            // Revenue metrics
            Double overallRevenue = 0.0;
            Double todayRevenue = 0.0;
            Double monthlyRevenue = 0.0;
            Double yearlyRevenue = 0.0;

            try {
                Double rev = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'Cancelled'", Double.class);
                overallRevenue = rev != null ? rev : 0.0;

                Double tRev = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'Cancelled' AND DATE(created_at) = CURRENT_DATE()", Double.class);
                todayRevenue = tRev != null ? tRev : 0.0;

                Double mRev = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'Cancelled' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())", Double.class);
                monthlyRevenue = mRev != null ? mRev : 0.0;

                Double yRev = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'Cancelled' AND YEAR(created_at) = YEAR(CURRENT_DATE())", Double.class);
                yearlyRevenue = yRev != null ? yRev : 0.0;
            } catch (Exception ignored) {}

            stats.put("totalProducts", totalProducts != null ? totalProducts : 0);
            stats.put("totalCategories", totalCategories != null ? totalCategories : 0);
            stats.put("totalCustomers", totalCustomers != null ? totalCustomers : 0);
            stats.put("totalUsers", totalUsers != null ? totalUsers : 0);
            stats.put("pendingOrders", pendingOrders != null ? pendingOrders : 0);
            stats.put("completedOrders", completedOrders != null ? completedOrders : 0);
            stats.put("todayRevenue", todayRevenue);
            stats.put("monthlyRevenue", monthlyRevenue);
            stats.put("yearlyRevenue", yearlyRevenue);
            stats.put("overallRevenue", overallRevenue);

            // Revenue Line Chart Data (Monthly trends)
            List<Map<String, Object>> revenueLineChart = new ArrayList<>();
            try {
                String chartSql = "SELECT DATE_FORMAT(created_at, '%b %Y') as label, SUM(total_amount) as revenue, COUNT(*) as orders " +
                        "FROM orders WHERE status != 'Cancelled' " +
                        "GROUP BY DATE_FORMAT(created_at, '%b %Y'), YEAR(created_at), MONTH(created_at) " +
                        "ORDER BY YEAR(created_at) ASC, MONTH(created_at) ASC LIMIT 12";
                revenueLineChart = jdbcTemplate.queryForList(chartSql);
            } catch (Exception ignored) {}
            if (revenueLineChart.isEmpty()) {
                // Fallback default structure if no order history exists yet
                String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"};
                double[] values = {125000, 180000, 240000, 310000, 280000, 450000, 520000, 610000};
                for (int i = 0; i < months.length; i++) {
                    Map<String, Object> point = new HashMap<>();
                    point.put("label", months[i]);
                    point.put("revenue", values[i]);
                    point.put("orders", (i + 1) * 4);
                    revenueLineChart.add(point);
                }
            }
            stats.put("revenueLineChart", revenueLineChart);

            // Monthly Sales Chart Data
            stats.put("monthlySalesChart", revenueLineChart);

            // Category Pie Chart
            List<Map<String, Object>> categoryPieChart = new ArrayList<>();
            try {
                String catSql = "SELECT c.category_name as name, COUNT(p.product_id) as value " +
                        "FROM categories c " +
                        "LEFT JOIN products p ON c.category_id = p.category_id " +
                        "GROUP BY c.category_id, c.category_name";
                categoryPieChart = jdbcTemplate.queryForList(catSql);
            } catch (Exception ignored) {}
            stats.put("categoryPieChart", categoryPieChart);

            // Top Selling Jewellery
            List<Map<String, Object>> topSelling = getProductsListInternal(5);
            stats.put("topSellingJewellery", topSelling);

            // Latest Orders
            List<Map<String, Object>> latestOrders = getOrdersListInternal(5);
            stats.put("latestOrders", latestOrders);

            // Low Stock Products
            List<Map<String, Object>> lowStock = new ArrayList<>();
            try {
                String lowStockSql = "SELECT p.product_id as id, p.name, p.stock, p.price, pi.image_url as imageUrl " +
                        "FROM products p " +
                        "LEFT JOIN productimages pi ON p.product_id = pi.product_id " +
                        "WHERE p.stock <= 5 ORDER BY p.stock ASC LIMIT 5";
                lowStock = jdbcTemplate.queryForList(lowStockSql);
            } catch (Exception ignored) {}
            stats.put("lowStockProducts", lowStock);

            // Recent Customers
            List<Map<String, Object>> recentCustomers = getUsersListInternal(5);
            stats.put("recentCustomers", recentCustomers);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==========================================
    // 2. PRODUCT MANAGEMENT CRUD
    // ==========================================
    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getAllProducts() {
        ensureTablesExist();
        return ResponseEntity.ok(getProductsListInternal(100));
    }

    private List<Map<String, Object>> getProductsListInternal(int limit) {
        String imgTable = "productimages";
        try {
            List<Map<String, Object>> check = jdbcTemplate.queryForList("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='ecommerce_db' AND TABLE_NAME='product_images'");
            if (check != null && !check.isEmpty()) imgTable = "product_images";
        } catch (Exception ignored) {}

        String sql = "SELECT p.product_id as id, p.name, p.category_id as categoryId, COALESCE(c.category_name, 'Jewellery') as category, " +
                "p.description, p.price, COALESCE(p.discount, 0.00) as discount, COALESCE(p.stock, 10) as stock, " +
                "COALESCE(p.weight, '10g') as weight, COALESCE(p.metal_type, 'Gold') as metalType, " +
                "COALESCE(p.gold_purity, '22K') as goldPurity, COALESCE(p.diamond_details, 'VS1 / G-H Color') as diamondDetails, " +
                "COALESCE(p.stone_details, 'Natural Diamond') as stoneDetails, " +
                "COALESCE(p.certificate_number, '') as certificateNumber, COALESCE(p.sku, CONCAT('SKU-', p.product_id)) as sku, " +
                "COALESCE(p.status, 'ACTIVE') as status, pi.image_url as imageUrl " +
                "FROM products p " +
                "LEFT JOIN categories c ON p.category_id = c.category_id " +
                "LEFT JOIN (SELECT product_id, MAX(image_url) as image_url FROM " + imgTable + " GROUP BY product_id) pi ON p.product_id = pi.product_id " +
                "ORDER BY p.product_id DESC LIMIT " + limit;
        try {
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                String simpleSql = "SELECT p.product_id as id, p.name, 'Jewellery' as category, p.description, p.price, 0 as discount, 10 as stock, 'ACTIVE' as status FROM products p LIMIT " + limit;
                return jdbcTemplate.queryForList(simpleSql);
            } catch (Exception ignored) {
                return new ArrayList<>();
            }
        }
    }

    private double parseDoubleSafe(Object val, double defaultVal) {
        if (val == null) return defaultVal;
        if (val instanceof Number) return ((Number) val).doubleValue();
        try {
            return Double.parseDouble(val.toString().trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private int parseIntSafe(Object val, int defaultVal) {
        if (val == null) return defaultVal;
        if (val instanceof Number) return ((Number) val).intValue();
        try {
            return Integer.parseInt(val.toString().trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String name = (String) body.get("name");
            String description = (String) body.get("description");
            double price = parseDoubleSafe(body.get("price"), 0.0);
            double discount = parseDoubleSafe(body.get("discount"), 0.0);
            int stock = parseIntSafe(body.get("stock"), 10);

            String weight = body.get("weight") != null && !((String) body.get("weight")).trim().isEmpty() ? (String) body.get("weight") : "10g";
            String metalType = body.get("metalType") != null && !((String) body.get("metalType")).trim().isEmpty() ? (String) body.get("metalType") : "Gold";
            String goldPurity = body.get("goldPurity") != null && !((String) body.get("goldPurity")).trim().isEmpty() ? (String) body.get("goldPurity") : "22K";
            String diamondDetails = body.get("diamondDetails") != null && !((String) body.get("diamondDetails")).trim().isEmpty() ? (String) body.get("diamondDetails") : "VS1 / G-H Color";
            String stoneDetails = body.get("stoneDetails") != null && !((String) body.get("stoneDetails")).trim().isEmpty() ? (String) body.get("stoneDetails") : "Natural Diamond";
            String certificateNumber = body.get("certificateNumber") != null && !((String) body.get("certificateNumber")).trim().isEmpty() ? (String) body.get("certificateNumber") : "CERT-" + System.currentTimeMillis();
            String sku = body.get("sku") != null && !((String) body.get("sku")).trim().isEmpty() ? (String) body.get("sku") : "SKU-" + System.currentTimeMillis() + "-" + ((int)(Math.random() * 8999) + 1000);
            String status = body.containsKey("status") ? (String) body.get("status") : "ACTIVE";
            String imageUrl = body.containsKey("imageUrl") ? (String) body.get("imageUrl") : "https://images.unsplash.com/photo-1605100804763-247f67b3557e";

            // Find or set category_id
            Integer categoryId = 1;
            if (body.containsKey("category")) {
                String catName = (String) body.get("category");
                try {
                    List<Map<String, Object>> cats = jdbcTemplate.queryForList("SELECT category_id FROM categories WHERE category_name = ?", catName);
                    if (!cats.isEmpty()) {
                        categoryId = ((Number) cats.get(0).get("category_id")).intValue();
                    } else {
                        jdbcTemplate.update("INSERT INTO categories (category_name, description) VALUES (?, ?)", catName, catName + " collection");
                        List<Map<String, Object>> newCats = jdbcTemplate.queryForList("SELECT category_id FROM categories WHERE category_name = ?", catName);
                        if (!newCats.isEmpty()) {
                            categoryId = ((Number) newCats.get(0).get("category_id")).intValue();
                        }
                    }
                } catch (Exception ignored) {}
            }

            String insertProductSql = "INSERT INTO products (name, category_id, description, price, discount, stock, weight, metal_type, gold_purity, diamond_details, stone_details, certificate_number, sku, status) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(insertProductSql, name, categoryId, description, price, discount, stock, weight, metalType, goldPurity, diamondDetails, stoneDetails, certificateNumber, sku, status);

            // Fetch created product_id
            Integer productId = null;
            try {
                productId = jdbcTemplate.queryForObject("SELECT MAX(product_id) FROM products", Integer.class);
            } catch (Exception ignored) {}

            if (productId != null && imageUrl != null && !imageUrl.trim().isEmpty()) {
                String cleanUrl = imageUrl.trim();
                try {
                    jdbcTemplate.update("INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", productId, cleanUrl);
                } catch (Exception ignored) {}
                try {
                    jdbcTemplate.update("INSERT INTO product_images (product_id, image_url) VALUES (?, ?)", productId, cleanUrl);
                } catch (Exception ignored) {}
            }

            Map<String, Object> resp = new HashMap<>();
            resp.put("message", "Product created successfully");
            resp.put("productId", productId);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to add product: " + e.getMessage());
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String name = (String) body.get("name");
            String description = (String) body.get("description");
            double price = parseDoubleSafe(body.get("price"), 0.0);
            double discount = parseDoubleSafe(body.get("discount"), 0.0);
            int stock = parseIntSafe(body.get("stock"), 10);
            String weight = body.get("weight") != null ? (String) body.get("weight") : "10g";
            String metalType = body.get("metalType") != null ? (String) body.get("metalType") : "Gold";
            String goldPurity = body.get("goldPurity") != null ? (String) body.get("goldPurity") : "22K";
            String diamondDetails = body.get("diamondDetails") != null ? (String) body.get("diamondDetails") : "VS1 / G-H Color";
            String stoneDetails = body.get("stoneDetails") != null ? (String) body.get("stoneDetails") : "Natural Diamond";
            String certificateNumber = body.get("certificateNumber") != null && !((String) body.get("certificateNumber")).trim().isEmpty() ? (String) body.get("certificateNumber") : "CERT-" + System.currentTimeMillis();
            String sku = body.get("sku") != null && !((String) body.get("sku")).trim().isEmpty() ? (String) body.get("sku") : "SKU-" + id + "-" + ((int)(Math.random() * 8999) + 1000);
            String status = body.containsKey("status") ? (String) body.get("status") : "ACTIVE";

            String updateSql = "UPDATE products SET name=?, description=?, price=?, discount=?, stock=?, " +
                    "weight=?, metal_type=?, gold_purity=?, diamond_details=?, stone_details=?, certificate_number=?, sku=?, status=? " +
                    "WHERE product_id=?";
            jdbcTemplate.update(updateSql, name, description, price, discount, stock, weight, metalType, goldPurity, diamondDetails, stoneDetails, certificateNumber, sku, status, id);

            if (body.containsKey("imageUrl") && body.get("imageUrl") != null) {
                String imageUrl = ((String) body.get("imageUrl")).trim();
                try {
                    jdbcTemplate.update("DELETE FROM productimages WHERE product_id=?", id);
                    jdbcTemplate.update("INSERT INTO productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", id, imageUrl);
                } catch (Exception ignored) {}
                try {
                    jdbcTemplate.update("DELETE FROM product_images WHERE product_id=?", id);
                    jdbcTemplate.update("INSERT INTO product_images (product_id, image_url) VALUES (?, ?)", id, imageUrl);
                } catch (Exception ignored) {}
            }

            return ResponseEntity.ok(Map.of("message", "Product updated successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to update product: " + e.getMessage());
        }
    }

    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<?> updateProductStock(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            int stock = parseIntSafe(body.get("stock"), 0);
            jdbcTemplate.update("UPDATE products SET stock=? WHERE product_id=?", stock, id);
            return ResponseEntity.ok(Map.of("message", "Stock updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating stock: " + e.getMessage());
        }
    }

    @PatchMapping("/products/{id}/price")
    public ResponseEntity<?> updateProductPrice(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            double price = parseDoubleSafe(body.get("price"), 0.0);
            jdbcTemplate.update("UPDATE products SET price=? WHERE product_id=?", price, id);
            return ResponseEntity.ok(Map.of("message", "Price updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating price: " + e.getMessage());
        }
    }

    @PatchMapping("/products/{id}/status")
    public ResponseEntity<?> toggleProductStatus(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            String status = (String) body.get("status");
            jdbcTemplate.update("UPDATE products SET status=? WHERE product_id=?", status, id);
            return ResponseEntity.ok(Map.of("message", "Product status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating status: " + e.getMessage());
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        ensureTablesExist();
        try {
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=0");
            jdbcTemplate.update("DELETE FROM productimages WHERE product_id=?", id);
            try { jdbcTemplate.update("DELETE FROM product_images WHERE product_id=?", id); } catch (Exception ignored) {}
            try { jdbcTemplate.update("DELETE FROM cart_items WHERE product_id=?", id); } catch (Exception ignored) {}
            try { jdbcTemplate.update("DELETE FROM order_items WHERE product_id=?", id); } catch (Exception ignored) {}
            try { jdbcTemplate.update("DELETE FROM reviews WHERE product_id=?", id); } catch (Exception ignored) {}
            try { jdbcTemplate.update("DELETE FROM wishlist WHERE product_id=?", id); } catch (Exception ignored) {}
            try { jdbcTemplate.update("DELETE FROM wishlist_items WHERE product_id=?", id); } catch (Exception ignored) {}
            jdbcTemplate.update("DELETE FROM products WHERE product_id=?", id);
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1");
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully from MySQL database"));
        } catch (Exception e) {
            try { jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1"); } catch (Exception ignored) {}
            return ResponseEntity.internalServerError().body("Error deleting product: " + e.getMessage());
        }
    }

    // ==========================================
    // 3. CATEGORY MANAGEMENT CRUD
    // ==========================================
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        ensureTablesExist();
        try {
            String sql = "SELECT c.category_id as id, c.category_name as name, " +
                    "c.description, c.image_url as imageUrl, COALESCE(c.status, 'ACTIVE') as status, " +
                    "(SELECT COUNT(*) FROM products p WHERE p.category_id = c.category_id) as productCount " +
                    "FROM categories c ORDER BY c.category_id ASC";
            List<Map<String, Object>> cats = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(cats);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                String simpleSql = "SELECT category_id as id, category_name as name, description, image_url as imageUrl, status, 10 as productCount FROM categories";
                return ResponseEntity.ok(jdbcTemplate.queryForList(simpleSql));
            } catch (Exception ignored) {
                return ResponseEntity.ok(new ArrayList<>());
            }
        }
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String name = (String) body.get("name");
            String description = (String) body.get("description");
            String imageUrl = body.containsKey("imageUrl") ? (String) body.get("imageUrl") : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f";
            String status = body.containsKey("status") ? (String) body.get("status") : "ACTIVE";

            jdbcTemplate.update("INSERT INTO categories (category_name, description, image_url, status) VALUES (?, ?, ?, ?)",
                    name, description, imageUrl, status);
            return ResponseEntity.ok(Map.of("message", "Category created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating category: " + e.getMessage());
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String name = (String) body.get("name");
            String description = (String) body.get("description");
            String imageUrl = (String) body.get("imageUrl");
            String status = (String) body.get("status");

            jdbcTemplate.update("UPDATE categories SET category_name=?, description=?, image_url=?, status=? WHERE category_id=?",
                    name, description, imageUrl, status, id);
            return ResponseEntity.ok(Map.of("message", "Category updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating category: " + e.getMessage());
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        ensureTablesExist();
        try {
            jdbcTemplate.update("UPDATE products SET category_id = NULL WHERE category_id = ?", id);
            jdbcTemplate.update("DELETE FROM categories WHERE category_id = ?", id);
            return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error deleting category: " + e.getMessage()));
        }
    }

    // ==========================================
    // 4. ORDER MANAGEMENT
    // ==========================================
    @GetMapping("/orders")
    public ResponseEntity<List<Map<String, Object>>> getAllOrdersAdmin() {
        ensureTablesExist();
        return ResponseEntity.ok(getOrdersListInternal(100));
    }

    private List<Map<String, Object>> getOrdersListInternal(int limit) {
        String imgTable = "productimages";
        try {
            List<Map<String, Object>> check = jdbcTemplate.queryForList("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='ecommerce_db' AND TABLE_NAME='product_images'");
            if (check != null && !check.isEmpty()) imgTable = "product_images";
        } catch (Exception ignored) {}

        String userTable = "user";
        try {
            List<Map<String, Object>> checkU = jdbcTemplate.queryForList("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='ecommerce_db' AND TABLE_NAME='users'");
            if (checkU != null && !checkU.isEmpty()) userTable = "users";
        } catch (Exception ignored) {}

        String sqlOrders = "SELECT o.order_id as orderId, o.user_id as userId, COALESCE(u.full_name, 'Customer') as customerName, COALESCE(u.email, 'customer@alphajewels.com') as customerEmail, " +
                "o.total_amount as grandTotal, COALESCE(o.payment_method, 'Razorpay Online') as paymentMethod, COALESCE(o.payment_status, 'COMPLETED') as paymentStatus, " +
                "COALESCE(o.status, 'SUCCESS') as orderStatus, COALESCE(o.shipping_address, 'Standard Delivery Address') as shippingAddress, o.created_at as orderDate " +
                "FROM orders o " +
                "LEFT JOIN " + userTable + " u ON o.user_id = u.id " +
                "ORDER BY o.created_at DESC LIMIT " + limit;
        try {
            List<Map<String, Object>> orders = jdbcTemplate.queryForList(sqlOrders);
            for (Map<String, Object> order : orders) {
                String orderId = (String) order.get("orderId");
                String custName = (String) order.get("customerName");
                String shipAddr = (String) order.get("shippingAddress");

                if (custName == null || custName.equalsIgnoreCase("Customer") || custName.trim().isEmpty()) {
                    if (shipAddr != null && shipAddr.contains(",")) {
                        String namePart = shipAddr.split(",")[0].trim();
                        if (!namePart.isEmpty() && !namePart.toLowerCase().contains("house") && !namePart.toLowerCase().contains("street")) {
                            order.put("customerName", namePart);
                        }
                    }
                }

                String status = (String) order.get("orderStatus");
                if (status == null || status.equalsIgnoreCase("SUCCESS") || status.trim().isEmpty()) {
                    order.put("orderStatus", "Confirmed");
                }

                String sqlItems = "SELECT oi.product_id as id, COALESCE(p.name, CONCAT('Jewellery Item #', oi.product_id)) as name, oi.quantity, oi.price_per_unit as price, oi.total_price as subtotal, pi.image_url as imageUrl " +
                        "FROM order_items oi " +
                        "LEFT JOIN products p ON oi.product_id = p.product_id " +
                        "LEFT JOIN (SELECT product_id, MAX(image_url) as image_url FROM " + imgTable + " GROUP BY product_id) pi ON p.product_id = pi.product_id " +
                        "WHERE oi.order_id = ?";
                List<Map<String, Object>> items = jdbcTemplate.queryForList(sqlItems, orderId);
                order.put("items", items);
                order.put("itemCount", items.size());
            }
            return orders;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId, @RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String status = (String) body.get("status");
            jdbcTemplate.update("UPDATE orders SET status=?, updated_at=NOW() WHERE order_id=?", status, orderId);
            return ResponseEntity.ok(Map.of("message", "Order status updated to " + status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating order status: " + e.getMessage());
        }
    }

    @PutMapping("/orders/{orderId}/payment")
    public ResponseEntity<?> updateOrderPaymentStatus(@PathVariable String orderId, @RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String paymentStatus = (String) body.get("paymentStatus");
            jdbcTemplate.update("UPDATE orders SET payment_status=?, updated_at=NOW() WHERE order_id=?", paymentStatus, orderId);
            return ResponseEntity.ok(Map.of("message", "Payment status updated to " + paymentStatus));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating payment status: " + e.getMessage());
        }
    }

    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<?> deleteOrderAdmin(@PathVariable String orderId) {
        ensureTablesExist();
        try {
            jdbcTemplate.update("DELETE FROM order_items WHERE order_id=?", orderId);
            jdbcTemplate.update("DELETE FROM orders WHERE order_id=?", orderId);
            return ResponseEntity.ok(Map.of("message", "Order deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting order: " + e.getMessage());
        }
    }

    // ==========================================
    // 5. CUSTOMER & USER MANAGEMENT
    // ==========================================
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersAdmin() {
        ensureTablesExist();
        return ResponseEntity.ok(getUsersListInternal(100));
    }

    private List<Map<String, Object>> getUsersListInternal(int limit) {
        String sql = "SELECT u.id, u.full_name as name, u.email, u.phone, u.role, 'ACTIVE' as status, " +
                "COUNT(o.order_id) as ordersCount, COALESCE(SUM(o.total_amount), 0) as totalSpent " +
                "FROM user u " +
                "LEFT JOIN orders o ON u.id = o.user_id " +
                "GROUP BY u.id, u.full_name, u.email, u.phone, u.role " +
                "ORDER BY u.id DESC LIMIT " + limit;
        try {
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            try {
                sql = "SELECT u.id, u.full_name as name, u.email, u.phone, u.role, 'ACTIVE' as status " +
                        "FROM user u ORDER BY u.id DESC LIMIT " + limit;
                return jdbcTemplate.queryForList(sql);
            } catch (Exception ex) {
                return new ArrayList<>();
            }
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUserAdmin(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String name = (String) body.get("name");
            String email = (String) body.get("email");
            String phone = (String) body.get("phone");
            String role = (String) body.get("role");

            jdbcTemplate.update("UPDATE user SET full_name=?, email=?, phone=?, role=? WHERE id=?",
                    name, email, phone, role, id);
            return ResponseEntity.ok(Map.of("message", "User updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String role = (String) body.get("role");
            jdbcTemplate.update("UPDATE user SET role=? WHERE id=?", role, id);
            return ResponseEntity.ok(Map.of("message", "User role updated to " + role));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating user role: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetUserPasswordAdmin(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String newPassword = (String) body.get("newPassword");
            String encoded = passwordEncoder != null ? passwordEncoder.encode(newPassword) : newPassword;
            jdbcTemplate.update("UPDATE user SET password=? WHERE id=?", encoded, id);
            return ResponseEntity.ok(Map.of("message", "User password reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error resetting password: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserAdmin(@PathVariable Long id) {
        try {
            jdbcTemplate.update("DELETE FROM user WHERE id=?", id);
            return ResponseEntity.ok(Map.of("message", "User account deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting user: " + e.getMessage());
        }
    }

    // ==========================================
    // 6. COUPONS & REVIEWS & SETTINGS
    // ==========================================
    @GetMapping("/coupons")
    public ResponseEntity<List<Map<String, Object>>> getCoupons() {
        ensureTablesExist();
        return ResponseEntity.ok(jdbcTemplate.queryForList("SELECT coupon_id as id, code, discount_percentage as discountPercentage, min_spend as minSpend, expiry_date as expiryDate, status FROM coupons"));
    }

    @PostMapping("/coupons")
    public ResponseEntity<?> createCoupon(@RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String code = body.get("code") != null ? body.get("code").toString().trim().toUpperCase() : "";
            if (code.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Coupon code cannot be empty"));
            }

            double discountPercentage = 0.0;
            Object discObj = body.get("discountPercentage");
            if (discObj instanceof Number) {
                discountPercentage = ((Number) discObj).doubleValue();
            } else if (discObj != null && !discObj.toString().isEmpty()) {
                discountPercentage = Double.parseDouble(discObj.toString());
            }

            double minSpend = 0.0;
            Object minObj = body.get("minSpend");
            if (minObj instanceof Number) {
                minSpend = ((Number) minObj).doubleValue();
            } else if (minObj != null && !minObj.toString().isEmpty()) {
                minSpend = Double.parseDouble(minObj.toString());
            }

            String expiryDate = body.get("expiryDate") != null && !body.get("expiryDate").toString().isEmpty()
                    ? body.get("expiryDate").toString()
                    : "2026-12-31";

            String status = body.get("status") != null && !body.get("status").toString().isEmpty()
                    ? body.get("status").toString()
                    : "ACTIVE";

            jdbcTemplate.update("INSERT INTO coupons (code, discount_percentage, min_spend, expiry_date, status) VALUES (?, ?, ?, ?, ?) " +
                    "ON DUPLICATE KEY UPDATE discount_percentage=VALUES(discount_percentage), min_spend=VALUES(min_spend), expiry_date=VALUES(expiry_date), status=VALUES(status)",
                    code, discountPercentage, minSpend, expiryDate, status);

            return ResponseEntity.ok(Map.of("message", "Coupon created successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Error creating coupon: " + e.getMessage()));
        }
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Integer id) {
        ensureTablesExist();
        jdbcTemplate.update("DELETE FROM coupons WHERE coupon_id=?", id);
        return ResponseEntity.ok(Map.of("message", "Coupon deleted"));
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<Map<String, Object>>> getReviews() {
        ensureTablesExist();
        String sql = "SELECT r.review_id as id, r.product_id as productId, p.name as productName, " +
                "r.customer_name as customerName, r.rating, r.comment, r.status, r.created_at as date " +
                "FROM reviews r " +
                "LEFT JOIN products p ON r.product_id = p.product_id " +
                "ORDER BY r.created_at DESC";
        return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer id) {
        ensureTablesExist();
        jdbcTemplate.update("DELETE FROM reviews WHERE review_id=?", id);
        return ResponseEntity.ok(Map.of("message", "Review deleted"));
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings() {
        ensureTablesExist();
        Map<String, Object> settings = new HashMap<>();
        List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT setting_key, setting_value FROM store_settings");
        for (Map<String, Object> r : rows) {
            settings.put((String) r.get("setting_key"), r.get("setting_value"));
        }
        return ResponseEntity.ok(settings);
    }

    @PostMapping("/settings")
    public ResponseEntity<?> saveSettings(@RequestBody Map<String, Object> body) {
        ensureTablesExist();
        for (Map.Entry<String, Object> entry : body.entrySet()) {
            String key = entry.getKey();
            String val = String.valueOf(entry.getValue());
            jdbcTemplate.update("INSERT INTO store_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value=?",
                    key, val, val);
        }
        return ResponseEntity.ok(Map.of("message", "Settings updated successfully"));
    }
}
