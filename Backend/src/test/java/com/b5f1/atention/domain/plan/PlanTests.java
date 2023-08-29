package com.b5f1.atention.domain.plan;

import com.b5f1.atention.domain.plan.dto.PlanRequestDto;
import com.b5f1.atention.domain.plan.dto.PlanResponseDto;
import com.b5f1.atention.domain.plan.repository.PlanRepository;
import com.b5f1.atention.domain.plan.service.PlanService;
import com.b5f1.atention.domain.team.repository.TeamParticipantRepository;
import com.b5f1.atention.domain.team.repository.TeamRepository;
import com.b5f1.atention.domain.team.service.TeamService;
import com.b5f1.atention.domain.user.repository.UserRepository;
import com.b5f1.atention.entity.Plan;
import com.b5f1.atention.entity.Team;
import com.b5f1.atention.entity.TeamParticipant;
import com.b5f1.atention.entity.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
@Rollback
public class PlanTests {

    @Autowired
    private PlanService planService;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamParticipantRepository teamParticipantRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void getAllPlansTest() {
        // Given
        User user = User.builder()
                .email("testUser")
                .meetingUrl("test")
                .build();
        user = userRepository.save(user);

        Team team1 = Team.builder()
                .name("Test Team 1")
                .build();
        team1 = teamRepository.save(team1);

        Team team2 = Team.builder()
                .name("Test Team 2")
                .build();
        team2= teamRepository.save(team2);

        teamParticipantRepository.save(new TeamParticipant().createTeamParticipant(user, team1, true));
        teamParticipantRepository.save(new TeamParticipant().createTeamParticipant(user, team2, true));

        Plan plan1 = Plan.builder()
                .name("Plan 1")
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(1))
                .description("Test Plan 1")
                .teamId(team1.getId())  // team1을 사용자가 속한 팀으로 지정
                .build();
        Plan plan2 = Plan.builder()
                .name("Plan 2")
                .startTime(LocalDateTime.now().plusDays(1))
                .endTime(LocalDateTime.now().plusDays(1).plusHours(2))
                .description("Test Plan 2")
                .teamId(team2.getId())  // team2를 사용자가 속한 팀으로 지정
                .build();
        planRepository.saveAll(List.of(plan1, plan2));

        // When
        List<PlanResponseDto> plans = planService.getAllPlans(user.getId());

