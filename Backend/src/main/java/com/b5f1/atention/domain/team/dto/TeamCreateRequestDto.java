package com.b5f1.atention.domain.team.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
// Team 생성할 때 받아오는 DTO
public class TeamCreateRequestDto {
    // 팀 이름
    private String name;
    // 초대 할 유저 ID List
    private List<UUID> userIdList;
    // 팀 소개
    private String description;
}
