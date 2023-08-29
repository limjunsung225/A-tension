package com.b5f1.atention.domain.team.dto;

import com.b5f1.atention.entity.Team;
import com.b5f1.atention.entity.User;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TeamDetailResponseDto {
    // Team
    // 팀 고유 식별값
    private Long teamId;
    // 팀 이름
    private String name;
    // 팀 프로필 사진 링크
    private String profileImage;
    // 팀 소개
    private String description;
    // User
    // 유저 프로필 관련 데이터 (userId, name, profileImage)
    private List<UserProfileDto> userProfileDtoList;

    // Team 정보를 받아 필드를 채워 TeamDetailResponseDto 변환
    public TeamDetailResponseDto toTeamDetailResponseDto(Team team) {
        return TeamDetailResponseDto.builder()
                .teamId(team.getId())
                .name(team.getName())
                .profileImage(team.getProfileImage())
                .description(team.getDescription())
                .userProfileDtoList(new ArrayList<>())
                .build();
    }

    // TeamDetailResponseDto에 userProfileDto를 채워 추가
    public void addUserProfileDto(User user) {
        UserProfileDto userProfileDto = UserProfileDto.builder()
                .userId(user.getId())
                .name(user.getName())
                .profileImage(user.getProfileImage())
                .build();
        this.userProfileDtoList.add(userProfileDto);
    }
}
