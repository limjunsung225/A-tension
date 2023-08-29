package com.b5f1.atention.domain.Team;

import com.b5f1.atention.domain.team.dto.*;
import com.b5f1.atention.domain.team.repository.TeamInvitationRepository;
import com.b5f1.atention.domain.team.repository.TeamParticipantRepository;
import com.b5f1.atention.domain.team.repository.TeamRepository;
import com.b5f1.atention.domain.team.service.TeamServiceImpl;
import com.b5f1.atention.domain.user.repository.UserRepository;
import com.b5f1.atention.entity.Team;
import com.b5f1.atention.entity.TeamInvitation;
import com.b5f1.atention.entity.TeamParticipant;
import com.b5f1.atention.entity.User;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
@Rollback
public class TeamTests {

    @Autowired
    private TeamServiceImpl teamService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamParticipantRepository teamParticipantRepository;

    @Autowired
    private TeamInvitationRepository teamInvitationRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void findMyTeamTest() throws Exception {
        //given
        createTeamTest();
        User user = userRepository.findByEmail("testUser")
                .orElseThrow();

        //when
        List<TeamResponseDto> myTeamList = teamService.findMyTeamList(user.getId());

        //then
        assertThat(myTeamList.get(0).getTeamId()).isEqualTo(teamRepository.findByName("testTeam").orElseThrow().getId());

    }

    // 팀 새로 생성 후 초대 테스트
    @Test
    public void createTeamTest() throws Exception {
        //given
        User hostUser = User.builder()
                .email("testUser")
                .meetingUrl("test")
                .build();
        userRepository.saveAndFlush(hostUser);

        List<UUID> userIdList = new ArrayList<>();
        User invitedUser1 = User.builder()
                .email("invitedUser1")
                .meetingUrl("test")
                .build();
        userIdList.add(userRepository.saveAndFlush(invitedUser1).getId());

        User invitedUser2 = User.builder()
                .email("invitedUser2")
                .meetingUrl("test")
                .build();
        userIdList.add(userRepository.saveAndFlush(invitedUser2).getId());

        TeamCreateRequestDto teamCreateRequestDto = TeamCreateRequestDto.builder()
                .userIdList(userIdList)
                .name("testTeam")
                .build();

        //when
        User user = userRepository.findByEmail("testUser")
                .orElseThrow(() -> new ArithmeticException("유저를 찾을 수 없습니다"));
        teamService.createTeam(user.getId(), teamCreateRequestDto);
//        teamService.inviteUser(user.getId(), createdTeam, teamCreateRequestDto);

        //then
        Optional<TeamParticipant> teamParticipant = teamParticipantRepository.findByUser(hostUser);
        assertThat(teamParticipant).isNotEqualTo(Optional.empty());
        Optional<TeamParticipant> teamParticipant1 = teamParticipantRepository.findByUser(invitedUser1);
        assertThat(teamParticipant1).isNotEqualTo(Optional.empty());
    }

    @Test
    public void getTeamDetailTest() throws Exception {
        //given
        createTeamTest();

        // when
        UUID userId = userRepository.findByEmail("testUser").orElseThrow().getId();
        Long teamId = teamRepository.findByName("testTeam").orElseThrow().getId();

        // then
        System.out.println(teamService.getTeamDetail(userId, teamId));

    }

    @Test
    public void updateTeamTest() throws Exception {
        //given
        createTeamTest();
        User user = userRepository.findByEmail("testUser").orElseThrow();
        Team team = teamRepository.findByName("testTeam").orElseThrow();

        TeamUpdateRequestDto teamUpdateRequestDto = TeamUpdateRequestDto.builder()
                .name("updateTest")
                .profileImage("updateTest")
                .description("updateTest")
                .build();

        //when
        TeamUpdateRequestDto teamUpdateResponseDto = teamService.updateTeam(user.getId(), team.getId(), teamUpdateRequestDto);

        //then
        assertThat(teamUpdateRequestDto.getName()).isEqualTo(teamUpdateResponseDto.getName());
    }

    @Test
    public void deleteTeamTest() throws Exception {
        //given
        createTeamTest();
        User user = userRepository.findByEmail("testUser").orElseThrow();
        Team team = teamRepository.findByName("testTeam").orElseThrow();

        assertThat(user.getTeamParticipantList().get(0)).isEqualTo(team.getTeamParticipantList().get(0));
        //when
        teamService.deleteTeam(user.getId(), team.getId());

        //then

        assertThat(team.getIsDeleted()).isEqualTo(true);
        assertThat(user.getTeamParticipantList().size()).isEqualTo(0);
//        assertThat(team.getTeamParticipantList().size()).isEqualTo(0);
        assertThat(teamParticipantRepository.findByUser(user)).isEqualTo(Optional.empty());
    }

    // 그룹 초대 로직 변경으로 인해 사용 X
//    @Test
//    public void acceptTeam() throws Exception {
//        //given
//        createTeamTest();
//        Team team = teamRepository.findByName("testTeam").orElseThrow();
//        User user = userRepository.findByEmail("invitedUser1").orElseThrow();
//
//        //when
//        teamService.acceptTeam(user.getId(), team.getId());
//
//        //then
//        TeamParticipant teamParticipant = teamParticipantRepository.findByUserAndTeamAndIsDeletedFalse(user, team)
//                .orElseThrow();
//
//        assertThat(teamParticipant.getUser().getId()).isEqualTo(user.getId());
//
//    }

    @Test
    public void leaveTeamTest() throws Exception {
        //given
        createTeamTest();
        User user = userRepository.findByEmail("testUser").orElseThrow();
        Team team = teamRepository.findByName("testTeam").orElseThrow();
        //when

        teamService.leaveTeam(user.getId(), team.getId());

        //then
        Optional<TeamParticipant> teamParticipant = teamParticipantRepository.findByUserAndTeamAndIsDeletedFalse(user, team);
        assertThat(teamParticipant).isEqualTo(Optional.empty());
    }

    // 그룹 초대 로직 변경으로 인해 테스트 불가
//    @Test
//    public void updateTeamParticipantAuthorityTest() throws Exception {
//        //given
//        acceptTeam();
//        User hostUser = userRepository.findByEmail("testUser").orElseThrow();
//        User updateUser = userRepository.findByEmail("invitedUser1").orElseThrow();
//        Team team = teamRepository.findByName("testTeam").orElseThrow();
//        UserAuthDto userAuthDto = UserAuthDto.builder()
//                .userId(updateUser.getId())
//                .hasAuthority(true)
//                .build();
//        List<UserAuthDto> userAuthDtoList = new ArrayList<>();
//        userAuthDtoList.add(userAuthDto);
//
//        TeamParticipantAuthorityDto teamParticipantAuthorityDto = new TeamParticipantAuthorityDto().builder()
//                .teamId(team.getId())
//                .userAuthDtoList(userAuthDtoList)
//                .build();
//        //when
//        teamService.updateTeamParticipantAuthority(hostUser.getId(), teamParticipantAuthorityDto);
//
//        //then
//
//        TeamParticipant teamParticipant = teamParticipantRepository.findByUserAndTeamAndIsDeletedFalse(updateUser, team)
//                .orElseThrow();
//        assertThat(teamParticipant.getHasAuthority()).isEqualTo(true);
//
//    }
}
