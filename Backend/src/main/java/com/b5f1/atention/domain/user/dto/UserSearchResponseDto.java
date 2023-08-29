package com.b5f1.atention.domain.user.dto;

import com.b5f1.atention.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserSearchResponseDto {

    private UUID userId;
    private String email;
    private String name;
    private String profileImage;


    public UserSearchResponseDto toUserResponseDto(User user) {
        return UserSearchResponseDto.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profileImage(user.getProfileImage())
                .build();
    }
}
