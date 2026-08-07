-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: ecommerce_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_cart_product` (`product_id`),
  KEY `fk_cart_user` (`user_id`),
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (3,1,133,1),(4,1,134,1),(5,1,123,1),(6,1,126,1),(7,1,113,2),(8,1,114,1),(9,1,143,1),(10,1,144,1);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image_url` varchar(500) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `category_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Diamond',NULL,'2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE',NULL),(2,'Gold',NULL,'2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE',NULL),(3,'Platinum',NULL,'2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE',NULL),(4,'Silver',NULL,'2026-07-30 17:54:30','https://images.unsplash.com/photo-1611591475874-9f79f2e307e5?auto=format&fit=crop&w=300&q=80','ACTIVE',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `coupon_id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `min_spend` decimal(12,2) DEFAULT '0.00',
  `expiry_date` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`coupon_id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jwt_tokens`
--

DROP TABLE IF EXISTS `jwt_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jwt_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `token` varchar(500) NOT NULL,
  `token_type` varchar(20) DEFAULT 'BEARER',
  `expired` tinyint(1) DEFAULT '0',
  `revoked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_token_user` (`user_id`),
  CONSTRAINT `fk_token_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jwt_tokens`
--

LOCK TABLES `jwt_tokens` WRITE;
/*!40000 ALTER TABLE `jwt_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `jwt_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orderitem_order` (`order_id`),
  KEY `fk_orderitem_product` (`product_id`),
  CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `order_status` varchar(30) DEFAULT 'PENDING',
  `payment_status` varchar(30) DEFAULT 'PENDING',
  `shipping_address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_method` varchar(50) DEFAULT 'Credit Card',
  PRIMARY KEY (`id`),
  KEY `fk_order_user` (`user_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_image_product` (`product_id`),
  CONSTRAINT `fk_image_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,111,'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476',1),(2,112,'https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792',1),(3,113,'https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435',1),(4,114,'https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167',1),(5,115,'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171',1),(6,116,'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402',1),(7,117,'https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778',1),(8,118,'https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366',1),(9,119,'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553',1),(10,120,'https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034',1),(11,121,'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg',1),(12,122,'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg',1),(13,123,'https://ik.imagekit.io/StringstackNaveen/earrings.jpg',1),(14,124,'https://ik.imagekit.io/StringstackNaveen/earings2.jpg',1),(15,125,'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif',1),(16,126,'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg',1),(17,127,'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp',1),(18,128,'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif',1),(19,129,'https://ik.imagekit.io/StringstackNaveen/bangles-1.webp',1),(20,130,'https://ik.imagekit.io/StringstackNaveen/bangle2.jpg',1),(21,131,'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp',1),(22,132,'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp',1),(23,133,'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg',1),(24,134,'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp',1),(25,135,'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp',1),(26,136,'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp',1),(27,137,'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp',1),(28,138,'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg',1),(29,139,'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp',1),(30,140,'https://ik.imagekit.io/StringstackSanjana/Platinum/BANG%203.webp',1),(31,141,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp',1),(32,142,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp',1),(33,143,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp',1),(34,144,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp',1),(35,145,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp',1),(36,146,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp',1),(37,147,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp',1),(38,148,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp',1),(39,149,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp',1),(40,150,'https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp',1);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productimages`
--

DROP TABLE IF EXISTS `productimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productimages` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` text,
  `is_thumbnail` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productimages`
--

LOCK TABLES `productimages` WRITE;
/*!40000 ALTER TABLE `productimages` DISABLE KEYS */;
/*!40000 ALTER TABLE `productimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int DEFAULT '0',
  `weight` decimal(10,2) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `purity` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `metal_type` varchar(50) DEFAULT 'Gold',
  `gold_purity` varchar(50) DEFAULT '22K',
  `diamond_details` varchar(255) DEFAULT 'VS1 / G-H Color',
  `stone_details` varchar(255) DEFAULT 'Natural Diamond',
  `certificate_number` varchar(100) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT '0.00',
  `status` varchar(20) DEFAULT 'ACTIVE',
  `stock` int DEFAULT '10',
  PRIMARY KEY (`id`),
  KEY `fk_product_category` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (111,1,'Nury Chevron Ring','Nury Chevron Ring',55400.00,5,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(112,1,'The Trina Ring','Beautifully Designed Trina',67500.00,5,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(113,1,'Ozo Stud Earring','Handmade Ozo Earrings for Women',54203.00,7,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(114,1,'Nuray Earrings','N-Shaped Earrings',65009.00,7,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(115,1,'Mazikeen Necklace','Mazi-Queen Royal Look Necklace',89500.00,6,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(116,1,'Ryck Princess Necklace','The Ryck Princess Necklace',99999.00,6,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(117,1,'Aelric Bracelet','The Aelric Bracelet',45000.00,8,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(118,1,'Resilient Bracelet','The Chain-Type Bracelet',46000.00,8,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(119,1,'Line Bangles','Royal Elegant Bangles for Women',67000.00,4,NULL,'Diamond',NULL,1,'2026-07-27 17:05:09','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(120,1,'Set Bangles','The Bazel Set Bangles',70000.00,4,NULL,'Diamond',NULL,1,'2026-07-27 17:30:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(121,2,'Spiral Ring','Classic Spiral Gold Ring',45000.00,6,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(122,2,'Leaf Design Ring','Elegant Leaf Design Gold Ring',33000.00,6,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(123,2,'Stud Earrings','Temple Gold Stud Earrings',44000.00,4,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(124,2,'Jhumka Earrings','Gold Jhumka Earrings',36411.00,4,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(125,2,'Lakshmi Temple Necklace','Beautifully Designed Necklace',77777.00,3,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(126,2,'Lakshmi Gold Necklace','Wonderfully Designed Necklace',88888.00,3,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(127,2,'Gold Beaded Bracelet','Handcrafted Bracelet for Women',45812.00,2,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(128,2,'Textured Gold Bracelet','Stylish Gold Bracelet for Men',38562.00,8,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(129,2,'Floral Bangle Set','Wonderfully Crafted Bangles',65481.00,5,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(130,2,'Designer Gold Bangles','Beautifully Crafted Bangles',65874.00,5,NULL,'Gold','22K',1,'2026-07-28 06:43:59','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(131,3,'Vidh Platinum Solitaire','Best Ring for Men',45021.00,8,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(132,3,'Elegant Floral Ring','Elegant Floral Platinum Ring',65741.00,8,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(133,3,'Swirl Stud Earrings','Circular Platinum Earrings',33254.00,7,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(134,3,'Floral Stud Earrings','Flower Platinum Stud Earrings',32546.00,7,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(135,3,'Emerald Drop Platinum Necklace','Wonderfully Crafted Necklace for Women',89899.00,1,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(136,3,'Solitaire Platinum Pendant Necklace','Looking Gorgeous',87898.00,1,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(137,3,'Star Motif Platinum Bracelet','Star Motif Platinum Bracelet',65475.00,3,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(138,3,'Floral Two-Tone Platinum Bracelet','Floral Two-Tone Platinum Bracelet',56874.00,3,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(139,3,'Star Motif Platinum Bangles','Premium Platinum Bangles',65477.00,4,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(140,3,'Eternity Platinum Bangle','Premium Platinum Bangle',54655.00,5,NULL,'Platinum','950',1,'2026-07-28 09:11:15','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(141,4,'Meris Textured Band Ring','Wonderful Silver Plated Ring',33332.00,8,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(142,4,'Butterfly Ring','Adjustable Silver Butterfly Ring',22712.00,8,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(143,4,'Dangler Earrings','Silver Flower Dangler Earrings',24589.00,9,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(144,4,'Ossum Earrings','Beautiful Earrings for Women',27586.00,9,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(145,4,'Wisdom Sterling Silver Necklace','Infinite Wisdom Sterling Silver Necklace',45821.00,4,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(146,4,'Gargi Stone Necklace','Beautifully Crafted Stone Necklace',46525.00,4,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(147,4,'Flexi Bracelet','Fleur Flexi Bracelet in Silver',55554.00,3,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(148,4,'Chain Bracelet','Clara Women\'s Evil Eye Bracelet',35241.00,3,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(149,4,'Rewa Bangles','Rounded Rewa Silver Bangles',42516.00,7,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10),(150,4,'Sterling Bangles','Sterling Silver Unique Bangles for Women',39564.00,7,NULL,'Silver','925',1,'2026-07-29 05:18:10','Gold','22K','VS1 / G-H Color','Natural Diamond',NULL,NULL,0.00,'ACTIVE',10);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `rating` int DEFAULT '5',
  `comment` text,
  `status` varchar(20) DEFAULT 'APPROVED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_settings`
--

DROP TABLE IF EXISTS `store_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_settings`
--

LOCK TABLES `store_settings` WRITE;
/*!40000 ALTER TABLE `store_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `store_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'mathapatisavitri2@gmail.com','Savitri Mathapati','$2a$10$96xkIeeCbc/Aqs5NCa5Z4O0DrMIaEVSyrXBE4cSETHquw1RwLQvBW','9019928824','USER',NULL),(2,'abmcons@gmail.com','mathapati Akshay','$2a$10$y0SnZ7tR4XqENJ119DfU2OeSYPgY4wu8W8PVDHXe47dQ6zdDwd0Em','9742615861','USER',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'USER',
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKtp53unkks741xiqi6m620i7mx` (`user_id`,`product_id`),
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
INSERT INTO `wishlist_items` VALUES (1,111,1),(2,113,1),(3,120,1),(4,124,1);
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-07 15:04:40
