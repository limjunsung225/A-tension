package com.b5f1.atention.domain.plan.service;

import com.b5f1.atention.domain.plan.dto.PlanRequestDto;
import com.b5f1.atention.domain.plan.dto.PlanResponseDto;
import com.b5f1.atention.domain.plan.repository.PlanRepository;
import com.b5f1.atention.domain.team.repository.TeamParticipantRepository;
import com.b5f1.atention.domain.team.repository.TeamRepository;
import com.b5f1.atention.domain.user.repository.UserRepository;
import com.b5f1.atention.entity.Plan;
import com.b5f1.atention.entity.Team;
import com.b5f1.atention.entity.TeamParticipant;
import com.b5f1.atention.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class PlanServiceImpl implements PlanService{

    private final PlanRepository planRepository;
    private final TeamRepository teamRepository;
    private final TeamParticipantRepository teamParticipantRepository;
    private final UserRepository userRepository;

    /**
     * 개인이 속한 모든 팀의 일정을 가져오는 메서드
     * @param userId
     * @return List<Plan>
     */
    @Override
    public List<PlanResponseDto> getAllPlans(UUID userId) {
        // userId로 user 조회
        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("해당하는 유저가 없습니다."));
        // teamParticipant 객체에 담긴 Team 에서 teamId 들을 List 로 저장
        List<TeamParticipant> teamParticipants = user.getTeamParticipantList();
        List<Long> teamIds = teamParticipants.stream()
                .map(TeamParticipant::getTeam)
                .map(Team::getId)
                .collect(Collectors.toList());
        // List 에 담긴 teamId 들로 모든 plan 을 find 후 반환
        List<Plan> plans = planRepository.findAllByTeamIdInAndIsDeletedFalse(teamIds);
        return mapPlansToPlanResponseDtoList(plans);
    }

    /**
     * 팀 ID로 해당하는 팀의 일정을 가져오는 메서드
     * @param teamId
     * @return List<Plan>
     */
    @Override
    public List<PlanResponseDto> getAllTeamPlans(Long teamId) {
        List<Plan> plans = planRepository.findAllByTeamIdAndIsDeletedFalse(teamId);
        return mapPlansToPlanResponseDtoList(plans);
    }

    /**
     * 일정 상세 보기 메서드
     * @param planId
     * @return plan
     */
    @Override
    public Optional<Plan> getPlan(Long planId) {
        return planRepository.findByIdAndIsDeletedFalse(planId);
    }

    /**
     * 일정 생성 후 DTO 로 변환하고 반환하는 메서드
     * @param userId
     * @param  planRequestDto
     * @return savedPlan
     */
    @Override
    public PlanResponseDto createPlan(UUID userId, PlanRequestDto planRequestDto) {
        // 현재 유저의 권한을 확인하는 메서드
        Optional<TeamParticipant> optionalTeamParticipant = authorityCheck(userId, planRequestDto);
        // 권한이 없으면 예외 처리
        if (optionalTeamParticipant.isEmpty() || Boolean.TRUE.equals(!optionalTeamParticipant.get().getHasAuthority())) {
            throw new RuntimeException("일정을 생성할 권한이 없습니다.");
        }
        // 권한이 있으면 dto 로 변환 후 반환
        Plan plan = mapPlanRequestDtoToPlan(planRequestDto);
        Plan savedPlan = planRepository.save(plan);
        return mapPlanToPlanResponseDto(savedPlan);
    }


    /**
     * 일정 수정 후 DTO 로 변환하고 반환하는 메서드
     * @param userId
     * @param planId
     * @param planRequestDto
     * @return updatedPlan
     */
    @Override
    public PlanResponseDto updatePlan(UUID userId, Long planId, PlanRequestDto planRequestDto) {
        // 현재 유저의 권한을 확인하는 메서드
        Optional<TeamParticipant> optionalTeamParticipant =  authorityCheck(userId, planRequestDto);
        // 권한이 없으면 예외 처리
        if (optionalTeamParticipant.isEmpty() || Boolean.TRUE.equals(!optionalTeamParticipant.get().getHasAuthority())) {
            throw new RuntimeException("일정을 수정할 권한이 없습니다.");
        }
        // 수정할 일정 객체 하나를 가져와서 수정 후 반환
        Plan plan = planRepository.findByIdAndIsDeletedFalse(planId)
                .orElseThrow(() -> new RuntimeException("해당하는 일정이 없습니다."));
        Plan updatedPlan = planRepository.save(plan.updatePlan(planRequestDto));

        return mapPlanToPlanResponseDto(updatedPlan);
    }

    /**
     * 일정 삭제하는 메서드
     * @param userId
     * @param planId
     * @param planRequestDto
     */
    @Override
    public void deletePlan(UUID userId, Long planId, PlanRequestDto planRequestDto) {
        // 현재 유저의 권한을 확인하는 메서드
        Optional<TeamParticipant> optionalTeamParticipant =  authorityCheck(userId, planRequestDto);
        // 권한이 없으면 예외 처리
        if (optionalTeamParticipant.isEmpty() || Boolean.TRUE.equals(!optionalTeamParticipant.get().getHasAuthority())) {
            throw new RuntimeException("일정을 삭제할 권한이 없습니다.");
        }
        // 일정 객체 가져와서 is_deleted를 true로 바꾼다.
        Optional<Plan> optionalPlan = planRepository.findByIdAndIsDeletedFalse(planId);
        if (optionalPlan.isPresent()) {
            Plan plan = optionalPlan.get();
            plan.deleted();
            planRepository.save(plan);
        } else {
            throw new RuntimeException("해당하는 일정이 없습니다");
        }
    }

    // 서비스 내부에서 사용하는 로직

    /**
     * 일정 객체를 DTO 로 변환하는 메서드
     * @param plan
     * @return planResponseDto
     */
    private PlanResponseDto mapPlanToPlanResponseDto(Plan plan) {
        return PlanResponseDto.builder()
                .id(plan.getId())
                .name(plan.getName())
                .startTime(plan.getStartTime())
                .endTime(plan.getEndTime())
                .teamId(plan.getTeamId())
                .description(plan.getDescription())
                .build();
    }

    /**
     * DTO 를 일정 객체로 변환하는 메서드
     * @param planRequestDto
     * @return planResponseDto
     */
    private Plan mapPlanRequestDtoToPlan(PlanRequestDto planRequestDto) {
        return Plan.builder()
                .name(planRequestDto.getName())
                .startTime(planRequestDto.getStartTime())
                .endTime(planRequestDto.getEndTime())
                .teamId(planRequestDto.getTeamId())
                .description(planRequestDto.getDescription())
                .build();
    }

    /**
     * plans 를 DTO 로 변환하는 메서드
     * @param plans
     * @return planResponseDtoList
     */
    private List<PlanResponseDto> mapPlansToPlanResponseDtoList(List<Plan> plans) {
        return plans.stream()
                .map(this::mapPlanToPlanResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * 권한을 검사하는 메서드
     * @param userId
     * @param planRequestDto
     */
    private Optional<TeamParticipant> authorityCheck(UUID userId, PlanRequestDto planRequestDto) {
        // userId로 user 조회
        Optional<User> currentUser = userRepository.findByIdAndIsDeletedFalse(userId);
        // dto 안의 team 에서 teamId 가져옴
        Optional<Team> currentTeam = teamRepository.findByIdAndIsDeletedFalse(planRequestDto.getTeamId());
        // user 또는 team 이 없으면 예외 처리
        if (currentUser.isEmpty() || currentTeam.isEmpty()) {
            throw new RuntimeException("해당 사용자 또는 팀을 찾을 수 없습니다.");
        }
        // 있으면 user와 team 찾아서 teamParticipant 객체 반환
        return teamParticipantRepository.findByUserAndTeamAndIsDeletedFalse(currentUser.get(), currentTeam.get());
    }
}
