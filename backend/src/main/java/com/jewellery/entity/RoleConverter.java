package com.jewellery.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role role) {
        if (role == null) return "USER";
        return role.name();
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return Role.USER;
        }
        try {
            return Role.valueOf(dbData.trim().toUpperCase());
        } catch (Exception e) {
            return Role.USER;
        }
    }
}
