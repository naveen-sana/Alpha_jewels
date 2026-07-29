package com.jewellery.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jewellery.entity.Role;

@Service
public class JwtService {

    private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder URL_DECODER = Base64.getUrlDecoder();
    private final byte[] signingKey;
    private final long expirationMs;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-ms}") long expirationMs) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("app.jwt.secret must be at least 32 bytes long");
        }
        this.signingKey = keyBytes;
        this.expirationMs = expirationMs;
    }

    public String generateToken(String email, Role role, String name) {
        long now = System.currentTimeMillis();
        try {
            String header = URL_ENCODER.encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
            String payloadJson = "{\"sub\":\"" + escapeJson(email) + "\",\"role\":\"" + role.name()
                    + "\",\"name\":\"" + escapeJson(name) + "\",\"iat\":" + now + ",\"exp\":" + (now + expirationMs) + "}";
            String payload = URL_ENCODER.encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));
            String unsignedToken = header + "." + payload;
            return unsignedToken + "." + URL_ENCODER.encodeToString(sign(unsignedToken));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not generate JWT", ex);
        }
    }

    public JwtPayload parseToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid JWT format");
            }
            byte[] expectedSignature = sign(parts[0] + "." + parts[1]);
            byte[] actualSignature = URL_DECODER.decode(parts[2]);
            if (!MessageDigest.isEqual(expectedSignature, actualSignature)) {
                throw new IllegalArgumentException("Invalid JWT signature");
            }
            String payload = new String(URL_DECODER.decode(parts[1]), StandardCharsets.UTF_8);
            String email = extractString(payload, "sub");
            String role = extractString(payload, "role");
            String name = extractString(payload, "name");
            long expiry = extractLong(payload, "exp");
            if (expiry < System.currentTimeMillis()) {
                throw new IllegalArgumentException("JWT has expired");
            }
            return new JwtPayload(email, role, name);
        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid JWT", ex);
        }
    }

    private byte[] sign(String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(signingKey, "HmacSHA256"));
        return mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
    }

    private String extractString(String json, String field) {
        Matcher matcher = Pattern.compile("\\\"" + field + "\\\"\\s*:\\s*\\\"([^\\\"]*)\\\"").matcher(json);
        if (!matcher.find()) {
            throw new IllegalArgumentException("JWT is missing " + field);
        }
        return matcher.group(1).replace("\\\\\"", "\"").replace("\\\\\\\\", "\\");
    }

    private long extractLong(String json, String field) {
        Matcher matcher = Pattern.compile("\\\"" + field + "\\\"\\s*:\\s*(\\d+)").matcher(json);
        if (!matcher.find()) {
            throw new IllegalArgumentException("JWT is missing " + field);
        }
        return Long.parseLong(matcher.group(1));
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    public record JwtPayload(String email, String role, String name) { }
}
