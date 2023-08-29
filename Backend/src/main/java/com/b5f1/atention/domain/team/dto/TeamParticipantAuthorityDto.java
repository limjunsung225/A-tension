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
// 팀 내 유저의 권한을 변경하기 위한 DTO
public class TeamParticipantAuthorityDto {
    Long teamId;
    private List<UserAuthDto> userAuthDtoList;
}
