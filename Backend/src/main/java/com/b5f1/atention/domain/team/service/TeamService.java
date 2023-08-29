package com.b5f1.atention.domain.team.service;

import com.b5f1.atention.domain.team.dto.*;
import com.b5f1.atention.entity.Team;
import com.b5f1.atention.entity.TeamParticipant;
import com.b5f1.atention.entity.User;

import java.util.List;
import java.util.UUID;

public interface TeamService {

    public List<TeamResponseDto> findMyTeamList(UUID userId);
    public void createTeam(UUID userId, TeamCreateRequestDto teamCreateRequestDto);
    public void inviteUser(UUID userId, Team team, TeamCreateRequestDto teamCreateRequestDto);
    public TeamDetailResponseDto getTeamDetail(UUID userId, Long teamId);
    public TeamUpdateRequestDto updateTeam(UUID userId, Long teamId, TeamUpdateRequestDto teamUpdateRequestDto);
    public void deleteTeam(UUID userId, Long teamId);
    public void inviteTeam(UUID userId, TeamInviteRequestDto teamInviteRequestDto);
    public void acceptTeam(UUID userId, Long teamId);
    public void refuseTeam(UUID userId, Long teamId);

    public void leaveTeam(UUID userId, Long teamId);
    public void updateTeamParticipantAuthority(UUID userId, TeamParticipantAuthorityDto teamParticipantAuthorityDto);

    public User findUserById(UUID userId);
    public Team findTeamById(Long teamId);

    public void hasTeamParticipantAuthority(TeamParticipant teamParticipant, String message);
}
