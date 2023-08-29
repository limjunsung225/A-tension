package com.b5f1.atention.domain.user.service;

import com.b5f1.atention.domain.team.repository.TeamParticipantRepository;
import com.b5f1.atention.domain.user.dto.UserProfileUpdateDto;
import com.b5f1.atention.domain.user.dto.UserResponseDto;
import com.b5f1.atention.domain.user.dto.UserSearchResponseDto;
import com.b5f1.atention.domain.user.repository.UserRepository;
import com.b5f1.atention.entity.Team;
import com.b5f1.atention.entity.TeamParticipant;
import com.b5f1.atention.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    private final TeamParticipantRepository teamParticipantRepository;


    /**
     * 프로필을 반환하는 로직
     * @param userId
     * @return
     */
    public UserResponseDto getMyUserProfile(UUID userId) {
        User user = findUserById(userId);
        return new UserResponseDto().toUserResponseDto(user);
    }


    /**
     * 유저를 삭제하는 로직, soft delete
     * @param userId
     */
    public void deleteUser(UUID userId) {
        User user = findUserById(userId);
        List<TeamParticipant> teamParticipantList = teamParticipantRepository.findAllByUserAndIsDeletedFalse(user);
        for (TeamParticipant teamParticipant : teamParticipantList) {
            Team team = teamParticipant.getTeam();
            teamParticipantRepository.delete(teamParticipant.deleteTeamParticipant(user, team));
        }
        user.deleted();
        userRepository.saveAndFlush(user);
    }

    /**
     * 유저 프로필을 업데이트 하고 변경 값을 반환하는 로직
     * @param userId
     * @param userProfileUpdateDto
     * @return
     */
    public UserResponseDto updateUserProfile(UUID userId, UserProfileUpdateDto userProfileUpdateDto) {
        User user = userRepository.save(findUserById(userId).updateUser(userProfileUpdateDto));
        return new UserResponseDto().toUserResponseDto(user);
    }

    public List<UserSearchResponseDto> searchUser(String keyword) {
        // TODO
        //  유저가 팀에 참여하고 있는 경우 보여주지 않는 로직 추가하면 좋을 듯
        List<User> userList = userRepository.findByNameContainingOrEmailContainingAndIsDeletedFalse(keyword, keyword);
        List<UserSearchResponseDto> searchUserList = new ArrayList<>();
        for (User user : userList) {
            searchUserList.add(new UserSearchResponseDto().toUserResponseDto(user));
        }
        return searchUserList;
    }

    // userId로 유저를 찾고, 없으면 throw Exception
    public User findUserById(UUID userId) {
        return userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("해당하는 유저를 찾을 수 없습니다"));
    }
}
