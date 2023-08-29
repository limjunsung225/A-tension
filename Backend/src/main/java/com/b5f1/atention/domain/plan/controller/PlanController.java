package com.b5f1.atention.domain.plan.controller;

import com.b5f1.atention.common.MessageOnly;
import com.b5f1.atention.common.MessageWithData;
import com.b5f1.atention.domain.plan.dto.PlanRequestDto;
import com.b5f1.atention.domain.plan.dto.PlanResponseDto;
import com.b5f1.atention.domain.plan.service.PlanService;
import com.b5f1.atention.entity.Plan;
import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/plan")
@Api(tags = "일정")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @GetMapping
    @Operation(summary = "모든 일정 조회", description = "유저가 속한 모든 팀의 일정 조회 요청 API 입니다.")
    public ResponseEntity<MessageWithData> getAllUserPlans(Authentication authentication) {
        List<PlanResponseDto> data = planService.getAllPlans(UUID.fromString(authentication.getName()));
        return new ResponseEntity<>(new MessageWithData(("가입한 모든 그룹의 일정을 가져왔습니다."), data), HttpStatus.OK);
    }

    @GetMapping("/team/{teamId}")
    @Operation(summary = "팀 일정 조회", description = "팀의 일정 조회 요청 API 입니다.")
    public ResponseEntity<MessageWithData> getAllTeamPlans(@PathVariable Long teamId) {
        List<PlanResponseDto> data = planService.getAllTeamPlans(teamId);
        return new ResponseEntity<>(new MessageWithData(("그룹의 일정을 가져왔습니다."), data), HttpStatus.OK);
    }

    @GetMapping("/{planId}")
    @Operation(summary = "일정 상세 조회", description = "일정 상세 조회 요청 API 입니다.")
    public ResponseEntity<MessageWithData> getPlan(@PathVariable Long planId) {
        Optional<Plan> data = planService.getPlan(planId);
        return new ResponseEntity<>(new MessageWithData(("일정 상세정보를 가져왔습니다."), data), HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "일정 생성", description = "일정 생성 요청 API 입니다.")
    public ResponseEntity<MessageOnly> createPlan(Authentication authentication, @RequestBody PlanRequestDto planRequestDto) {
        planService.createPlan(UUID.fromString(authentication.getName()), planRequestDto);
        return new ResponseEntity<>(new MessageOnly("일정을 생성했습니다."), HttpStatus.OK);
    }

    @PutMapping("/{planId}")
    @Operation(summary = "일정 수정", description = "일정 수정 요청 API 입니다.")
    public ResponseEntity<MessageWithData> updatePlan(Authentication authentication, @PathVariable Long planId, @RequestBody PlanRequestDto planRequestDto) {
        PlanResponseDto data = planService.updatePlan(UUID.fromString(authentication.getName()), planId, planRequestDto);
        return new ResponseEntity<>(new MessageWithData(("일정을 수정했습니다."), data), HttpStatus.OK);
    }

    @DeleteMapping("/{planId}")
    @Operation(summary = "일정 삭제", description = "일정 삭제 요청 API 입니다.")
    public ResponseEntity<MessageOnly> deletePlan(Authentication authentication, @PathVariable Long planId, @RequestBody PlanRequestDto planRequestDto) {
        planService.deletePlan(UUID.fromString(authentication.getName()),planId, planRequestDto);
        return new ResponseEntity<>(new MessageOnly("일정을 삭제했습니다."),HttpStatus.OK);
    }
}
