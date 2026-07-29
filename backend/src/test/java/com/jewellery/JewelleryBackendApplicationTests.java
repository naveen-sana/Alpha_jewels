package com.jewellery;

import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

class JewelleryBackendApplicationTests {

	@Test
	void checkPlatinum() {
		try {
			Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/", "root", "Naveen@0987");
			Statement stmt = conn.createStatement();
			
			System.out.println("=== PRODUCTS FOR PLATINUM ===");
			ResultSet rs = stmt.executeQuery("SELECT p.product_id, p.name, p.category_id, pi.image_url FROM ecommerce_db.products p LEFT JOIN ecommerce_db.productimages pi ON p.product_id = pi.product_id WHERE p.category_id = 3;");
			while (rs.next()) {
				System.out.println("ID: " + rs.getInt("product_id") + " | Name: " + rs.getString("name") + " | CategoryID: " + rs.getInt("category_id") + " | ImageURL: " + rs.getString("image_url"));
			}
			rs.close();
			
			System.out.println("=== ALL PRODUCTS IN DB ===");
			ResultSet rsAll = stmt.executeQuery("SELECT p.product_id, p.name, p.category_id FROM ecommerce_db.products p;");
			while (rsAll.next()) {
				System.out.println("ID: " + rsAll.getInt("product_id") + " | Name: " + rsAll.getString("name") + " | CategoryID: " + rsAll.getInt("category_id"));
			}
			rsAll.close();
			
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
