package com.jewellery.dto;

import com.jewellery.entity.Role;

public record UserSummary(Long id, String fullName, String email, String phone, Role role) {
}
