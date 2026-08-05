package com.jewellery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired(required = false)
    private PasswordEncoder passwordEncoder;

    // Helper method to ensure required database tables and columns exist
    private void ensureTablesExist() {
        try {
            // Categories table
            String createCategoriesSql = "CREATE TABLE IF NOT EXISTS ecommerce_db.categories (" +
                    "category_id INT AUTO_INCREMENT PRIMARY KEY, " +
                    "category_name VARCHAR(100) NOT NULL UNIQUE, " +
                    "description TEXT, " +
                    "image_url VARCHAR(500), " +
                    "status VARCHAR(20) DEFAULT 'ACTIVE', " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                    ")";
            jdbcTemplate.execute(createCategoriesSql);

            // Add missing columns if table pre-existed with older schema
            try { jdbcTemplate.execute("ALTER TABLE ecommerce_db.categories ADD COLUMN description TEXT"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("ALTER TABLE ecommerce_db.categories ADD COLUMN image_url VARCHAR(500)"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("ALTER TABLE ecommerce_db.categories ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE'"); } catch (Exception ignored) {}

            // Seed default categories if empty
            Integer catCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ecommerce_db.categories", Integer.class);
            if (catCount == null || catCount == 0) {
                String[][] defaultCats = {
                        {"Rings", "Solitaire, Cocktail, Diamond & Band Rings", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80"},
                        {"Necklaces", "Royal Chokers, Pendants, Kundan & Chains", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80"},
                        {"Earrings", "Studs, Jhumkas, Chandbalis & Drop Earrings", "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=300&q=80"},
                        {"Bracelets", "Diamond Tennis Bracelets & Gold Cuffs", "https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80"},
                        {"Bangles", "Traditional 22K Gold & Bridal Kada Sets", "https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80"},
                        {"Collections", "Haute Joaillerie & High Jewelry Sets", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80"}
                };
                for (String[] cat : defaultCats) {
                    try {
                        jdbcTemplate.update("INSERT INTO ecommerce_db.categories (category_name, description, image_url, status) VALUES (?, ?, ?, 'ACTIVE')",
                                cat[0], cat[1], cat[2]);
                    } catch (Exception ignored) {}
                }
            } else {
                // Update missing image_urls
                try {
                    jdbcTemplate.update("UPDATE ecommerce_db.categories SET image_url='https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80' WHERE image_url IS NULL OR image_url=''");
                } catch (Exception ignored) {}
            }

            // Products table
            String createProductsSql = "CREATE TABLE IF NOT EXISTS ecommerce_db.products (" +
                    "product_id INT AUTO_INCREMENT PRIMARY KEY, " +
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
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                    ")";
            jdbcTemplate.execute(createProductsSql);

            // Add missing columns to products table if existing table had fewer columns
            String[] columnsToAdd = {
                "ALTER TABLE ecommerce_db.products ADD COLUMN weight VARCHAR(50) DEFAULT '10g'",
                "ALTER TABLE ecommerce_db.products ADD COLUMN metal_type VARCHAR(50) DEFAULT 'Gold'",
                "ALTER TABLE ecommerce_db.products ADD COLUMN gold_purity VARCHAR(50) DEFAULT '22K'",
                "ALTER TABLE ecommerce_db.products ADD COLUMN diamond_details VARCHAR(255) DEFAULT 'VS1 / G-H Color'",
                "ALTER TABLE ecommerce_db.products ADD COLUMN stone_details VARCHAR(255) DEFAULT 'Natural Diamond'",
                "ALTER TABLE ecommerce_db.products ADD COLUMN certificate_number VARCHAR(100)",
                "ALTER TABLE ecommerce_db.products ADD COLUMN sku VARCHAR(100)",
                "ALTER TABLE ecommerce_db.products ADD COLUMN discount DECIMAL(5, 2) DEFAULT 0.00",
                "ALTER TABLE ecommerce_db.products ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE'"
            };
            for (String alterSql : columnsToAdd) {
                try { jdbcTemplate.execute(alterSql); } catch (Exception ignored) {}
            }

            // Product Images table
            String createImagesSql = "CREATE TABLE IF NOT EXISTS ecommerce_db.productimages (" +
                    "image_id INT AUTO_INCREMENT PRIMARY KEY, " +
                    "product_id INT NOT NULL, " +
                    "image_url TEXT NOT NULL, " +
                    "is_thumbnail BOOLEAN DEFAULT TRUE" +
                    ")";
            jdbcTemplate.execute(createImagesSql);

            try { jdbcTemplate.execute("ALTER TABLE ecommerce_db.productimages ADD COLUMN is_thumbnail BOOLEAN DEFAULT TRUE"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("ALTER TABLE ecommerce_db.productimages MODIFY image_url TEXT"); } catch (Exception ignored) {}

            // Seed default products if empty
            Integer prodCount = 0;
            try {
                prodCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ecommerce_db.products", Integer.class);
            } catch (Exception ignored) {}

            if (prodCount == null || prodCount == 0) {
                try {
                    String insertProd = "INSERT INTO ecommerce_db.products (name, category_id, description, price, discount, stock, weight, metal_type, gold_purity, diamond_details, stone_details, certificate_number, sku, status) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')";
                    
                    jdbcTemplate.update(insertProd, "Royal Solitaire Diamond Ring", 1, "Exquisite 22K gold ring with VVS solitaire diamond", 125000.00, 5.0, 15, "Gold", "22K", "VVS1 / D Color", "Natural Solitaire Diamond", "GIA-902144", "SKU-RING-01");
                    Integer p1 = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
                    if (p1 != null) jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", p1, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80");

                    jdbcTemplate.update(insertProd, "Imperial Emerald Gold Choker", 2, "Handcrafted royal Kundan and Emerald gold choker necklace", 450000.00, 10.0, 8, "Gold", "22K", "VS1 / G Color", "Zambia Emerald", "IGI-883920", "SKU-NECK-02");
                    Integer p2 = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
                    if (p2 != null) jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", p2, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80");

                    jdbcTemplate.update(insertProd, "Princess Cut Diamond Studs", 3, "Elegant platinum studs featuring princess cut diamonds", 85000.00, 0.0, 20, "Platinum", "950", "VS2 / F Color", "Natural Diamond", "GIA-112349", "SKU-EAR-03");
                    Integer p3 = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
                    if (p3 != null) jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", p3, "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80");

                    jdbcTemplate.update(insertProd, "Heritage Kundan Bridal Set", 9, "Grand 24K traditional Kundan bridal necklace set with pearls", 850000.00, 12.0, 4, "Gold", "24K", "Uncut Polki", "Uncut Diamond & Rubies", "SGL-449120", "SKU-SET-04");
                    Integer p4 = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
                    if (p4 != null) jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", p4, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            // Orders table
            String createOrdersSql = "CREATE TABLE IF NOT EXISTS ecommerce_db.orders (" +
                    "order_id VARCHAR(100) PRIMARY KEY, " +
                    "user_id BIGINT NOT NULL, " +
                    "total_amount DECIMAL(12, 2) NOT NULL, " +
                    "payment_method VARCHAR(50) DEFAULT 'Credit Card', " +
                    "payment_status VARCHAR(50) DEFAULT 'Paid', " +
                    "status VARCHAR(50) NOT NULL DEFAULT 'Delivered', " +
                    "shipping_address TEXT, " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                    ")";
            jdbcTemplate.execute(createOrdersSql);

            String[] orderColsToAdd = {
                "ALTER TABLE ecommerce_db.orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Credit Card'",
                "ALTER TABLE ecommerce_db.orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'Paid'",
                "ALTER TABLE ecommerce_db.orders ADD COLUMN shipping_address TEXT"
            };
            for (String alterSql : orderColsToAdd) {
                try { jdbcTemplate.execute(alterSql); } catch (Exception ignored) {}
            }

            // Order Items table
            String createOrderItemsSql = "CREATE TABLE IF NOT EXISTS ecommerce_db.order_items (" +
                    "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                    "order_id VARCHAR(100) NOT NULL, " +
                    "product_id BIGINT NOT NULL, " +
                    "quantity INT NOT NULL DEFAULT 1, " +
                    "price_per_unit DECIMAL(12, 2) NOT NULL, " +
                    "total_price DECIMAL(12, 2) NOT NULL" +
                    ")";
            jdbcTemplate.execute(createOrderItemsSql);

            // Coupons table
            String createCouponsSql = "CREATE TABLE IF NOT EXISTS ecommerce_db.coupons (" +
                    "coupon_id INT AUTO_INCREMENT PRIMARY KEY, " +
                    "code VARCHAR(50) NOT NULL UNIQUE, " +
                    "discount_percentage DECIMAL(5, 2) NOT NULL, " +
                    "min_spend DECIMAL(12, 2) DEFAULT 0.00, " +
                    "expiry_date VARCHAR(50), " +
                    "status VARCHAR(20) DEFAULT 'ACTIVE', " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                    ")";
            jdbcTemplate.execute(createCouponsSql);

            // Reviews table
            String createReviewsSql = "CREATE TABLE IF NOT EXISTS ecommerce_db.reviews (" +
                    "review_id INT AUTO_INCREMENT PRIMARY KEY, " +
                    "product_id INT, " +
                    "user_id BIGINT, " +
                    "customer_name VARCHAR(100), " +
                    "rating INT DEFAULT 5, " +
                    "comment TEXT, " +
                    "status VARCHAR(20) DEFAULT 'APPROVED', " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                    ")";
            jdbcTemplate.execute(createReviewsSql);

            // Store Settings table
            String createSettingsSql = "CREATE TABLE IF NOT EXISTS ecommerce_db.store_settings (" +
                    "setting_key VARCHAR(100) PRIMARY KEY, " +
                    "setting_value TEXT" +
                    ")";
            jdbcTemplate.execute(createSettingsSql);

        } catch (Exception e) {
            e.printStackTrace();
        }
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
            Integer totalProducts = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ecommerce_db.products", Integer.class);
            // Category count
            Integer totalCategories = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ecommerce_db.categories", Integer.class);
            // Customer & User count
            Integer totalUsers = 0;
            try {
                totalUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ecommerce_db.user", Integer.class);
            } catch (Exception e) {
                try {
                    totalUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ecommerce_db.users", Integer.class);
                } catch (Exception ignored) {}
            }
            Integer totalCustomers = totalUsers;

            // Orders count
            Integer pendingOrders = 0;
            Integer completedOrders = 0;
            try {
                pendingOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ecommerce_db.orders WHERE status IN ('Pending', 'Confirmed', 'Packed', 'Shipped')", Integer.class);
                completedOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ecommerce_db.orders WHERE status = 'Delivered'", Integer.class);
            } catch (Exception ignored) {}

            // Revenue metrics
            Double overallRevenue = 0.0;
            Double todayRevenue = 0.0;
            Double monthlyRevenue = 0.0;
            Double yearlyRevenue = 0.0;

            try {
                Double rev = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_amount), 0) FROM ecommerce_db.orders WHERE status != 'Cancelled'", Double.class);
                overallRevenue = rev != null ? rev : 0.0;

                Double tRev = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_amount), 0) FROM ecommerce_db.orders WHERE status != 'Cancelled' AND DATE(created_at) = CURRENT_DATE()", Double.class);
                todayRevenue = tRev != null ? tRev : 0.0;

                Double mRev = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_amount), 0) FROM ecommerce_db.orders WHERE status != 'Cancelled' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())", Double.class);
                monthlyRevenue = mRev != null ? mRev : 0.0;

                Double yRev = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_amount), 0) FROM ecommerce_db.orders WHERE status != 'Cancelled' AND YEAR(created_at) = YEAR(CURRENT_DATE())", Double.class);
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
                        "FROM ecommerce_db.orders WHERE status != 'Cancelled' " +
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
                        "FROM ecommerce_db.categories c " +
                        "LEFT JOIN ecommerce_db.products p ON c.category_id = p.category_id " +
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
                        "FROM ecommerce_db.products p " +
                        "LEFT JOIN ecommerce_db.productimages pi ON p.product_id = pi.product_id " +
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
        String sql = "SELECT p.product_id as id, p.name, p.category_id as categoryId, c.category_name as category, " +
                "p.description, p.price, p.discount, p.stock, p.weight, p.metal_type as metalType, " +
                "p.gold_purity as goldPurity, p.diamond_details as diamondDetails, p.stone_details as stoneDetails, " +
                "p.certificate_number as certificateNumber, p.sku, p.status, pi.image_url as imageUrl " +
                "FROM ecommerce_db.products p " +
                "LEFT JOIN ecommerce_db.categories c ON p.category_id = c.category_id " +
                "LEFT JOIN ecommerce_db.productimages pi ON p.product_id = pi.product_id " +
                "ORDER BY p.product_id DESC LIMIT " + limit;
        try {
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private double toDouble(Object val, double defaultVal) {
        if (val == null) return defaultVal;
        if (val instanceof Number n) return n.doubleValue();
        try { return Double.parseDouble(val.toString().trim()); } catch (Exception e) { return defaultVal; }
    }

    private int toInt(Object val, int defaultVal) {
        if (val == null) return defaultVal;
        if (val instanceof Number n) return n.intValue();
        try { return Integer.parseInt(val.toString().trim()); } catch (Exception e) { return defaultVal; }
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String name = (String) body.get("name");
            String description = (String) body.get("description");
            double price = toDouble(body.get("price"), 0.0);
            double discount = toDouble(body.get("discount"), 0.0);
            int stock = toInt(body.get("stock"), 10);

            String weight = body.get("weight") != null && !((String) body.get("weight")).trim().isEmpty() ? (String) body.get("weight") : "10g";
            String metalType = body.get("metalType") != null && !((String) body.get("metalType")).trim().isEmpty() ? (String) body.get("metalType") : "Gold";
            String goldPurity = body.get("goldPurity") != null && !((String) body.get("goldPurity")).trim().isEmpty() ? (String) body.get("goldPurity") : "22K";
            String diamondDetails = body.get("diamondDetails") != null && !((String) body.get("diamondDetails")).trim().isEmpty() ? (String) body.get("diamondDetails") : "VS1 / G-H Color";
            String stoneDetails = body.get("stoneDetails") != null && !((String) body.get("stoneDetails")).trim().isEmpty() ? (String) body.get("stoneDetails") : "Natural Diamond";
            String certificateNumber = body.get("certificateNumber") != null && !((String) body.get("certificateNumber")).trim().isEmpty() ? (String) body.get("certificateNumber") : "CERT-" + System.currentTimeMillis();
            String sku = body.get("sku") != null && !((String) body.get("sku")).trim().isEmpty() ? (String) body.get("sku") : "SKU-" + System.currentTimeMillis();
            String status = body.containsKey("status") ? (String) body.get("status") : "ACTIVE";
            String imageUrl = body.containsKey("imageUrl") ? (String) body.get("imageUrl") : "https://images.unsplash.com/photo-1605100804763-247f67b3557e";

            // Find or set category_id
            Integer categoryId = 1;
            if (body.containsKey("category")) {
                String catName = (String) body.get("category");
                try {
                    List<Map<String, Object>> cats = jdbcTemplate.queryForList("SELECT category_id FROM ecommerce_db.categories WHERE category_name = ?", catName);
                    if (!cats.isEmpty()) {
                        categoryId = ((Number) cats.get(0).get("category_id")).intValue();
                    } else {
                        jdbcTemplate.update("INSERT INTO ecommerce_db.categories (category_name, description) VALUES (?, ?)", catName, catName + " collection");
                        List<Map<String, Object>> newCats = jdbcTemplate.queryForList("SELECT category_id FROM ecommerce_db.categories WHERE category_name = ?", catName);
                        if (!newCats.isEmpty()) {
                            categoryId = ((Number) newCats.get(0).get("category_id")).intValue();
                        }
                    }
                } catch (Exception ignored) {}
            }

            String insertProductSql = "INSERT INTO ecommerce_db.products (name, category_id, description, price, discount, stock, weight, metal_type, gold_purity, diamond_details, stone_details, certificate_number, sku, status) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try {
                jdbcTemplate.update(insertProductSql, name, categoryId, description, price, discount, stock, weight, metalType, goldPurity, diamondDetails, stoneDetails, certificateNumber, sku, status);
            } catch (Exception ex) {
                // If duplicate SKU error, generate unique fallback SKU
                sku = "SKU-" + System.currentTimeMillis();
                jdbcTemplate.update(insertProductSql, name, categoryId, description, price, discount, stock, weight, metalType, goldPurity, diamondDetails, stoneDetails, certificateNumber, sku, status);
            }

            // Fetch created product_id
            Integer productId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);

            if (productId != null && imageUrl != null && !imageUrl.trim().isEmpty()) {
                try {
                    jdbcTemplate.update("DELETE FROM ecommerce_db.productimages WHERE product_id=?", productId);
                    jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url) VALUES (?, ?)", productId, imageUrl.trim());
                } catch (Exception ex) {
                    try {
                        jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, 1)", productId, imageUrl.trim());
                    } catch (Exception ignored) {}
                }
            }

            Map<String, Object> resp = new HashMap<>();
            resp.put("message", "Product created successfully");
            resp.put("productId", productId);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage(), "message", "Failed to add product: " + e.getMessage()));
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String name = (String) body.get("name");
            String description = (String) body.get("description");
            double price = toDouble(body.get("price"), 0.0);
            double discount = toDouble(body.get("discount"), 0.0);
            int stock = toInt(body.get("stock"), 10);
            String weight = body.get("weight") != null && !((String) body.get("weight")).trim().isEmpty() ? (String) body.get("weight") : "10g";
            String metalType = body.get("metalType") != null && !((String) body.get("metalType")).trim().isEmpty() ? (String) body.get("metalType") : "Gold";
            String goldPurity = body.get("goldPurity") != null && !((String) body.get("goldPurity")).trim().isEmpty() ? (String) body.get("goldPurity") : "22K";
            String diamondDetails = body.get("diamondDetails") != null && !((String) body.get("diamondDetails")).trim().isEmpty() ? (String) body.get("diamondDetails") : "VS1 / G-H Color";
            String stoneDetails = body.get("stoneDetails") != null && !((String) body.get("stoneDetails")).trim().isEmpty() ? (String) body.get("stoneDetails") : "Natural Diamond";
            String certificateNumber = body.get("certificateNumber") != null && !((String) body.get("certificateNumber")).trim().isEmpty() ? (String) body.get("certificateNumber") : "CERT-" + id;
            String sku = body.get("sku") != null && !((String) body.get("sku")).trim().isEmpty() ? (String) body.get("sku") : "SKU-" + id;
            String status = body.containsKey("status") ? (String) body.get("status") : "ACTIVE";

            String updateSql = "UPDATE ecommerce_db.products SET name=?, description=?, price=?, discount=?, stock=?, " +
                    "weight=?, metal_type=?, gold_purity=?, diamond_details=?, stone_details=?, certificate_number=?, sku=?, status=? " +
                    "WHERE product_id=?";
            try {
                jdbcTemplate.update(updateSql, name, description, price, discount, stock, weight, metalType, goldPurity, diamondDetails, stoneDetails, certificateNumber, sku, status, id);
            } catch (Exception ex) {
                // If duplicate SKU error, generate unique fallback SKU
                sku = "SKU-" + id + "-" + System.currentTimeMillis();
                jdbcTemplate.update(updateSql, name, description, price, discount, stock, weight, metalType, goldPurity, diamondDetails, stoneDetails, certificateNumber, sku, status, id);
            }

            if (body.containsKey("imageUrl")) {
                String imageUrl = (String) body.get("imageUrl");
                if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                    try {
                        jdbcTemplate.update("DELETE FROM ecommerce_db.productimages WHERE product_id=?", id);
                        jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url) VALUES (?, ?)", id, imageUrl.trim());
                    } catch (Exception ex) {
                        try {
                            jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, 1)", id, imageUrl.trim());
                        } catch (Exception ignored) {}
                    }
                }
            }

            return ResponseEntity.ok(Map.of("message", "Product updated successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage(), "message", "Failed to update product: " + e.getMessage()));
        }
    }

    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<?> updateProductStock(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            int stock = toInt(body.get("stock"), 0);
            jdbcTemplate.update("UPDATE ecommerce_db.products SET stock=? WHERE product_id=?", stock, id);
            return ResponseEntity.ok(Map.of("message", "Stock updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating stock: " + e.getMessage());
        }
    }

    @PatchMapping("/products/{id}/price")
    public ResponseEntity<?> updateProductPrice(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            double price = toDouble(body.get("price"), 0.0);
            jdbcTemplate.update("UPDATE ecommerce_db.products SET price=? WHERE product_id=?", price, id);
            return ResponseEntity.ok(Map.of("message", "Price updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating price: " + e.getMessage());
        }
    }

    @PatchMapping("/products/{id}/status")
    public ResponseEntity<?> toggleProductStatus(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            String status = (String) body.get("status");
            jdbcTemplate.update("UPDATE ecommerce_db.products SET status=? WHERE product_id=?", status, id);
            return ResponseEntity.ok(Map.of("message", "Product status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating status: " + e.getMessage());
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        ensureTablesExist();
        try {
            jdbcTemplate.update("DELETE FROM ecommerce_db.productimages WHERE product_id=?", id);
            jdbcTemplate.update("DELETE FROM ecommerce_db.cart_items WHERE product_id=?", id);
            jdbcTemplate.update("DELETE FROM ecommerce_db.products WHERE product_id=?", id);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully from MySQL database"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting product: " + e.getMessage());
        }
    }

    // ==========================================
    // 3. CATEGORY MANAGEMENT CRUD
    // ==========================================
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        ensureTablesExist();
        try {
            String sql = "SELECT c.category_id as id, c.category_name as name, c.description, c.image_url as imageUrl, " +
                    "c.status, COUNT(p.product_id) as productCount " +
                    "FROM ecommerce_db.categories c " +
                    "LEFT JOIN ecommerce_db.products p ON c.category_id = p.category_id " +
                    "GROUP BY c.category_id";
            List<Map<String, Object>> cats = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(cats);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                String fallbackSql = "SELECT category_id as id, category_name as name, description, image_url as imageUrl, status FROM ecommerce_db.categories";
                return ResponseEntity.ok(jdbcTemplate.queryForList(fallbackSql));
            } catch (Exception ex) {
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

            jdbcTemplate.update("INSERT INTO ecommerce_db.categories (category_name, description, image_url, status) VALUES (?, ?, ?, ?)",
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

            jdbcTemplate.update("UPDATE ecommerce_db.categories SET category_name=?, description=?, image_url=?, status=? WHERE category_id=?",
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
            jdbcTemplate.update("DELETE FROM ecommerce_db.categories WHERE category_id=?", id);
            return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting category: " + e.getMessage());
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
        String sqlOrders = "SELECT o.order_id as orderId, o.user_id as userId, u.full_name as customerName, u.email as customerEmail, " +
                "o.total_amount as grandTotal, o.payment_method as paymentMethod, o.payment_status as paymentStatus, " +
                "o.status as orderStatus, o.shipping_address as shippingAddress, o.created_at as orderDate " +
                "FROM ecommerce_db.orders o " +
                "LEFT JOIN ecommerce_db.user u ON o.user_id = u.id " +
                "ORDER BY o.created_at DESC LIMIT " + limit;
        try {
            List<Map<String, Object>> orders = jdbcTemplate.queryForList(sqlOrders);
            for (Map<String, Object> order : orders) {
                String orderId = (String) order.get("orderId");
                String sqlItems = "SELECT oi.product_id as id, p.name, oi.quantity, oi.price_per_unit as price, oi.total_price as subtotal, pi.image_url as imageUrl " +
                        "FROM ecommerce_db.order_items oi " +
                        "LEFT JOIN ecommerce_db.products p ON oi.product_id = p.product_id " +
                        "LEFT JOIN ecommerce_db.productimages pi ON p.product_id = pi.product_id " +
                        "WHERE oi.order_id = ?";
                List<Map<String, Object>> items = jdbcTemplate.queryForList(sqlItems, orderId);
                order.put("items", items);
                order.put("itemCount", items.size());
            }
            return orders;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId, @RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String status = (String) body.get("status");
            jdbcTemplate.update("UPDATE ecommerce_db.orders SET status=?, updated_at=NOW() WHERE order_id=?", status, orderId);
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
            jdbcTemplate.update("UPDATE ecommerce_db.orders SET payment_status=?, updated_at=NOW() WHERE order_id=?", paymentStatus, orderId);
            return ResponseEntity.ok(Map.of("message", "Payment status updated to " + paymentStatus));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating payment status: " + e.getMessage());
        }
    }

    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<?> deleteOrderAdmin(@PathVariable String orderId) {
        ensureTablesExist();
        try {
            jdbcTemplate.update("DELETE FROM ecommerce_db.order_items WHERE order_id=?", orderId);
            jdbcTemplate.update("DELETE FROM ecommerce_db.orders WHERE order_id=?", orderId);
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
                "FROM ecommerce_db.user u " +
                "LEFT JOIN ecommerce_db.orders o ON u.id = o.user_id " +
                "GROUP BY u.id, u.full_name, u.email, u.phone, u.role " +
                "ORDER BY u.id DESC LIMIT " + limit;
        try {
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            try {
                sql = "SELECT u.id, u.full_name as name, u.email, u.phone, u.role, 'ACTIVE' as status " +
                        "FROM ecommerce_db.user u ORDER BY u.id DESC LIMIT " + limit;
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

            jdbcTemplate.update("UPDATE ecommerce_db.user SET full_name=?, email=?, phone=?, role=? WHERE id=?",
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
            jdbcTemplate.update("UPDATE ecommerce_db.user SET role=? WHERE id=?", role, id);
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
            jdbcTemplate.update("UPDATE ecommerce_db.user SET password=? WHERE id=?", encoded, id);
            return ResponseEntity.ok(Map.of("message", "User password reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error resetting password: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserAdmin(@PathVariable Long id) {
        try {
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=0");
            try {
                try { jdbcTemplate.update("DELETE FROM ecommerce_db.cart_items WHERE user_id=?", id); } catch (Exception ignored) {}
                try { jdbcTemplate.update("DELETE FROM ecommerce_db.cart_items WHERE cart_id IN (SELECT cart_id FROM ecommerce_db.cart WHERE user_id=?)", id); } catch (Exception ignored) {}
                try { jdbcTemplate.update("DELETE FROM ecommerce_db.cart WHERE user_id=?", id); } catch (Exception ignored) {}
                try { jdbcTemplate.update("DELETE FROM ecommerce_db.wishlist_items WHERE user_id=?", id); } catch (Exception ignored) {}
                try { jdbcTemplate.update("DELETE FROM ecommerce_db.wishlist_items WHERE wishlist_id IN (SELECT wishlist_id FROM ecommerce_db.wishlist WHERE user_id=?)", id); } catch (Exception ignored) {}
                try { jdbcTemplate.update("DELETE FROM ecommerce_db.wishlist WHERE user_id=?", id); } catch (Exception ignored) {}
                try { jdbcTemplate.update("DELETE FROM ecommerce_db.reviews WHERE user_id=?", id); } catch (Exception ignored) {}
                try { jdbcTemplate.update("DELETE FROM ecommerce_db.order_items WHERE order_id IN (SELECT order_id FROM ecommerce_db.orders WHERE user_id=?)", id); } catch (Exception ignored) {}
                try { jdbcTemplate.update("DELETE FROM ecommerce_db.orders WHERE user_id=?", id); } catch (Exception ignored) {}

                jdbcTemplate.update("DELETE FROM ecommerce_db.user WHERE id=?", id);
            } finally {
                jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1");
            }
            return ResponseEntity.ok(Map.of("message", "User account deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage(), "message", "Error deleting user: " + e.getMessage()));
        }
    }

    // ==========================================
    // 6. COUPONS & REVIEWS & SETTINGS
    // ==========================================
    @GetMapping("/coupons")
    public ResponseEntity<List<Map<String, Object>>> getCoupons() {
        ensureTablesExist();
        return ResponseEntity.ok(jdbcTemplate.queryForList("SELECT coupon_id as id, code, discount_percentage as discountPercentage, min_spend as minSpend, expiry_date as expiryDate, status FROM ecommerce_db.coupons"));
    }

    @PostMapping("/coupons")
    public ResponseEntity<?> createCoupon(@RequestBody Map<String, Object> body) {
        ensureTablesExist();
        try {
            String code = (String) body.get("code");
            double discountPercentage = ((Number) body.get("discountPercentage")).doubleValue();
            double minSpend = body.containsKey("minSpend") ? ((Number) body.get("minSpend")).doubleValue() : 0.0;
            String expiryDate = (String) body.get("expiryDate");
            String status = body.containsKey("status") ? (String) body.get("status") : "ACTIVE";

            jdbcTemplate.update("INSERT INTO ecommerce_db.coupons (code, discount_percentage, min_spend, expiry_date, status) VALUES (?, ?, ?, ?, ?)",
                    code, discountPercentage, minSpend, expiryDate, status);
            return ResponseEntity.ok(Map.of("message", "Coupon created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating coupon: " + e.getMessage());
        }
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Integer id) {
        ensureTablesExist();
        jdbcTemplate.update("DELETE FROM ecommerce_db.coupons WHERE coupon_id=?", id);
        return ResponseEntity.ok(Map.of("message", "Coupon deleted"));
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<Map<String, Object>>> getReviews() {
        ensureTablesExist();
        return ResponseEntity.ok(jdbcTemplate.queryForList("SELECT review_id as id, customer_name as customerName, rating, comment, status, created_at as date FROM ecommerce_db.reviews"));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer id) {
        ensureTablesExist();
        jdbcTemplate.update("DELETE FROM ecommerce_db.reviews WHERE review_id=?", id);
        return ResponseEntity.ok(Map.of("message", "Review deleted"));
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings() {
        ensureTablesExist();
        Map<String, Object> settings = new HashMap<>();
        List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT setting_key, setting_value FROM ecommerce_db.store_settings");
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
            jdbcTemplate.update("INSERT INTO ecommerce_db.store_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value=?",
                    key, val, val);
        }
        return ResponseEntity.ok(Map.of("message", "Settings updated successfully"));
    }
}
