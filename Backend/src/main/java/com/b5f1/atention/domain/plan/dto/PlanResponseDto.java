package com.b5f1.atention.domain.plan.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
// 일정 조회 시 보내는 DTO
public class PlanResponseDto {
    // 일정 ID
    private Long id;
    // 팀 ID
    private Long teamId;
    // 일정 제목
    private String name;
    // 일정 시작 시간
    private LocalDateTime startTime;
    // 일정 종료 시간
    private LocalDateTime endTime;
    // 일정 상세
    private String description;
    // 팀 이름
    private String teamName;
    // 프로필 이미지 경로
    private String profileImage;
}
