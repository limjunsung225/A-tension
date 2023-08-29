package com.b5f1.atention.domain.user.repository;

import com.b5f1.atention.entity.User;
import com.b5f1.atention.entity.enums.SocialType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    Optional<User> findByIdAndIsDeletedFalse(UUID userId);

    Optional<User> findByRefreshToken(String refreshToken);

    // 소셜 타입과 소셜의 식별값으로 회원 찾는 메소드
    Optional<User> findBySocialTypeAndSocialId(SocialType socialType, String socialId);
  
    List<User> findByNameContainingOrEmailContainingAndIsDeletedFalse(String keyword1, String keyword2);
}

