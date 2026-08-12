
package com.jewellery.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jewellery.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findFirstByEmailOrderByIdAsc(String email);

    default Optional<User> findByEmail(String email) {
        if (email == null) return Optional.empty();
        return findFirstByEmailOrderByIdAsc(email.trim().toLowerCase());
    }

}
