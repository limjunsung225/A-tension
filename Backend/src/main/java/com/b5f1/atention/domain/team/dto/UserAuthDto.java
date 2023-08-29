package com.b5f1.atention.domain.team.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
// 팀 내 유저 권한을 변경하기 위한 DTO
public class UserAuthDto {
    private UUID userId;
    private Boolean hasAuthority;
}
