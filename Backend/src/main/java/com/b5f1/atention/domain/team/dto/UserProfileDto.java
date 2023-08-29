package com.b5f1.atention.domain.team.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

// 추후에 이동 예정
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

    // 유저 고유 식별값
    private UUID userId;
    // 유저 이름
    private String name;
    // 유저 프로필 사진 링크
    private String profileImage;
}
