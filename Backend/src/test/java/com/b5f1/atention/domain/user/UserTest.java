package com.b5f1.atention.domain.user;

import com.b5f1.atention.domain.team.dto.TeamCreateRequestDto;
import com.b5f1.atention.domain.team.repository.TeamParticipantRepository;
import com.b5f1.atention.domain.team.service.TeamService;
import com.b5f1.atention.domain.user.dto.UserProfileUpdateDto;
import com.b5f1.atention.domain.user.dto.UserResponseDto;
import com.b5f1.atention.domain.user.dto.UserSearchResponseDto;
import com.b5f1.atention.domain.user.repository.UserRepository;
import com.b5f1.atention.domain.user.service.UserService;
import com.b5f1.atention.entity.TeamParticipant;
import com.b5f1.atention.entity.User;
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

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
@Rollback
public class UserTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamService teamService;

    @Autowired
    private TeamParticipantRepository teamParticipantRepository;


    @Test
    public void createUserAndTeam() throws Exception {
        //given
        User hostUser = User.builder()
                .email("testUser")
                .name("testName")
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

        //then
        Optional<TeamParticipant> teamParticipant = teamParticipantRepository.findByUser(hostUser);
        assertThat(teamParticipant).isNotEqualTo(Optional.empty());
    }

    @Test
    public void getMyUserProfile() throws Exception {
        createUserAndTeam();
        User user = userRepository.findByEmail("testUser")
                .orElseThrow(() -> new ArithmeticException("유저를 찾을 수 없습니다"));
        UserResponseDto myUserProfile = userService.getMyUserProfile(user.getId());

        assertThat(myUserProfile.getName()).isEqualTo("testName");

    }

    @Test
    public void updateUserProfileTest() throws Exception {
        createUserAndTeam();
        User user = userRepository.findByEmail("testUser")
                .orElseThrow(() -> new ArithmeticException("유저를 찾을 수 없습니다"));
        UserProfileUpdateDto userProfileUpdateDto = UserProfileUpdateDto.builder()
                .name("updateTest")
                .profileImage("profileTest")
                .build();
        UserResponseDto userResponseDto = userService.updateUserProfile(user.getId(), userProfileUpdateDto);
        assertThat(userResponseDto.getName()).isEqualTo("updateTest");
    }

    @Test
    public void deleteUserTest() throws Exception {
        createUserAndTeam();
        User user = userRepository.findByEmail("testUser")
                .orElseThrow();

        assertThat(user.getTeamParticipantList().size()).isEqualTo(1);

        userService.deleteUser(user.getId());

        User deletedUser = userRepository.findByEmail("testUser")
                .orElseThrow();

        assertThat(deletedUser.getIsDeleted()).isEqualTo(true);
        assertThat(deletedUser.getTeamParticipantList().size()).isEqualTo(0);
        assertThat(teamParticipantRepository.findByUser(deletedUser)).isEqualTo(Optional.empty());

    }

    @Test
    public void searchTest() throws Exception {
        List<UserSearchResponseDto> searchResponseDtoList = userService.searchUser("k");
        for (UserSearchResponseDto user : searchResponseDtoList) {
            System.out.println(user.getEmail() + " " + user.getName());
        }
    }
}