        // Then
        assertEquals(2, plans.size());
        assertEquals(plan1.getName(), plans.get(0).getName());
        assertEquals(plan2.getName(), plans.get(1).getName());
    }

    @Test
    public void getAllTeamPlansTest(){
        // Given
        User user = User.builder()
                .email("testUser")
                .meetingUrl("test")
                .build();
        user = userRepository.save(user);

        Team team = Team.builder()
                .name("Test Team 1")
                .build();
        team = teamRepository.save(team);

        teamParticipantRepository.save(new TeamParticipant().createTeamParticipant(user, team, true));

        Plan plan1 = Plan.builder()
                .name("Plan 1")
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(1))
                .description("Test Plan 1")
                .teamId(team.getId())  // team1을 사용자가 속한 팀으로 지정
                .build();
        Plan plan2 = Plan.builder()
                .name("Plan 2")
                .startTime(LocalDateTime.now().plusDays(1))
                .endTime(LocalDateTime.now().plusDays(1).plusHours(2))
                .description("Test Plan 2")
                .teamId(team.getId())  // team2를 사용자가 속한 팀으로 지정
                .build();
        planRepository.saveAll(List.of(plan1, plan2));

        // When
        List<PlanResponseDto> plans = planService.getAllTeamPlans(team.getId());

        // Then
        assertEquals(2, plans.size());
        assertEquals(plan1.getName(), plans.get(0).getName());
        assertEquals(plan2.getName(), plans.get(1).getName());
    }

    @Test
    public void createPlanTest() {
        // Given
        User user = User.builder()
                .email("testUser")
                .meetingUrl("test")
                .build();
        userRepository.save(user);

        Team team = Team.builder()
                .name("Test Team")
                .build();
        teamRepository.save(team);

        TeamParticipant teamParticipant = TeamParticipant.builder()
                .user(user)
                .team(team)
                .hasAuthority(true)
                .build();
        teamParticipantRepository.save(teamParticipant);

        PlanRequestDto planRequestDto = PlanRequestDto.builder()
                .name("Test Plan")
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(2))
                .description("Test Plan Description")
                .teamId(team.getId())
                .build();

        // When
        PlanResponseDto createdPlan = planService.createPlan(user.getId(), planRequestDto);

        // Then
        assertNotNull(createdPlan);
        assertNotNull(createdPlan.getId());
        assertEquals(planRequestDto.getName(), createdPlan.getName());
        assertEquals(planRequestDto.getStartTime(), createdPlan.getStartTime());
        assertEquals(planRequestDto.getEndTime(), createdPlan.getEndTime());
        assertEquals(planRequestDto.getDescription(), createdPlan.getDescription());
    }

    @Test
    public void updatePlanTest() {
        // Given
        User user = User.builder()
                .email("testUser")
                .meetingUrl("test")
                .build();
        userRepository.save(user);

        Team team = Team.builder()
                .name("Test Team")
                .build();
        teamRepository.save(team);

        TeamParticipant teamParticipant = TeamParticipant.builder()
                .user(user)
                .team(team)
                .hasAuthority(true)
                .build();
        teamParticipantRepository.save(teamParticipant);

        Plan plan = Plan.builder()
                .name("Test Plan")
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(2))
                .description("Test Plan Description")
                .teamId(team.getId())
                .build();
        planRepository.save(plan);

        PlanRequestDto planRequestDto = PlanRequestDto.builder()
                .name("Updated Plan")
                .startTime(LocalDateTime.now().plusDays(1))
                .endTime(LocalDateTime.now().plusDays(1).plusHours(2))
                .description("Updated Plan Description")
                .teamId(team.getId())
                .build();

        // When
        PlanResponseDto updatedPlan = planService.updatePlan(user.getId(), plan.getId(), planRequestDto);

        // Then
        assertNotNull(updatedPlan);
        assertEquals(planRequestDto.getName(), updatedPlan.getName());
        assertEquals(planRequestDto.getStartTime(), updatedPlan.getStartTime());
        assertEquals(planRequestDto.getEndTime(), updatedPlan.getEndTime());
        assertEquals(planRequestDto.getDescription(), updatedPlan.getDescription());
    }

    @Test
    public void deletePlanTest() {
        // Given
        User user = User.builder()
                .email("testUser")
                .meetingUrl("test")
                .build();
        userRepository.save(user);

        Team team = Team.builder()
                .name("Test Team")
                .build();
        teamRepository.save(team);

        TeamParticipant teamParticipant = TeamParticipant.builder()
                .user(user)
                .team(team)
                .hasAuthority(true)
                .build();
        teamParticipantRepository.save(teamParticipant);

        Plan plan = Plan.builder()
                .name("Test Plan")
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(2))
                .description("Test Plan Description")
                .teamId(team.getId())
                .build();
        planRepository.save(plan);

        PlanRequestDto planRequestDto = PlanRequestDto.builder()
                .name("Updated Plan")
                .startTime(LocalDateTime.now().plusDays(1))
                .endTime(LocalDateTime.now().plusDays(1).plusHours(2))
                .description("Updated Plan Description")
                .teamId(team.getId())
                .build();

        // When
        planService.deletePlan(user.getId(), plan.getId(), planRequestDto);

        // Then
        Plan deletedPlan = planRepository.findById(plan.getId()).orElse(null);
        assertNotNull(deletedPlan);
        assertTrue(deletedPlan.getIsDeleted());
    }

}