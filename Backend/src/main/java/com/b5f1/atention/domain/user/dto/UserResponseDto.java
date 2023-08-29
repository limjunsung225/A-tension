package com.b5f1.atention.domain.user.dto;

import com.b5f1.atention.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private String email;
    private String name;
    private String profileImage;
    private int ticket;
    private String meetingUrl;

    public UserResponseDto toUserResponseDto(User user) {
        return UserResponseDto.builder()
                .email(user.getEmail())
                .name(user.getName())
                .profileImage(user.getProfileImage())
                .ticket(user.getTicket())
                .meetingUrl(user.getMeetingUrl())
                .build();
    }
}
