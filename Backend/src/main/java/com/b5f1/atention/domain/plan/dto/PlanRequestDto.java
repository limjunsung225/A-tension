package com.b5f1.atention.domain.plan.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
// 일정 생성 및 수정 시 받아오는 DTO
public class PlanRequestDto {
    // 일정 제목
    private String name;
    // 팀 ID
    private Long teamId;
    // 일정 시작 시간
    private LocalDateTime startTime;
    // 일정 종료 시간
    private LocalDateTime endTime;
    // 일정 상세
    private String description;
}
