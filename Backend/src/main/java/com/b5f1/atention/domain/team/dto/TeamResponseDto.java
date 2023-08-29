package com.b5f1.atention.domain.team.dto;

import com.b5f1.atention.entity.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
// 팀의 간단한 정보를 보여주는 DTO
public class TeamResponseDto {

    // 팀 고유 ID
    private Long teamId;
    // 팀 이름
    private String name;
    // 팀 프로필 이미지 링크
    private String profileImage;
    // 팀 description
    private String description;


    // Team -> TeamResponseDto 변환
    public TeamResponseDto toTeamResponseDto(Team team) {
        return TeamResponseDto.builder()
                .teamId(team.getId())
                .name(team.getName())
                .profileImage(team.getProfileImage())
                .description(team.getDescription())
                .build();
    }
}
