package com.b5f1.atention.domain.plan.service;

import com.b5f1.atention.domain.plan.dto.PlanRequestDto;
import com.b5f1.atention.domain.plan.dto.PlanResponseDto;
import com.b5f1.atention.entity.Plan;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlanService {

    // 개인의 모든 일정 가져오기
    List<PlanResponseDto> getAllPlans(UUID userId);
    // 팀 일정 가져오기
    List<PlanResponseDto> getAllTeamPlans(Long teamId);
    // 일정 가져오기
    Optional<Plan> getPlan(Long planId);
    // 일정 생성
    PlanResponseDto createPlan(UUID userId, PlanRequestDto planRequestDto);
    // 일정 수정
    PlanResponseDto updatePlan(UUID userId, Long planId, PlanRequestDto planRequestDto);
    // 일정 삭제
    void deletePlan(UUID userId, Long planId, PlanRequestDto planRequestDto);

}
